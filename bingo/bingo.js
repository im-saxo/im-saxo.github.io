window.onload = function () {
	function get (classname) {
		return document.getElementsByClassName(classname)[0];
	}

	function toggleMod (element, mod, enable) {
		if (enable === undefined) {
			enable = element.className.indexOf('_' + mod) == -1;
		}
		element.classList[enable ? 'add' : 'remove'](element.classList[0] + '_' + mod);
	}

	// DOM
	// settings
	var from = get('js-from');
	var to = get('js-to');
	var resetBtn = get('js-reset');

	// action
	var bingobox = get('js-bingobox');
	var currentResult = get('js-result');
	var currentResultText = get('js-result-num');

	// results
	var resultBox = get('js-results');

	// Math
	var source;
	var results;

	function reset () {
		toggleMod(currentResult, 'on', false);
		resultBox.value = '';

		results = [];
		var fromNum = 1*from.value || 1;
		var toNum = 1*to.value || 100;

		source = [];
		for (var i = fromNum; i <= toNum; i++) {
			source.push(i);
		}
	}

	from.addEventListener('change', reset);
	to.addEventListener('change', reset);
	resetBtn.addEventListener('click', reset);

	function getNumber () {
		var length = source.length;
		var random = Math.floor(Math.random() * length);
		var result = source[random];
		source.splice(random, 1);

		if (result === undefined) {
			result = 'Конец';
		}
		currentResultText.innerHTML = result;
		setTimeout(function () {
			toggleMod(currentResult, 'on', true);
			resultBox.value += result + '\n';
		}, 1000);
	}


	bingobox.addEventListener('click', function (event) {
		if (!source.length) {
			alert('Номера закончились');
			return;
		}
		toggleMod(currentResult, 'on', false);
		toggleMod(bingobox, 'active');

		getNumber();
	});

	reset();
}