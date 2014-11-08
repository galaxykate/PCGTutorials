/**
 * @author Kate Compton
 */

var app = {};

define(["./jamboreeUI", "./settings", "./tutorials/tutorials"], function(UI, _settings, tutorials) {'use strict';

    // Active tutorials
    var tutorialNames = ["GameOfLife", "Flowers", "LTrees", "Terrain", "Boids"];
    // Starting
    var tutorialIndex = null;

    app.init = function() {
        console.log("Init Jamboree App");
        app.time = {
            total : 0,
            framecount : 0,
            elapsed : .1,
        };

        app.elapsed = .001;
        app.ui = UI;
        app.ui.init();

        var appContainer = $("#app");
        app.w = appContainer.width();
        app.h = appContainer.height();

        app.startTime = new Date().getTime();

        var startIndex = localStorage.getItem("lastTutorial");
        if (startIndex === null)
            startIndex = 0;

        app.loadTutorial(startIndex);

    };

    app.loadTutorial = function(index) {
        console.log("Load " + index);
        tutorialIndex = index;
        var type = tutorialNames[index];
        app.tutorial = new tutorials[type]();
        $("#title").html(app.tutorial.title);

        localStorage.setItem("lastTutorial", index);

    };

    app.nextTutorial = function() {
        tutorialIndex = (tutorialIndex + 1) % tutorialNames.length;
        app.loadTutorial(tutorialIndex);
    };

    app.previousTutorial = function() {
        tutorialIndex = (tutorialNames.length + tutorialIndex - 1) % tutorialNames.length;
        app.loadTutorial(tutorialIndex);
    };

    app.setTime = function() {
        app.time.framecount++;

        var last = app.time.total;
        app.time.total = (new Date().getTime() - app.startTime) * .001;
        app.time.elapsed = app.time.total - last;

    };

    app.update = function() {
        app.setTime();
        app.ui.update(app.time);

    };
});
