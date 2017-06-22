(function(global) {
    function getChoiceById(list, id) {
        var i;

        if (list) {
            for (i = 0; i < list.length; i++) {
                if (list[i].getAttribute('data-value') == id) {
                    return list[i];
                }
            }
        }
        return false;
    }

    function makeChoice(target) {
        if (target && target.className.indexOf('select-list__item') !== -1) {
            renderTemplate(
                EM.templates.selectsChoice,
                {
                    text: target.textContent,
                    dataParent: target.getAttribute('data-parent'),
                    dataValue: target.getAttribute('data-value')
                },
                '#' + target.getAttribute('data-parent') + ' .select-choices'
            );
            toggleSelect(document.getElementById(target.getAttribute('data-parent')));
            target.classList.add('select-list__item_hide');

            if (document.querySelectorAll('#' + target.getAttribute('data-parent') + ' .select-list__item:not(.select-list__item_hide)').length === 0) {
                document.querySelector('#' + target.getAttribute('data-parent') + ' .select__label').classList.add('select__label_disabled');
            }
        }
    }

    function deleteChoice(target) {
        var choice = target.parentNode,
            list = Array.prototype.slice.call(document.querySelectorAll('#' + choice.getAttribute('data-parent') + ' .select-list__item')),
            choiceInList = getChoiceById(list, choice.getAttribute('data-value'));

        choice.parentNode.removeChild(choice);
        choiceInList.classList.remove('select-list__item_hide');

        if (document.querySelectorAll('#' + choice.getAttribute('data-parent') + ' .select-list__item:not(.select-list__item_hide)').length > 0) {
            document.querySelector('#' + choice.getAttribute('data-parent') + ' .select__label').classList.remove('select__label_disabled');
        }
    }

    function toggleSelect(select) {
        if (select) {
            select.querySelector('.select-list').classList.toggle('select-list_show');
        }
    }

    function renderTemplate(template, params, target) {
        document.querySelector(target).innerHTML += template(params);
    }

    function initSelects() {

        var selects = document.querySelectorAll('.select'),
            i;

        for (i = 0; i < selects.length; i++) {
            (function (i) {
                selects[i].querySelector('.select__label').addEventListener('click', toggleSelect.bind(null, selects[i]));
            }(i));
        }
    }

    document.addEventListener('clear-form', function() {
        var selects = document.querySelectorAll('.select'),
            listItems = document.querySelectorAll('.select-list__item'),
            i;

        for (i = 0; i < selects.length; i++) {
            selects[i].querySelector('.select-choices').innerHTML = '';
        }

        for (i = 0; i < listItems.length; i++) {
            listItems[i].classList.remove('select-list__item_hide');
        }


    });

    global.EM = (typeof EM === 'object' ? EM : window.EM = {});
    global.EM.selects = {};
    global.EM.selects.makeChoice = makeChoice;
    global.EM.selects.deleteChoice = deleteChoice;
    global.EM.selects.initSelects = initSelects;
})(window);