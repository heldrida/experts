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
	 */
    var ExpertsTopbox = function () {

    	// todo: get data from API or json file in this case
    	// then set `init` as the callback
    	this.init();

    };

	ExpertsTopbox.prototype = {

		init: function () {

			Debugger.log('init!');

			this.setProperties();

			this.placeExpertsOnStage();

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
			this.renderer = new PIXI.CanvasRenderer(this.container.width, this.container.height);

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
			graphics.beginFill(0x00CCFF);
			graphics.drawRect(0, 0, this.container.width * 0.9,  this.container.height * 0.6);
			graphics.alpha = 0.2;
			this.expertsContainer.addChild(graphics);

			this.stage.addChild(this.expertsContainer);

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

			var total = 10;
			var size = (this.container.width * 0.9) / total;
			var graphics = new PIXI.Graphics();

			graphics.beginFill(index <= 5 ? 0xFFFFFF : 0xFFCC00);

			graphics.drawRect(0, 0, size, size);

			return graphics;

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

				Debugger.log('this.container.height: ' + this.container.height);
				Debugger.log('this.container.height * 0.6: ' + this.container.height * 0.6);
				Debugger.log('this.container.width * 0.9: ' + this.container.width * 0.9);
				Debugger.log('total: ' + total);
				Debugger.log('size: ' + size);
				Debugger.log('max: ' + max);
				Debugger.log('offsetY: ' + offsetY);

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

			Debugger.log('inserCircle call()');

			var total = 10;
			var size = (this.container.width * 0.9) / total;

			Debugger.log('size: ' + size);

			var center = {
				x: size / 2,
				y: size / 2
			};

			/*
			var graphics = new PIXI.Graphics();
			graphics.lineStyle(1, 0x000000, 1);
			graphics.alpha = 1;
			graphics.drawCircle(center.x, center.y, center.x);

			el.addChild(graphics);
			*/

			var canvas = document.createElement("canvas");

			var ctx = canvas.getContext('2d');

			ctx.arc(size, size, size / 2, 0, Math.PI * 2);

			ctx.clip();

			var img = new Image();

			img.addEventListener('load', function(e) {

			    ctx.drawImage(this, 0, 0, size * 2, size * 2);

			}, true);

			img.src = "img/darth-vader.jpg";

			var sprite = new PIXI.Sprite(PIXI.Texture.fromCanvas(canvas));
			sprite.anchor.x = sprite.anchor.y = 0.5;
			sprite.position.x = center.x * 2.85;
			sprite.position.y = center.y;

			el.addChild(sprite);

		}

	};

	window.expertsTopbox = new ExpertsTopbox();

}());