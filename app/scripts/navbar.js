EM.ui.navbar = {
    click: function () {
        var mobileNav = document.querySelector('.main-header-mobile-menu__container'),
        	toggleNav = document.querySelector('.icon-nav');
        if (mobileNav.className.indexOf('em-show') == -1) {
            mobileNav.className += ' em-show';
            toggleNav.classList.add('open');
        } else {
            mobileNav.className = mobileNav.className.replace(' em-show', '');
            toggleNav.classList.remove('open');
        }
    }
};