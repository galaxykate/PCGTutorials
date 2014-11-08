/**
 * @author Kate Compton
 */

define(["common"], function(common) {'use strict';

    // Tree drawing

    var Branch = Class.extend({
        init : function(settings) {
            this.pct = 0;
            this.side = 0;
            this.growthRate = 1;
            this.depth = 0;

            $.extend(this, settings);
            this.settings = settings;

            this.currentLength = 0;
            this.children = [];
            this.updateCount = 0;
            this.endSize = this.size * .6;

            this.lastPoint = new Vector(this.root);
            this.currentPoint = new Vector(this.root);
            this.currentSize = this.size;
            this.totalLength = this.size * this.length;

        },

        drawSelf : function(g) {

            if (this.updateCount == 1 && this.depth === 0) {
                for (var i = 0; i < 4; i++) {
                     g.fill(0, 0, 0, 1/(i*i + 1));
               var pct = .1*Math.pow(i + 2, 2);
                    g.ellipse(this.root.x, this.root.y, pct * 5 * this.size, pct * 1.2 * this.size);

                }
            }

            this.currentLength = Math.min(this.currentLength + this.growthRate * this.size, this.totalLength);
            this.currentAngle = this.rootDir;

            var distance = this.growthRate * this.size;

            // Make the angle wiggle
            this.currentAngle += .3 * Math.sin(.3 * this.updateCount);

            // Make the tree curly
            this.currentAngle += this.branchCurl * this.updateCount * this.side;

            // Make the tree droopy
            // this.currentPoint.y += .8 * Math.pow(this.currentSize, .6);

            this.currentPoint.addPolar(distance, this.currentAngle);

            this.currentSize = utilities.lerp(this.size, this.endSize, this.pct);

            // Draw the circle
            this.idColor.fill(g);
            this.currentPoint.drawCircle(g, this.currentSize, this.currentSize);

        },

        drawChildren : function(g) {
            var allFinished = true;
            for (var i = 0; i < this.children.length; i++) {
                this.children[i].draw(g);

                // Any children not finished?
                if (!this.children[i].isFinished)
                    allFinished = false;
            }

            if (allFinished)
                this.isFinished = true;
        },

        spawnChild : function(side) {

            var settings = jQuery.extend({}, this.settings);
            settings.side = side;
            settings.rootDir = this.currentAngle + this.branchAngle * side;
            settings.root = new Vector(this.currentPoint);
            settings.size = this.currentSize;
            settings.depth = this.depth + 1;
            settings.growthRate = this.growthRate * .8, this.children.push(new Branch(settings));
        },

        draw : function(g) {

            // Still have some to draw?
            if (this.currentSize > 1) {

                this.updateCount++;
                this.lastPoint.setTo(this.currentPoint);

                this.pct = this.currentLength / this.totalLength;

                if (this.pct < 1) {
                    this.drawSelf(g);

                } else {
                    if (this.children.length === 0) {
                        this.spawnChild(-1);
                        this.spawnChild(1);
                    } else {
                        this.drawChildren(g);
                    }
                }
            } else {
                this.isFinished = true;
            }
        }
    });

    var LTrees = Class.extend({
        init : function() {
            console.log("Start trees");
            this.frame = 0;
            this.title = "L-Trees";
            this.subtitle = "Growing trees";

            this.trees = [];

            for (var i = 0; i < 5; i++) {
                this.trees[i] = this.spawnTree();
            }

            console.log(this);
        },

        onClick : function(mouse) {
            console.log("Click! " + mouse);
            var tree = this.spawnTree(mouse);
            this.trees.push(tree);
        },

        spawnTree : function(pos) {
            if (!pos) {
                var pct = .1 * this.frame * .01;
                var y = pct * 180 + 30;
                var x = 200 * (Math.random() - .5);
                x *= (2 + pct);
                pos = new Vector(x, y);
            }

            var pct = (pos.y - 30) / 180;

            console.log(pos);

            return new Branch({
                root : pos,
                rootDir : -Math.PI / 2,
                size : 10 * (pct + .4 ) * (1 + .3 * Math.random()),
                length : 10 + Math.random() * 20,
                branchAngle : .2 + Math.random() * .4,
                branchCurl : .03 + Math.random() * .07,
                wiggle : Math.random(),
                idColor : new common.KColor(Math.random(), .0, Math.random() * .2),
            });

        },
        update : function(t) {
            for (var i = 0; i < this.trees.length; i++) {
                if (this.trees[i] && this.trees[i].isFinished) {
                    if (this.frame < 1200)
                        this.trees[i] = this.spawnTree();
                }
            }
        },
        draw : function(g) {
            if (this.frame === 0)
                g.background(.6, .2, 1);
            this.frame++;

            // Make a fading background rectangle
            if (app.time.framecount % 10 === 0) {
                g.fill(.6, .1, .8, .05);
                g.rect(-.5 * g.width, -.5 * g.height, g.width, g.height);
            }

            //   g.background(.6, .2, 1);
            g.noStroke();
            for (var i = 0; i < this.trees.length; i++) {
                if (this.trees[i] !== undefined)
                    this.trees[i].draw(g);
            }

        },
    });

    return LTrees;
});
