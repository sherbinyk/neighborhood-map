class MapApp {

	constructor( google ){

		this.google = google;

		var el = document.getElementById( 'neighborhood-map' );


		this.mapOptions = {
			zoom: 6,
            mapTypeId: google.maps.MapTypeId.ROADMAP,
            streetViewControl: true,
            mapTypeControl: true,
            center: new google.maps.LatLng( 30, 30 ),
        };

        /**
         * Set Map
         * @type {this}
         */
		this.map = new this.google.maps.Map( el, this.mapOptions );

		// Set Geocoder
		this.geocoder = new this.google.maps.Geocoder();


		this.google.maps.event.addDomListener(window, 'resize', () => {
			this.google.maps.event.trigger( this.map, 'resize');
		});

		$( '#neighborhood-map' ).bind( 'menuModeChanged', () => { 
			this.google.maps.event.trigger( this.map, 'resize');
		} );

	}


	/**
	 * Add Marker on Map
	 * @param {[type]} position [description]
	 */
	addMarker( position ){

		return new this.google.maps.Marker({
            position: position,
            map: this.map,
            animation: this.google.maps.Animation.DROP,
            draggable: false,
        });
	}

	/**
	 * Make Info Window
	 * @param  {[type]} options [description]
	 * @return {[type]}         [description]
	 */
	makeInfoWindow( options ){
		return new this.google.maps.InfoWindow( options );
	}

}

module.exports = MapApp;