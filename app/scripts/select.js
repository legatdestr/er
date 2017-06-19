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

    function deleteChoice(e) {
        var choice = e.target.parentNode,
            choiceId = choice.getAttribute('data-value'),
            choiceInList = getChoiceById(document.getElementById(choice.getAttribute('data-parent')));
    }

    function toggleSelect(select) {
        if (select) {
            select.querySelector('.select-list').classList.toggle('select-list_show');
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

        /*$('select').each(function(){
            var $this = $(this), numberOfOptions = $(this).children('option').length;
          
            $this.addClass('select-hidden'); 
            $this.wrap('<div class="select"></div>');
            $this.after('<div class="select-styled color-red"></div>');

            var $styledSelect = $this.next('div.select-styled');
            $styledSelect.text($this.children('option').eq(0).text());
          
            var $list = $('<ul />', {
                'class': 'select-options'
            }).insertAfter($styledSelect);
          
            for (var i = 0; i < numberOfOptions; i++) {
                $('<li />', {
                    text: $this.children('option').eq(i).text(),
                    rel: $this.children('option').eq(i).val(),
                    'class': 'color-red'
                }).appendTo($list);
            }
          
            var $listItems = $list.children('li');
          
            $styledSelect.click(function(e) {
                e.stopPropagation();
                $('div.select-styled.active').not(this).each(function(){
                    $(this).removeClass('active').next('ul.select-options').hide();
                });
                $(this).toggleClass('active').next('ul.select-options').toggle();
            });
          
            $listItems.click(function(e) {
                var event = new CustomEvent('category-change', {detail: {value: $(this).attr('rel')}});

                e.stopPropagation();
                $styledSelect.text($(this).text()).removeClass('active');
                $this.val($(this).attr('rel'));
                $list.hide();

                document.dispatchEvent(event);
            });
          
            $(document).click(function() {
                $styledSelect.removeClass('active');
                $list.hide();
            });
        });*/
    }

    document.addEventListener('clear-form', function() {
        var defaultText = '-- Не выбрано --';
        document.getElementById('categorySelect').value = 'default';
        document.getElementById('lpuSelect').value = 'default';

        document.querySelector('.advanced-search-group_cat .select-styled').textContent = defaultText;
        document.querySelector('.advanced-search-group_lpu .select-styled').textContent = defaultText;
    });

    global.EM = (typeof EM === 'object' ? EM : window.EM = {});
    EM.initSelects = initSelects;
})(window);