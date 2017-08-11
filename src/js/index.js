/**
 * App Dependencies
 */
require( './__dependencies' )

import Location from './Location';
import MapApp from './MapApp';
import ViewModel from './ViewModel';

/**
 * UI Work
 */
require( './Ui' );

// Knockout JS Library
import KO from 'knockout';

let loadingObj = {
	loadingInterval: null,
	checkEvery: 100,
	isLoaded: false,

	// Max Timeout time is 10 Sec
	maxLoadingTime: 10000,
	totalTriesTime: 0,
};


/**
 * Set Google Map API Key
 * @type {String}
 */
GoogleMapsLoader.KEY = 'AIzaSyDHWDn7tAzjRjZs515vcgm2N-BccAM1wZ0';

/**
 * Init App While Google Map Is Ready
 * @param  {MapApp} google ){	var       map [description]
 * @return {[type]}        [description]
 */
GoogleMapsLoader.load( function( google ){

	var mapApp = new MapApp( google );


	window.myLocations = [
		new Location( {
			lat: 31.045058,
			lng: 31.378376,
			name: 'Mansoura'
		}, mapApp ),

		new Location( {
			lat: 30.0053,
			lng: 29.536363,
			name: 'Second Location'
		}, mapApp ),

		new Location( {
			lat: 30.1,
			lng: 27,
			name: 'Third Location'
		}, mapApp ),

		new Location( {
			lat: 30.1,
			lng: 30.32,
			name: 'Fourth Location'
		}, mapApp ),

		new Location( {
			lat: 28.1753,
			lng: 30.953,
			name: 'Fifth Location'
		}, mapApp ),
	];

	window.appModel = new ViewModel( myLocations, KO );

	// focus on first Location
	// model.focus( window.myLocations[0] );

	// Apply Knockout Feature
	KO.applyBindings( window.appModel );

	// Set Loaded
	setTimeout( () => {
		loadingObj.isLoaded = true;
	}, 500 );

} );


loadingObj.loadingInterval = setInterval( () => {
	if( loadingObj.isLoaded == true ){
		// Loaded
		clearInterval( loadingObj.loadingInterval );

		// Trigger Custom Event ON BODY
		$( 'body' ).trigger( 'GoogleMapLoaded' );
	}
	else
	{
		// Check How Many Tries Passed
		if( loadingObj.totalTriesTime >= loadingObj.maxLoadingTime )
		{
			clearInterval( loadingObj.loadingInterval );
			// alert( 'Timeout' );
			$.notify( {
				// options
				icon: 'glyphicon glyphicon-warning-sign',
				title: '<b>"Connection Timeout":</b> ',
				message: 'Error calling GoggleMaps APi.',
			}, {
				timer: 0,

				type: "danger",
				allow_dismiss: false,
				animate: {
					enter: 'animated rubberBand',
					exit: 'animated fadeOutUp'
				},
			} );

			$('.loading h5').text( 'GoggleMaps APi Connection Timeout!' )
		}
		else
		{
			loadingObj.totalTriesTime += loadingObj.checkEvery;
		}
	}

	console.log( 'Interval Working' );
}, loadingObj.checkEvery );