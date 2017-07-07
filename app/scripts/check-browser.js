(function(global) {
	function getBrowser(chrAfterPoint) {

		var
		    UA=global.navigator.userAgent,       // содержит переданный браузером юзерагент
		    //--------------------------------------------------------------------------------
			OperaB = /Opera[ \/]+\w+\.\w+/i,     //
			OperaV = /Version[ \/]+\w+\.\w+/i,   //	
			FirefoxB = /Firefox\/\w+\.\w+/i,     // шаблоны для распарсивания юзерагента
			ChromeB = /Chrome\/\w+\.\w+/i,       //
			SafariB = /Version\/\w+\.\w+/i,      //
			IEB = /MSIE *\d+\.\w+/i,             //
			SafariV = /Safari\/\w+\.\w+/i,       //
			EdgeB = /Edge\/\w+\.\w+/i,
		    //--------------------------------------------------------------------------------
			browser = new Array(),               //массив с данными о браузере
			browserSplit = /[ \/\.]/i,           //шаблон для разбивки данных о браузере из строки
			OperaV = UA.match(OperaV),
			Firefox = UA.match(FirefoxB),
			Chrome = UA.match(ChromeB),
			Safari = UA.match(SafariB),
			SafariV = UA.match(SafariV),
			IE = UA.match(IEB),
			Edge = UA.match(EdgeB),
			Opera = UA.match(OperaB);
			
		//----- Opera ----
		if (Opera && OperaV) {
			browser[0] = OperaV[0].replace(/Version/, 'Opera');
		} else if (Opera){
			browser[0] = Opera[0];
		} else if (window.atob && !Edge) {
			//----- IE10+ -----
			browser[0] = 'MSIE/11.0';
		} else if (Firefox) {
			//----- Firefox ----
			browser[0] = Firefox[0];
		} else if (Chrome && !Edge) {
			//----- Chrome ----
			browser[0] = Chrome[0];
		} else if (Edge) {
			browser[0] = Edge[0];
		} else if (Safari && SafariV && !Edge) {
			//----- Safari ----
			browser[0] = Safari[0].replace('Version', 'Safari');
		} else if (IE) {
			browser[0] = IE[0];
		}
		//------------ Разбивка версии -----------
		var outputData = null; 	// возвращаемый функцией массив значений
	                    		// [0] - имя браузера, [1] - целая часть версии
	                    		// [2] - дробная часть версии
		if (browser[0] != null) {
			outputData = browser[0].split(browserSplit);
			if (chrAfterPoint !== null) {
				outputData[2] = outputData[2].substring(0, chrAfterPoint); // берем нужное ко-во знаков
			}
		}
		if (outputData != null) {
			return outputData;
		} else {
			return false;
		}
	}

	function checkBrowser(params) {
		if (!params.chrome) params.chrome = 49;
		if (!params.safari) params.safari = 5;
		if (!params.msie) params.msie = 10;
		if (!params.opera) params.opera = 45;
		if (!params.firefox) params.firefox = 51;
		
		var browser = getBrowser(1),
			browserName = browser[0],
			browserVer = browser[1],
			browserVerPoints = browser[2],
			browserVer = parseFloat(browserVer+'.'+browserVerPoints);

		if (browserName && (browserVer || browserVer === 0)) {
			switch (browserName) {
				case 'Chrome':
					if (browserVer < params.chrome) {
						return false;
					}
					break;
				case 'Safari':
					if (browserVer < params.safari) {
						return false;
					}
					break;
				case 'MSIE':
					if (browserVer < params.msie) {
						return false;
					}
					break;
				case 'Opera':
					if (browserVer < params.opera) {
						return false;
					}
					break;
				case 'Firefox':
					if (browserVer < params.firefox) {
						return false;
					}
					break;
			};
		}

		return true;
	}

	function getCookie(name) {
		var matches = document.cookie.match(new RegExp(
			'(?:^|; )' + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + '=([^;]*)'
		));
		return matches ? decodeURIComponent(matches[1]) : undefined;
	}

	function setCookie(name, value, options) {
		options = options || {};

		var expires = options.expires;

		if (typeof expires == 'number' && expires) {
			var d = new Date();
			d.setTime(d.getTime() + expires * 1000);
			expires = options.expires = d;
		}
		if (expires && expires.toUTCString) {
			options.expires = expires.toUTCString();
		}

		value = encodeURIComponent(value);

		var updatedCookie = name + '=' + value;

		for (var propName in options) {
			updatedCookie += '; ' + propName;
			var propValue = options[propName];
			if (propValue !== true) {
		  		updatedCookie += '=' + propValue;
			}
		}

		document.cookie = updatedCookie;
	}

	var browserCookie = getCookie('em_browser'),
		params = {
			chrome: 49,
		    safari: 5,
		    msie: 10,
		    opera: 45,
		    firefox: 51
		};

	if (browserCookie) {
		if (browserCookie === 'old') {
			global.location = '/rav/free-doctor/v2/old-browser/';
		}
	} else {
		if (!checkBrowser(params)) {
			setCookie('em_browser', 'old', {path: '/', expires: 30 * 24 * 60 * 60 * 1000});
			global.location = '/rav/free-doctor/v2/old-browser/';
		} else {
			setCookie('em_browser', 'new', {path: '/', expires: 30 * 24 * 60 * 60 * 1000});
		}
	}
}(window));