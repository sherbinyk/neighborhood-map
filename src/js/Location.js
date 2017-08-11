class Location{
	constructor( options, mapApp ){

		// Set Object Properties
		this.name = options.name;
		this.lat = options.lat;
		this.lng = options.lng;

		// Set Location ID
		this.id = ++this.globals.lastId;

		// console.log( this.id )

		// set mapApp
		this.mapApp = mapApp;


		/**
		 * Status Object
		 * @type {Object}
		 */
		this.status = {
			'infoWindowOpened': false,
			'markerOnMap': false,
			'isFocused': false,
		};

		this.__setCenterTimeout = null,

		// Add Marker On Map
		this.addMarker();

		/**
		 * Set Info Window
		 */
		this.__setInfoWindow();

		/**
		 * Get Addresss By Geocoder
		 */
		this.__getAddress();

		/**
		 * Get Description from wikipedia
		 */
		this.__getWikipediaDescription();


		/**
		 * Listen for Map resize
		 * @param  {[type]} this.mapApp.map [description]
		 * @param  {[type]} 'resize'        [description]
		 * @param  {[type]} ()              [description]
		 * @return {[type]}                 [description]
		 */
		this.mapApp.google.maps.event.addListener( this.mapApp.map, 'resize', () => { this.centerMarker(); } );


		// Add Location Instances To Instances Array
		this.instances[ this.id ] = this;

	}


	/**
	 * Center Map On Marker
	 * @return {[type]} [description]
	 */
	centerMarker(){
		if( this.status.isFocused )
		{
			clearTimeout( this.__setCenterTimeout );

			this.__setCenterTimeout = setTimeout( () => {
				this.mapApp.map.setCenter( {
					lat: this.lat,
					lng: this.lng
				} );
			}, 500 );
				
		}
	}

	/**
	 * Add Marker Object To Map
	 */
	addMarker(){
		if( ! this.marker )
		{
			this.marker = this.mapApp.addMarker( { lat: this.lat, lng: this.lng } );

			this.marker.addListener( 'click', () => {

				this.focus( 10000 );

				if( window.appModel ){
					window.appModel.activeLocationId( this.id );
				}
			} );

		}
		

	}

	/**
	 * Show Marker On Map
	 */
	showMarker(){
		if( ! this.marker )
			this.addMarker();

		this.marker.setMap( this.mapApp.map );

		this.markerOnMap = true;
	}

	/**
	 * Remove Marker From Map
	 */
	removeMarker(){
		if( this.marker ){
			this.marker.setMap( null );
		}

		this.markerOnMap = false;
	}

	/**
	 * Start Animating MArker
	 * @return {[type]} [description]
	 */
	animateMarker( timeout ){
		if( this.marker ){
			this.marker.setAnimation( this.mapApp.google.maps.Animation.BOUNCE );

			// Stop Animation
			if( ! isNaN( timeout ) ){
				setTimeout( () => {
					this.stopMarkerAnimation();
				}, timeout );
			}
		}
	}

	/**
	 * Stop Animationg Marker
	 * @return {[type]} [description]
	 */
	stopMarkerAnimation(){
		if( this.marker ){
			this.marker.setAnimation( null );
		}
	}

	/**
	 * Set Location Info Window
	 * @return {[type]} [description]
	 */
	__setInfoWindow( force ){
		
		// if( force )
		// 	this.infoWindow = null;

		if( this.wikipedia ){
			if( Object.keys( this.wikipedia ).length > 0 ){
				// Ok There ara data
				var wikiContent = `<strong>Wikipidia:</strong> ${ this.wikipedia.description.substr( 0, 100 ) + '...' } <a href="${this.wikipedia.link}">More</a>`;
			} else{
				var wikiContent = `<strong>Wikipidia:</strong> No data found on wikipedia for <b>${ this.name }</b>`;
			}
		}
		else{
			var wikiContent = '<strong>Wikipidia: </strong>  Loading... ';
		}
			
		var content = `
			<div class="info-window">
				<h5 class="name">${this.name}</h5>
				<div>
					<strong>Address:</strong> ${this.address}
					<br>
					${wikiContent}
				</div>
			</div>
		`;

		if( ! this.infoWindow ){
			this.infoWindow = this.mapApp.makeInfoWindow({
				content: content,
			});
		}
		else{
			this.infoWindow.setContent( content );
		}
	}

	/**
	 * Show Info Window
	 * @return {[type]} [description]
	 */
	showInfoWindow(){
		if( this.infoWindow && this.marker ){
			this.infoWindow.open( this.mapApp.map, this.marker );

			this.status.infoWindowOpened = true;
		}
	}

	/**
	 * Hide Info Window
	 * @return {[type]} [description]
	 */
	hideInfoWindow(){
		if( this.infoWindow && this.marker ){
			this.infoWindow.close();
			this.status.infoWindowOpened = false;
		}
	}

	/**
	 * Get Address of location
	 * @return {[type]} [description]
	 */
	__getAddress(){
		if( ! this.address ){
			this.mapApp.geocoder.geocode( { location: { lat: this.lat, lng: this.lng } }, ( response, status ) => {
				// console.log( response )
				if (status == 'OK'){
					this.address = response[0].formatted_address;

					this.__setInfoWindow();

					if( this.status.infoWindowOpened ){
						this.hideInfoWindow();
						this.showInfoWindow();
					}
						
				}
				else{
					$.notify( {
						// options
						icon: 'glyphicon glyphicon-warning-sign',
						title: '<b>'+ this.name +'</b>',
						message: 'Error calling GoggleMaps APi to get address.',
					}, {
						timer: 0,

						type: "warning",
						allow_dismiss: true,
						animate: {
							enter: 'animated rubberBand',
							exit: 'animated fadeOutUp'
						},
					} );
				}
			} );
		}
	}

	__getWikipediaDescription(){
		var name = this.name;
		if( ! this.wikipedia ){
			// Ajax Request
			$.ajax( {
				type: 'GET',
				dataType: 'JSONP',
				url: 'https://en.wikipedia.org/w/api.php',
				data: { 'action': 'opensearch', 'search': name },
			} )
			.done( (r) => {
				// console.log( r );
				if( r[ 1 ].length ){
					this.wikipedia = {
						description: r[ 2 ][0],
						link: r[ 3 ][0],
					}
				}else
				{
					this.wikipedia = {};
				}
			} )
			.fail( ( error ) => {
				// alert( 'Error getting wikipedia info' );
				this.wikipedia = {};

				$.notify( {
						// options
						icon: 'glyphicon glyphicon-warning-sign',
						title: '<b>'+ this.name +'</b>',
						message: 'Error calling Wikipedia APi to get location description.',
					}, {
						timer: 0,

						type: "warning",
						allow_dismiss: true,
						animate: {
							enter: 'animated rubberBand',
							exit: 'animated fadeOutUp'
						},
					} );
			} )
			.always( () => {
				this.__setInfoWindow();
			} )
		}
	}

	/**
	 * Focus on Location
	 * Make Location at The center of Map
	 * @return {[type]} [description]
	 */
	focus( timeout ){
		this.mapApp.map.setCenter( { lat: this.lat, lng: this.lng } );
		this.showMarker();
		this.showInfoWindow();
		this.animateMarker( timeout );

		this.status.isFocused = true;

		// Hide All Others
		this.unFocusOthers();
	}

	/**
	 * UnFocus  Location
	 * Make Location at The center of Map
	 * @return {[type]} [description]
	 */
	unFocus(){
		this.removeMarker();
		this.hideInfoWindow();
		this.stopMarkerAnimation();

		this.status.isFocused = false;

	}

	/**
	 * Un Focus Other Markers
	 * @return {[type]} [description]
	 */
	unFocusOthers(){
		for( var id in this.instances ){
			if( id != this.id )
				this.instances[ id ].unFocus();
		}
	}
}

Object.defineProperties( Location.prototype, {
	globals: {
		value: {
			lastId: 0,
		},
		writable: true,
	},

	instances: {
		value: {},
		writable: true,
	},

	
} );

/**
 * Define static methods
 */
Object.defineProperties( Location, {
	/**
	 * Show All Markers
	 * @type {Object}
	 */
	showAllMarkers: {
		value: function(){
			for( var id in Location.prototype.instances ){
				Location.prototype.instances[ id ].showMarker();
				Location.prototype.instances[ id ].hideInfoWindow();
			}
		},
		enumerable: true,
	},

	/**
	 * Show Only Specific Locations
	 * @type {Object}
	 */
	showOnly: {
		value: function( locations ){
			for( var id in Location.prototype.instances ){

				if( locations.indexOf( Location.prototype.instances[ id ] ) === -1 ){
					// Hide
					Location.prototype.instances[ id ].removeMarker();
					Location.prototype.instances[ id ].hideInfoWindow();
				}
				else{
					//  Show
					Location.prototype.instances[ id ].showMarker();
				}

			}
		},
		enumerable: true,
	},
});

module.exports = Location;