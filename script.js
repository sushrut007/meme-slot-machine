/*****************************************************************************
 *  script.js
 *  Created by Sushrut Mhetras
 *****************************************************************************/
const iconIdsArr = ["#icon-1", "#icon-2", "#icon-3", "#icon-4", "#icon-5","#icon-6","#icon-7"];
const slotClassArr = [".s1", ".s2", ".s3"];


let DataStore = { "wins": 0, "loses": 0, "most": 0, "least": 0 };
const LocalStore = window.localStorage;

function rng(min, max) {
	const rand = Math.random() * (max - min) + min;
	return Math.floor(rand);
}

function disappear() {
	for (let i = 0; i < iconIdsArr.length; i++) {
		for (let j = 0; j < slotClassArr.length; j++) {
			$(`${slotClassArr[j]}`).find(`${iconIdsArr[i]}`)
								   .css("display", "none");
		}
	}
}
function magicAct(num1, num2, num3) {
	disappear(); 
	for (let i = 0; i < iconIdsArr.length; i++) {
		if (num1 == i) {
			$(".s1").find(`${iconIdsArr[num1]}`)
					.css("display", "initial");
		}
		if (num2 == i) {
			$(".s2").find(`${iconIdsArr[num2]}`)
					.css("display", "initial");
		}
		if (num3 == i) {
			$(".s3").find(`${iconIdsArr[num3]}`)
					.css("display", "initial");
		}
	}
}

function winCondition(num1, num2, num3, spinCount) {
	if (num1 == num2 && num2 == num3) {
		$("#try-your-luck").text("WINNER!");
		$("#try-your-luck").css("color", "lawngreen");
		$("#reset-btn").css("visibility", "visible");
		let DS = DataStore;
		let LS = LocalStore;
		DS.wins += 1;
		LS.setItem("NUM_WINS", DataStore.wins);
		let least = DS.least;
		if (least == 0) {
			least = 9999;
		}
		let most = DS.most;
		if (spinCount > most) {
			LS.setItem("MOST_SPINS", spinCount);
		}
		if (spinCount < least) {
			LS.setItem("LEAST_SPINS", spinCount);
		}
		refreshStats();
	}
}
function startStorage() {
	const LS = LocalStore;
	let DS = DataStore;
	if (LS.getItem("NUM_WINS") !== null) {
		DS.wins = parseInt(LS.getItem("NUM_WINS"));
		DS.loses = parseInt(LS.getItem("NUM_LOSES"));
		DS.most = parseInt(LS.getItem("MOST_SPINS"));
		DS.least = parseInt(LS.getItem("LEAST_SPINS"));
	}
	else {
		LS.setItem("NUM_WINS", DS.wins);
		LS.setItem("NUM_LOSES", DS.loses);
		LS.setItem("MOST_SPINS", DS.most);
		LS.setItem("LEAST_SPINS", DS.least);
	}
	return DS;
}

function refreshStats() {
	let DS = DataStore;
	$("#win-spins").text(DS.wins);
	$("#lose-spins").text(DS.loses);
	$("#most-spins").text(DS.most);
	$("#least-spins").text(DS.least);
}

function resetLocalStorage() {
    const conf = confirm("Are you sure you want to reset you game stats?");
    if (conf) {
      localStorage.clear(); 
      DataStore = { "wins": 0, "loses": 0, "most": 0, "least": 0 }; 
      refreshStats(); 
    }
  }

///////////////////////////////////////////////////////////////////////////////

$(document).ready(function(){
	disappear();
	let spinCount = 0;
	$("#num-spins").text(spinCount);
	if (typeof(Storage) !== "undefined") {
		DataStore = startStorage();
		refreshStats();

	} else { 
		console.warn("Web Storage not supported! \
					 Features for this site will be missing.");
	}

	$("#spin-btn").click(function(){
		if ($("#try-your-luck").text() === "WINNER!") {
			return;
		}
		else {
			let dice = [];
			for (let i = 0; i < slotClassArr.length; i++) {
				let r = rng(0, iconIdsArr.length);
				dice.push(r);
			}				
			spinCount += 1;
			$("#num-spins").text(spinCount);
			DataStore.loses += 1;
			localStorage.setItem("NUM_LOSES", DataStore.loses);
			console.log(`DEBUG: (${dice[0]}, ${dice[1]}, ${dice[2]})`);
			magicAct(dice[0], dice[1], dice[2]);
			winCondition(dice[0], dice[1], dice[2], spinCount);
		}
		refreshStats();
	});
	$("#reset-btn").click(() => {
		location.reload();
	});
});