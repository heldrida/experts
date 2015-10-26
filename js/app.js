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

    	// todo: get data from API or json file in this case
    	// then set `init` as the callback
    	this.init();

    };

	ExpertsTopbox.prototype = {

		init: function () {

			//Debugger.log('init!');

			this.setProperties();

			this.placeExpertsOnStage();

			this.attachListeners();

			this.startTicker.call(this);

		},

		setProperties: function () {

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

			var graphics = new PIXI.Graphics();
			graphics.beginFill(0xFFFFFF);
			graphics.drawRect(0, 0, this.container.width * 0.9,  this.container.height * 0.6);
			graphics.alpha = 0;
			this.expertsContainer.addChild(graphics);

			this.stage.addChild(this.expertsContainer);

			this.defaultLineWidth = 1;

			this.attachTitle();

		},

		startTicker: function () {

			var context = this;

			function animate() {

				requestAnimationFrame(animate);
				context.renderer.render(context.stage);

			}

			animate.call(this);

		},

		generateExpert: function (index) {

			/*
			var total = 10;
			var size = (this.container.width * 0.9) / total;
			var graphics = new PIXI.Graphics();

			graphics.beginFill(index <= 5 ? 0x00CCFF : 0xFFCC00);

			graphics.drawRect(0, 0, size, size);

			return graphics;
			*/

			var size = (this.container.width * 0.9) / 10;
			var container = new PIXI.Container();
			container.width = size;
			container.height = size;

			return container;

		},

		placeExpertsOnStage: function () {

			var total, size, max, offsetY, offsetX, rnd, posX, posY, center;

			total  = 10;
			max = 5;

			if (total > max) {

				size = (this.container.width * 0.9) / (max * 2);
				offsetY = (((this.container.height * 0.6) / 2) / (max * 2));
				offsetX = (size * max) / (max - 1);
				rnd = offsetY * Math.floor(Math.random() * max) + 1;
				posX = 0;
				posY = rnd;
				center = ((this.container.height * 0.6) / 2);

				for (var i = 1; i <= total; i++) {

					var expert = this.generateExpert(i);

					this.insertCircle(expert, size);

					// each row has a max of X elements,
					// reset the posX and move to second row
					if (i === max + 1) {

						posX = 0;
						posY = center;

					}

					expert.position.x = posX;
					expert.position.y = posY;

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
				offsetY = (((this.container.height * 0.6) - size) / (max - 1)); // calculated by subtracting the last element, remaining height and the number of elements to even
 				offsetX = (((this.container.width * 0.9) - size) / (total - 1)) - size;//225;
				rnd = offsetY * Math.floor(Math.random() * total) + 1;
				posX = 0;
				posY = 0;

				/*
				Debugger.log('this.container.height: ' + this.container.height);
				Debugger.log('this.container.height * 0.6: ' + this.container.height * 0.6);
				Debugger.log('this.container.width * 0.9: ' + this.container.width * 0.9);
				Debugger.log('total: ' + total);
				Debugger.log('size: ' + size);
				Debugger.log('max: ' + max);
				Debugger.log('offsetY: ' + offsetY);
				*/

				for (var i = 1; i <= total; i++) {

					var expert = this.generateExpert(i);

					expert.position.x = posX;
					expert.position.y = posY;

					this.expertsContainer.addChild(expert);

					rnd = offsetY * Math.floor(Math.random() * 5) + 1;

					posX += (size + offsetX);
					//posY += offsetY;
					posY = rnd;

				}

			}

		},

		insertCircle: function (el, size) {

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

			img.src = "img/darth-vader.jpg";

			var sprite = new PIXI.Sprite(PIXI.Texture.fromCanvas(canvas));

			el.addChild(sprite);


			this.insertCircleLine(el, size);
			this.insertInfoCircle(el, size);
			this.insertLine(el, size);

		},

		insertCircleLine: function (el, size) {

			var graphics = new PIXI.Graphics();
			graphics.lineStyle (this.defaultLineWidth, 0x3b81ff);
			graphics.drawCircle(size, size, size / 2);
			graphics.x = -size/2;
			graphics.y = -size/2;
			el.addChild(graphics);

		},

		insertInfoCircle: function (el, size) {

			var sprite = PIXI.Sprite.fromImage("img/icon-info.png?201510221531");

			sprite.width = size * 0.25;
			sprite.height = size * 0.25;

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

		insertLine: function (el, size) {

			// draw line
			var gfxLn = new PIXI.Graphics();
			gfxLn.lineStyle(this.defaultLineWidth, 0x3b81ff);
			gfxLn.moveTo(0,0);
			gfxLn.lineTo(size * 0.8, 0);
			gfxLn.x = size / 2;
			gfxLn.y = size / 2;
			gfxLn.rotation = 0.5; // 0 ~ 4.725
			el.addChild(gfxLn);

			// draw circle
			this.attachLineIcon(gfxLn, size);

		},

		attachLineIcon: function (gfxLn, size) {

			// draw circle
			var gfxCircle = new PIXI.Graphics();
			gfxCircle.beginFill(0x3b81ff);
			gfxCircle.lineStyle (this.defaultLineWidth, 0x3b81ff);
			gfxCircle.drawCircle(size * 0.15, size * 0.15, (size * 0.15) / 2);
			gfxCircle.x = size * 0.6;
			gfxCircle.y = -16;

			// attach as line child
			gfxLn.addChild(gfxCircle);

			var gfxIconSprite = PIXI.Sprite.fromImage("img/icon-ball.png?201510221531");

			gfxIconSprite.width = size * 0.10;
			gfxIconSprite.height = size * 0.10;
			gfxIconSprite.position.x = (size * 0.12) * 1.25;
			gfxIconSprite.position.y = (size * 0.12) * 1.25;
			gfxIconSprite.anchor.x = 0.5;
			gfxIconSprite.anchor.y = 0.5;

			gfxCircle.addChild(gfxIconSprite);

		},

		attachTitle: function () {

			// create a new div element
			this.titleDiv = document.createElement("div");
			var h1 = document.createElement("h1");
			var p = document.createElement("p");

			h1.innerHTML = "THE EXPERTS";
			p.innerHTML = "OUR NETWORK OF EXPERTS ARE SOME OF THE MOST SORT AFTER PEOPLE IN THE INDUSTRY.<br>GIVING ADVICE OF A MULTITUDE OF SPORTS AND ACTIVITIES";

			this.titleDiv.appendChild(h1);
			this.titleDiv.appendChild(p);

			this.titleDiv.setAttribute('id', 'title-container');

			this.container.el.appendChild(this.titleDiv);

		},

		attachListeners: function () {

			window.addEventListener('resize', this.titleHandler.bind(this));

		},

		titleHandler: function () {

			var rm = 67 / 1440;
			var rh1 = 30 / 1440;
			var rh1_ls = 1.5 / 1440;
			var rp = 10 / 1440;
			var rp_ls = 1.22 / 1440;
			var rp_p = 10 / 1440;
			var rp_ln = 16 / 1440;

			this.titleDiv.style.top = (window.innerWidth * rm) + 'px';
			this.titleDiv.querySelector('h1').style.fontSize = (window.innerWidth * rh1) + 'px';
			this.titleDiv.querySelector('h1').style.letterSpacing = (window.innerWidth * rh1_ls) + 'px';
			this.titleDiv.querySelector('p').style.fontSize = (window.innerWidth * rp) + 'px';
			this.titleDiv.querySelector('p').style.letterSpacing = (window.innerWidth * rp_ls) + 'px';
			this.titleDiv.querySelector('p').style.padding = (window.innerWidth * rp_p) + 'px 0';
			this.titleDiv.querySelector('p').style.lineHeight = (window.innerWidth * rp_ln) + 'px';

		}

	};

	window.expertsTopbox = new ExpertsTopbox();

}());