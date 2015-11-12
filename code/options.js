(function(doc) {
	var delimiterDefault = ':  ',
		previews = {
			txt2Lines: 'Google\nhttps://www.google.com/',
			txt1Line: 'Google{{delimiter}}https://www.google.com/',
			txtUrlOnly: 'https://www.google.com/',
			markdown: '[Google](https://www.google.com/)',
			bbcode: '[url=https://www.google.com/]Google[/url]',
			json: '{ \n   "title": "Google", \n   "url": "https://www.google.com/" \n}',
			html: '<a href="https://www.google.com/" target="_blank">Google</a>'
		},
		format = doc.getElementById('format'),
		delimiter = doc.getElementById('delimiter'),
		delimiterBox = doc.getElementById('delimiterBox'),
		preview = doc.getElementById('preview');

	format.addEventListener('change', function() {
		localStorage.setItem('tab-format', format.value);
		setControlStates();
	});

	delimiter.addEventListener('keyup', function() {
		localStorage.setItem('tab-format-delimiter', delimiter.value);
		setControlStates();
	});

	delimiter.addEventListener('change', function() {
		if (!delimiter.value) {
			delimiter.value = delimiterDefault;
		}
	});

	format.value = localStorage.getItem('tab-format') || 'txt2Lines';
	delimiter.value = localStorage.getItem('tab-format-delimiter') || delimiterDefault;

	setControlStates();

	doc.body.style.display = '';
	format.focus();

	function setControlStates() {
		preview.textContent = previews[format.value].replace('{{delimiter}}', delimiter.value || delimiterDefault);
		delimiterBox.style.visibility = format.value === 'txt1Line' ? 'visible' : 'hidden';
	}
}(document))
