EM.ui.navbar = {
    click: function () {
        var x = document.getElementById('navbar-small-screens');
        if (x.className.indexOf('em-show') == -1) {
            x.className += ' em-show';
        } else {
            x.className = x.className.replace(' em-show', '');
        }
    }
};