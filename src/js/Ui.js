var navHeight = $('#content-side nav').height();
var $map = $( '#neighborhood-map' );
var $window = $(window);
var $bars = $('#bars');
var $menuSide  = $( '#menu-side' );
var $contentSide  = $( '#content-side' );
var $body = $('body');
var $loading = $('.loading');

// Listen For Body Map Loaded
$body.on( 'GoogleMapLoaded', () => {
	$loading.fadeOut( () => {
		$loading.remove();
	});
} );

// MENU
// menu Modes => Fixed OR Float
// menu Visibility => Visible Or Hidden

/**
 * Set Map Height Function
 */
function setMapHeight() {
	var mapHeight = $window.height() - navHeight - 10;

	$map.css( 'height', mapHeight + 'px' );

}

/**
 * Check Menu Mode
 * @return {[type]} [description]
 */
function checkMenuMode( controlVisibility ){
	if( $window.width() < 768 ){
		$body.addClass( 'menu-float' );

		if( controlVisibility )
			$body.removeClass( 'menu-visible' );
	}
	else{
		$body.removeClass( 'menu-float' );

		if( controlVisibility )
			$body.addClass( 'menu-visible' );
	}
}

/**
 * Hide Side Menu
 * @return {[type]} [description]
 */
function hideSideMenu(){
	
	checkMenuMode();
	
	$body.removeClass( 'menu-visible' );

}

/**
 * Hide Side Menu
 * @return {[type]} [description]
 */
function showSideMenu(){
	checkMenuMode();
	
	$body.addClass( 'menu-visible' );
}

/**
 * On window resize
 * @param  {[type]} ( [description]
 * @return {[type]}   [description]
 */
$window.resize( () => {
	setMapHeight();

	checkMenuMode( true );
} );


// Toggle Menu Button
$bars.click( () => {

	if( $body.hasClass( 'menu-visible' ) ){
		hideSideMenu();

		// Trigger Event On Map Element, to use it anywhere if we want
		$map.trigger( 'menuModeChanged', 'hidden' )
	}
	else{
		showSideMenu();
		$map.trigger( 'menuModeChanged', 'visible' )
	}

} );

/**
 * Set Initial Height
 */
setMapHeight();

// Initial menu position
checkMenuMode( true );