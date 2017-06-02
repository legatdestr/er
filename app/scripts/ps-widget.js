(function(global, extParams) {
	var objProt = global.Object.prototype;

	function main() {
		var settings = {
			psId: 'paid-services-widget',
			formHeader: 'Поиск услуг',
			searchInputLabel: 'Поисковый запрос',
			searchPlaceholder: 'Поиск...',
            advancedSearchId: 'advancedSearch',
            searchFormId: 'searchForm',
            psContentId: 'psContent'
		},
        states = {
            advancedSearch: false
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

        function loadScript(url, callback) {
            var head = document.getElementsByTagName('head')[0],
                script = document.createElement('script');

            script.src = url;

            if (callback) {
                //Humans browser
                script.onload = callback;

                //IE
                script.onreadystatechange = function () {
                    if (this.readyState == 'loaded' || this.readyState == 'complete') {
                        callback();
                    }
                };
            }
            head.appendChild(script);
        }

		function renderTemplate(template, params, target) {
			document.querySelector(target).innerHTML = template(params);
		}

        function showLoading() {
            document.querySelector('.loading-overlay').classList.add('loading-overlay_show');
        }

        function hideLoading() {
            document.querySelector('.loading-overlay').classList.remove('loading-overlay_show');
        }

        function runSearch() {
            showLoading();
            setTimeout(function() {
                fetch('https://er.em70.ru/api/paidservices/find')
                .then(function(response) {
                    return response.json()
                })
                .then(function(response) {
                    console.log(response);
                    renderTemplate(
                        EM.templates.services,
                        {
                            services: response.items
                        },
                        '#' + settings.psContentId
                    )
                    hideLoading();
                });
            }, 3000);
        }

        function resetSearchForm() {
            document.getElementById(settings.searchFormId).reset();
            document.getElementById(settings.psContentId).innerHTML = '';
        }

        function toggleAdvancedSearch() {
            var advancedSearch = document.getElementById(settings.advancedSearchId);

            if (advancedSearch) {
                if (advancedSearch.classList.contains('advanced-search_show')) {
                    advancedSearch.classList.remove('advanced-search_show');
                    advancedSearch = false;
                } else {
                    advancedSearch.classList.add('advanced-search_show');
                    advancedSearch = true;
                }
            }
        }

		setupSettings(extParams, settings);

		renderTemplate(
            EM.templates.main, 
            {
                formHeader: settings.formHeader,
                searchPlaceholder: settings.searchPlaceholder,
                searchInputLabel: settings.searchInputLabel,
                advancedSearchId: settings.advancedSearchId,
                categories: ['Диагностика', 'Анализы', 'Операция'],
                lpus: ['Поликлиника 1', 'Поликлиника 4'],
                searchFormId: settings.searchFormId,
                psContentId: settings.psContentId
            },
            '#' + settings.psId
        );

        global.toggleAdvancedSearch = toggleAdvancedSearch;
        global.runSearch = runSearch;
        global.resetSearchForm = resetSearchForm;
	}

	document.addEventListener('DOMContentLoaded', main);
}(window, ps_widget_params));