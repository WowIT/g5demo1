

let express = require('express');
let router = express.Router();
let mongoose = require('mongoose');

// connect to our incident model
let Incident = require('../models/incident');

let incidentController = require('../controllers/incident');

let authRequired = require('../config/auth');

/* GET Route for the incident List page - READ operation */
router.get('/', authRequired, incidentController.displayIncidentList);

/* GET Route for displaying Add page - CREATE operation */
router.get('/add', authRequired, incidentController.displayAddPage);

/* POST Route for processing Add page - CREATE operation */
router.post('/add', authRequired, incidentController.processAddPage);

/* GET Route for displaying Edit page - UPDATE operation */
router.get('/edit/:id', authRequired, incidentController.displayEditPage);

/* POST Route for processing Edit page - UPDATE operation */
router.post('/edit/:id', authRequired, incidentController.processEditPage);

/* POST Route for processing status change at incident list - UPDATE operation */
router.post('/statusChange', authRequired, incidentController.processStatusChange);

/* GET to perform Deletion - DELETE operation */
router.get('/delete/:id', authRequired, incidentController.performDelete);


/* GET to Show All Incidents -  */
router.get('/dashboard', authRequired, incidentController.displayDashboard);

/* GET to perform Deletion From DashBoard - DELETE operation */
router.get('/dashboard/delete/:id', authRequired, incidentController.performDeleteFromDashBoard);


module.exports = router;
