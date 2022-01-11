/**
 * wcln.ca
 * Greatest Common Factor
 * @author Colin Perepelken (colin@perepelken.ca)
 * March 2017
 */

 // HELPER FUNCTIONS

 /*
 * Toggles mute variable. Called from HTML button.
 */
function toggleMute() {

	if (mute == true) {
		mute = false;
	} else {
		mute = true;
	}

	if (mute == true) {
		document.getElementById("mute").firstElementChild.setAttribute("src", "images/mute.png");
	} else {
		document.getElementById("mute").firstElementChild.setAttribute("src", "images/unmute.png");
	}
}

/**
 * Shuffles array in place.
 * @param {Array} a items The array containing the items.
 */
function shuffle(a) {
    var j, x, i;
    for (i = a.length; i; i--) {
        j = Math.floor(Math.random() * i);
        x = a[i - 1];
        a[i - 1] = a[j];
        a[j] = x;
    }
}

/*
* Plays a sound if the game is not muted.
*/
function playSound(id) {
	if (mute == false) {
		createjs.Sound.play(id);
	}
}

function sleep(ms) {
	return new Promise(resolve => setTimeout(resolve, ms));
}