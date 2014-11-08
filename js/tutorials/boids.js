/**
 * @author Kate Compton
 */

define(["common"], function(common) {'use strict';
    var neighborRange = 250;
    var gravityRange = 250;

    function drawKiteShape(g, w, x0, xW, x1) {
        g.beginShape(g.TRIANGLE_STRIP);
        g.vertex(xW, w);
        g.vertex(x0, 0);
        g.vertex(x1, 0);
        g.vertex(xW, -w);
        g.endShape();
    }

    var boidCount = 0;
    var forceNames = ["gravity", "cohesion", "wander", "alignment", "separation", "acceleration"];

    var Boid = Vector.extend({

        init : function(center, angle) {
            this.id = boidCount;
            boidCount++;

            this.drag = .02;
            this.flapPct = 0;

            this.setTo(center);
            this.angle = angle;
            this.velocity = Vector.polar(50, this.angle);
            this.force = new Vector();

            this.forces = {
                separation : new Vector(),
                acceleration : new Vector(),
                cohesion : new Vector(),
                alignment : new Vector(),
                gravity : new Vector(),
                wander : new Vector(),
            };

            this.speed = 1 + Math.random();
            this.neighbors = 0;
            this.neighborCenter = new Vector();
        },

        setForces : function(t) {
            this.force.mult(0);

            // Gravity
            var distance = this.magnitude();
            this.forces.gravity.mult(0);
            if (distance > gravityRange) {

                this.forces.gravity.setToMultiple(this, -Math.pow(distance - gravityRange, 2) / distance);
            }

            // Calculate center of neighbor mass
            this.neighborCenter.setToAverage(this.neighbors);
            this.forces.cohesion.setToDifference(this.neighborCenter, this);
            this.forces.cohesion.mult(3);

            this.forces.separation.mult(0);
            var range = 200;
            var offset = new Vector();

            var neighborDir = new Vector();
            for (var i = 0; i < this.neighbors.length; i++) {
                var b = this.neighbors[i];
                offset.setToDifference(this, b);
                var distance = offset.magnitude();

                var pctInside = Math.max(0, range - distance) / range;
                if (distance > 0) {
                    var strength = Math.pow(pctInside, 2) * 300;
                    this.forces.separation.addMultiple(offset, strength / distance);
                }

                neighborDir.addPolar(1, b.angle);
            }
            neighborDir.div(this.neighbors.length);
            if (this.neighbors.length > 0)
                this.forces.alignment.setToMultiple(neighborDir, 100);

            this.forces.acceleration.setToPolar(100*this.speed, this.angle);
            // Add all the forces
            for (var i = 0; i < forceNames.length; i++) {
                this.force.add(this.forces[forceNames[i]]);
            }

        },

        update : function(t) {
            this.velocity.addMultiple(this.force, t.elapsed);

            this.addMultiple(this.velocity, t.elapsed);
            this.velocity.mult(1 - this.drag);
            if (this.velocity.magnitude() > 0)
                this.angle = this.velocity.getAngle();

            this.flapPct += this.speed * t.elapsed;
        },

        updateNeighborList : function(flock) {
            this.neighbors = [];
            for (var i = 0; i < flock.length; i++) {
                if (flock[i] !== this && this.getDistanceTo(flock[i]) < neighborRange)
                    this.neighbors.push(flock[i]);
            }
        },

        drawBG : function(g) {

            g.strokeWeight(1);
            for (var i = 0; i < forceNames.length; i++) {
                g.stroke((i * .38 + .3) % 1, 1, 1);
                g.fill((i * .38 + .3) % 1, 1, 1);
                this.drawArrow(g, this.forces[forceNames[i]], .2, 10);
            }

            if (this.isSelected) {
                // Draw a line to each neighbor
                for (var i = 0; i < this.neighbors.length; i++) {
                    g.stroke(.85, 1, 1, .3);
                    g.strokeWeight(2);
                    this.drawLineTo(g, this.neighbors[i]);
                }

            }

        },

        draw : function(g) {
            g.fill(0);

            if (this.isSelected) {
                g.fill(.89, 1, 1);
            }
            g.noStroke();
            g.pushMatrix();

            this.translateTo(g);
            g.rotate(this.angle);
            // Draw a flapping kite shape

            var flap = 1 + Math.sin(this.flapPct*10 + this.id);
            drawKiteShape(g, 9 + 5 * flap, -5, -15 + flap * 4, 20);
            g.popMatrix();

        }
    });

    var Boids = Class.extend({
        init : function() {
            this.frame = 0;
            this.title = "Boids";
            this.subtitle = "Sensing and moving agents";
            this.boids = [];
            for (var i = 0; i < 20; i++) {
                this.boids[i] = this.spawnBoid();
            }
        },

        spawnBoid : function() {

            var x = 300 * (Math.random() - .5);
            var y = 200 * (Math.random() - .5);
            return new Boid(new Vector(x, y), Math.random() * 2 * Math.PI);
        },

        update : function(t) {

            // Every few frames, recalculate all the closest boids
            if (this.frame % 10 === 0) {
                console.log("Update neighbors");
                for (var i = 0; i < this.boids.length; i++) {
                    this.boids[i].updateNeighborList(this.boids);
                }
            }

            this.frame++;
            for (var i = 0; i < this.boids.length; i++) {
                this.boids[i].setForces(t);
            }
            for (var i = 0; i < this.boids.length; i++) {
                this.boids[i].update(t);
            }

        },

        draw : function(g) {

            this.boids[0].isSelected = true;

            g.background(.9, .2, 1);
            for (var i = 0; i < this.boids.length; i++) {
                this.boids[i].drawBG(g);
            }

            for (var i = 0; i < this.boids.length; i++) {
                this.boids[i].draw(g);
            }

        },
    });

    return Boids;
});
