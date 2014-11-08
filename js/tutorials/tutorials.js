/**
 * @author Kate Compton
 */

define(["common", "./gameOfLife", "./flowers", "./lTrees", "./boids", "./terrain"], function(common, GameOfLife, Flowers, LTrees, Boids, Terrain) {'use strict';

    return {
        GameOfLife : GameOfLife,
        Flowers : Flowers,
        Boids : Boids,
        LTrees : LTrees,
        Terrain : Terrain,

    };

});
