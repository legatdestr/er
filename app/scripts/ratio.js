(function(global) {
	function renderTemplate(template, params, target) {
		document.querySelector(target).innerHTML = template(params);
	}

	function run() {
		renderTemplate(
			EM.templates.ratioMain,
			{},
			'#ratio-widget'
		);
	}

	function showModal() {
		document.getElementById('review').style.display = 'block';
	}

	global.EM = (typeof EM === 'object' ? EM : window.EM = {});
	EM.ratio = {};
	EM.ratio.run = run;
	EM.ratio.showModal = showModal;
}(window));