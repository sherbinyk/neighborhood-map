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
		 * Listen for Map resize
		 * @param  {[type]} this.mapApp.map [description]
		 * @param  {[type]} 'resize'        [description]
		 * @param  {[type]} ()              [description]
		 * @return {[type]}                 [description]
		 */
		this.mapApp.google.maps.event.addListener( this.mapApp.map, 'resize', () => { this.centerMarker(); } );

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
				this.stopMarkerAnimation();

				// Toggle Info Window
				if( this.status.infoWindowOpened )
					this.hideInfoWindow();
				else
					this.showInfoWindow();
			} );

		}
		else{
			this.marker.setMap( this.mapApp.map );
		}

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
			
		var content = `
			<div class="info-window">
				<h5>${this.name}</h5>
				<div>
					<strong>Address:</strong> ${this.address}
					<br>
					<strong>Wikipidia:</strong> <a target="_blank" href="https://en.wikipedia.org/wiki/${this.name}">${this.name}</a>
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
			} );
		}
	}

	/**
	 * Focus on Location
	 * Make Location at The center of Map
	 * @return {[type]} [description]
	 */
	focus( timeout ){
		this.mapApp.map.setCenter( { lat: this.lat, lng: this.lng } );
		this.addMarker();
		this.showInfoWindow();
		this.animateMarker( timeout );

		this.status.isFocused = true;
	}

	/**
	 * UnFocus  Location
	 * Make Location at The center of Map
	 * @return {[type]} [description]
	 */
	unFocus(){
		this.hideInfoWindow();
		this.stopMarkerAnimation();

		this.status.isFocused = false;

	}
}

Object.defineProperties( Location.prototype, {
	globals: {
		value: {
			lastId: 0,
		},
		writable: true,
	}
} );

module.exports = Location;