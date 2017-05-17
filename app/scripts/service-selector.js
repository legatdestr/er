function openService(evt, serviceName) {
    var i, x, tablinks;
    x = document.getElementsByClassName("service");
    for (i = 0; i < x.length; i++) {
        x[i].style.display = "none";
    }
    tablinks = document.getElementsByClassName("tablink");
    for (i = 0; i < x.length; i++) {
        tablinks[i].className = tablinks[i].className.replace("em-border-red", "");
    }
    document.getElementById(serviceName).style.display = "block";
    evt.currentTarget.firstElementChild.className += " em-border-red";
}