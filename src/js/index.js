/**
 * App Dependencies
 */
require( './__dependencies' );

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
// GoogleMapsLoader.KEY = 'AIzaSyDHWDn7tAzjRjZs515vcgm2N-BccAM1wZ0';


GoogleMapsApiLoader({
		libraries: ['places'],
		apiKey: 'AIzaSyDHWDn7tAzjRjZs515vcgm2N-BccAM1wZ0', // optional
	})
	.then(function(googleApi) {

		var mapApp = new MapApp( google );

		window.myLocations = [
			new Location( {
			lat: 31.045058,
			lng: 31.378376,
			name: 'Mansoura',
		}, mapApp ),

		new Location( {
			lat: 30.0444,
			lng: 31.2357,
			name: 'Cairo',
		}, mapApp ),

		new Location( {
			lat: 31.2001,
			lng: 29.91877,
			name: 'Alexandria',
		}, mapApp ),

		new Location( {
			lat: 25.6872,
			lng: 32.6396,
			name: 'Luxor',
		}, mapApp ),

		new Location( {
			lat: 24.0889,
			lng: 32.8998,
			name: 'Aswan',
		}, mapApp ),
		];

		window.appModel = new ViewModel( myLocations, KO );

		// focus on first Location
		// model.focus( window.myLocations[0] );

		// Apply Knockout Feature
		KO.applyBindings( window.appModel );

		// Trigger Custom Event ON BODY
		$( 'body' ).trigger( 'GoogleMapLoaded' );

	}, function(err) {
		console.error(err);

		$.notify( {
				// options
				icon: 'glyphicon glyphicon-warning-sign',
				title: '<b>"Connection Timeout":</b> ',
				message: 'Error calling GoggleMaps APi.',
			}, {
				timer: 0,

				type: 'danger',
				allow_dismiss: false,
				animate: {
					enter: 'animated rubberBand',
					exit: 'animated fadeOutUp',
				},
			} );

			$('.loading' ).addClass( 'error' ).find( 'h5' ).text( 'GoggleMaps APi Connection Timeout!' );

	});