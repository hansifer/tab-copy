(function(doc) {
	var format = doc.getElementById('format'),
		condensedSeparator = doc.getElementById('condensed-separator'),
		htmlTableIncludeHeader = doc.getElementById('html-table-include-header'),
		customTabTemplate = doc.getElementById('custom-tab-template'),
		customStart = doc.getElementById('custom-start'),
		customEnd = doc.getElementById('custom-end'),
		customDelimiter = doc.getElementById('custom-delimiter');

	addControlStateListeners();

	addEditListeners();

	addTemplateKeyListeners();

	initializeControlValues();

	setControlStates();

	doc.body.style.display = '';
	format.focus();

	function addControlStateListeners() {
		format.addEventListener('change', function() {
			set('format', format.value);
			setControlStates();
		});

		condensedSeparator.addEventListener('keyup', function() {
			set('condensed-separator', condensedSeparator.value);
			setControlStates();
		});

		htmlTableIncludeHeader.addEventListener('change', function() {
			set('html-table-include-header', htmlTableIncludeHeader.checked);
			setControlStates();
		});

		customTabTemplate.addEventListener('keyup', function() {
			set('custom-tab-template', customTabTemplate.value);
			setControlStates();
		});

		customStart.addEventListener('keyup', function() {
			set('custom-start', customStart.value);
			setControlStates();
		});

		customEnd.addEventListener('keyup', function() {
			set('custom-end', customEnd.value);
			setControlStates();
		});

		customDelimiter.addEventListener('keyup', function() {
			set('custom-delimiter', customDelimiter.value);
			setControlStates();
		});
	}

	function addEditListeners() {
		condensedSeparator.addEventListener('change', function() {
			if (!condensedSeparator.value) {
				condensedSeparator.value = def('condensed-separator');
			}
		});

		customTabTemplate.addEventListener('change', function() {
			if (!customTabTemplate.value) {
				customTabTemplate.value = def('custom-tab-template');
			}
		});

		customDelimiter.addEventListener('change', function() {
			if (!customDelimiter.value) {
				customDelimiter.value = def('custom-delimiter');
			}
		});
	}

	function addTemplateKeyListeners() {
		doc.getElementById('open-template-key').addEventListener('click', function() {
			doc.getElementById('template-key').style.display = '';
		});

		doc.getElementById('close-template-key').addEventListener('click', function() {
			doc.getElementById('template-key').style.display = 'none';
		});
	}

	function initializeControlValues() {
		format.value = get('format');
		condensedSeparator.value = get('condensed-separator');
		htmlTableIncludeHeader.checked = get('html-table-include-header') === 'true';
		customTabTemplate.value = get('custom-tab-template');
		customStart.value = get('custom-start');
		customEnd.value = get('custom-end');
		customDelimiter.value = get('custom-delimiter');
	}

	function setControlStates() {
		tabsText([{
			title: 'Google',
			url: 'https://www.google.com/',
			highlighted: true
		}, {
			title: 'Extensions',
			url: 'chrome://extensions/',
			highlighted: true
		}], 1, format.value, function(s, tabCount) {
			doc.getElementById('preview').textContent = s;
		});

		doc.getElementById('condensed-options').style.display = format.value === 'condensed' ? '' : 'none';
		doc.getElementById('custom-options').style.display = format.value === 'custom' ? '' : 'none';
		doc.getElementById('html-table-options').style.display = format.value === 'html-table' ? '' : 'none';
	}
}(document));
