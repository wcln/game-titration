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
 		if (buretDispensing) {
 			buretLiquidY++;
 			var oldIndex = stage.getChildIndex(buretLiquid);
 			stage.removeChild(buretLiquid);
 			buretLiquid = new createjs.Shape();
 			buretLiquid.graphics.beginFill("blue").drawRect(375, buretLiquidY, 100, 450 - buretLiquidY);
 			stage.addChildAt(buretLiquid, oldIndex);
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
	});
	eyedrop.on("click", function(event) {
		stage.addChild(eyedropSqueezed);
		stage.removeChild(this);

		setTimeout(function() {
			stage.addChild(eyedrop);
			stage.removeChild(eyedropSqueezed);
		}, 500);
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