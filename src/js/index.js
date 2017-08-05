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
			lat: 29.6353,
			lng: 29,
			name: 'First Location'
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

	var model = new ViewModel( myLocations, KO );

	// focus on first Location
	model.focus( window.myLocations[0] );

	// Apply Knockout Feature
	KO.applyBindings( model );

} );