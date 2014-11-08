/**
 * @author Kate Compton
 */
define(["common"], function(common) {'use strict';
    var Flower = Class.extend({
        init : function(center, petalCount, drawPetal) {
            this.center = center;
            this.petalCount = petalCount;
            this.drawPetal = drawPetal;
            this.growthRate = Math.random() * .09 + .01;
            this.pct = 0;
            this.spiralAmt = Math.random();
            this.spiralWave = Math.random();
            this.spiral = 3 * (Math.random() - .5);
            this.waggleOffset = Math.random() * 2;
            this.widthWaggle = Math.random() * 2;
            this.widthMult = 1 + Math.random();
            this.centerHue = Math.random();
            this.petalLength = Math.random() * 50 + 30;
        },
        grow : function(g) {
            g.pushMatrix();
            g.translate(this.center.x, this.center.y);
            g.rotate(this.spiral * this.pct);
            if (this.pct === 0) {
                g.fill(Math.random(), .8, .4, .2);
                g.ellipse(0, 0, 50, 50);
            }
            g.fill(this.centerHue, 1 - .4 * this.pct, .3 + .6 * this.pct, .2);
            var centerR = 30 * (1 - this.pct);
            g.ellipse(0, 0, centerR, centerR);
            this.pct += this.growthRate;
            var theta = Math.PI * 2 / this.petalCount;
            for (var i = 0; i < this.petalCount; i++) {
                g.rotate(theta);
                this.drawPetal(g, this.pct);
            }
            g.popMatrix();
        }
    });

    var Flowers = Class.extend({

        init : function() {
            this.frame = 0;
            this.title = "Flowers";
            this.subtitle = "Generative flowers";
            this.flowers = [];
            for (var i = 0; i < 7; i++) {
                this.flowers[i] = this.createFlower();
            }
        },

        createFlower : function() {
            var startColor = Math.random();
            var center = new Vector(utilities.random(-300, 300), utilities.random(-200, 200));
            var flower = new Flower(center, 7, function(g, pct) {
                g.noStroke();
                var hue = (pct * .3 + startColor ) % 1;
                var r = this.widthMult * 10 * Math.abs(Math.sin(pct * 2 * this.widthWaggle + 4 * this.waggleOffset)) + 3;
                var x = 30 * this.spiralAmt * Math.sin(6 * pct * this.spiralWave) * pct;
                g.fill(hue, 1, 1 - .8 * pct, .3);
                g.ellipse(x, pct * this.petalLength, r, r);
                g.fill(hue, .5, 1.2 - .5 * pct, .7);
                g.ellipse(x, pct * this.petalLength + 6, r * .4, r * .8);
            });
            return flower;
        },
        
        update : function(t) {
        },

        draw : function(g) {

            if (this.frame === 0)
                g.background(.4, .3, 1);
            this.frame++;

            // Make a fading background rectangle
            if (app.time.framecount % 15 === 0) {
                var pastel = .5 + .5 * Math.sin(this.frame * .2);
                g.fill(.4, pastel + .5, 1 - pastel, .04);
                g.rect(-.5 * g.width, -.5 * g.height, g.width, g.height);
            }
            for (var i = 0; i < this.flowers.length; i++) {
                this.flowers[i].grow(g);
                if (this.flowers[i].pct > 1)
                    this.flowers[i] = this.createFlower();
            }
        }
    });
    return Flowers;
});
