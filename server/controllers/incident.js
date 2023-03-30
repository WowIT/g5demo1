

let express = require('express');
let router = express.Router();
let mongoose = require('mongoose');

// create a reference to the model
let Incident = require('../models/incident');
let getcurrentTimestamp = () => {
    let currentDate = new Date();
    let day = currentDate.getDate().toString();
    let month = (currentDate.getMonth() + 1).toString();
    let year = currentDate.getFullYear().toString();
    let time = currentDate.toLocaleTimeString();

    if (day.length < 2) day = '0' + day;
    if (month.length < 2) month = '0' + month;

    return [day, month, year].join('/') + " " + time;
};

module.exports.displayIncidentList = (req, res, next) => {
    Incident.find((err, incidentList) => {
        if(err){
            console.log(err);
            res.end(err);
        } else {
            res.render('incident/list', { title: 'Incident List', incidentList: incidentList,
                                                    displayName: req.user ? req.user.displayName : ''});
        }
    });
};

module.exports.displayAddPage = (req, res, next) => {
    res.render('incident/add', { title: 'Add Incident', displayName: req.user ? req.user.displayName : ''});
};

module.exports.processAddPage = (req, res, next) => {
    let newIncident = Incident({
        "description": req.body.description,
        "priority": req.body.priority,
        "customerInfo": req.body.customerInfo
    });

    let currentDate = new Date();
    let day = currentDate.getDate().toString();
    let month = (currentDate.getMonth() + 1).toString();
    let year = currentDate.getFullYear().toString().substr(-2);
    let newTicketNumber;

    Incident.findOne({}, {}, { sort: { 'recordNumber' : -1 } }, function(err, result) {
        if(err){
            console.log(err);
            res.end(err);
        }
        else{
            const zeroPad = (num, places) => String(num).padStart(places, '0');
            if (result == null || result.recordNumber == null || result.recordNumber == "undefined"){
                newTicketNumber = zeroPad(1, 7);
            } else {
                let recordNumber = result.recordNumber.toString();
                let extractedLastNumber = parseInt(recordNumber.substring(recordNumber.length - 7));
                newTicketNumber = zeroPad(extractedLastNumber + 1, 7);
            }

            newIncident.recordNumber = day + month + year + "-" + newTicketNumber;

            let createdStr = "Created at " + getcurrentTimestamp() +"; ";
            newIncident.narrativeLatest = createdStr;
            newIncident.narrative = createdStr;

            Incident.create(newIncident, (err, incident) => {
                if(err){
                    console.log(err);
                    res.end(err);
                } else {
                    // refresh the Incident list
                    res.redirect('/incident-list');
                }
            });
        }
   });
};

module.exports.displayEditPage = (req, res, next) => {
    let id = req.params.id;

    Incident.findById(id, (err, incidentToEdit) => {
        if(err){
            console.log(err);
            res.end(err);
        } else {
            // show the edit view
            res.render('incident/edit', { title: 'Update Incident', incident: incidentToEdit,
                                                    displayName: req.user ? req.user.displayName : ''});
        }
    });
};

module.exports.processEditPage = (req, res, next) => {
    let id = req.params.id;

    let updateIncident = Incident({
        "_id": id,
        "description": req.body.description,
        "priority": req.body.priority,
        "status": req.body.status,
        "customerInfo": req.body.customerInfo
    });

    Incident.findById(id, (err, oldIncident) => {
        if(err){
            console.log(err);
            res.end(err);
        } else {
            let narrativeStr = "";
            let fieldsChanged = [];

            if (updateIncident.priority != oldIncident.priority){
                fieldsChanged.push("Priority " +  oldIncident.priority + " -> " + updateIncident.priority)
            }

            if (updateIncident.status != oldIncident.status){
                let statusTmpStr = "Status " +  oldIncident.status + " -> " + updateIncident.status;
                if (req.body.comment.trim().length > 0){
                    statusTmpStr += " with comment (" + req.body.comment + ")";
                }
                fieldsChanged.push(statusTmpStr);
            }

            if (updateIncident.description != oldIncident.description){
                fieldsChanged.push("Description");
            }

            if (updateIncident.customerInfo != oldIncident.customerInfo){
                fieldsChanged.push("CustomerInfo");
            }

            if (fieldsChanged.length > 0){
                narrativeStr = fieldsChanged.join(", ") + " changed at " + getcurrentTimestamp() + "; ";
            }

            if (narrativeStr.trim().length > 0){
                updateIncident.narrativeLatest = narrativeStr;
                updateIncident.narrative = (req.body.narrative == null) ? narrativeStr : (req.body.narrative + "\n" + narrativeStr);
            }

            Incident.updateOne({_id: id}, updateIncident, (err) => {
                if(err){
                    console.log(err);
                    res.end(err);
                } else {
                    // refresh the Incident list
                    res.redirect('/incident-list');
                }
            });
        }
    });
};

module.exports.processStatusChange = (req, res, next) => {
    let id = req.body.id;

    let updateIncident = Incident({
        "_id": id,
        "status": req.body.status
    });

    Incident.findById(id, (err, oldIncident) => {
        if(err){
            console.log(err);
            res.end(err);
        } else {
            let narrativeStr = "";

            if (updateIncident.status != oldIncident.status){
                let statusTmpStr = "Status " +  oldIncident.status + " -> " + updateIncident.status;
                if (req.body.comment.trim().length > 0){
                    statusTmpStr += " with comment (" + req.body.comment + ")" + " changed at " + getcurrentTimestamp() + "; ";
                }
                narrativeStr = statusTmpStr;
            }

            if (narrativeStr.trim().length > 0){
                updateIncident.narrativeLatest = narrativeStr;
                updateIncident.narrative = oldIncident.narrative + "\n" + narrativeStr;
            }

            Incident.updateOne({_id: id}, updateIncident, (err) => {
                if(err){
                    console.log(err);
                    res.end(err);
                } else {
                    // refresh the Incident list
                    res.redirect('/incident-list');
                }
            });
        }
    });
};

module.exports.performDelete = (req, res, next) => {
    let id = req.params.id;

    Incident.remove({_id: id}, (err) => {
        if(err){
            console.log(err);
            res.end(err);
        } else {
            // refresh the Incident list
            res.redirect('/incident-list');
        }
    });
};

module.exports.performDeleteFromDashBoard = (req, res, next) => {
    let id = req.params.id;

    Incident.remove({_id: id}, (err) => {
        if(err){
            console.log(err);
            res.end(err);
        } else {
            // refresh the Incident list
            res.redirect('/incident-list/dashboard');
        }
    });
};

module.exports.displayDashboard = (req, res, next) => {
    Incident.find((err, incidentList) => {
        if(err){
            console.log(err);
            res.end(err);
        } else {
            res.render('incident/dashboard', { title: 'Incidents Dashboard', incidentList: incidentList,
                                                    displayName: req.user ? req.user.displayName : ''});
        }
    });
}
