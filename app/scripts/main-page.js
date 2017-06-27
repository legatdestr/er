(function (global) {
    function ItemClickHandler(type, e) {
        e.preventDefault();
        var clickedItem = e.target,
            targetId,
            offsetTop;

        if (type === 'sidebar') {
            clickedItem = clickedItem.parentNode.className.indexOf('sidebar__item') !== -1 ?
                    clickedItem.parentNode :
                    clickedItem.parentNode.parentNode.className.indexOf('sidebar__item') !== -1 ?
                        clickedItem.parentNode.parentNode :
                        clickedItem.parentNode.parentNode.parentNode.className.indexOf('sidebar__item') !== -1 ?
                            clickedItem.parentNode.parentNode.parentNode :
                            null;
        }

        if (type === 'menu' && clickedItem.classList.contains('navbar__item_mobile')) {
            EM.ui.navbar.click();
        }

        targetId = clickedItem.getAttribute('data-target');

        if (targetId) {
            offsetTop = targetId === '#' 
                ? 0 
                : (EM.offset(document.getElementById(targetId)).top - menuHeight + 15);
            
            EM.scrollToY(offsetTop);
        }
    }

    var
        sidebar = document.getElementById('sidebar'),
        sidebarItems = Array.prototype.slice.call(sidebar.querySelectorAll('.sidebar__item')),
        menuItems = Array.prototype.slice.call(document.querySelectorAll('.navbar__item')),
        selectorItems = Array.prototype.slice.call(document.querySelectorAll('.service-selector__item')),
        lastId,
        menuHeight = EM.outerHeight(document.getElementById('navbar')) + 15,
        scrollItems = sidebarItems.map(function(item) {
            var innerItem = document.getElementById(item.getAttribute('data-target'));

            if (innerItem) {
                return innerItem;
            }
        });

    menuItems.forEach(function(item, index, arr) {
        item.addEventListener('click', ItemClickHandler.bind(null, 'menu'));
    });

    sidebarItems.forEach(function(item, index, arr) {
        item.addEventListener('click', ItemClickHandler.bind(null, 'sidebar'));
    });

    selectorItems.forEach(function(item, index, arr) {
        item.addEventListener('click', ItemClickHandler.bind(null, 'selector'));
    });

    global.onscroll = function() {
        var fromTop = EM.scrollTop() + menuHeight,
            cur = scrollItems.filter(function(item) {
                return EM.offset(item).top < fromTop + 40;
            }),
            id;

            cur = cur[cur.length - 1];
            id = cur ? cur.id : '';

            if (lastId !== id) {
                lastId = id;

                sidebarItems.forEach(function(item) {
                    item.classList.remove('sidebar__item_active');

                    if (item.getAttribute('data-target') == lastId) {
                        item.classList.add('sidebar__item_active');
                    }
                });

                menuItems.forEach(function(item) {
                    item.classList.remove('navbar__item_active');
                    if (item.getAttribute('data-target') == lastId && item.className.indexOf('navbar__item_logo') === -1) {
                        item.classList.add('navbar__item_active');
                    }
                });
            }
    }
}(window));