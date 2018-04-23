/**
 * Created by Chris on 4/7/2018.
 */
toolkit = (function() {
    let that = {};

    // Get a normally distributed random number.
    that.gaussian = function (mean, sd) {
        let a = 0;
        for (let i = 0; i < 6; i++) {
            a += (mean + (Math.random() - 0.5) * sd * 4);
        }
        a /= 6;
        return a;
    };

    // Get a uniformly distributed random number.
    that.uniform = function (min, max) {
        return Math.random() * (max - min) + min;
    };

    // Get a random unit vector.
    that.circleVector = function () {
        let angle = Math.random() * 2 * Math.PI;
        return {
            x: Math.cos(angle),
            y: Math.sin(angle)
        };
    };

    that.coin = function(){
        return Math.random() > 0.5;
    };

    that.computeDirection = function(s, t) {
        return Math.atan2(t.y - s.y, t.x - s.x);
    };

    that.distance = function(s, t){
        return(Math.sqrt((t.y - s.y)**2 + (t.x - s.x)**2));
    };

    that.drawPath = function (sPath){
        let cellSize = App.management.canvas.width / App.settings.nGridCells;
        for (let i = 0; i < sPath.length; i++) {
            App.graphics.drawRect('yellow', (0.5 + sPath[i].x) * cellSize, (0.5 + sPath[i].y) * cellSize, 5, 5);
        }
    };

    that.constrain = function(a, min, max){
        if(a < min) return min;
        else if(a > max) return max;
        else return a;
    };

    return that;
}());