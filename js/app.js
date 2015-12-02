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
			this.expertsList = document.querySelectorAll('.experts-list li');
			this.setExpertsSize();
			this.attachTitle();
			this.animationTimes = {
				title_animation_delay: 200,
				particleDisplayLengthSecs: 8
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

		},

		initAnimations: function () {

			TweenLite.to(this.container, 0.3, { opacity: 1 });
			this.expertListAnimationHandler(this.expertsList);
			this.startTicker();

		},

		attachListeners: function () {

			window.addEventListener('resize', this.rendererSizeHandler.bind(this));

			this.container.addEventListener('mousemove', function (e) {
				this.mouseMoveEvent.clientX = e.clientX;
				this.mouseMoveEvent.clientY = e.clientY;
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

		}

	};

	window.expertsTopbox = new ExpertsTopbox();

}());