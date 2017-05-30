EM.ui.serviceSelector = {
    openTab: function (evt, name) {
        const activeCssClass = 'em-white';
        /* set active tab */
        let tablinks = document.querySelectorAll('.service-selector__tablink');
        tablinks.forEach(function(link){
            link.className = link.className.replace(' ' + activeCssClass, '');
        });
        /* hide\show tabs content */
        let services = document.querySelectorAll('.service-selector__tabs-content-item');
        services.forEach(function (service) {
            let tabName = service.getAttribute('tabName');
            EM.isString(tabName) && (tabName === name) && (service.style.display = 'block')
            && (evt.currentTarget.firstElementChild.className += (' ' + activeCssClass) )
            || (service.style.display = 'none');

        });
    }
};

/**
 * Вносит поправку на padding хедера при переходе по якорю.. Иначе после кликка заголовок секции скрыт под меню
 */
!(function () {
    const btns = window.document.querySelectorAll('.service-selector__tabs-content .em-button');
    const onClick = function(e){
        setTimeout(function () {
            let headerPaddingTop = 105, val = headerPaddingTop ;
            window.scrollTo(0, window.scrollY - val);
        }, 20);
    };

    btns.forEach(function (btn) {
        btn.addEventListener('click', onClick);
    });

}());