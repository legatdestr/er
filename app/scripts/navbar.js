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

/**
 * Вносит поправку на padding хедера при переходе по якорю.. Иначе после кликка заголовок секции скрыт под меню
 */
!(function () {
    const menu = window.document.querySelector('#navbar-small-screens');
    menu.addEventListener('click', function (e) {
        setTimeout(function () {
            let headerPaddingTop = 105, val = headerPaddingTop ;
            window.scrollTo(0, window.scrollY - val);
        }, 20);
    });
}());