/**
 * BCLearningNetwork.com
 * Titration
 * @author Colin Bernard (colinjbernard@hotmail.com)
 * June 2017
 */

//// VARIABLES ////

var mute = false;
var FPS = 24;

var STAGE_WIDTH, STAGE_HEIGHT;

var gameStarted = false;

// liquid to be drawn
var buretLiquid, flaskLiquid, indicatorLiquid;

var buretDispensing = false;
var buretLiquidY = 30;
var flaskCounter = 1; // used to make flask level increase faster as it gets skinnier

var liquidFalling;
var liquidFallingOriginalX = 413;
var liquidFallingOriginalY = 455;
var liquidFallingHeight = 1;

var flaskLiquidOriginalY = 880;


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

 			if (liquidFalling !== null) {
 				stage.removeChild(liquidFalling);
 			}

 			// decrease buret level
 			buretLiquidY++;
 			var oldIndex = stage.getChildIndex(buretLiquid);
 			stage.removeChild(buretLiquid);
 			buretLiquid = new createjs.Shape();
 			buretLiquid.graphics.beginFill("blue").drawRect(375, buretLiquidY, 100, 450 - buretLiquidY);
 			stage.addChildAt(buretLiquid, oldIndex);

 			// increase flask level
 			flaskLiquid.y -= 0.3 * flaskCounter;
 			flaskCounter += 0.003;

 			// draw line of liquid falling
 			if (liquidFallingHeight < (flaskLiquid.y + flaskLiquidOriginalY) - liquidFallingOriginalY) {
	 			liquidFallingHeight += 50;

 			} else { // it has hit the water in the flask
 				liquidFallingHeight = (flaskLiquid.y + flaskLiquidOriginalY) - liquidFallingOriginalY;
 			}

			liquidFalling = new createjs.Shape();
 			liquidFalling.graphics.beginFill("blue").drawRect(liquidFallingOriginalX, liquidFallingOriginalY, 4, liquidFallingHeight);
 			stage.addChildAt(liquidFalling, stage.getChildIndex(flaskLiquid));	
 		}
	}

	stage.update(event);
}

function endGame() {
 	gameStarted = false;
}

function initGraphics() {


	buretLiquid = new createjs.Shape();
	buretLiquid.graphics.beginFill("blue").drawRect(380, 30, 90, 425);
	stage.addChild(buretLiquid);

	flaskLiquid = new createjs.Shape();
	flaskLiquid.graphics.beginFill("red").drawRect(280, flaskLiquidOriginalY, 265, 500);
	stage.addChild(flaskLiquid);

	indicatorLiquid = new createjs.Shape();
	indicatorLiquid.graphics.beginFill("green").drawRect(0, 0, 30, 150);
	indicatorLiquid.regX = 15;
	indicatorLiquid.regY = 75;
	indicatorLiquid.x = 335;
	indicatorLiquid.y = 445;
	indicatorLiquid.rotation = -47;
	stage.addChild(indicatorLiquid);

	stage.addChild(background);
	stage.addChild(setup);
	stage.addChild(buretStop);
	stage.addChild(eyedrop);

	initListeners();
	gameStarted = true;	
	stage.update();
}

function initListeners() {
	buretStop.on("mousedown", function(event) {
		stage.addChild(buretGo);
		stage.removeChild(this);
		buretDispensing = true;
	});
	buretGo.on("mousedown", function(event) {
		stage.addChild(buretStop);
		stage.removeChild(this);
		buretDispensing = false;
		stage.removeChild(liquidFalling);
	});
	eyedrop.on("click", function(event) {
		stage.addChild(eyedropSqueezed);
		stage.removeChild(this);

		dispenseIndicator();

		setTimeout(function() {
			stage.addChild(eyedrop);
			stage.removeChild(eyedropSqueezed);
		}, 500);
	});
}

function dispenseIndicator() {
	createjs.Tween.get(indicatorLiquid).to({x: indicatorLiquid.x + 5, y: indicatorLiquid.y + 5, scaleY: indicatorLiquid.scaleY - 0.1}, 500)
		.wait(400).call(function() {
			flaskLiquid.y--;
		});
}

//////////////////////// PRELOADJS FUNCTIONS

// bitmap variables
var setup, buretGo, buretStop, eyedrop, eyedropSqueezed;
var background;

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