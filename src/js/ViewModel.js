let $this;

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

}

module.exports = ViewModel;