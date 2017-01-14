(function(destinyParser) {

	'use strict';

	var numberCount = 0;

	var cardsByNumber = {};
	var cardPool = {};

	$('#cardNumber').keyup(checkCardNumber);
	$('#cardNumber').focus();
	$('#destinyButton').click(viewDestiny);

	getRatings();

	function viewDestiny() {
		var destinies = destinyParser.parse(cardPool);
		console.log(destinies);
		displayDestinies(destinies);
	}

	function displayDestinies(destinies) {
		$("#destiny").empty();
		for (var i in destinies) {
			var destiny = destinies[i];
			var destinyRow = $("<div></div>");
			destinyRow.append("<h3>"+getColorImages(destiny.color)+destiny.averageRating.toFixed(2)+"</h3>");
			$("#destiny").append(destinyRow);
		}
	}

	function getColorImages(color) {
		var colorImages = "";
		if (color == "") {
			colorImages += getColorImageTag("colorless");
		}
		if (color.includes('R')){
			colorImages += getColorImageTag("red");
		}
		if (color.includes('U')){
			colorImages += getColorImageTag("blue");
		}
		if (color.includes('B')){
			colorImages += getColorImageTag("black");
		}
		if (color.includes('W')){
			colorImages += getColorImageTag("white");
		}
		if (color.includes('G')){
			colorImages += getColorImageTag("green");
		}
		return colorImages;
	}

	function getColorImageTag(color) {
		return "<img class='color-icon' src='assets/"+color+".jpg'/>"
	}

	function checkCardNumber(event){
		if (event.keyCode >= 48 && event.keyCode <= 57) {
			numberCount++;
			if (numberCount == 3) {
				findCard($('#cardNumber').val());
				$('#cardNumber').val("");
				numberCount = 0;
			}
			return true;
		}
		return false;
	}

	function findCard(cardNumber) {
		cardNumber = parseInt(cardNumber);
		var card = cardsByNumber[cardNumber];
		if (card) {
			addCard(card);
		}
	}

	function addCard(card) {
		if (cardPool[card.id]) {
			cardPool[card.id].amount++;
		} else {
			cardPool[card.id] = card;
			card.amount = 1;
		}

		var cardRow = $("<li class='list-group-item card-row "+getColorClass(card)+"' id='"+card.id+"'><span class='button-cell'><button type='button' class='removal-button'>Remove</button></span><span>"+card.name+" ("+card.rating.toFixed(2)+")</span></li>");
		cardRow.click(removeRow);
		$("#cards").append(cardRow);
	}

	function getColorClass(card) {
		var color = "color-";
		if (card.color[0]) {
			if (card.color.length > 1) {
				color += "M";
			} else {
				color += card.color[0];
			}
		} else {
			color += "L";
		}
		return color;
	}

	function removeCard(id) {
		var card = cardPool[id];
		if (card) {
			if (card.amount > 1) {
				card.amount--;
			} else {
				delete cardPool[card.id];
			}
		}
	}

	function removeRow() {
		removeCard($(this).attr('id'));
		$(this).remove();
	}

	function getRatings() {
		$.getJSON("./assets/aer-average-ratings.json", function(data) {
			cardsByNumber = data;
		});
	}
})(destinyParser);