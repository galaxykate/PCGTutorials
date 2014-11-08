/**
 * @author Kate Compton
 */

define(["common", "processing"], function(common, _processing) {'use strict';

    var JamboreeUI = {

        init : function() {
            var ui = this;

            ui.mouse = new Vector();
            this.createViews();

            $(document).keydown(function(e) {
                console.log("key " + e.which);

                var key = String.fromCharCode(event.which);

                if (e.which >= 48 && e.which <= 57)
                    app.loadTutorial(parseInt(key));

                switch(key) {
                    case " ":
                        app.paused = !app.paused;
                        break;

                }

            });

            this.mouseDown = 0;
            document.body.onmousedown = function() {++app.ui.mouseDown;

            };
            document.body.onmouseup = function() {--app.ui.mouseDown;
            };

            $(document).mouseleave(function() {
                console.log("Leave");
                app.ui.mouseDown = 0;

            });

            var container = $("#viewProcessing");

            // Mouse responses
            container.mousemove(function(ev) {
                var offset = $(this).offset();
                //or $(this).offset(); if you really just want the current element's offset
                var x = ev.pageX - offset.left;
                var y = ev.pageY - offset.top;

                ui.mouse.setTo(x - ui.width / 2, y - ui.height / 2);
                if (ui.mouseDown) {
                    if (app.tutorial.onDrag)
                        app.tutorial.onDrag(ui.mouse);
                } else {
                    if (app.tutorial.onMouseMove)
                        app.tutorial.onMouseMove(ui.mouse);
                }
            });

            container.click(function(ev) {
                if (app.tutorial.onClick)
                    app.tutorial.onClick(ui.mouse);

            });

            $("#forwardButton").click(function() {
                app.nextTutorial();
            });
            $("#backButton").click(function() {
                app.previousTutorial();
            });
        },

        //=====================================
        createViews : function() {
            var container = $("#viewProcessing");
            var canvas = container.get(0);

            // attaching the sketchProc function to the canvas
            this.processing = new Processing(canvas, function(g) {
                var w = container.width();
                var h = container.height();
                app.ui.width = w;
                app.ui.height = h;

                g.size(w, h);
                g.colorMode(g.HSB, 1);
                g.ellipseMode(g.CENTER_RADIUS);

                g.draw = function() {
                    app.update();
                    app.tutorial.update(app.time);

                    g.pushMatrix();
                    // Center the screen
                    g.translate(w / 2, h / 2);
                    app.tutorial.draw(g);

                    g.popMatrix();
                };
            });
        },

        update : function(time) {

        },
    };

    return JamboreeUI;
});
