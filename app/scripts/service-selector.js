EM.ui.serviceSelector = {
    openTab: function (evt, name) {
        const activeCssClass = 'color-gray';
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