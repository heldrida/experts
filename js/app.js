// debug messages
var Debugger = {
	log: function(message) {

		try {

			console.log(message);

		} catch (exception) {

			return;

		}

	}
};

(function () {

	/**
	 *  Experts Top Box
	 *
	 *  blue: #3b81ff
	 */
    var ExpertsTopbox = function () {

		this.init();

    };

	ExpertsTopbox.prototype = {

		init: function (data) {

			this.setProperties();
			this.attachListeners();
			this.initAnimations();

		},

		setProperties: function (data) {

			this.container = document.querySelector('.sh-experts-topbox');

			this.titleDiv = document.querySelector('#title-container');
			this.attachTitle();

			this.animationTimes = {
				title_animation_delay: 200
			};

		},

		initAnimations: function () {

			TweenLite.to(this.container, 0.3, { opacity: 1 });

		},

		attachListeners: function () {

			window.addEventListener('resize', this.titleHandler.bind(this));

		},

		attachTitle: function () {

			var h1 = this.titleDiv.querySelector('h1');
			var p = this.titleDiv.querySelector('p');
			var elements = [];
			elements.push(h1);
			elements.push(p);

			this.titleHandler();

			setTimeout(function () {

				this.titleAnimationsHandler.call(this, elements);

			}.bind(this), 400);

		},

		titleHandler: function () {

			var h1 = this.titleDiv.querySelector('h1');
			var p = this.titleDiv.querySelector('p');

			if (window.innerWidth < 1028) {

				this.titleDiv.style.top = '';
				h1.style.fontSize = '';
				h1.style.letterSpacing = '';
				h1.style.position = '';
				p.style.fontSize = '';
				p.style.letterSpacing = '';
				p.style.padding = '';
				p.style.lineHeight = '';
				p.style.position = '';

				return false;

			}

			var ratio = 1.3;
			var rm = (30 * ratio) / 1440;
			var rh1 = (30 * ratio) / 1440;
			var rh1_ls = (1.5 * ratio) / 1440;
			var rp = (10 * ratio) / 1440;
			var rp_ls = (1.22 * ratio) / 1440;
			var rp_p = (10 * ratio) / 1440;
			var rp_ln = (16 * ratio) / 1440;
			var rp_container = 675 / 1440;

			this.titleDiv.style.top = (window.innerWidth * rm) + 'px';
			h1.style.fontSize = (window.innerWidth * rh1) + 'px';
			h1.style.letterSpacing = (window.innerWidth * rh1_ls) + 'px';
			h1.style.position = "relative";
			p.style.fontSize = (window.innerWidth * rp) + 'px';
			p.style.letterSpacing = (window.innerWidth * rp_ls) + 'px';
			p.style.padding = (window.innerWidth * rp_p) + 'px 0';
			p.style.lineHeight = (window.innerWidth * rp_ln) + 'px';
			p.style.position = "relative";
			this.titleDiv.style.maxWidth = (window.innerWidth * rp_container) + 'px';


		},

		titleAnimationsHandler: function (els) {

			var delay = 0;

			for (var i = 0; i < els.length; i++) {

				(function (context, el, delay) {

					setTimeout(function () {

						TweenLite.fromTo(el, 1.2, {
							left: '-50px',
							opacity: 0
						}, {
							left: '0px',
							opacity: 1
						});

					}.bind(context), delay);

				}(this, els[i], delay));

				delay += this.animationTimes.title_animation_delay;

			}

		},

	};

	window.expertsTopbox = new ExpertsTopbox();

}());