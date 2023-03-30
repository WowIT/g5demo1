

// immediate invoke function
(function(){
    function start(){
        console.log("App started...");

        // let deleteButtons = document.querySelectorAll('.btn-danger');
        let deleteButtons = document.querySelectorAll('.cancel');

        for (button of deleteButtons) {
            button.addEventListener('click', (event) =>{
                if(!confirm("Are you sure?")){
                    event.preventDefault();
                    window.location.assign('/incident-list');
                }
            });
        }
    }

    window.addEventListener("load", start);
})();

function openStatusCommentPopup() {
    $("#myModal").modal({
        backdrop: 'static',
        keyboard: false
    });
}

function closeStatusCommentPopup() {
    let comment = document.getElementById("comment").value;
    let statusCommentError = document.getElementById("statusCommentError");
    if(comment.trim().length == 0){
        statusCommentError.style.display = "block";
    } else {
        statusCommentError.style.display = "none";
        $("#myModal").modal('toggle');
    }
}

function openStatusCommentPopupAtTicket(ticketID) {
    $("#myModal").modal({
        backdrop: 'static',
        keyboard: false
    });

    let btn = document.getElementById("confirmToChangeStatusBtn-" + ticketID);
    btn.style.display = "block";
}

function confirmToChangeStatus(ticketID){
    let comment = document.getElementById("comment").value;
    let status = document.getElementById("status-" + ticketID).value;

    let http = new XMLHttpRequest();
    let url = 'incident-list/statusChange';
    let params = 'id=' + ticketID + "&comment=" + comment + "&status=" + status;
    http.open('POST', url, true);

    //Send the proper header information along with the request
    http.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');

    http.onreadystatechange = function() {//Call a function when the state changes.
        if(http.readyState == 4 && http.status == 200) {
            window.location.href = "incident-list";
        }
    }
    http.send(params);
}

function openNav() {
    document.getElementById("mySidenav").style.width = "250px";
    document.getElementById("main").style.marginLeft = "250px";
    document.body.style.backgroundColor = "rgba(0,0,0,0.2)";
}

  function closeNav() {
    document.getElementById("mySidenav").style.width = "0";
    document.getElementById("main").style.marginLeft= "0";
    document.body.style.backgroundColor = "white";
}
