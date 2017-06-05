(function(global) {
	var objProt = global.Object.prototype,
		settings = {
			psId: 'paid-services-widget',
			formHeader: 'Поиск услуг',
			searchInputLabel: 'Поисковый запрос',
			searchPlaceholder: 'Поиск...',
	        advancedSearchId: 'advancedSearch',
	        searchFormId: 'searchForm',
	        psContentId: 'psContent',
	        psCount: 10
		},
		advancedSearch;

	function setupSettings(external, internal) {
		var inter = internal || {},
			prop;

		if (objProt.toString.call(external) !== '[object Object]') {
			return;
		}
		/* TODO: need to implement cases where properties are objects or array
		of DOM elements */
		for (prop in inter) {
			if (objProt.hasOwnProperty.call(internal, prop) &&
				typeof external[prop] !== 'undefined') {
				internal[prop] = external[prop];
			}
		}
	}

	function renderTemplate(template, params, target) {
		document.querySelector(target).innerHTML = template(params);
	}

    function showLoading() {
        document.querySelector('.spinner').classList.add('spinner_show');
    }

    function hideLoading() {
        document.querySelector('.spinner').classList.remove('spinner_show');
    }

    function validateSearchForm() {
    	var result = false;

    	if (document.getElementById('searchString').value !== '' ||
    		(document.getElementById(settings.advancedSearchId).classList.contains('advanced-search_show') && (
    			document.getElementById('categorySelect').value !== 'default' ||
    			document.getElementById('lpuSelect').value !== 'default'
    		))) {
    		result = true;
    	}

    	return result;
    }

    function firstReq() {
    	return new Promise(function(resolve, reject) {
    		setTimeout(function() {
    			resolve('{"lpus":[{"name":"Поликлиника 1","lpu":"0001"}],"paidcategories":[{"id":1,"name":"Анализы","parent_id":0}]}');
    		}, 100);
    	});
    }

    function secondReq() {
    	return new Promise(function(resolve, reject) {
    		setTimeout(function() {
    			resolve('{"total":"100000","offset":"100","limit":"3","items":[{"service_name":"Услуга","service_price":"1000","service_desc":"описание услуги","lpu_name":"Поликлиника 1","lpu_ratio":"10.0","lpu_addresses":[{"name":"Отделение 1","address":"улица Пушкина"},{"name":"Отделение 2","address":"улица Колотушкина"}],"category_name":"Диагностика"},{"service_name":"Услуга №2","service_price":"1000","service_desc":"описание услуги","lpu_name":"Поликлиника 1","lpu_ratio":"10.0","lpu_addresses":[{"name":"Отделение 1","address":"улица Пушкина"},{"name":"Отделение 2","address":"улица Колотушкина"}],"category_name":"Диагностика"},{"service_name":"Услуга №3","service_price":"1000","service_desc":"описание услуги","lpu_name":"Поликлиника 1","lpu_ratio":"10.0","lpu_addresses":[{"name":"Отделение 1","address":"улица Пушкина"},{"name":"Отделение 2","address":"улица Колотушкина"}],"category_name":"Диагностика"}]}');
    		}, 100);
    	});
    }

    function runSearch() {
    	if (!validateSearchForm()) {
    		document.querySelector('.error-message').classList.add('error-message_active');
    	} else {
    		document.querySelector('.error-message').classList.remove('error-message_active');
	        showLoading();
            
            //fetch('https://er.em70.ru/api/paidservices/find')
            secondReq()
            .then(function(response) {
                //return response.json()
                return JSON.parse(response);
            })
            .then(function(response) {
                renderTemplate(
                    EM.templates.services,
                    {
                        services: response.items
                    },
                    '#' + settings.psContentId
                )
                hideLoading();
            });
    	}
    }

    function resetSearchForm() {
    	var resetEvent = new Event('clear-form');
    	document.dispatchEvent(resetEvent);
        document.getElementById(settings.searchFormId).reset();
        document.getElementById(settings.psContentId).innerHTML = '';
    }

    function toggleAdvancedSearch() {
        if (advancedSearch) {
            if (advancedSearch.classList.contains('advanced-search_show')) {
                advancedSearch.classList.remove('advanced-search_show');
            } else {
                advancedSearch.classList.add('advanced-search_show');
            }
        }
    }

	function run(params) {
		setupSettings(params, settings);

		//fetch('https://er.em70.ru/api/lpuspaidcategories/')
		firstReq()
        .then(function(response) {
            //return response.json();
            return JSON.parse(response)
        })
        .then(function(response) {
            renderTemplate(
	            EM.templates.main, 
	            {
	                formHeader: settings.formHeader,
	                searchPlaceholder: settings.searchPlaceholder,
	                searchInputLabel: settings.searchInputLabel,
	                advancedSearchId: settings.advancedSearchId,
	                categories: response.paidcategories,
	                lpus: response.lpus,
	                searchFormId: settings.searchFormId,
	                psContentId: settings.psContentId
	            },
	            '#' + settings.psId
	        );
	        EM.initSelects();
        	advancedSearch = document.getElementById(settings.advancedSearchId);
        });
	}

	function createSearchObject() {
		var searchString = document.getElementById('searchString'),
			advancedSearch = document.getElementById(settings.advancedSearchId),
			isAdvancedSearch = advancedSearch.classList.contains('advanced-search_show'),
			sortedItems = document.querySelector('.ps-sorting__item_sorted'),
			result = {},
			i;

		result.searching_string = searchString.value;
		result.sorting_fields = [];
		result.filtering_fields = [];

		for (i = 0; i < sortedItems.length; i++) {
			result.sorting_fileds[i] = {
				'name': sortedItems[i].getAttribute('data-sort-field'),
				'order_by': sortedItems[i].classList.contains('asc') ? 'asc' : 'desc'
			}
		}

		if (isAdvancedSearch) {

		}
	}

	function changeSortingButtonOrder(btn) {
		if (!btn.classList.contains('ps-sorting__item_sorted')) {
			btn.classList.add('ps-sorting__item_sorted', 'asc');
		} else {
			if (btn.classList.contains('asc')) {
				btn.classList.remove('asc');
				btn.classList.add('desc');
			} else {
				btn.classList.remove('desc');
				btn.classList.add('asc');
			}
		}
	}

	function sort(sortingButton) {
		changeSortingButtonOrder(sortingButton);
	}

	global.EM = (typeof EM === 'object' ? EM : window.EM = {});
	EM.ps = {};
	EM.ps.toggleAdvancedSearch = toggleAdvancedSearch;
	EM.ps.runSearch = runSearch;
	EM.ps.resetSearchForm = resetSearchForm;
	EM.ps.sort = sort;
	EM.ps.run = run;
}(window));