/**
 * @author Kate Compton
 */
/**
 * @author Kate Compton
 */

require.config({
    paths : {
        'threeJS' : 'libs/three',
        'jQuery' : 'libs/jquery-1.10.1',
        'jQueryUI' : 'libs/jquery-ui',
        'mousewheel' : 'libs/jquery.mousewheel.min',

        'underscore' : 'libs/underscore',

        'processing' : 'libs/processing-1.4.1',
        'dancer' : 'libs/dancer',
        'inheritance' : 'libs/inheritance',
        'noise' : 'libs/simplex_noise',
        'react' : 'libs/react',

        'common' : 'commonUtils/commonUtils'
    },
    shim : {

        'jQueryUI' : {
            exports : '$',
            deps : ['jQuery']
        },
        'mousewheel' : {
            exports : '$',
            deps : ['jQueryUI']
        },

        'inheritance' : {
            exports : 'Inheritance'
        },

        'react' : {
            exports : 'React'
        },

    }
});

require(["./app"], function(_app) {

    app.init();
    console.log("Start");

});
