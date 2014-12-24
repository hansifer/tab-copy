window.addEvent("domready", function () {
    new FancySettings.initWithManifest(function (settings) {
        var textArea = settings.manifest.linkFormat.element;

        var paramContainer = document.id('parameter-summary-container');
        var paramList = new Element("ul", {id: "param-list"});
        new Element("span", {html: i18n.get("parameter-descriptions")}).inject(paramContainer);
        paramList.inject(paramContainer);

        Array.each(parameters, function(param, idx) {
            new Element("li", {text: "{"+param.key+"}"}).inject(paramList);
        });

        var exampleContainer = document.id('example-format-container');
        var exampleList = new Element("ul", {id: "example-list"});
        new Element("span", {html: "Some Examples:"}).inject(exampleContainer);
        exampleList.inject(exampleContainer);
        
        Array.each(examples, function(ex, idx) {
            var entry = new Element("li", {text: ex.name + ": " + ex.formatString});
            var copyLink = new Element("span.copy-link", {
                html: '&#x2398',
                events: {click: function() {textArea.value = ex.formatString;}}
            }).inject(entry);
            entry.inject(exampleList);
        });
    });
});                              
