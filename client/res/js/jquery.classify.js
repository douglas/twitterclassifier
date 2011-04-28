; (function($) {
    $.fn.classify = function(cmethod) {
        var cnode = $(this);
		//test if uclassify is down
		//cnode.showMarker('default');
        jsonp = function(data) {
            var tclass = data.cls1;
            var max = 0;
            //default class is unknown
            var decision = 'NA';
            for (var i in tclass) {
                if (tclass[i] > max) {
                    max = tclass[i];
                    decision = i;
                }
            }
            cnode.addClass(decision);
			      cnode.showMarker(decision);
        }
			
        return this.each(function() {
		//change to .ajax
				$.getJSON(window.clsServerUrl + "?callback=?",
				{
					text: cnode.text(),
					method: cmethod,
				},
				jsonp
				);
        });
    };
})(jQuery);
