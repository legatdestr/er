EM.ui.navbar = {
    click: function () {
        var mobileNav = document.querySelector('.main-header-mobile-menu__container');
        if (mobileNav.className.indexOf('em-show') == -1) {
            mobileNav.className += ' em-show';
        } else {
            mobileNav.className = mobileNav.className.replace(' em-show', '');
        }
    }
};