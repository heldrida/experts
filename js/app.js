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

// extend the Graphics lib to allow `line update`
PIXI.Graphics.prototype.updateLineStyle = function(lineWidth, color, alpha, fillColor) {

	// console.log('lineUpdate');
	var len = this.graphicsData.length;

	for (var i = 0; i < len; i++) {
		var data = this.graphicsData[i];
		if (data.lineWidth && lineWidth) {
			data.lineWidth = lineWidth;
		}
		if (data.lineColor && color) {
			data.lineColor = data._lineTint = color;
		}
		if (data.alpha && alpha) {
			data.alpha = alpha;
		}
		if (data.fillColor && fillColor) {
			data.fillColor = data._fillTint = fillColor;
		}
		this.dirty = true;
		this.clearDirty = true;
	}

};

(function () {

	/**
	 *  Experts Top Box
	 *
	 *  blue: #3b81ff
	 */
    var ExpertsTopbox = function () {

		this.getExpertsData(this.init.bind(this));

    };

	ExpertsTopbox.prototype = {

		init: function (data) {

			//Debugger.log('init!');

			this.setProperties(data);

			this.placeExpertsOnStage.call(this);

			this.attachListeners();

			this.expertsAnimShow.call(this);

			this.startTicker.call(this);
		},

		setProperties: function (data) {

			this.expertsData = data;

			this.expertsMoveLock = false;

			// calculate project container ratio
			var containerRatio = 1440 / 760;

			// container related properties
			this.container = {
				el: document.querySelector('.sh-experts-topbox'),
				width: window.innerWidth,
				height: window.innerWidth / containerRatio
			};

			// create renderer
			this.renderer = new PIXI.CanvasRenderer(this.container.width, this.container.height, {
				antialias: true,
				resolution: 2,
				roundPixels: true
			});

			// inserts canva element into main container
			this.container.el.appendChild(this.renderer.view);

			// create stage
			this.stage = new PIXI.Container();

			this.expertsContainer = new PIXI.Container();

			// set experts container width
			this.expertsContainer.width = this.container.width * 0.9;
			this.expertsContainer.height = this.container.height * 0.6;
			this.expertsContainer.x = (this.container.width * 0.1) / 2;
			this.expertsContainer.y = (this.container.height * 0.25);

			// colours
			this.colours = {
				hex: {
					grey: '0xAAAAAA',
					blue: '0x3b81ff',
					white: '0xffffff'
				}
			};

			var graphics = new PIXI.Graphics();
			graphics.beginFill(0xFFFFFF);
			graphics.drawRect(0, 0, this.container.width * 0.9,  this.container.height * 0.6);
			graphics.alpha = 0;
			this.expertsContainer.addChild(graphics);

			this.particles = [];
			this.generateParticles();

			this.stage.addChild(this.expertsContainer);

			this.defaultLineWidth = 1;

			this.attachTitle();

			this.attachArrow();

			this.particlesScale = 0;

			this.mouseMoveEvent = {
				clientX: null,
				clientY: null
			};

			this.expertScaleSmallRatio = 0.1;

			this.defaultExpertSize = null;

			this.animationTimes = {
				expert_mouseover: 0.3,
				expert_mouseout: 0.3,
				expert_mousemovehandler_non_active: 0.8,
				expert_init_scale: 0.8,
				title_animation_delay: 200
			};

			this.circle_lines = [];

			this.icon_lines = [];

			this.icon_line_circle_tip = [];

			this.icon_line_circle_tip_colour = [];

		},

		startTicker: function () {

			var context = this;

			function animate() {

				requestAnimationFrame(animate);
				context.renderer.render(context.stage);
				!context.particlesScaleLock ? context.particlesAnimateHandler() : null;
				context.mouseMoveHandler.call(context);

			}

			animate.call(this);

		},

		generateExpert: function (index) {

			console.log('index', index);

			var total = 10;
			var size = (this.container.width * 0.9) / total;
			var graphics = new PIXI.Graphics();

			graphics.beginFill(0x000000);

			graphics.drawCircle(size / 2, size / 2, size / 1.9);

			graphics.pivot.x = graphics.pivot.y = 0.5;

			graphics.interactive = true;

			graphics.scale = {
				x: 0,
				y: 0
			};

			return graphics;

		},

		placeExpertsOnStage: function () {

			var total, size, max, offsetY, offsetX, rnd, posX, posY, center;

			this.experts = [];

			total = this.expertsData.length;
			max = 5;

			if (total > max) {

				size = (this.container.width * 0.9) / (max * 2);
				this.defaultExpertSize = size;
				offsetY = (((this.container.height * 0.6) / 2) / (max * 2));
				offsetX = (size * max) / (max - 1);
				rnd = offsetY * Math.floor(Math.random() * max) + 1;
				posX = 0;
				posY = rnd;
				center = ((this.container.height * 0.6) / 2);

				for (var i = 1; i <= total; i++) {

					var expert = this.generateExpert(i);

					this.insertCircle(expert, size, i);

					// each row has a max of X elements,
					// reset the posX and move to second row
					if (i === max + 1) {

						posX = 0;
						posY = center;

					}

					expert.position.x = posX;
					expert.position.y = posY;

					this.experts.push({
						centered: false,
						active: false,
						el: expert,
						hasText: {
							data: false,
							pos: { x: null, y: null }
						},
						quote: {
							line: null
						},
						circle_line: null,
						root: {
							x: posX,
							y: posY
						}
					});

					this.expertsContainer.addChild(expert);

					if (i <= max) {

						rnd = offsetY * Math.floor(Math.random() * 5) + 1;

					} else {

						rnd = center + (offsetY * Math.floor(Math.random() * 5) + 1);

					}

					posX += (size + offsetX);
					posY = rnd;

				}

			} else {

				size = (this.container.width * 0.9) / 10;
				this.defaultExpertSize = size;
				offsetY = (((this.container.height * 0.6) - size) / (max - 1)); // calculated by subtracting the last element, remaining height and the number of elements to even
 				offsetX = (((this.container.width * 0.9) - size) / (total - 1)) - size;//225;
				rnd = offsetY * Math.floor(Math.random() * total) + 1;
				posX = 0;
				posY = 0;

				for (var i = 1; i <= total; i++) {

					var expert = this.generateExpert(i);
					this.insertCircle(expert, size, i);
					expert.position.x = posX;
					expert.position.y = posY;

					this.experts.push({
						centered: false,
						active: false,
						el: expert,
						hasText: {
							data: false,
							pos: { x: null, y: null }
						},
						quote: {
							line: null
						},
						circle_line: null,
						root: {
							x: posX,
							y: posY
						}
					});

					this.expertsContainer.addChild(expert);

					rnd = offsetY * Math.floor(Math.random() * 5) + 1;

					posX += (size + offsetX);
					//posY += offsetY;
					posY = rnd;

				}

			}

		},

		insertCircle: function (el, size, index) {

			//Debugger.log('inserCircle call()');

			var total = 10;
			var size = (this.container.width * 0.9) / total;

			//Debugger.log('size: ' + size);

			var center = {
				x: size / 2,
				y: size / 2
			};

			var canvas = document.createElement("canvas");

			var ctx = canvas.getContext('2d');

			ctx.arc(size / 2, size / 2, size / 2, 0 * Math.PI, 2 * Math.PI);

			ctx.clip();

			var img = new Image();

			img.addEventListener('load', function(e) {

			    ctx.drawImage(this, 0, 0, size, size);

			}, true);

			img.src = this.expertsData[index - 1].img;

			var sprite = new PIXI.Sprite(PIXI.Texture.fromCanvas(canvas));

			//this.insertLine(el, size);
			el.addChild(sprite);


			this.insertCircleLine(el, size, index);
			this.insertInfoCircle(el, size, index);


		},

		insertCircleLine: function (el, size, index) {

			var graphics = new PIXI.Graphics();
			graphics.lineStyle(this.defaultLineWidth, this.colours.hex.white);
			graphics.drawCircle(size, size, size / 2);
			graphics.x = -size/2;
			graphics.y = -size/2;

			el.addChild(graphics);

			this.circle_lines[index] = graphics;

		},

		insertInfoCircle: function (el, size, index) {

			var sprite = PIXI.Sprite.fromImage('img/icon-info.png');

			sprite.width = size * 0.23;
			sprite.height = size * 0.23;

			/*
			 * top left
			 *
			sprite.position.x = size * 0.15;
			sprite.position.y = size * 0.15;
			 */

			/*
			 * top right
			 *
			sprite.position.x = size * 0.85;
			sprite.position.y = size * 0.15;
			 */

			/*
			 * center left
			 *
			sprite.position.x = 0;
			sprite.position.y = size * 0.5;
			 */

			/*
			 * center right
			 *
			sprite.position.x = size;
			sprite.position.y = size * 0.5;
			 */

			/*
			 * bottom left
			 *
			sprite.position.x = size * 0.15;
			sprite.position.y = size * 0.85;
			 */

			/*
			 * bottom right
			 *
			sprite.position.x = size * 0.85;
			sprite.position.y = size * 0.85;
			 */

			sprite.position.x = size * 0.15;
			sprite.position.y = size * 0.85;

			sprite.anchor.x = 0.5;
			sprite.anchor.y = 0.5;

			el.addChild(sprite);

		},

		insertLine: function (el, size, index) {

			// draw line
			var gfxLn = new PIXI.Graphics();
			gfxLn.lineStyle(this.defaultLineWidth, this.colours.hex.white);
			gfxLn.moveTo(0, 0);
			//gfxLn.lineTo(size * 0.8, 0);
			gfxLn.x = size / 2;
			gfxLn.y = size / 2;
			//gfxLn.rotation = 0.5; // 0 ~ 4.725
			el.addChildAt(gfxLn, 0);

			// draw circle
			var gfxCircle = this.attachLineIcon(gfxLn, size, index);
			el.addChildAt(gfxCircle, 1);

			// animate
			TweenLite.to(gfxCircle, 0.8, { x: size * 0.9, y: size * 0.9, ease: Power1.easeOut, onUpdate:drawLineHelper });

			function drawLineHelper() {
				gfxLn.lineTo(gfxCircle.x - (size * 0.3), gfxCircle.y - (size * 0.3));
			}

			this.icon_lines[index] = gfxLn;

			this.icon_line_circle_tip[index] = gfxCircle;

		},

		attachLineIcon: function (gfxLn, size, index) {

			// draw circle
			var gfxCircle = new PIXI.Graphics();
			gfxCircle.beginFill(this.colours.hex.white);
			gfxCircle.lineStyle (this.defaultLineWidth, this.colours.hex.white);
			gfxCircle.drawCircle(size * 0.23, size * 0.23, (size * 0.23) / 2);

			gfxCircle.x = size / 2;
			gfxCircle.y = size / 2;

			gfxCircle.x = gfxCircle.x * 0.75;
			gfxCircle.y = gfxCircle.y * 0.75;

			// attach as line child
			//gfxLn.addChild(gfxCircle);

			var gfxIconSpriteDark = PIXI.Sprite.fromImage(this.expertsData[index].icon.dark);

			gfxIconSpriteDark.width = size * 0.15;
			gfxIconSpriteDark.height = size * 0.15;
			gfxIconSpriteDark.position.x = gfxIconSpriteDark.width * 1.04;
			gfxIconSpriteDark.position.y = gfxIconSpriteDark.height * 1.04;
			gfxIconSpriteDark.alpha = 1;

			gfxCircle.addChild(gfxIconSpriteDark);

			var gfxIconSpriteLight = PIXI.Sprite.fromImage(this.expertsData[index].icon.light);

			gfxIconSpriteLight.width = size * 0.15;
			gfxIconSpriteLight.height = size * 0.15;
			gfxIconSpriteLight.position.x = gfxIconSpriteLight.width * 1.04;
			gfxIconSpriteLight.position.y = gfxIconSpriteLight.height * 1.04;

			gfxIconSpriteLight.alpha = 0;

			gfxCircle.addChild(gfxIconSpriteLight);

			this.icon_line_circle_tip_colour[index] = {
				dark: gfxIconSpriteDark,
				light: gfxIconSpriteLight
			};

			return gfxCircle;

		},

		attachArrow: function () {

			this.arrow = document.createElement("div");
			this.arrow.style.position = 'relative';
			this.arrow.setAttribute('class', 'experts-down-arrow');

			this.container.el.appendChild(this.arrow);

		},

		attachTitle: function () {

			// create a new div element
			this.titleDiv = document.createElement("div");
			var h1 = document.createElement("h1");
			var p = document.createElement("p");
			var elements = [];
			elements.push(h1);
			elements.push(p);

			h1.innerHTML = "THE EXPERTS";
			p.innerHTML = "OUR NETWORK OF EXPERTS ARE SOME OF THE MOST SORT AFTER PEOPLE IN THE INDUSTRY.<br>GIVING ADVICE OF A MULTITUDE OF SPORTS AND ACTIVITIES";

			this.titleDiv.appendChild(h1);
			this.titleDiv.appendChild(p);

			this.titleDiv.setAttribute('id', 'title-container');

			this.container.el.appendChild(this.titleDiv);

			this.titleHandler();

			setTimeout(function () {

				this.titleAnimationsHandler.call(this, elements);

			}.bind(this), 400);

		},

		attachListeners: function () {

			var lock_mouseout = false;
			var context = this;

			window.addEventListener('resize', this.titleHandler.bind(this));

			this.container.el.addEventListener('mousemove', function (e) {

				this.mouseMoveEvent.clientX = e.clientX;
				this.mouseMoveEvent.clientY = e.clientY;

			}.bind(this));

			// attach click event to `experts`
			for (var i = 0; i < this.experts.length; i++) {

				(function (expert, i) {

					expert[i].el.click = function (e) {

						lock_mouseout = true;
						context.showExpertInfo(i);

						context.circle_lines[i + 1].updateLineStyle(false, context.colours.hex.blue, false);
						context.icon_lines[i].updateLineStyle(false, context.colours.hex.blue, false);
						context.icon_line_circle_tip[i].updateLineStyle(false, context.colours.hex.blue, false, context.colours.hex.blue);
						context.icon_line_circle_tip_colour[i]['dark'].alpha = 0;
						context.icon_line_circle_tip_colour[i]['light'].alpha = 1;

						setTimeout(function () {
							lock_mouseout = false;
						}, 1000);

					};

					expert[i].el.mouseover = function (e) {

						context.container.el.classList.add('mouseover');

						(function (i) {

							//TweenLite.to(expert[i].el, context.animationTimes.expert_mouseover, { alpha: 0.85, ease: Power1.easeOut });
							//context.circle_lines[i].lineStyle(context.defaultLineWidth, context.colours.hex.blue);
							context.circle_lines[i + 1].updateLineStyle(false, context.colours.hex.blue, false);
							context.icon_lines[i].updateLineStyle(false, context.colours.hex.blue, false);
							context.icon_line_circle_tip[i].updateLineStyle(false, context.colours.hex.blue, false, context.colours.hex.blue);
							context.icon_line_circle_tip_colour[i]['dark'].alpha = 0;
							context.icon_line_circle_tip_colour[i]['light'].alpha = 1;

						}(i));

					}.bind(this);

					expert[i].el.mouseout = function (e) {

						context.container.el.classList.remove('mouseover');

						(function (i) {

							if (expert[i].el.scale.x === 1 && !lock_mouseout && !expert[i].active) {

								//TweenLite.to(expert[i].el, context.animationTimes.expert_mouseout, { alpha: 1, ease: Power1.easeOut });
								context.circle_lines[i + 1].updateLineStyle(false, context.colours.hex.white, false);
								context.icon_lines[i].updateLineStyle(false, context.colours.hex.white, false);
								context.icon_line_circle_tip[i].updateLineStyle(false, context.colours.hex.white, false, context.colours.hex.white);
								context.icon_line_circle_tip_colour[i]['dark'].alpha = 1;
								context.icon_line_circle_tip_colour[i]['light'].alpha = 0;

							}

						}(i));

					}.bind(this);

				}(this.experts, i));

			}

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

			var rm = 67 / 1440;
			var rh1 = 30 / 1440;
			var rh1_ls = 1.5 / 1440;
			var rp = 10 / 1440;
			var rp_ls = 1.22 / 1440;
			var rp_p = 10 / 1440;
			var rp_ln = 16 / 1440;

			this.titleDiv.style.top = (window.innerWidth * rm) + 'px';
			h1.style.fontSize = (window.innerWidth * rh1) + 'px';
			h1.style.letterSpacing = (window.innerWidth * rh1_ls) + 'px';
			h1.style.position = "relative";
			p.style.fontSize = (window.innerWidth * rp) + 'px';
			p.style.letterSpacing = (window.innerWidth * rp_ls) + 'px';
			p.style.padding = (window.innerWidth * rp_p) + 'px 0';
			p.style.lineHeight = (window.innerWidth * rp_ln) + 'px';
			p.style.position = "relative";

		},

		particle: function (col) {

			var size = (this.stage.height * 0.01) * Math.random() % (this.stage.height * 0.01);
			var gfxCircle = new PIXI.Graphics();
			gfxCircle.beginFill(this.colours.hex.grey);
			gfxCircle.lineStyle (this.defaultLineWidth, this.colours.hex.grey);
			gfxCircle.drawCircle(size, size, size);
			gfxCircle.x = ((this.container.el.offsetWidth / 2) * col) * Math.random();
			gfxCircle.y = ((this.container.el.offsetHeight / 2) * Math.random()) + this.container.el.offsetHeight * 0.3;
			gfxCircle.alpha = Math.max(0.2, Math.random());

			gfxCircle.pivot.x = 0.5;
			gfxCircle.pivot.y = 0.5;

			gfxCircle.scale.x = gfxCircle.scale.y = 0;

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

		generateParticles: function () {

			for (var col = 1; col <= 3; col++) {

				for (var i = 1; i <= 75; i++) {

					this.particle.call(this, col);

				}

			}

		},

		particlesAnimateHandler: function () {

			for (var i = 0; i < this.particles.length; i++) {

				this.particlesScale += 0.0001;
				this.particles[i].circle.scale.x = this.particlesScale;
				this.particles[i].circle.scale.y = this.particlesScale;

				this.particlesScaleLock = this.particlesScale > 1 ? true : false;

			}

		},

		particleMouseMoveHandler: function () {

			var anim = function (i) {

				var posX, posY, friction;

				friction = this.particles[i].root.size / 20;

				posX = this.particles[i].circle.x = this.particles[i].root.x + (this.mouseMoveEvent.clientX * friction);
				posY = this.particles[i].circle.y = this.particles[i].root.y + (this.mouseMoveEvent.clientY * friction);

				this.particles[i].circle.x = posX;
				this.particles[i].circle.y = posY;

			};

			for (var i = 0; i < this.particles.length; i++) {

				anim.call(this, i);

			}

		},

		expertMouseMoveHandler: function () {

			if (this.expertsMoveLock) {
				return;
			}

			var anim = function (i, offsetX, offsetY) {

				(function (expert) {

					if (!expert.active) {
						expert.centered = false;
						TweenLite.to(expert.el, this.animationTimes.expert_mousemovehandler_non_active, { x: offsetX, y: offsetY });
					} else {
						if (!expert.centered) {
							expert.centered = true;
							//this.expertsMoveLock = true;
							//this.expertMoveToCenter(expert.el);
							if (!expert.hasText.data) {
								this.expertMoveToCenter(expert.el, function () {
									this.expertShowTextQuote.call(this, i);
									this.repositionActiveExpert.call(this, i);
								}.bind(this));
							}
						}
					}

				}.call(this, this.experts[i]));

			};

			var delay = 0;

			for (var i = 0; i < this.experts.length; i++) {

				var expert = this.experts[i];
				var quantity = expert.el.scale.x === this.expertScaleSmallRatio && expert.el.scale.y === this.expertScaleSmallRatio ? 0.05 : 0.01;

				var offsetX = expert.root.x + (this.mouseMoveEvent.clientX * quantity);
				var offsetY = expert.root.y + (this.mouseMoveEvent.clientY * quantity);

				(function (i, delay, offsetX, offsetY) {

					setTimeout(function() {
						anim.call(this, i, offsetX, offsetY);
					}.bind(this), delay);

				}.call(this, i, delay, offsetX, offsetY));

				delay += 60;

			}

		},

		mouseMoveHandler: function () {

			this.particleMouseMoveHandler.call(this);
			this.expertMouseMoveHandler.call(this);

		},

		expertsAnimShow: function () {

			var context = this;
			var delay = 0;

			for (var i = 0; i < this.experts.length; i++) {

				(function (expert, delay, index) {

					setTimeout(function () {

						TweenLite.fromTo(expert.scale, context.animationTimes.expert_init_scale, { x: 0, y: 0 }, { x: 1, y: 1, ease: Power1.easeOut, onComplete: context.insertLine.bind(context, expert, context.defaultExpertSize, index) });

					}.bind(this), delay);

				}(this.experts[i].el, delay, i));

				delay += 80;

			}

		},

		showExpertInfo: function (index) {

			this.expertsMoveLock = true;

			// exception handler
			if (!this.expertActiveExceptionHandler.call(this, index)) {

				this.closeNonIndexed.call(this, index);

			}

		},

		closeNonIndexed: function (index) {

			var context = this;
			var expert = this.experts[index];

			var delay = 0;

			var unlock = function () {
				this.expertsMoveLock = false;
			};

			for (var i = 0; i < this.experts.length; i++) {

				// reset
				this.experts[i].active = this.experts[i].centered = false;

				if (i !== index) {

					console.log('CASE A');

					this.shrinkLine(i);
					this.experts[i].active = false;

					(function (expert, delay) {

						setTimeout(function () {

							TweenLite.to(expert.scale, 1, { x: this.expertScaleSmallRatio, y: this.expertScaleSmallRatio, ease: Power1.easeOut });
							TweenLite.to(expert, 1, { alpha: 0.65, ease: Power1.easeOut, onComplete: unlock.bind(this) });

						}.bind(this), delay);

					}.call(this, this.experts[i].el, delay));

					delay += 30;

				} else {

					this.experts[index].active = true;

					if (this.expertQuoteDiv) {
						this.closeQuoteFirst.call(this, index);
					}

					(function (expert, i) {

						TweenLite.to(expert.scale, 1, { x: 1, y: 1 , ease: Power1.easeOut, onComplete: unlock.bind(this) });
						TweenLite.to(expert, 1, { alpha: 1 });
						/*
						context.expertMoveToCenter.call(context, expert, function () {
							console.log('callback!!');
							context.repositionActiveExpert.call(context, i);
						}.bind(context));
						*/

					}(this.experts[i].el, i));


					console.log('CASE B');

				}

			}

		},

		expertActiveExceptionHandler: function (index) {

			var context = this;

			var unlock = function () {
				this.expertsMoveLock = false;
			};

			var resetAll = function () {

				for (var i = 0; i < this.experts.length; i++) {

					(function (experts) {

						TweenLite.to(experts.el.scale, 1, { x: 1, y: 1, ease: Power1.easeOut, onComplete: unlock.bind(this) });
						TweenLite.to(experts.el, 1, { alpha: 1, ease: Power1.easeOut });
						TweenLite.to(experts.el, 1, { x: experts.root.x, y: experts.root.y, ease: Power1.easeOut });

						experts.active = false;


						// change colours
						context.circle_lines[i + 1].updateLineStyle(false, context.colours.hex.white, false);
						context.icon_lines[i].updateLineStyle(false, context.colours.hex.white, false);
						context.icon_line_circle_tip[i].updateLineStyle(false, context.colours.hex.white, false, context.colours.hex.white);
						context.icon_line_circle_tip_colour[i]['dark'].alpha = 1;
						context.icon_line_circle_tip_colour[i]['light'].alpha = 0;

					}.call(this, this.experts[i]));

				}

			};

			// check if current active element matches the clicked index
			for (var i = 0; i < this.experts.length; i++) {

				if (this.experts[i].active && i === index) {

					this.closeQuoteFirst(i, resetAll.bind(this));

					return true;
				}

			}

		},

		expertsResetAll: function () {

			for (var i = 0; i < this.experts.length; i++) {

				var experts = this.experts[i];

				TweenLite.to(experts.el.scale, 1, { x: 1, y: 1, ease: Power1.easeOut });
				TweenLite.to(experts.el, 1, { alpha: 1, ease: Power1.easeOut });
				TweenLite.to(experts.el, 1, { x: experts.root.x, y: experts.root.y, ease: Power1.easeOut });

			}

		},

		titleAnimationsHandler: function (els) {

			for (var i = 0, delay = 0; i < els.length; i++) {

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

		expertMoveToCenter: function (expert, callback) {

			console.log('expertMoveToCenter fn()');

			var x = this.expertsContainer.width / 2 - (this.defaultExpertSize / 2);
			var y = this.expertsContainer.height / 2 - (this.defaultExpertSize / 2);

			//TweenLite.to(expert, 1, { x: x, y: y, ease: Power1.easeOut });

			TweenLite.to(expert, 1, { x: x, y: y, ease: Power1.easeOut, onComplete: function () {
					this.expertsMoveLock = false;

					if (typeof callback === 'function') {
						callback.call(this);
					}

				}.bind(this)
			});

			this.orderExpertsByActiveElement(expert);

		},

		orderExpertsByActiveElement: function () {

			var activeIndex = 0;

			for (var i = 0; i < this.experts.length - 1; i++) {
				if (this.experts[i].active) {
					activeIndex = this.expertsContainer.getChildIndex(this.experts[i].el);
				}
			}

			for (var i = 0; i < this.experts.length; i++) {
				if (!this.experts[i].active) {
					this.expertsContainer.setChildIndex(this.experts[i].el, i);
				}

			}

			if (this.experts[activeIndex]) {
				this.expertsContainer.setChildIndex(this.experts[activeIndex].el, this.experts.length);
				TweenLite.to(this.experts[activeIndex].el, 0.3, { alpha: 1, ease: Power1.easeOut });
			}

		},

		expertShowTextQuote: function (index) {

			// create a new div element
			this.expertQuoteDiv = document.createElement('div');
			this.expertQuoteDiv.setAttribute('id', 'quoteWrp');
			var p = document.createElement('p');
			p.innerHTML = this.expertsData[index].quote;
			this.expertQuoteDiv.appendChild(p);

			var span = document.createElement('span');
			span.innerHTML = "Borum Scuba | Foriamblu";

			this.expertQuoteDiv.appendChild(span);

			this.expertQuoteDiv.style.opacity = 0;

			this.container.el.appendChild(this.expertQuoteDiv);

			// center element
			var positionQuote = function () {

				//this.expertQuoteDiv.style.width = "auto"; //this.getExpertSize() * 4 + "px";
				//this.expertQuoteDiv.style.height = "auto";

				this.expertQuoteDiv.style.fontSize = this.getExpertSize() * 0.125 + "px";
				this.expertQuoteDiv.style.lineHeight = this.getExpertSize() * 0.15 + "px";

				var size = (window.innerWidth * 0.9) / 10;
				x = ((window.innerWidth / 2) - size) - this.expertQuoteDiv.offsetWidth;
				y = (window.innerWidth * 0.45) / 2;

				y = y - (this.expertQuoteDiv.offsetHeight * 0.5);

				this.expertQuoteDiv.style.left = x + 'px';
				this.expertQuoteDiv.style.top = y + 'px';

			};

			positionQuote.call(this);

			// draw the line and then show the quote
			this.drawLine.call(this, index, x, y, function () {
				TweenLite.to(this.expertQuoteDiv, 0.4, { opacity: 1, ease: Power1.easeOut, onComplete: this.drawLine.bind(this, [index, x, y]) });
			}.bind(this));

			window.addEventListener('resize', positionQuote.bind(this));

		},

		drawLine: function (index, x, y, callback) {

			var size = this.getExpertSize();
			var line = new PIXI.Graphics();

			line.lineStyle(1, 0x3b81ff, 1);

			line.moveTo(size  / 2, size / 2);

			//line.lineTo(-(size * 0.4), -(size * 0.2));

 			line.endFill();

 			// circle tip
			// draw circle
			var gfxCircle = new PIXI.Graphics();
			gfxCircle.beginFill(0x3b81ff);
			gfxCircle.lineStyle(this.defaultLineWidth, 0x3b81ff);
			gfxCircle.drawCircle(size * 0.05, size * 0.05, (size * 0.05) / 2);
			//gfxCircle.x = -((size * 0.4) + size * 0.05);
			//gfxCircle.y = -((size * 0.2) + size * 0.05);
			gfxCircle.x = gfxCircle.y = size / 2;

			// attach as line child
			line.addChild(gfxCircle);

			//this.experts[index].el.addChild(line);
			if (this.experts[index]) {

	 			this.experts[index].el.addChildAt(line, 0);
	 			this.experts[index].quote.line = line;

				TweenLite.to(gfxCircle, 0.4, { x: -((size * 0.4) + size * 0.05), y: -((size * 0.2) + size * 0.05), ease: Power1.easeOut, onUpdate:drawLineHelper, onComplete: callback.bind(this) });

			}

			function drawLineHelper() {
				line.lineTo(gfxCircle.x + (size * 0.05), gfxCircle.y + (size * 0.05));
			}

		},

		getExpertSize: function () {
			return (window.innerWidth * 0.9) / 10;
		},

		closeQuoteFirst: function (index, callback) {

			TweenLite.to(this.expertQuoteDiv, 0.3, { scale: 0, ease: Power1.easeOut, onComplete: function () {

					if (this.expertQuoteDiv.parentNode) {
						this.expertQuoteDiv.parentNode.removeChild(this.expertQuoteDiv);
						this.shrinkLine(index, callback ? callback.bind(this) : false);
					}

					/*
					if (typeof callback === "function") {

						callback.call(this);

					}
					*/

				}.bind(this)
			});

		},

		resetExpertLines: function () {

			for (var i = 0; i < this.experts.length; i++) {

				if (this.experts[i].quote.line) {

					this.shrinkLine(i, false);

				}

			}

		},

		shrinkLine: function (index, callback) {

			var size = this.getExpertSize();

			// mask
			var lineMask = new PIXI.Graphics();
			lineMask.lineStyle(5, 0x000000, 1);

			if (!this.experts[index].quote.line) {
				return false;
			}

			var circle = this.experts[index].quote.line.children[0];

			var line = this.experts[index].quote.line;

			line.moveTo(size  / 2, size / 2);

			lineMask.moveTo(circle.x, circle.y);

			line.addChild(lineMask);

			TweenLite.to(circle, 1, { x: size / 2, y: size / 2, ease: Power1.easeOut, onUpdate: drawLineHelper, onComplete: function () {

					callback ? callback.call(this) : null;

					this.experts[index].el.removeChild(line);

				}.bind(this)
			});

			function drawLineHelper() {
				lineMask.lineTo(circle.x, circle.y);
			}

		},

		getExpertsData: function (callback) {

			var url = 'data/data-experts.json';

			// compatible with IE7+, Firefox, Chrome, Opera, Safari
			var xhr = new XMLHttpRequest();

			xhr.onreadystatechange = function () {

				if (xhr.readyState == 4 && xhr.status == 200) {

					var data = JSON.parse(xhr.responseText);

					if (typeof callback === 'function') {
						callback(data.experts);
					}

				}

			};

			xhr.open("GET", url, true);

			xhr.send();

		},

		repositionActiveExpert: function (index) {

			console.log("this.experts.length", this.experts.length);

			var reset = function () {

				for (var i = 0; i < this.experts.length; i++) {
					this.expertsContainer.removeChild(this.experts[i].el);
					this.expertsContainer.addChildAt(this.experts[i].el, this.experts.length - i);
				}

			};

			// reset all pos first
			reset.call(this);

			this.expertsContainer.removeChild(this.experts[index].el);
			this.expertsContainer.addChildAt(this.experts[index].el, this.experts.length);

		}

	};

	window.expertsTopbox = new ExpertsTopbox();

}());