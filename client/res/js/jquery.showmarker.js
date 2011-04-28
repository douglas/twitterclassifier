;(function ($) {
    $.fn.showMarker = function (topic) {
        var cnode = $(this);
        var address = $(this).attr('address');
        return this.each(function () {
            var geocoder = new google.maps.Geocoder();
            var loc = null;
            geocoder.geocode({
                'address': address
            }, function (results, status) {
                if (status == google.maps.GeocoderStatus.OK) {
                    loc = {
                        lat: results[0].geometry.location.Da,
                        lng: results[0].geometry.location.Ea
                    }
                } else {
                    loc = null;
                };
						 //generate list in a hidden node, map it to markers by jMap afterwards
		         if (loc != null) {
					  cnode.addClass('hasloc');
		              var mn = $('<div class="map-location" data-jmapping="{id:' + cnode.attr('id') + ', point: {lat: ' + loc.lat + ', lng: ' + loc.lng + '}, category: \'' + topic + '\'}"><a href="#" class="map-link"><\/a><div class="info-box"><p><\/p><\/div><\/div>');
		              $('#map-side-bar').prepend(mn);
					  $('#map').jMapping('update');
		          }
            });        
        });
    };
})(jQuery);
