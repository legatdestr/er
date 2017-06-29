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

    function subcatListIsEmpty(list) {
        var i;

        for (i = 0; i < list.length; i++) {
            if (list[i].style.display !== 'none') {
                return false;
            }
        }

        return true;
    }

    function resetCategoryForm() {
        var subcat = document.getElementById('subcatSelect'),
            subcatActiveLabel = subcat.querySelector('.select__label'),
            cat = document.getElementById('catSelect'),
            catActiveLabel = cat.querySelector('.select__label');

        subcat.classList.remove('select_show');
        subcat.querySelector('.select-list').innerHTML = '';
        subcatActiveLabel.setAttribute('data-value', 'default');
        subcatActiveLabel.innerHTML = '-- Не выбрано --';
        catActiveLabel.setAttribute('data-value', 'default');
        catActiveLabel.innerHTML = '-- Не выбрано --';
    }

    function categoryChoice() {
        var category = document.querySelector('#catSelect .category-select__active'),
            subcategory = document.querySelector('#subcatSelect .category-select__active'),
            params = {
                choiceLabel: '',
                parent: '',
                value: '',
                select: ''
            },
            categoryId,
            subcategoryId;

        if (category && category.getAttribute('data-value') !== 'default') {
            categoryId = category.getAttribute('data-value');
            if (subcategory && subcategory.getAttribute('data-value') !== 'default') {
                subcategoryId = subcategory.getAttribute('data-value');

                params.choiceLabel = category.textContent + ': ' +
                                subcategory.textContent;
                params.parent = categoryId;
                params.value = subcategoryId;
                params.select = 'subcatSelect';
                document.querySelector('#subcatSelect .select-list .select-list__item[data-value="' + subcategoryId + '"]')
                    .style.display = 'none';

                if (subcatListIsEmpty(document.querySelectorAll('#subcatSelect .select-list__item'))) {
                    document.querySelector('#catSelect .select-list .select-list__item[data-value="' + categoryId + '"]')
                    .style.display = 'none';
                }
            } else {
                params.choiceLabel = category.textContent;
                params.value = categoryId;
                params.select = 'catSelect';
                console.log('#catSelect .select-list select-list__item[data-value="' + categoryId + '"]');
                document.querySelector('#catSelect .select-list .select-list__item[data-value="' + categoryId + '"]')
                    .style.display = 'none';
            }

            renderTemplate(
                EM.templates.selectsChoice,
                params,
                '#category-select .select-choices',
                true
            );

            resetCategoryForm();
            EM.ps.runSearch();
        }
    }

    function lpuChoice(target) {
        if (target && target.className.indexOf('select-list__item') !== -1) {
            renderTemplate(
                EM.templates.selectsChoice,
                {
                    choiceLabel: target.textContent,
                    select: target.getAttribute('data-select'),
                    value: target.getAttribute('data-value')
                },
                '#' + target.getAttribute('data-select') + ' .select-choices',
                true
            );
            toggleSelect(document.getElementById(target.getAttribute('data-select')));
            target.classList.add('select-list__item_hide');

            if (document.querySelectorAll('#' + target.getAttribute('data-select') + ' .select-list__item:not(.select-list__item_hide)').length === 0) {
                document.querySelector('#' + target.getAttribute('data-select') + ' .select__label').classList.add('select__label_disabled');
            }
            EM.ps.runSearch();
        }
    }

    function deleteChoice(target) {
        
        var choice = target.parentNode,
            select = document.querySelector('#catSelect'),
            list,
            choiceInList;

        if (choice.getAttribute('data-select') === 'catSelect' || choice.getAttribute('data-select') === 'subcatSelect') {
            if (choice.getAttribute('data-parent') === '') {
                select.querySelector('.select-list__item[data-value="' + choice.getAttribute('data-value') + '"]')
                    .style.display = 'block';
            } else {
                select.querySelector('.select-list__item[data-value="' + choice.getAttribute('data-parent') + '"]')
                    .style.display = 'block';
            }
        } else {
            list = Array.prototype.slice.call(document.querySelectorAll('#lpu-select .select-list__item')),
            choiceInList = getChoiceById(list, choice.getAttribute('data-value'));

            choiceInList.classList.remove('select-list__item_hide');
            if (document.querySelectorAll('#' + choice.getAttribute('data-select') + ' .select-list__item:not(.select-list__item_hide)').length > 0) {
                document.querySelector('#' + choice.getAttribute('data-select') + ' .select__label').classList.remove('select__label_disabled');
            }
        }
        choice.parentNode.removeChild(choice);

        
        EM.ps.runSearch();
    }

    function toggleSelect(select) {
        var list = select.querySelector('.select-list') || null;
        if (list && list.innerHTML !== '') {
            select.querySelector('.select-list').classList.toggle('select-list_show');
        }
    }

    function renderTemplate(template, params, target, add) {
        target = target ? document.querySelector(target) : null;

        if (target) {
            if (add) {
                target.innerHTML += template(params);
            } else {
                target.innerHTML = template(params);
            }
        }
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

    function getActualSubCats(subCats) {
        var choices = document.querySelectorAll('#category-select .selects-choices__item');

        subCats = subCats.filter(function(item) {
            var i = 0;

            for (i = 0; i < choices.length; i++) {
                if (choices[i].getAttribute('data-value') == item.id) {
                    return false;
                }
            }

            return true;
        });

        return subCats;
    }

    function changeCategory(target) {
        var childs,
            activeEl = document.getElementById(target.getAttribute('data-select')).querySelector('.category-select__active');

        toggleSelect(document.getElementById(target.getAttribute('data-select')));

        // Смена активного пункта селекта
        activeEl.innerHTML = target.innerHTML;
        activeEl.setAttribute('data-value', target.getAttribute('data-value'));

        // Категория
        if (target.getAttribute('data-parent') === null) {
            childs = EM.ps.getCats()[target.getAttribute('data-value')].childs;

            if (childs && childs.length > 0) {
                renderTemplate(
                    EM.templates.psSubcategories,
                    {
                        cats: getActualSubCats(EM.ps.getCats()[target.getAttribute('data-value')].childs),
                        parent: target.getAttribute('data-value')
                    },
                    '#subcatSelect .select-list'
                )

                document.getElementById('subcatSelect').classList.add('select_show');
            } else {
                document.getElementById('subcatSelect').classList.remove('select_show');
                renderTemplate(function(){return ''}, {}, '#subcatSelect .select-list');
            }
        }
    }

/*    document.addEventListener('clear-form', function() {
        var selects = document.querySelectorAll('.select'),
            listItems = document.querySelectorAll('.select-list__item'),
            i;

        for (i = 0; i < selects.length; i++) {
            selects[i].querySelector('.select-choices').innerHTML = '';
        }

        for (i = 0; i < listItems.length; i++) {
            listItems[i].classList.remove('select-list__item_hide');
        }


    });*/

    global.EM = (typeof EM === 'object' ? EM : window.EM = {});
    global.EM.selects = {};
    /*global.EM.selects.makeChoice = makeChoice;*/
    global.EM.selects.lpuChoice = lpuChoice;
    global.EM.selects.categoryChoice = categoryChoice;
    global.EM.selects.deleteChoice = deleteChoice;
    global.EM.selects.initSelects = initSelects;
    global.EM.selects.changeCategory = changeCategory;
})(window);
