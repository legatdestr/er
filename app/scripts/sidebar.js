(function (global) {
	function outerHeight(el) {
	  var height = el.offsetHeight;
	  var style = getComputedStyle(el);

	  height += parseInt(style.marginTop) + parseInt(style.marginBottom);
	  return height;
	}

	function offset(el) {
	    var rect = el.getBoundingClientRect(),
	    scrollLeft = window.pageXOffset || document.documentElement.scrollLeft,
	    scrollTop = window.pageYOffset || document.documentElement.scrollTop;
	    return { top: rect.top + scrollTop, left: rect.left + scrollLeft }
	}

	function scrollTop() {
		var supportPageOffset = window.pageYOffset !== undefined;
		var isCSS1Compat = ((document.compatMode || "") === "CSS1Compat");

		return supportPageOffset ? window.pageYOffset : isCSS1Compat ? document.documentElement.scrollTop : document.body.scrollTop;
	}

	global.requestAnimFrame = (function() {
	  return  global.requestAnimationFrame       ||
	          global.webkitRequestAnimationFrame ||
	          global.mozRequestAnimationFrame    ||
	          function( callback ){
	            global.setTimeout(callback, 1000 / 60);
	          };
	})();

	// main function
	function scrollToY(scrollTargetY, speed, easing) {
	    // scrollTargetY: the target scrollY property of the window
	    // speed: time in pixels per second
	    // easing: easing equation to use

	    var scrollY = window.scrollY || document.documentElement.scrollTop,
	        scrollTargetY = scrollTargetY || 0,
	        speed = speed || 2000,
	        easing = easing || 'easeOutSine',
	        currentTime = 0;

	    // min time .1, max time .8 seconds
	    var time = Math.max(.1, Math.min(Math.abs(scrollY - scrollTargetY) / speed, .8));

	    // easing equations from https://github.com/danro/easing-js/blob/master/easing.js
	    var easingEquations = {
	            easeOutSine: function (pos) {
	                return Math.sin(pos * (Math.PI / 2));
	            },
	            easeInOutSine: function (pos) {
	                return (-0.5 * (Math.cos(Math.PI * pos) - 1));
	            },
	            easeInOutQuint: function (pos) {
	                if ((pos /= 0.5) < 1) {
	                    return 0.5 * Math.pow(pos, 5);
	                }
	                return 0.5 * (Math.pow((pos - 2), 5) + 2);
	            }
	        };

	    // add animation loop
	    function tick() {
	        currentTime += 1 / 60;

	        var p = currentTime / time;
	        var t = easingEquations[easing](p);

	        if (p < 1) {
	            requestAnimFrame(tick);

	            window.scrollTo(0, scrollY + ((scrollTargetY - scrollY) * t));
	        } else {
	            console.log('scroll done');
	            window.scrollTo(0, scrollTargetY);
	        }
	    }

	    // call it once to get started
	    tick();
	}

	function sidebarItemClickHandler(e) {
		e.preventDefault();
		var clickedItem = e.target,
			targetId,
			offsetTop;

		clickedItem = clickedItem.parentNode.className.indexOf('sidebar__item') !== -1 ?
					clickedItem.parentNode :
					clickedItem.parentNode.parentNode.className.indexOf('sidebar__item') !== -1 ?
						clickedItem.parentNode.parentNode :
						clickedItem.parentNode.parentNode.parentNode.className.indexOf('sidebar__item') !== -1 ?
							clickedItem.parentNode.parentNode.parentNode :
							null;

		targetId = clickedItem.getAttribute('data-target');

		offsetTop = targetId === '#' 
			? 0 
			: (offset(document.getElementById(targetId)).top - menuHeight + 15);
		
		scrollToY(offsetTop);
	}

	var 
		lastId,
		sidebar = document.getElementById('sidebar'),
		menuHeight = outerHeight(document.getElementById('navbar')) + 15,
		sidebarItems = Array.prototype.slice.call(sidebar.querySelectorAll('.sidebar__item')),
		scrollItems = sidebarItems.map(function(item) {
			var innerItem = document.getElementById(item.getAttribute('data-target'));

			if (innerItem) {
				return innerItem;
			}
		});

		sidebarItems.forEach(function(item, index, arr) {
			item.addEventListener('click', sidebarItemClickHandler);
		});

	global.onscroll = function() {
		var fromTop = scrollTop() + menuHeight,
			cur = scrollItems.filter(function(item) {
				return offset(item).top < fromTop + 40;
			}),
			id;

			cur = cur[cur.length - 1];
			id = cur ? cur.id : '';

			if (lastId !== id) {
				lastId = id;

				sidebarItems.forEach(function(item) {
					item.classList.remove('sidebar__item_active');

					if (item.getAttribute('data-target') == lastId) {
						item.classList.add('sidebar__item_active');
					}
				});
			}
	}
}(window));

//el.offset().top === el.getBoundingClientRect().top