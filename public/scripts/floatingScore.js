/**
 * Created by Chris on 4/23/2018.
 */

let FloatingScore = function(score, pos){
    let that = {
        pos: pos,
        destroyed: false
    };

    let eTime = 0;

    that.update = function(dTime){
        that.pos.y -= dTime * .03;
        eTime += dTime;
        if(eTime >= 1000){
            that.destroyed = true;
        }
    };

    that.render = function(){
        let ctx = App.management.ctx;
        ctx.save();
        ctx.font = '14px Monospace';
        ctx.fontWeight = 200;
        ctx.fillStyle = 'white';
        ctx.strokeStyle = 'white';
        ctx.textAlign = 'center';
        ctx.fillText(score, that.pos.x, that.pos.y);
        ctx.restore();
    };

    App.screens.game.actors.push(that);
    return that;
};