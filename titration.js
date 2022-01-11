/**
 * wcln.ca
 * Titration
 * @author Colin Perepelken (colin@perepelken.ca)
 * June 2017
 */

//// VARIABLES ////

var mute = false;
var FPS = 24;

var STAGE_WIDTH, STAGE_HEIGHT;

var gameStarted = false;

// liquid to be drawn
var buretLiquid, flaskLiquid, indicatorLiquid;
var buretLiquidMeniscusLeft, buretLiquidMeniscusRight;

var buretDispensing = false;
var buretLiquidY = 30;
var flaskCounter = 1; // used to make flask level increase faster as it gets skinnier

var liquidFalling;
var liquidFallingOriginalX = 413;
var liquidFallingOriginalY = 455;
var liquidFallingHeight = 1;

var flaskLiquidOriginalY = 880;
var indicatorDropOriginalX, indicatorDropOriginalY;

var indicatorCounter = 0;

var halfCircle;
var halfCircle2;
var halfCircleSize = 25;
var halfCircleAlpha = 0;


function init() {
 	STAGE_WIDTH = parseInt(document.getElementById("gameCanvas").getAttribute("width"));
	STAGE_HEIGHT = parseInt(document.getElementById("gameCanvas").getAttribute("height"));

	// init state object
	stage = new createjs.Stage("gameCanvas"); // canvas id is gameCanvas
	stage.mouseEventsEnabled = true;
	stage.enableMouseOver(); // Default, checks the mouse 20 times/second for hovering cursor changes

	setupManifest(); // preloadJS
	startPreload();

	stage.update();
}

function update(event) {
 	if (gameStarted) {
 		if (buretDispensing && buretLiquidY < 450) {

 			if (buretLiquidY > 150) {
 				endGame();
 			}

 			if (liquidFalling !== null) {
 				stage.removeChild(liquidFalling);
 			}

 			// decrease buret level
 			buretLiquidY++;
 			var oldIndex = stage.getChildIndex(buretLiquid);
 			stage.removeChild(buretLiquid);
 			buretLiquid = new createjs.Shape();
 			buretLiquid.graphics.beginFill("#97def4").drawRect(375, buretLiquidY, 100, 450 - buretLiquidY);
 			stage.addChildAt(buretLiquid, oldIndex);

 			// increase flask level
 			flaskLiquid.y -= 0.3 * flaskCounter;
 			halfCircle.y -= 0.3 * flaskCounter;
 			halfCircleSize += 0.1;
 			flaskCounter += 0.003;

 			// draw line of liquid falling
 			if (liquidFallingHeight < (flaskLiquid.y + flaskLiquidOriginalY) - liquidFallingOriginalY) {
	 			liquidFallingHeight += 50;

 			} else { // it has hit the water in the flask
 				liquidFallingHeight = (flaskLiquid.y + flaskLiquidOriginalY) - liquidFallingOriginalY;
 			}

			liquidFalling = new createjs.Shape();
 			liquidFalling.graphics.beginFill("#97def4").drawRect(liquidFallingOriginalX, liquidFallingOriginalY, 4, liquidFallingHeight);
 			stage.addChildAt(liquidFalling, stage.getChildIndex(flaskLiquid));	


 			// re draw half circle
 			if (halfCircleAlpha < 0.6) {
 				halfCircleAlpha += 0.01;
 			}
 			stage.removeChild(halfCircle);
 			halfCircle = new createjs.Shape();
			halfCircle.graphics.beginFill("purple").arc(STAGE_WIDTH/2 - 10, flaskLiquid.y + flaskLiquidOriginalY, halfCircleSize, 2*Math.PI, Math.PI);
			halfCircle.alpha = halfCircleAlpha;
			stage.addChild(halfCircle);
			stage.removeChild(halfCircle2);
 			halfCircle2 = new createjs.Shape();
			halfCircle2.graphics.beginFill("purple").arc(STAGE_WIDTH/2 - 10, flaskLiquid.y + flaskLiquidOriginalY, halfCircleSize + 8, 2*Math.PI, Math.PI);
			halfCircle2.alpha = halfCircleAlpha - 0.3;
			stage.addChild(halfCircle2);
 		}
	}

	stage.update(event);
}

function endGame() {
 	gameStarted = false;

 	// complete titration
 	var flaskComplete = new createjs.Shape();
	flaskComplete.graphics.beginFill("purple").drawRect(280, flaskLiquid.y + flaskLiquidOriginalY, 265, 500);
	flaskComplete.alpha = 0;
	stage.addChildAt(flaskComplete, stage.getChildIndex(flaskLiquid) + 1);
	createjs.Tween.get(flaskComplete).to({alpha:1}, 800);
	createjs.Tween.get(liquidFalling).to({y:(flaskLiquid.y + flaskLiquidOriginalY) - liquidFallingOriginalY}, 150)
		.call(function() { stage.removeChild(liquidFalling); });
	stage.addChild(buretStop);
	stage.removeChild(buretGo);
	stage.addChild(completeScreen);
	completeScreen.on("click", function() {
		location.reload();
	})
}

function initGraphics() {


	buretLiquid = new createjs.Shape();
	buretLiquid.graphics.beginFill("#97def4").drawRect(380, 30, 90, 425);
	stage.addChild(buretLiquid);

	buretLiquidMeniscusLeft = new createjs.Shape();
	buretLiquid

	flaskLiquid = new createjs.Shape();
	flaskLiquid.graphics.beginFill("#b5e5f4").drawRect(280, flaskLiquidOriginalY, 265, 500);
	stage.addChild(flaskLiquid);

	indicatorLiquid = new createjs.Shape();
	indicatorLiquid.graphics.beginFill("#8cfaff").drawRect(0, 0, 30, 150);
	indicatorLiquid.regX = 15;
	indicatorLiquid.regY = 75;
	indicatorLiquid.x = 335;
	indicatorLiquid.y = 445;
	indicatorLiquid.rotation = -47;
	stage.addChild(indicatorLiquid);



	stage.addChild(background);

	indicatorDropOriginalX = STAGE_WIDTH/2 - 40;
	indicatorDropOriginalY = STAGE_HEIGHT/2 - 10;
	indicatorDrop.x = indicatorDropOriginalX;
	indicatorDrop.y = indicatorDropOriginalY;
	indicatorDrop.alpha = 0;
	stage.addChild(indicatorDrop);

	stage.addChild(setup);
	stage.addChild(buretStop);
	stage.addChild(eyedrop);



	initListeners();
	gameStarted = true;	
	stage.update();
}

function initListeners() {
	buretStop.on("mousedown", function(event) {
		if (indicatorCounter < 4) {
			indicatorAlert.alpha = 0;
			stage.addChild(indicatorAlert);
			createjs.Tween.get(indicatorAlert).to({alpha:1}, 1000);
		} else {
			stage.addChild(buretGo);
			stage.removeChild(this);
			buretDispensing = true;

			halfCircle = new createjs.Shape();
			halfCircle.graphics.beginFill("purple").arc(STAGE_WIDTH/2 - 10, flaskLiquid.y + flaskLiquidOriginalY, halfCircleSize, 2*Math.PI, Math.PI);
			halfCircle.alpha = 0;
			stage.addChild(halfCircle);
		}
	});
	buretGo.on("mousedown", function(event) {
		stage.addChild(buretStop);
		stage.removeChild(this);
		buretDispensing = false;
		halfCircleSize = 25;
		createjs.Tween.get(liquidFalling).to({y:(flaskLiquid.y + flaskLiquidOriginalY) - liquidFallingOriginalY}, 150)
			.call(function() { stage.removeChild(liquidFalling); });
		createjs.Tween.get(halfCircle).to({alpha:0}, 2000).call(function(){stage.removeChild(halfCircle)});
		createjs.Tween.get(halfCircle2).to({alpha:0}, 2000).call(function(){stage.removeChild(halfCircle2)});
		halfCircleAlpha = 0;
	});
	eyedrop.on("click", function(event) {
		if (indicatorCounter < 5) {

			indicatorCounter++;

			stage.addChild(eyedropSqueezed);
			stage.removeChild(this);

			dispenseIndicator();

			setTimeout(function() {
				stage.addChild(eyedrop);
				stage.removeChild(eyedropSqueezed);
			}, 500);
		}

	});
}

function dispenseIndicator() {

	stage.removeChild(indicatorAlert);

	indicatorDrop.x = indicatorDropOriginalX;
	indicatorDrop.y = indicatorDropOriginalY;



	createjs.Tween.get(indicatorLiquid).to({x: indicatorLiquid.x + 5, y: indicatorLiquid.y + 5, scaleY: indicatorLiquid.scaleY - 0.1}, 500)
		.wait(400).call(function() {
			flaskLiquid.y--;
		});
	createjs.Tween.get(indicatorDrop).to({alpha:1}, 400).to({y:flaskLiquid.y + flaskLiquidOriginalY}, 400).to({alpha:0}, 500);
	
}

//////////////////////// PRELOADJS FUNCTIONS

// bitmap variables
var setup, buretGo, buretStop, eyedrop, eyedropSqueezed;
var background;
var indicatorDrop;
var indicatorAlert;
var completeScreen;

function setupManifest() {
 	manifest = [
 		{
 			src: "sounds/click.mp3",
 			id: "click"
 		},
 		{
 			src: "images/setup.png",
 			id: "setup"
 		},
 		{
 			src: "images/buret_go.png",
 			id: "buret_go"
 		},
 		{
 			src: "images/buret_stop.png",
 			id: "buret_stop"
 		},
 		{
 			src: "images/eyedrop.png",
 			id: "eyedrop"
 		},
 		{
 			src: "images/eyedrop_squeezed.png",
 			id: "eyedrop_squeezed"
 		},
 		{
 			src: "images/background.png",
 			id: "background"
 		},
 		{
 			src: "images/water_drop.png",
 			id: "water_drop"
 		},
 		{
 			src: "images/indicator_alert.png",
 			id: "indicator_alert"
 		},
 		{
 			src: "images/complete.png",
 			id: "complete"
 		}
 	];
}


function startPreload() {
	preload = new createjs.LoadQueue(true);
    preload.installPlugin(createjs.Sound);          
    preload.on("fileload", handleFileLoad);
    preload.on("progress", handleFileProgress);
    preload.on("complete", loadComplete);
    preload.on("error", loadError);
    preload.loadManifest(manifest);
}

function handleFileLoad(event) {
	console.log("A file has loaded of type: " + event.item.type);
    // create bitmaps of images
   	if (event.item.id == "setup") {
   		setup = new createjs.Bitmap(event.result);
   	} else if (event.item.id == "buret_stop") {
   		buretStop = new createjs.Bitmap(event.result);
   	} else if (event.item.id == "buret_go") {
   		buretGo = new createjs.Bitmap(event.result);
   	} else if (event.item.id == "eyedrop") {
   		eyedrop = new createjs.Bitmap(event.result);
   	} else if (event.item.id == "eyedrop_squeezed") {
   		eyedropSqueezed = new createjs.Bitmap(event.result);
   	} else if (event.item.id == "background") {
   		background = new createjs.Bitmap(event.result);
   	} else if (event.item.id == "water_drop") {
   		indicatorDrop = new createjs.Bitmap(event.result);
   	} else if (event.item.id == "indicator_alert") {
   		indicatorAlert = new createjs.Bitmap(event.result);
   	} else if (event.item.id == "complete") {
   		completeScreen = new createjs.Bitmap(event.result);
   	}
}

function loadError(evt) {
    console.log("Error!",evt.text);
}

// not currently used as load time is short
function handleFileProgress(event) {
    /*progressText.text = (preload.progress*100|0) + " % Loaded";
    progressText.x = STAGE_WIDTH/2 - progressText.getMeasuredWidth() / 2;
    stage.update();*/
}

/*
 * Displays the start screen.
 */
function loadComplete(event) {
    console.log("Finished Loading Assets");

    // ticker calls update function, set the FPS
	createjs.Ticker.setFPS(FPS);
	createjs.Ticker.addEventListener("tick", update); // call update function


    stage.update();
    initGraphics();
}

///////////////////////////////////// END PRELOADJS FUNCTIONS