(function(global) {
    VK.init({
		apiId: 6071772
	});
	
    VK.Auth.getLoginStatus(function(response) {
        if (response.session) {
        	EM.auth.loginSuccess('vk');
        }
	});

	function login(callback) {
		VK.Auth.getLoginStatus(function(response) {
	        if (response.session) {
	        	if (callback) {
	        		callback('success');
	        	}
	        } else {
	        	VK.Auth.login(function(response) {
			        if (response.session) {
			            /* Пользователь успешно авторизовался */
			            if (callback) {
			        		callback('success');
			        	}
			            if (response.settings) {
			            /* Выбранные настройки доступа пользователя, если они были запрошены */
			            }
			        } else {
			            /* Пользователь нажал кнопку Отмена в окне авторизации */
			        }
			    }, 4194304);
	        }
	    });
	}

	function logout(callback) {
		VK.Auth.logout(function(response) {
			if (!response.session) {
				callback('success');
			}
		});
	}

	global.EM = (typeof EM === 'object' ? EM : global.EM = {});
	global.EM.auth = (typeof auth === 'object' ? auth : global.auth = {});

	global.EM.auth.vk = {};

	global.EM.auth.vk.login = login;
	global.EM.auth.vk.logout = logout;
	// https://oauth.vk.com/authorize?client_id=5988860&scope=name,email&redirect_uri=http://mysite.local&display=popup&response_type=token
	// https://oauth.vk.com/access_token?client_id=5988860&client_secret=9VztbqjlOs7CB7P5uLGq&code=4246ab8032df10bf582cf4991c66120e391e8b4b849ef8dfebd322bdfa340cc3401a4331778f2dcaac5a4&redirect_uri=http://mysite.ru
	//
	// https://oauth.vk.com/authorize?client_id=APP_ID&scope=PERMISSIONS&redirect_uri=REDIRECT_URI&response_type=code&v=API_VERSION
})(window);