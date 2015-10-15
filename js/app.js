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

			console.log('init!');

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
			this.renderer = new PIXI.WebGLRenderer(this.container.width, this.container.height);

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

			console.log(this.expertsContainer);

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

			console.log('size', size);

			graphics.beginFill(index <= 5 ? 0xFFFFFF : 0xFFCC00);

			graphics.drawRect(0, 0, size, size);

			return graphics;

		},

		placeExpertsOnStage: function () {

			var total = 10;
			var size = (this.container.width * 0.9) / total;
			var max = 5;
			var offsetY = (((this.container.height * 0.6) / 2) / total);
			var offsetX = (size * max) / (max - 1);
			var rnd = offsetY * Math.floor(Math.random() * 6) + 1;
			var posX = 0;
			var posY = rnd;

			console.log('start, offsetY: ', offsetY);

			for (var i = 1; i <= total; i++) {

			console.log('offsetY: ', offsetY);

				var expert = this.generateExpert(i);

				console.log('i', i);
				console.log('max', max);
				console.log('posY', posY);

				// each row has a max of X elements,
				// reset the posX and move to second row
				if (i === max + 1) {

					posX = 0;
					posY = ((this.container.height * 0.6) / 2);

				}

				expert.position.x = posX;
				expert.position.y = posY;

				this.expertsContainer.addChild(expert);

				if (i <= max) {

					rnd = offsetY * Math.floor(Math.random() * 6) + 1;

				} else {

					//rnd = offsetY * Math.floor(Math.random() * 6) + 1;
					rnd = posY + offsetY;
				}

				console.log('rnd', rnd);

				posX += (size + offsetX);
				posY = rnd;

			}

		}

	};

	window.expertsTopbox = new ExpertsTopbox();

}());