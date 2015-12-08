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
			this.expertsWrap = this.container.querySelector('.experts-wrap');
			this.titleDiv = document.querySelector('#title-container');
			this.expertsListContainer = document.querySelector('.experts-list');
			this.expertsList = this.expertsListContainer.querySelectorAll('li');
			this.setExpertsSize();
			this.attachTitle();
			this.animationTimes = {
				title_animation_delay: 200,
				particleDisplayLengthSecs: 8,
				moveExpertToCenterSecs: 0.6,
				expertScaleDownMs: 0.3
			};
			this.expertUnlockerTimeoutMs = 1800;

			// set default expert size
			this.defaultExpertSize = {
				width: this.expertsList[0].offsetWidth,
				height: this.expertsList[0].offsetHeight
			};

			// colours
			this.colours = {
				hex: {
					grey: '0xAAAAAA',
					blue: '0x3b81ff',
					white: '0xffffff'
				}
			};

			this.mouseMoveEvent = {
				clientX: null,
				clientY: null
			};

			// calculate project container ratio
			this.containerRatio = 1440 / 677;

			this.globalSizes = {
				width: this.container.offsetWidth,
				height: 677
			};

			this.container.style.height = this.globalSizes.height + 'px';

			// create renderer
			this.renderer = new PIXI.CanvasRenderer(this.globalSizes.width, this.globalSizes.height, {
				antialias: true,
				resolution: 2,
				roundPixels: true
			});

			this.container.appendChild(this.renderer.view);

			// create stage
			this.stage = new PIXI.Container();

			// generate the particles
			this.particleSize = [1.2, 2, 2.3, 2.5, 3, 3.2];
			this.particlesTotal = 80;
			this.particles = [];
			this.particlesFrictionValue = 400;
			this.generateParticles();

			// set expert element xy origin
			this.setExpertListOrigin();

			this.activeExpertElement = false;

			this.lockExpertClick = false;
			console.log('lockExpertClick starts: false @ ln 133');

			this.quotePointerTimeline = [];

			this.quoteModule = document.querySelector('#quoteWrp');

			this.showQuoteModuleTimeline = [];

		},

		initAnimations: function () {

			TweenLite.to(this.container, 0.3, { opacity: 1 });
			this.expertListAnimationHandler(this.expertsList);
			this.startTicker();

		},

		attachListeners: function () {

			window.addEventListener('resize', this.rendererSizeHandler.bind(this));
			window.addEventListener('resize', _.debounce(this.setExpertListOrigin.bind(this), 100));
			window.addEventListener('resize', this.setDefaultExpertSize.bind(this));
			window.addEventListener('resize', this.expertCenterHandler.bind(this));
			//window.addEventListener('resize', this.repositionQuote.bind(this));

			this.container.addEventListener('mousemove', function (e) {
				this.mouseMoveEvent.clientX = e.clientX;
				this.mouseMoveEvent.clientY = e.clientY;
			}.bind(this));

			for (var i = 0; i < this.expertsList.length; i++) {

				this.expertsList[i].addEventListener('click', this.expertListClickHandler.bind(this, i));

			}

			// close when clicking outside expert element
			this.container.addEventListener('click', function (e) {

				if (this.lockExpertClick) {
					e.preventDefault();
					return;
				}

				this.lockExpertClick = true;

				if ((e.target === this.container || e.target === this.expertsWrap || e.target === this.expertsListContainer) && this.activeExpertElement) {

					this.expertCenterHandler();

				}

			}.bind(this));

		},

		attachTitle: function () {

			var h1 = this.titleDiv.querySelector('h1');
			var p = this.titleDiv.querySelector('p');
			var elements = [];
			elements.push(h1);
			elements.push(p);

			setTimeout(function () {

				this.titleAnimationsHandler.call(this, elements);

			}.bind(this), 400);

		},

		titleHandler: function () {

			var h1 = this.titleDiv.querySelector('h1');
			var p = this.titleDiv.querySelector('p');

			if (window.innerWidth < 1028) {

				//this.titleDiv.style.top = '';
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

			//this.titleDiv.style.top = (window.innerWidth * rm) + 'px';
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

		expertListAnimationHandler: function (els) {

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

		setExpertsSize: function () {

			var total = this.expertsList.length;
			var perc = 100 / total;

			for (var i = 0; i < total; i++) {

				this.expertsList[i].style.width = perc + '%';

			}

		},

		startTicker: function () {

			var context = this;

			function animate() {

				// loop
				requestAnimationFrame(animate);
				context.particleMouseMoveHandler.call(context);
				context.renderer.render(context.stage);

			}

			animate.call(this);

		},

		generateParticles: function () {

			for (var col = 1; col <= 3; col++) {

				for (var i = 1; i <= this.particlesTotal; i++) {

					this.particle.call(this, col);

				}

			}

		},

		particle: function (col) {

			var size = this.particleSize[Math.floor(Math.random() * this.particleSize.length) + 1];
			var gfxCircle = new PIXI.Graphics();
			gfxCircle.beginFill(this.colours.hex.grey);
			gfxCircle.lineStyle(1, this.colours.hex.grey);
			gfxCircle.drawCircle(size, size, size);
			gfxCircle.x = ((this.globalSizes.width / 2) * col) * Math.random();
			gfxCircle.y = ((this.globalSizes.height / 2) * Math.random()) + this.globalSizes.height * 0.3;;

			gfxCircle.alpha = Math.max(0.2, Math.random());

			gfxCircle.scale.x = gfxCircle.scale.y = Math.max(0.2, Math.random());

			this.particles.push({
				root: {
					x: gfxCircle.x,
					y: gfxCircle.y,
					size: size
				},
				circle: gfxCircle
			});

			this.stage.addChild(gfxCircle);

		},

		particleMouseMoveHandler: function () {

			var anim = function (i) {

				var posX, posY, friction;

				friction = this.particles[i].root.size / this.particlesFrictionValue;

				posX = this.particles[i].circle.x = this.particles[i].root.x + (this.mouseMoveEvent.clientX * friction);
				posY = this.particles[i].circle.y = this.particles[i].root.y + (this.mouseMoveEvent.clientY * friction);

				this.particles[i].circle.x = posX;
				this.particles[i].circle.y = posY;

			};

			for (var i = 0; i < this.particles.length; i++) {

				anim.call(this, i);

			}

		},

		rendererSizeHandler: function () {

			this.globalSizes.width = this.container.offsetWidth;
			this.renderer.resize(this.globalSizes.width, this.globalSizes.height);

		},

		expertListClickHandler: function (index) {

			if (this.lockExpertClick) {
				return;
			}

			// lock
			this.lockExpertClick = true;
			console.log('lockExpertClick set: true @ ln 395 on the fn expertListClickHandler()');

			// current target positions
			var element = this.expertsList[index];

			if (element.classList.contains('active')) {

				this.closeExpertInfoClickHandler(index);

			} else {

				this.showExpertInfoClickHandler(index);

			}

		},

		showExpertInfoClickHandler: function (index) {

			var element = this.expertsList[index];
			var pos = this.getCenter(element);

			// toggle active
			this.toggleActiveHandler(element);

			// move expert to the center
			TweenLite.to(element, this.animationTimes.moveExpertToCenterSecs, { x: pos.x, y: pos.y, ease: Power1.easeOut, onComplete: function () {
					/*
					// unlock after
					setTimeout(function () {
						this.lockExpertClick = false;
					}.bind(this), this.expertUnlockerTimeoutMs);
					*/
					this.showQuotePointerAnim(index);
				}.bind(this)
			});

		},

		closeExpertInfoClickHandler: function (index) {

			var element = this.expertsList[index];
			var x = 0;
			var y = 0;

			var moveToOrigin = function () {

				// reset all
				this.resetExperts();

				TweenLite.to(element, this.animationTimes.moveExpertToCenterSecs, { x: x, y: y, ease: Power1.easeOut, onComplete: function () {
						// drop quoteModule to the background / zindex depth
						this.quoteModule.style.zIndex = -1;
						this.setExpertListOrigin.call(this);
					}.bind(this)
				});
			};

			this.hideQuotePointerAnim(index, moveToOrigin.bind(this));

		},

		toggleActiveHandler: function (element) {

			// activate target element
			element.classList.add('active');

			// keep a reference for the active expert element
			this.activeExpertElement = element;

			// for non targeted, remove class active and scale down
			for (var i = 0; i < this.expertsList.length; i++) {

				var current = this.expertsList[i];

				if (current !== element) {

					current.classList.remove('active');

					TweenLite.to(this.expertsList[i], this.animationTimes.expertScaleDownMs, { scale: 0 });

				}

			}

		},

		setExpertListOrigin: function () {

			for (var i = 0; i < this.expertsList.length; i++) {

				var element = this.expertsList[i];
				var pos = element.getBoundingClientRect();

				element.setAttribute('data-origin-x', pos.left);
				element.setAttribute('data-origin-y', pos.top);

			}

		},

		resetExperts: function (element) {

			// for non targeted, remove class active and scale down
			for (var i = 0; i < this.expertsList.length; i++) {

				var current = this.expertsList[i];

				current.classList.remove('active');

				TweenLite.to(this.expertsList[i], this.animationTimes.expertScaleDownMs, { scale: 1, onComplete: false });

			}

			// remove the reference
			this.activeExpertElement = false;

			// unlock after
			setTimeout(function () {
				this.lockExpertClick = false;
				console.log('lockExpertClick set: false after a few Ms @ ln 522 on the fn  resetExperts');
			}.bind(this), this.expertUnlockerTimeoutMs);

			this.setExpertListOrigin.call(this);

		},

		getCenter: function (element) {

			// container center
			var containerClientRect = this.container.getBoundingClientRect();

			var x = ((containerClientRect.width) / 2) + containerClientRect.left;
			var y = (this.expertsWrap.offsetHeight / 2) - (this.quoteModule.offsetHeight / 2);

			// offset the positions
			x = x - (this.defaultExpertSize.width / 2);

			x = x - element.getAttribute('data-origin-x');
			y = y - element.getAttribute('data-origin-y');

			// offset if LI smaller then the child el
			var child = element.querySelector('.expert-wrp');

			if (child.offsetWidth > element.offsetWidth) {

				var offset = child.offsetWidth - element.offsetWidth;
				child.style.left = -(offset / 2) + 'px';

			} else {

				child.style.marginLeft = '';

			}

			var pos = { x: x, y: y};

			return pos;

		},

		expertCenterHandler: function () {

			if (this.activeExpertElement) {

				var index = this.getExpertIndexByEl(this.activeExpertElement);
				this.closeExpertInfoClickHandler(index);

			}

		},

		getExpertIndexByEl: function (el) {

			var index = Array.prototype.indexOf.call(this.expertsList, el);

			return index;

		},

		setDefaultExpertSize: function () {

			// set default expert size
			this.defaultExpertSize = {
				width: document.querySelector('.experts-list li').offsetWidth,
				height: document.querySelector('.experts-list li').offsetHeight
			};

		},

		showQuotePointerAnim: function (index) {

			// change zIndex, to top
			this.quoteModule.style.zIndex = 10;

			if (typeof this.quotePointerTimeline[index] !== "undefined") {

				this.quotePointerTimeline[index].eventCallback('onComplete', function () {
					this.showQuoteModule(index);
				}.bind(this));

				this.quotePointerTimeline[index].restart();

			} else {

				var lineEl = this.expertsList[index].querySelector('.line');
				var tipEl = this.expertsList[index].querySelector('.tip');

				// timeline animation
				var tl = new TimelineLite();

				tl.eventCallback('onComplete', function () {
					this.showQuoteModule(index);
				}.bind(this));

				tl.to(lineEl, 0.3, { width: 110, opacity: 1 });
				tl.to(tipEl, 0.3, { opacity: 1, scale: 3 }, "-=0.1");
				tl.to(tipEl, 0.3, { scale: 1 });

				// cache if not existent
				if (typeof this.quotePointerTimeline[index] === "undefined") {

					this.quotePointerTimeline[index] = tl;

				}

			}

		},

		hideQuotePointerAnim: function (index, callback) {

			/*
			this.quotePointerTimeline[index].reverse();
			*/

			var lineEl = this.expertsList[index].querySelector('.line');
			var tipEl = this.expertsList[index].querySelector('.tip');
			var tl = new TimelineLite();
			tl.to(tipEl, 0.3, { opacity: 0.7, scale: 3 });
			tl.to(tipEl, 0.3, { opacity: 0, scale: 1 });
			tl.to(lineEl, 0.3, { opacity: 0.7, width: 0 }, "-=0.4");

			this.showQuoteModuleTimeline[index].reverse();

			tl.eventCallback("onComplete", function () {

				if (typeof callback !== "undefined") {
					callback.call(this);
				}

			});

		},

		positionQuote: function (index) {

			var element = this.expertsList[index].querySelector('.pointer-wrp .tip');

			// find pointer tip pos
			var pointerPos = element.getBoundingClientRect();

			var max = Math.max(this.quoteModule.offsetWidth, pointerPos.left);
			var min = Math.min(this.quoteModule.offsetWidth, pointerPos.left);

			var offsetWidth = max - min;

			var offsetHeight = pointerPos.top - (this.quoteModule.offsetHeight / 2);
			var offsetMargin = 15;

			var desktopContainerPos = this.expertsWrap.getBoundingClientRect();
			offsetWidth = (offsetWidth - desktopContainerPos.left) + this.expertsWrap.offsetLeft;

			// set quote module position
			this.quoteModule.style.top = offsetHeight + "px";
			this.quoteModule.style.left = (offsetWidth - offsetMargin) + "px";

		},

		repositionQuote: function () {

			var index = this.getExpertIndexByEl(this.activeExpertElement);

			this.positionQuote(index);

		},

		showQuoteModule: function (index) {

			this.setQuoteText(index);

			this.positionQuote.call(this, index);

			var tl = new TimelineLite();

			var p = this.quoteModule.querySelector('p');
			//var span = this.quoteModule.querySelector('span');
			tl.fromTo(p, 0.2, { opacity: 0, right: '-5%' }, { opacity: 1, right: '0%', ease: Back.easeOut.config(1.7) });
			//tl.fromTo(span, 0.2, { opacity: 0, right: '-5%' }, { opacity: 1, right: '0%', ease: Back.easeOut.config(1.7) }, "-=0.3");

			this.showQuoteModuleTimeline[index] = tl;

			tl.eventCallback('onComplete', function () {
				// unlock after
				setTimeout(function () {
					this.lockExpertClick = false;
					console.log('lockExpertClick set: false after a few Ms @ ln 708 on the fn  showQuoteModule, after the tl onComplete event');
				}.bind(this), this.expertUnlockerTimeoutMs);
			}.bind(this));

		},

		setQuoteText: function (index) {

			var element = this.expertsList[index];
			var quote = element.querySelector('[name="quote"]').value;
			var first_name = element.querySelector('[name="first_name"]').value;
			var second_name = element.querySelector('[name="second_name"]').value;
			var skill = element.querySelector('[name="skill"]').value;

			var quoteHtmlNode = '<p>' + quote + '</p>';
			//var spanHtmlNode = '<span>' + first_name + ' <span>' + second_name + '</span> | ' + skill + '</span>';

			this.quoteModule.innerHTML = quoteHtmlNode; //+ spanHtmlNode;
		}

	};

	window.expertsTopbox = new ExpertsTopbox();

}());