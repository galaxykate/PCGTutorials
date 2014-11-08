/**
 * @author Kate Compton
 */

define(["common"], function(common) {'use strict';

    function createGrid(columns, rows) {
        var grid = [];
        for (var i = 0; i < columns; i++) {
            grid[i] = [];
            for (var j = 0; j < rows; j++) {
                grid[i][j] = 0;
            }
        }
        return grid;
    };

    function copyGrid(source, destination) {
        for (var i = 0; i < source.length; i++) {

            for (var j = 0; j < source[i].length; j++) {
                destination[i][j] = source[i][j];
            }
        }

    };

    var GameOfLife = Class.extend({
        init : function() {
            this.frame = 0;
            this.title = "The Game Of Life";
            this.subtitle = "Cellular Automata";

            this.columns = 54;
            this.rows = 33;
            this.cellSize = 15;
            this.grid = createGrid(this.columns, this.rows);
            this.next = createGrid(this.columns, this.rows);
            this.inject();

            this.drawSpot = new Vector(5, 5);
        },

        onClick : function(mouse) {
            console.log(mouse);
        },

        inject : function() {

            for (var i = 0; i < this.columns * this.rows * .55; i++) {
                var x = Math.floor(Math.random() * this.columns);
                var y = Math.floor(Math.random() * this.rows);
                this.grid[x][y] = Math.floor(Math.random() * 3);
            }
        },

        updateDrawSpot : function() {
            this.drawSpot.x += 1;
            if (Math.random() > .6)
                this.drawSpot.x -= 1;
            if (Math.random() > .5)
                this.drawSpot.y += 1;
            if (Math.random() > .5)
                this.drawSpot.y -= 1;

            this.drawSpot.x = (this.drawSpot.x + this.columns) % this.columns;
            this.drawSpot.y = (this.drawSpot.y + this.rows) % this.rows;

            //  console.log(this.drawSpot.x + " " + this.drawSpot.y);
            this.setLastAt(4, this.drawSpot.x, this.drawSpot.y);
        },

        update : function(t) {
            //   console.log(t.framecount); if (Math.random() > .6)

            this.updateDrawSpot();
            this.updateDrawSpot();
            this.updateDrawSpot();

            if (t.framecount % 10 === 0) {
                for (var i = 0; i < this.columns; i++) {
                    for (var j = 0; j < this.rows; j++) {
                        var v = this.getNextValue(i, j);

                        this.setAt(v, i, j);

                    }
                }

                copyGrid(this.next, this.grid);
            }

        },

        getNextValue : function(x, y) {

            var neighborCount = 0;
            for (var i = -1; i <= 1; i++) {
                for (var j = -1; j <= 1; j++) {
                    if (!(i === 0 && j === 0))
                        neighborCount += this.getAt(x + i, y + j);
                }
            }

            var v = this.getAt(x, y);
            switch(v) {
                case 0:
                    if (neighborCount === 3)
                        return 1;
                    return 0;
                case 1:
                    if (neighborCount <= 1)
                        return 0;
                    if (neighborCount >= 3)
                        return 0;

                    return 1;

                case 2:
                    return 1;
                case 3:
                    return 2;
                case 4:
                    return 3;
            }
            return 0;
        },

        setAt : function(val, x, y) {
            this.next[x%this.columns][y % this.rows] = val;
        },
        setLastAt : function(val, x, y) {
            this.grid[x%this.columns][y % this.rows] = val;
        },

        getAt : function(x, y) {
            x = (x + this.columns) % this.columns;
            y = (y + this.rows) % this.rows;
            // console.log(x + " " + y + " " + this.grid[x][y]);
            return this.grid[x][y];
        },

        draw : function(g) {
            this.frame++;

            g.background(.6, .2, 1);
            g.noStroke();
            g.pushMatrix();
            var spacing = 0;
            g.translate(-.5 * this.columns * (this.cellSize + spacing), -.5 * this.rows * (this.cellSize + spacing));
            for (var i = 0; i < this.columns; i++) {
                var x = i * (this.cellSize + spacing);

                for (var j = 0; j < this.rows; j++) {
                    var y = j * (this.cellSize + spacing);
                    this.drawGridCell(g, this.grid[i][j], x, y);

                }
            }

            g.popMatrix();
        },

        drawGridCell : function(g, type, x, y) {

            if (type === 0)
                g.fill(0);
            else
                g.fill(type * .2 + .3, .8, 1);
            g.rect(x, y, this.cellSize, this.cellSize);
        }
    });

    return GameOfLife;
});
