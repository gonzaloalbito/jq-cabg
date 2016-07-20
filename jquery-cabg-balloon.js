/**
 *	jQuery Canvas Animated Background: Balloon
 *	Copyright (c) 2016 Gonzalo Albito Méndez Rey
 *	Licensed under GNU GPL 3.0 (https://www.gnu.org/licenses/gpl-3.0-standalone.html)
 *	@version	0.8.1	(2016-07-18)
 *	@author		Gonzalo Albito Méndez Rey	<gonzalo@albito.es>
 *	@license	GPL-3.0
 */

(function($){
	$.fn.extend({
		ballooner: function(options){
	    	var defaults = {
					fps: 60,
					scale: 1,
					distance: 100,
					background: false,
					balloons: 10,
					balloonFactor: 0.4,
					balloonGradient: 3,
					balloonMinSize: 25,
					balloonMaxSize: 50,
					balloonScale: 2.0,
					balloonColors: ["#0000ff", "#00ff00", "#00ffff", "#ff0000", "#ff00ff", "#ffff00"],
					lightColor: "#ffffff",
					tieWidth: 0.12,
					tieHeight: 0.10,
					tieCurve: 0.13,
					minWind: 10,
					maxWind: 50,
					balloonMinSpeed: 50,
					balloonMaxSpeed: 100,
					unique: true,
				};
	    	
        	options = $.extend({}, defaults, options);
        	
        	return this.each(function(){
				var element = $(this);
				new Ballooner(options, element);
			});
		}
	});
	
	function Ballooner(opts, elemt)
	{
		var obj = this;
		var element = elemt;
		var options = opts;
		var jCanvas = null;
		var canvas = null;
		var context = null;
		var frameTime = Math.floor(1000/options.fps);
		var pi2 = 2*Math.PI;
		var kappa = (4*(Math.sqrt(2)-1))/3;
		var mouse = {
						x: -1,
						y: -1,
						xMin: -1,
						xMax: -1,
						yMin: -1,
						yMax: -1
					};
		var wind = 0;
		var balloons = [];
		var margin = options.balloonScale*(options.balloonMaxSize*(1+options.balloonFactor));
		
		var random = function(min, max){
				var diff = max-min;
				return Math.floor(Math.random()*diff)+min;
			};
		
		var clear = function(){
				context.clearRect(0, 0, canvas.width, canvas.height);
				if(options.background)
				{
					context.fillStyle = options.background;
					context.fillRect(0, 0, canvas.width, canvas.height);
				}
			};
		
		var drawBalloon = function(x, y, radius, color){
				// Prepare vars
				var handleLength = kappa*radius;
				var diff = (radius*options.balloonFactor);
				var balloonBottomY = y+radius+diff;
				// Begin balloon path
				context.beginPath();
				// Top Left Curve
				var topLeftStartX = x-radius;
				var topLeftStartY = y;
				var topLeftEndX = x;
				var topLeftEndY = y-radius;
				context.moveTo(topLeftStartX, topLeftStartY);
				context.bezierCurveTo(topLeftStartX, topLeftStartY-handleLength,
										topLeftEndX-handleLength, topLeftEndY,
										topLeftEndX, topLeftEndY);
				// Top Right Curve
				var topRightStartX = x;
				var topRightStartY = y-radius;
				var topRightEndX = x+radius;
				var topRightEndY = y;
				context.bezierCurveTo(topRightStartX+handleLength, topRightStartY,
										topRightEndX, topRightEndY-handleLength,
										topRightEndX, topRightEndY);
				// Bottom Right Curve
				var bottomRightStartX = x+radius;
				var bottomRightStartY = y;
				var bottomRightEndX = x;
				var bottomRightEndY = balloonBottomY;
				context.bezierCurveTo(bottomRightStartX, bottomRightStartY+handleLength,
										bottomRightEndX+handleLength, bottomRightEndY,
										bottomRightEndX, bottomRightEndY);
				// Bottom Left Curve
				var bottomLeftStartX = x;
				var bottomLeftStartY = balloonBottomY;
				var bottomLeftEndX = x-radius;
				var bottomLeftEndY = y;
				context.bezierCurveTo(bottomLeftStartX-handleLength, bottomLeftStartY,
										bottomLeftEndX, bottomLeftEndY+handleLength,
										bottomLeftEndX, bottomLeftEndY);
				var gradientOffset = (radius/3);
				var gradient = context.createRadialGradient(x+gradientOffset, y-gradientOffset, options.balloonGradient,
															x, y, radius+diff);

				gradient.addColorStop(0, options.lightColor);
				gradient.addColorStop(0.7, color);
				
				context.fillStyle = gradient;
				context.fill();
				// End balloon path
				
				// Create balloon tie
				var halfTieWidth = (radius*options.tieWidth)/2;
				var tieHeight = (radius*options.tieHeight);
				var tieCurveHeight = (radius*options.tieCurve);
				
				context.beginPath();
				context.moveTo(x-1, balloonBottomY);
				context.lineTo(x-halfTieWidth, balloonBottomY+tieHeight);
				context.quadraticCurveTo(x, balloonBottomY+tieCurveHeight,
										x+halfTieWidth, balloonBottomY+tieHeight);
				context.lineTo(x+1, balloonBottomY);
				context.fill();
			};
		
		var draw = function(){
				clear();
				for(var i=0; i<balloons.length; i++)
				{
					var balloon = balloons[i];
					var radius = balloon.size;
					var x = balloon.x;
					var y = balloon.y;
					if(options.distance>0 && mouse.x>0 && mouse.y>0 && balloon.x>mouse.xMin && balloon.x<mouse.xMax && balloon.y>mouse.yMin && balloon.y<mouse.yMax)
					{
						var distance = Math.floor(Math.sqrt(Math.pow(balloon.x-mouse.x, 2)+Math.pow(balloon.y-mouse.y, 2)));
						if(distance<options.distance)
						{
							var scale = (options.distance-distance)/options.distance;
							scale += 1;
							radius = Math.floor(radius*scale);
						}
					}
					drawBalloon(balloon.x, balloon.y, radius, balloon.color);
				}
			};
		
		var buildBalloon = function(randomY){
				var balloon = {
						x: random(0, canvas.width),
						y: randomY? random(0, canvas.height+margin) : canvas.height+margin,
						speed: Math.floor(random(options.balloonMinSpeed, options.balloonMaxSpeed)/options.fps)+1,
						size: random(options.balloonMinSize, options.balloonMaxSize),
						color: options.balloonColors[random(0, options.balloonColors.length)]
					};
				return balloon;
			};
		
		var populate = function(randomY){
				while(balloons.length<options.balloons)
				{
					var balloon = buildBalloon(randomY);
					balloons.push(balloon);
				}
			};
		
		var update = function(time){
				var limit = -margin;
				var left = -margin;
				var right = canvas.width+margin;
				for(var i=0; i<balloons.length; i++)
				{
					var balloon = balloons[i];
					if(balloon.y>limit && balloon.x>left && balloon.x<right)
					{
						balloon.y -= balloon.speed;
						balloon.x += wind;
					}
					else
					{
						balloons.splice(i, 1);
					}
				}
				populate();
			};
		
		var loop = function(){
				update(frameTime);
				draw();
				setTimeout(loop, frameTime);
			};
		
		var resize = function(){
				canvas.width = Math.floor(jCanvas.width()/options.scale);
				canvas.height = Math.floor(jCanvas.height()/options.scale);
			};
		
		var init = function(){
				if(options.unique)
				{
					element.children(".jq-cabg-canvas").remove();
				}
				jCanvas = $("<canvas class=\"jq-cabg-canvas interactive-background\"></canvas>");
				jCanvas.css({position:"fixed",left:"0px",top:"0px",right:"0px",bottom:"0px",width:"100%",height:"100%",zIndex:"-1"});
				element.addClass("jq-cabg canvas-background");
				element.append(jCanvas);
				canvas = jCanvas[0];
				context = canvas.getContext("2d");
				var win = $(window);
				win.resize(resize);
				var doc = $(document);
				doc.mouseout(function(ev){
						mouse.x = -1;
						mouse.y = -1;
					});
				doc.mousemove(function(ev){
						mouse.x = ev.clientX;
						mouse.y = ev.clientY;
						mouse.xMin = mouse.x-options.distance;
						mouse.xMax = mouse.x+options.distance;
						mouse.yMin = mouse.y-options.distance;
						mouse.yMax = mouse.y+options.distance;
					});
				resize();
				populate(true);
				loop();
			};
		
		init();
	};
})(jQuery);