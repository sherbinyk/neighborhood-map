let $this;
let Location = require( './Location' );

class ViewModel{

	constructor( locations, KO ){

		// My Locations
		this.locations = locations;

		// Filter Word
		this.searchKeyword = KO.observable( '' );


		/**
		 * Computed Property Filtered Locations
		 * @param  {[type]} 
		 * @return {[type]}                        [description]
		 */
		this.filteredLocations = KO.computed( () => {

			if( this.searchKeyword().trim().length > 0 ){
				// console.log( 'filter' )
				var regexp = new RegExp( this.searchKeyword(), 'i' );

				return this.locations.filter( function(location){
					return location.name.search( regexp ) != -1;
				} );
			}
			else
				return this.locations;
		} );

		/**
		 * Subscribe to Filtered Locations Changes
		 * @param  {[type]} newValue) {		             console.log( newValue );		} [description]
		 * @return {[type]}           [description]
		 */
		this.filteredLocations.subscribe((newValue) => {
		    console.log( newValue );

		    Location.showOnly( newValue );
		});


		/**
		 * Active Location Id
		 * @type {[type]}
		 */
		this.activeLocationId = KO.observable( '' );


		/**
		 * Bind Current instance to $this variable to be always available
		 * @type {[type]}
		 */
		$this = this;

	}

	/**
	 * Focus on Specific Location
	 * @param  {[type]} location [description]
	 * @return {[type]}          [description]
	 */
	focus( location ){
		// Get Last Active and UnFocus
		
		$this.locations.forEach( (locationEl) => {
			if( locationEl != location )
				locationEl.unFocus();
		} );

		location.focus( 10000);

		$this.activeLocationId( location.id );
	}

	/**
	 * Show All Locations
	 * @return {[type]} [description]
	 */
	showAll(){
		// Clear Active
		$this.activeLocationId( '' );

		// Clear All Filters
		$this.searchKeyword( '' );

		/**
		 * Show All Locations Markers
		 */
		Location.showAllMarkers();
	}

}

module.exports = ViewModel;