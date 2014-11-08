/**
 * @author Kate Compton
 */

define(["common"], function(common) {'use strict';

    var Terrain = Class.extend({
        init : function() {
             this.title = "Terrain";
            this.subtitle = "Making the ground move";

        },

        update : function(t) {

        },

        draw : function(g) {

            g.background(.38, 1, .51);

        },
    });

    return Terrain;
});
