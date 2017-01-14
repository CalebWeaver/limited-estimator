var destinyParser = (function() {

	'use strict';

	var destiny = {};

	var destinyByColor = {};

	initDestinyByColor();

	var sortedDestinies = [];

	destiny.parse = parse;

	return destiny;

	function parse(cardPool) {
		initDestinyByColor();
		parseIntoColors(cardPool);
		averageDestiny();
		sortDestiny();
		return sortedDestinies;
	}

	function initDestinyByColor() {
		destinyByColor = {'R':{},'W':{},'B':{},'U':{},'G':{},
		'R,W':{},'W,B':{},'B,U':{},'U,G':{},'G,R':{},
		'R,B':{},'W,U':{},'B,G':{},'U,R':{},'G,W':{}};
	}

	function sortDestiny() {
		for (var color in destinyByColor) {
			var destiny = destinyByColor[color];
			destiny.color = color;
			if (destiny.averageRating) {
				if (sortedDestinies.length == 0) {
					sortedDestinies[0] = destiny;
				} else {
					for (var i = 0; i < sortedDestinies.length; i++) {
						if (destiny.averageRating > sortedDestinies[i].averageRating) {
							sortedDestinies.splice(i, 0, destiny);
							break;
						} else if (i+1 == sortedDestinies.length) {
							sortedDestinies.splice(i+1, 0, destiny);
							break;
						}
					}
				}
			}
		}
	}

	function averageDestiny() {
		for (var color in destinyByColor) {
			var totalRating = 0;
			var destinyColor = destinyByColor[color];
			var cards = destinyColor.cards;
			if (cards) {
				destinyColor.totalCards = 0;
				for (var i in cards) {
					var card = cards[i];
					for (var i = 0; i < card.amount; i++) {
						totalRating += card.rating;
						destinyColor.totalCards++;
					}
				}
				destinyColor.averageRating = totalRating / destinyColor.totalCards;
			}
		}
	}

	function parseIntoColors(cardPool) {
		for (var cardId in cardPool) {
			var card = cardPool[cardId];
			var color = card.color;
			if (color.length == 1) {
				for (var c in destinyByColor) {
					if (c.length > 1 && c.includes(color)) {
						addCardByColor(card, c);
					}
				}
			}
			addCardByColor(card, color);
		}
	}

	function addCardByColor(card, color) {
		if (!destinyByColor[color]) {
			destinyByColor[color] = {};
		}
		if (!destinyByColor[color].cards) {
			destinyByColor[color].cards = [];
		}
		destinyByColor[color].cards.push(card);
	}
})();