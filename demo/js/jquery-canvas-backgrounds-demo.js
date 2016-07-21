/**
 *	jQuery Canvas Animated Background: Demo init script
 *	Copyright (c) 2016 Gonzalo Albito Méndez Rey
 *	Licensed under GNU GPL 3.0 (https://www.gnu.org/licenses/gpl-3.0-standalone.html)
 *	@version	0.8.1	(2016-07-20)
 *	@author		Gonzalo Albito Méndez Rey	<gonzalo@albito.es>
 *	@license	GPL-3.0
 */

jQuery(document).ready(function($){
	var initialOption = "cooqui";
	var options = jQuery(".options .option");
	options.click(function(ev){
			var clicked = jQuery(this);
			var option = clicked.attr("data-option");
			showOption(option);
		});
	options.filter("."+initialOption).click();
});

function showOption(option){
	var success = false;
	switch(option)
	{
		case "cooqui":
			success = showCooqui();
			break;
		case "circlus":
			success = showCirclus();
			break;
		case "ballooner":
			success = showBallooner();
			break;
		default:
			break;
	}
	if(success)
	{
		setSelectedOption(option);
	}
	return success;
};

function setSelectedOption(selected){
	if(selected)
	{
		var options = jQuery(".options .option");
		options.removeClass("active");
		options.filter("[data-option='"+selected+"']").addClass("active");
		var codes = jQuery(".codes .code");
		codes.hide();
		codes.filter("[data-option='"+selected+"']").show();
	}
};

function showCooqui(){
	jQuery("body").cooqui({
		fps: 60,
		scale: 1,
		distance: 100,
		background: "#fac979",
		spacing: 25,
		itemSize: 10,
		itemScale: 2.0,
		itemColors: ["#ffffff"],
		unique: true,
	});
	return true;
};
	
function showCirclus(){
	jQuery("body").circlus({
		fps: 30,
		scale: 1,
		background: false,
		items: 15,
		itemMinSpeed: 1000,
		itemMaxSpeed: 2500,
		itemMinSize: 20,
		itemMaxSize: 50,
		itemShapes: ["circle"],
		itemColors: ["#0000ff",
			"#00ff00",
			"#00ffff",
			"#ff0000",
			"#ff00ff",
			"#ffff00"],
		unique: true,
	});
	return true;
};
	
function showBallooner(){
	jQuery("body").ballooner({
		fps: 60,
		scale: 1,
		distance: 100,
		background: "#b3e8ff",
		balloons: 10,
		balloonFactor: 0.4,
		balloonGradient: 3,
		balloonMinSize: 25,
		balloonMaxSize: 50,
		balloonScale: 2.0,
		balloonColors: ["#0000ff",
			"#00ff00",
			"#00ffff",
			"#ff0000",
			"#ff00ff",
			"#ffff00"],
		lightColor: "#ffffff",
		tieWidth: 0.12,
		tieHeight: 0.10,
		tieCurve: 0.13,
		minWind: 10,
		maxWind: 50,
		balloonMinSpeed: 50,
		balloonMaxSpeed: 100,
		unique: true,
	});
	return true;
};