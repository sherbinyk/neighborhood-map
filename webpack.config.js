let path = require( 'path' );
let webpack = require('webpack');

let textPluginClass = require( 'extract-text-webpack-plugin' );

let textPlugin = new textPluginClass({
	filename: 'css/app.css'
});

let clenWebpackPlugin = require( 'clean-webpack-plugin' )

module.exports = {
	entry: './src/js/index.js',
	output: {
		path: path.resolve( __dirname, 'dist' ),
		filename: 'js/app.bundle.js',
		publicPath: '/dist/'
	},

	module: {
		rules: [

			/**
			 * Rule for js files
			 */
			{
				test: /\.js$/,
				use: {
					loader: 'babel-loader',
					options: {
						presets: [ 'es2015' ]
					}
				}
			},

			/**
			 * Rule for scss Files
			 */
			{
				test: /\.scss$/,
				loader: textPlugin.extract({
					use: [ 'css-loader', 'sass-loader' ]
				})
			},

			/**
			 * Rule for css Files
			 */
			{
				test: /\.css$/,
				loader: textPlugin.extract({
					use: [ 'css-loader' ]
				})
			},

			/**
			 * Rule for Fonts Files
			 */
			{
			  test: /\.(woff2?|ttf|eot|svg)(\?v=\d+\.\d+\.\d+)?$/,
			  loader: "file-loader?name=fonts/[name].[ext]",
			},

			/**
			 * Rule for Fonts Files
			 */
			{
			  test: /\.(png|jpg|jpeg|gif)(\?v=\d+\.\d+\.\d+)?$/,
			  use: {
			  	loader: 'file-loader',
			  	options: {
			  		outputPath: 'images/',
			  		name: '[name].[ext]',
			  		publicPath: 'images/'
			  	}
			  }
			},

			
		],
	},

	plugins: [
		textPlugin,

		/**
		 * Map Packages as global JS Variables
		 * @type {String}
		 */
		new webpack.ProvidePlugin({
			$: 'jquery',
			jQuery: 'jquery',

			GoogleMapsLoader: 'google-maps',
		}),


		new clenWebpackPlugin( ['dist'] )
	]
}