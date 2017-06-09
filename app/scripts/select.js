(function(global) {
    function initSelects() {
        $('select').each(function(){
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
        });
    }

    document.addEventListener('clear-form', function() {
        var defaultText = '-- Не выбрано --';
        document.getElementById('categorySelect').value = 'default';
        document.getElementById('lpuSelect').value = 'default';

        document.querySelector('.advanced-search-group_cat .select-styled').textContent = defaultText;
        document.querySelector('.advanced-search-group_lpu .select-styled').textContent = defaultText;
    });

/*    function initSelects() {
        var selects = global.document.querySelectAll('select'),
            i,
            currentSelect,
            numberOfOptions;

        function wrap(wrapper, elems) {
            if (!elms.length) elms = [elms];

            // Loops backwards to prevent having to clone the wrapper on the
            // first element (see `child` below).
            for (var i = elms.length - 1; i >= 0; i--) {
                var child = (i > 0) ? wrapper.cloneNode(true) : wrapper;
                var el    = elms[i];

                // Cache the current parent and sibling.
                var parent  = el.parentNode;
                var sibling = el.nextSibling;

                // Wrap the element (is automatically removed from its current
                // parent).
                child.appendChild(el);

                // If the element had a sibling, insert the wrapper before
                // the sibling to maintain the HTML structure; otherwise, just
                // append it to the parent.
                if (sibling) {
                    parent.insertBefore(child, sibling);
                } else {
                    parent.appendChild(child);
                }
            }
        }

        for (i = 0; i < selects.length; i++) {
            currentSelect = selects[i];
            numberOfOptions = currentSelect.querySelectAll('option').length;

            currentSelect.classList.add('select-hidden');
            wrap(document.createElement('div'), currentSelect);
        }
    }*/
    global.EM = (typeof EM === 'object' ? EM : window.EM = {});
    EM.initSelects = initSelects;
})(window);