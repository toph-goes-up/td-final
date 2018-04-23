/**
 * Created by Chris on 3/26/2018.
 */

App.management = (function(screens){
    let that = {};
    that.canvas = document.getElementById('game-canvas');
    that.ctx = that.canvas.getContext('2d');
    that.gameInfo = {};

    CanvasRenderingContext2D.prototype.clear = function() {
        this.save();
        this.setTransform(1, 0, 0, 1, 0, 0);
        this.clearRect(0, 0, that.canvas.width, that.canvas.height);
        this.restore();
    };

    that.showScreen = function(screen){
        let active = null;

        // Deactivate the active screen
        active = document.getElementsByClassName('active');
        for(let i = 0; i < active.length; i++){
            active[i].classList.remove('active');
        }

        // Start the screen's JS side
        if(screens[screen].hasOwnProperty('run')){
            screens[screen].run();
        }

        // Set it as the active css class
        document.getElementById(screen).classList.add('active');
    };

    that.init = function(){
        let screen = null;

        // Initialize all screens that have and init function
        for(screen in screens){
            if(screens[screen].hasOwnProperty('init')){
                screens[screen].init();
            }
        }

        // Set the screen to the menu
        that.showScreen('main-menu');
    };

    that.getMousePos = function(e){
        let rect = that.canvas.getBoundingClientRect();
        return {
            x: e.clientX - rect.left,
            y: e.clientY - rect.top
        }
    };

    //Snap the current mouse position to a 2x2 position on the grid
    that.snapToBlock = function(pos){
        let gridSize = that.canvas.width/App.settings.nGridCells;
        let x = Math.floor(0.5 + pos.x/gridSize) * gridSize;
        let y = Math.floor(0.5 + pos.y/gridSize) * gridSize;
        return {x, y}
    };

    return that;
}(App.screens));