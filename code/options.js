(function(doc) {
	var format = doc.getElementById('format'),
		delimiter = doc.getElementById('delimiter');

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

	template.addEventListener('keyup', function() {
		localStorage.setItem('tab-format-template', template.value);
		setControlStates();
	});

	template.addEventListener('change', function() {
		if (!template.value) {
			template.value = templateDefault;
		}
	});

	doc.getElementById('open-template-key').addEventListener('click',function() {
		doc.getElementById('template-key').style.display = '';
	});

	doc.getElementById('close-template-key').addEventListener('click',function() {
		doc.getElementById('template-key').style.display = 'none';
	});

	format.value = get('tab-format');
	delimiter.value = get('tab-format-delimiter');
	template.value = get('tab-format-template');

	setControlStates();

	doc.body.style.display = '';
	format.focus();

	function setControlStates() {
		doc.getElementById('preview').textContent = tabText({
			title: 'Google',
			url: 'https://www.google.com/'
		}, format.value);

		doc.getElementById('delimiterBox').style.display = format.value === 'txt1Line' ? '' : 'none';
		doc.getElementById('templateBox').style.display = format.value === 'custom' ? '' : 'none';
	}
}(document));
