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
		advancedSearch,
		categories,
		services,
		searchString,
		autocomplete,
		timeoutId;

	var Pagination = {

	    code: '',

	    // --------------------
	    // Utility
	    // --------------------

	    // converting initialize data
	    Extend: function(data) {
	        data = data || {};
	        Pagination.size = data.size || 0;
	        Pagination.page = data.page || 0;
	        Pagination.step = data.step || 0;
	    },

	    // add pages by number (from [s] to [f])
	    Add: function(s, f) {
	        for (var i = s; i < f; i++) {
	            Pagination.code += '<a>' + i + '</a>';
	        }
	    },

	    // add last page with separator
	    Last: function() {
	        Pagination.code += '<i class="separator">...</i><a>' + Pagination.size + '</a>';
	    },

	    // add first page with separator
	    First: function() {
	        Pagination.code += '<a>1</a><i class="separator">...</i>';
	    },

	    // --------------------
	    // Handlers
	    // --------------------

	    // change page
	    Click: function() {
	    	runSearch((+this.innerHTML) - 1);
	    },

	    // previous page
	    Prev: function() {
	    	if (Pagination.page !== 1) {
	    		runSearch(Pagination.page - 1);
	    	}
	    },

	    // next page
	    Next: function() {
	        if (Pagination.page < Pagination.size) {
	        	runSearch(Pagination.page + 1);
	        }
	    },

	    // --------------------
	    // Script
	    // --------------------

	    // binding pages
	    Bind: function() {
	        var a = Pagination.e.getElementsByTagName('a');
	        for (var i = 0; i < a.length; i++) {
	            if (+a[i].innerHTML === Pagination.page) a[i].className = 'current';
	            a[i].classList.add('pagination__link', 'em-button');
	            a[i].classList.add('color-red');
	            a[i].addEventListener('click', Pagination.Click, false);
	        }
	    },

	    // write pagination
	    Finish: function() {
	        Pagination.e.innerHTML = Pagination.code;
	        Pagination.code = '';
	        Pagination.Bind();
	    },

	    // find pagination type
	    Start: function() {
	        if (Pagination.size < Pagination.step * 2 + 6) {
	            Pagination.Add(1, Pagination.size + 1);
	        }
	        else if (Pagination.page < Pagination.step * 2 + 1) {
	            Pagination.Add(1, Pagination.step * 2 + 4);
	            Pagination.Last();
	        }
	        else if (Pagination.page > Pagination.size - Pagination.step * 2) {
	            Pagination.First();
	            Pagination.Add(Pagination.size - Pagination.step * 2 - 2, Pagination.size + 1);
	        }
	        else {
	            Pagination.First();
	            Pagination.Add(Pagination.page - Pagination.step, Pagination.page + Pagination.step + 1);
	            Pagination.Last();
	        }
	        Pagination.Finish();
	    },

	    // --------------------
	    // Initialization
	    // --------------------

	    // binding buttons
	    Buttons: function(e) {
	        var nav = e.getElementsByTagName('a');
	        nav[0].addEventListener('click', Pagination.Prev, false);
	        nav[1].addEventListener('click', Pagination.Next, false);
	    },

	    // create skeleton
	    Create: function(e) {

	        var html = [
	            '<a class="pagination__prev em-button">&#9668;</a>', // previous button
	            '<span></span>',  // pagination container
	            '<a class="pagination__next em-button">&#9658;</a>'  // next button
	        ];

	        e.innerHTML = html.join('');
	        Pagination.e = e.getElementsByTagName('span')[0];
	        Pagination.Buttons(e);
	    },

	    // init
	    Init: function(e, data) {
	        Pagination.Extend(data);
	        if (Pagination.size > 0) {
	        	Pagination.Create(e);
	        	Pagination.Start();
	        }
	    },

	    run: function(size, page, step) {
	    	Pagination.Init(document.getElementById('pagination'), {
		        size: size, // pages size
		        page: page,  // selected page
		        step: step   // pages before and after current
		    });
	    }
	};

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

	function getCategories(rowCats) {
		var result = {},
			i,
			currentCat,
			currentId;

		for (i = 0; i < rowCats.length; i++) {
			currentCat = rowCats[i];
			if (currentCat.parent_id === null && result[currentCat.parent_id] === undefined) {
				currentId = currentCat.id;
				result[currentId] = {};
				result[currentId].name = currentCat.name;
				result[currentId].childs = [];
			}
		}

		for (i = 0; i < rowCats.length; i++) {
			currentCat = rowCats[i];

			if (result[currentCat.parent_id]) {
				result[currentCat.parent_id].childs.push({
					id: currentCat.id,
					name: currentCat.name
				})
			}
		}

		return result;
	}

	function getPreviewDesc(text) {
		var result = '',
			i,
			wordsArr = text.split(' ');

		for (i = 0; i < wordsArr.length; i++) {
			if ((result + wordsArr[i]).length > 30) {
				result += '...';
				break;
			}
			result += wordsArr[i];

			if (i !== (wordsArr.length - 1)) {
				result += ' ' 
			}
		}
		return result;
	}

	function getFormattedServices(items) {
		var i,
			tmp,
			result = null;
		if (items && items.length) {
			result = items;
			for (i = 0; i < items.length; i++) {
				tmp = result[i].description;
				result[i].description = {
					preview: tmp ? getPreviewDesc(tmp): '',
					desc: tmp || '',
					id: i
				}
				if (result[i].description.preview !== result[i].description.desc) {
					result[i].description.shorted = true;
				}
			}
		}

		return result;
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
    			document.getElementById('categorySelect').value !== '-1' ||
    			document.getElementById('lpuSelect').value !== '-1'
    		))) {
    		result = true;
    	}

    	return result;
    }

    function firstReq() {
    	return new Promise(function(resolve, reject) {
    		setTimeout(function() {
    			resolve('{"lpus":[{"name":"Поликлиника 1","lpu":"0001"}],"paidcategories":[{"id":1,"name":"Анализы","parent_id":0}, {"id":2,"name":"Кровь","parent_id":1}]}');
    		}, 100);
    	});
    }

    function secondReq() {
    	return new Promise(function(resolve, reject) {
    		setTimeout(function() {
    			resolve('{"total":"3","offset":"0","limit":"3","items":[{"service_name":"Услуга","service_price":"1000","service_desc":"описание услуги очень длинное, ну прям вообще","lpu_name":"Поликлиника 1","lpu_ratio":"10.0","lpu_addresses":[{"name":"Отделение 1","address":"улица Пушкина улица Пушкина улица Пушкина улица Пушкина улица Пушкина"},{"name":"Отделение 2","address":"улица Колотушкина"}],"category_name":"Диагностика"},{"service_name":"Услуга","service_price":"1000","service_desc":"описание услуги очень длинное, ну прям вообще","lpu_name":"Поликлиника 1","lpu_ratio":"10.0","lpu_addresses":[{"name":"Отделение 1","address":"улица Пушкина"},{"name":"Отделение 2","address":"улица Колотушкина"}],"category_name":"Диагностика"},{"service_name":"Услуга №2","service_price":"1000","service_desc":"описание услуги","lpu_name":"Поликлиника 1","lpu_ratio":"10.0","lpu_addresses":[{"name":"Отделение 1","address":"улица Пушкина"},{"name":"Отделение 2","address":"улица Колотушкина"}],"category_name":"Диагностика"}]}');
    		}, 100);
    	});
    }
	function getFilteringFields() {
		var result = [],
			fields = Array.prototype.slice.call(document.querySelectorAll('.filter-fields')),
			i;

		result = fields.filter(function(field) {
			return field.value !== '-1';
		});

		return result.map(function(field) {
			var type = field.name,
				result = {};
			switch (type) {
				case 'cats':
					result = {
						name: field.name,
						value: [
							field.value
						]
					};
					break;
				default:
					result = {
						name: type,
						value: field.value
					};
					break;
			}

			return result;
		});
	}

	function createSearchObject(offset) {
		var searchString = document.getElementById('searchString'),
			sortedItems = document.querySelectorAll('.ps-sorting__item_sorted'),
			result = {},
			i;

		result.searching_string = searchString.value;
		result.sorting_fields = [];
		result.filtering_fields = getFilteringFields();
		result.limit = 10;
		result.offset = offset || 0;

		for (i = 0; i < sortedItems.length; i++) {
			result.sorting_fields[i] = {
				'name': sortedItems[i].getAttribute('data-sort-field'),
				'order_by': sortedItems[i].classList.contains('asc') ? 'asc' : 'desc'
			}
		}

		return result;
	}

    function runSearch(offset) {
    	if (!validateSearchForm()) {
    		document.querySelector('.error-message').classList.add('error-message_active');
    	} else {
    		offset = offset || 0;
    		document.querySelector('.error-message').classList.remove('error-message_active');
	        //showLoading();
           console.log(createSearchObject(offset));
            fetch('https://er.em70.ru/api/paidservices/find?data=' + encodeURI(JSON.stringify(createSearchObject(offset))), {method: 'GET'})
            .then(function(response) {
                return response.json()
            })
            .then(function(response) {
            	console.log(response);
            	services = response.items ? getFormattedServices(response.items) : null;
                renderTemplate(
                    EM.templates.services,
                    {
                        services: services
                    },
                    '#' + settings.psContentId
                );
                document.querySelector('.ps-sorting').classList.add('ps-sorting_show');
                Pagination.run(
                	Math.ceil(parseInt(response.total,10) / parseInt(response.limit, 10)), 
                	parseInt(response.offset, 10) + 1, 
                	parseInt(response.limit, 10)
                );
                //hideLoading();
            });
    	}
    }

    function onCategoryChangeHandler(event) {
    	var categoryId = parseInt(event.detail.value, 10),
    		selectedCategory = categories[categoryId];

    	if (selectedCategory && selectedCategory.childs && selectedCategory.childs.length > 0) {
    		renderTemplate(
    			EM.templates.subcategories,
    			{
    				subcats: selectedCategory.childs
    			},
    			'#subcat'
    		)
    	} else {
    		document.getElementById('subcat').innerHTML = '';
    	}
    }

    function resetSorting(params) {
    	var sortFields = Array.prototype.slice.call(document.querySelectorAll('.ps-sorting__item_sorted')),
    		i;

    	if (params && params.exclude) {
    		sortFields = sortFields.filter(function(item) {
    			return (item !== params.exclude);
    		})
    	}

		for (i = 0; i < sortFields.length; i++) {
        	sortFields[i].classList.remove('asc');
        	sortFields[i].classList.remove('desc');
        	sortFields[i].classList.remove('ps-sorting__item_sorted');
        }
    }

    function resetSearchForm() {
    	var resetEvent = new Event('clear-form');

    	document.dispatchEvent(resetEvent);
        document.getElementById(settings.searchFormId).reset();
        document.getElementById(settings.psContentId).innerHTML = '';
        document.querySelector('.ps-sorting').classList.remove('ps-sorting_show');
        document.querySelector('.error-message').classList.remove('error-message_active');

        resetSorting();
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

    function onSearchStringChange(e) {
    	clearTimeout(timeoutId);

    	timeoutId = setTimeout(function() {
    		fetch('https://er.em70.ru/api/paidservices/find?data=' + encodeURI(JSON.stringify(createSearchObject(0))), {method: 'GET'})
            .then(function(response) {
                return response.json()
            })
            .then(function(response) {
            	var names;

            	if (response.items) {
            		names = response.items
	            		.map(function(item) {
	            			return item.service_name || ''
	            		})
	            		.filter(function(item) {
	            			return item !== ''
	            		});

	            	autocomplete._list = names;
            	}
            });
    	}, 400);
    }

    function bindSearchString(input) {
    	input.oninput = onSearchStringChange;
    	input.onpropertychange = input.oninput;

    	autocomplete = new Awesomplete(input, {
    		list: [],
    		minChars: 3,
    		autoFirst: true
    	});
    }

	function run(params) {
		setupSettings(params, settings);

		fetch('https://er.em70.ru/api/paidcategories/')
		//firstReq()
        .then(function(response) {
            return response.json();
            //return JSON.parse(response)
        })
        .then(function(response) {
        	categories = getCategories(response.paidcategories);
            renderTemplate(
	            EM.templates.main, 
	            {
	                formHeader: settings.formHeader,
	                searchPlaceholder: settings.searchPlaceholder,
	                searchInputLabel: settings.searchInputLabel,
	                advancedSearchId: settings.advancedSearchId,
	                categories: categories,
	                lpus: response.lpus,
	                searchFormId: settings.searchFormId,
	                psContentId: settings.psContentId
	            },
	            '#' + settings.psId
	        );
	        EM.initSelects();
	        searchString = document.getElementById('searchString');
	        bindSearchString(searchString);
        	advancedSearch = document.getElementById(settings.advancedSearchId);
        });
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
		resetSorting({
			exclude: sortingButton
		});
		changeSortingButtonOrder(sortingButton);
		runSearch();
	}

	function showService(button) {
		var number = button.getAttribute('data-desc');
		console.log(services[number]);
		renderTemplate(
			EM.templates.modal,
			{
				service: services[number]
			},
			'#serviceWrap'
		);

		document.getElementById('service').style.display = 'block';
	}

	function hideService() {
		document.getElementById('service').style.display = 'none';
	}

	global.EM = (typeof EM === 'object' ? EM : window.EM = {});
	EM.ps = {};
	EM.ps.toggleAdvancedSearch = toggleAdvancedSearch;
	EM.ps.runSearch = runSearch;
	EM.ps.resetSearchForm = resetSearchForm;
	EM.ps.sort = sort;
	EM.ps.run = run;
	EM.ps.onCategoryChangeHandler = onCategoryChangeHandler;
	EM.ps.showService = showService;
	EM.ps.hideService = hideService;
}(window));