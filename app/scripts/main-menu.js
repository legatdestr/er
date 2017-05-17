function mainMenuClick() {
    var x = document.getElementById('main-menu__mobile');
    if (x.className.indexOf('em-show') == -1) {
        x.className += ' em-show';
    } else {
        x.className = x.className.replace(' em-show', '');
    }
}
