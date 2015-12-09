<!DOCTYPE html>
<html lang="en">

	<head>
		<meta charset="UTF-8">
		<meta name="viewport" content="width=device-width, initial-scale=1">

		<title>The Experts</title>

		<link rel="stylesheet" href="//cdnjs.cloudflare.com/ajax/libs/meyer-reset/2.0/reset.min.css">
		<link rel="stylesheet" href="css/fonts.css">
		<link rel="stylesheet" href="css/app.css">
	</head>

	<body>

		<!-- start: sh experts topbox module -->
		<div class="sh-experts-topbox">

			<div id="title-container">
				<h1>THE EXPERTS</h1>
				<p>OUR NETWORK OF EXPERTS ARE SOME OF THE MOST SORT AFTER PEOPLE IN THE INDUSTRY. GIVING ADVICE OF A MULTITUDE OF SPORTS AND ACTIVITIES</p>
			</div>

			<!-- the list should be populated server-side, but if you wish let us know -->
			<!-- we can populate is dynamically based on the json/collection/data your system provides -->
			<?php include_once('desktop-module.php'); ?>

			<?php include_once('quote-module.php'); ?>

			<div class="experts-down-arrow"></div>

		</div>
		<!-- end: sh experts topbox module -->

		<script src="//cdnjs.cloudflare.com/ajax/libs/jquery.imagesloaded/3.1.8/imagesloaded.pkgd.min.js"></script>
		<script src="js/vendor/tap.min.js"></script>
		<script src="//cdnjs.cloudflare.com/ajax/libs/gsap/1.18.0/TweenLite.min.js"></script>
		<script src="//cdnjs.cloudflare.com/ajax/libs/gsap/1.18.0/TimelineLite.min.js"></script>
		<script src="//cdnjs.cloudflare.com/ajax/libs/gsap/1.18.0/easing/EasePack.min.js"></script>
		<script src="//cdnjs.cloudflare.com/ajax/libs/gsap/latest/plugins/CSSPlugin.min.js"></script>
		<script src="//cdnjs.cloudflare.com/ajax/libs/pixi.js/3.0.7/pixi.min.js"></script>
		<script src="//cdnjs.cloudflare.com/ajax/libs/lodash.js/3.10.1/lodash.min.js"></script>
		<script src="js/vendor/classList.min.js"></script>
		<script src="js/app.js"></script>

	</body>

</html>