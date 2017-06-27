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

/*(function (global) {
    function selectorItemClickHandler(e) {
        e.preventDefault();
        var clickedItem = e.target,
            targetId,
            offsetTop;

        targetId = clickedItem.getAttribute('data-target');

        offsetTop = targetId === '#'
            ? 0 
            : (EM.offset(document.getElementById(targetId)).top - menuHeight + 15);
        
        EM.scrollToY(offsetTop);
    }

    var
        selectorItems = Array.prototype.slice.call(document.querySelectorAll('.service-selector__item')),
        lastId,
        menuHeight = EM.outerHeight(document.getElementById('navbar')) + 15,
        scrollItems = selectorItems.map(function(item) {
            var innerItem = document.getElementById(item.getAttribute('data-target'));

            if (innerItem) {
                return innerItem;
            }
        });

        selectorItems.forEach(function(item, index, arr) {
            item.addEventListener('click', selectorItemClickHandler);
        });
}(window));*/