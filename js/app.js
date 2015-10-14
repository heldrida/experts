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

		},

		startTicker: function () {

			var context = this;

			function animate() {

				requestAnimationFrame(animate);
				context.renderer.render(context.stage);

			}

			animate.call(this);

		},

		generateExpert: function () {

			var total = 10;
			var size = window.innerWidth / total;
			var graphics = new PIXI.Graphics();

			console.log('size', size);

			graphics.beginFill(0xFFFF00);

			graphics.lineStyle(5, 0xFF0000);

			graphics.drawRect(0, 0, size, size);

			return graphics;

		},

		placeExpertsOnStage: function () {

			for (var i = 0; i <= 10; i++) {

				var expert = this.generateExpert();

				expert.position.x = 100;
				expert.position.y = 100;

				this.stage.addChild(expert);

				console.log(i);
			}

		}

	};

	window.expertsTopbox = new ExpertsTopbox();

}());