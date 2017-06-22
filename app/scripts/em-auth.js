(function (global) {

	var authContainer = document.querySelector('.auth'),
		_type = {
			value: ''
		};

	function renderTemplate(template, params, target) {
		if (typeof target === 'string') {
			document.querySelector(target).innerHTML = template(params);
		} else if (typeof target === 'object') {
			target.innerHTML = template(params);
		}
	}

	function showLoginForm() {
		if (authContainer) {
			renderTemplate(
				EM.templates.authModal,
				{},
				authContainer
			);	
			document.getElementById('auth').style.display = 'block';
		}
	}

	function hideLoginForm() {
		document.getElementById('auth').style.display = 'none';
	}

	function showUserBlock(name) {
		var userBlock = document.getElementById('userInfo'),
			userNameContainer;

		if (userBlock) {
			userNameContainer = userBlock.querySelector('.user-info__name');
			userNameContainer.textContent = name;
			userBlock.classList.add('user-info_show');
		}
	}

	function hideUserBlock(name) {
		var userBlock = document.getElementById('userInfo'),
			userNameContainer;

		if (userBlock) {
			userNameContainer = userBlock.querySelector('.user-info__name');
			userNameContainer.textContent = '';
			userBlock.classList.remove('user-info_show');
		}
	}
	
	function hideLoginButton() {
		var loginButton = document.querySelector('.navbar__item_login');

		if (loginButton) {
			loginButton.style.display = 'none';
		}
	}

	function showLoginButton() {
		var loginButton = document.querySelector('.navbar__item_login');

		if (loginButton) {
			loginButton.style.display = 'inline-block';
		}
	}

	function loginSuccess(type) {
		hideLoginButton();
        showUserBlock('Артём Рожков');
        setType('vk');
	}

	function logoutSuccess() {
		showLoginButton();
        hideUserBlock('Артём Рожков');
        setType('');
	}

	function login(type) {
		if (type === 'vk') {
			EM.auth.vk.login(function(result) {
				if (result === 'success') {
					loginSuccess('vk');
				}
			});
			setType(type);
		}
	}

	function logout() {
		if (_type.value === 'vk') {
			EM.auth.vk.logout(function(result) {
				if (result === 'success') {
					logoutSuccess();
				}
			});
		}
	}

	function setType(type) {
		_type.value = type;
	}

	global.EM = (typeof EM === 'object' ? EM : global.EM = {});
	global.EM.auth = (typeof auth === 'object' ? auth : global.auth = {});

	global.EM.auth.showLoginForm = showLoginForm;
	global.EM.auth.hideLoginForm = hideLoginForm;
	global.EM.auth.login = login;
	global.EM.auth.logout = logout;
	global.EM.auth.loginSuccess = loginSuccess;
	global.EM.auth.setType = setType;
	global.EM.auth.type = _type;
})(window);