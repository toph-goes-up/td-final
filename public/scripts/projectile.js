/**
 * Created by Chris on 4/21/2018.
 */

function Projectile(damage, x, y, target, img){
    let that = {
        pos: {x: x, y: y},
        rotation: 0,
        width: 5,
        height: 5,
        image: img,
        speed: 5,
        damage: damage,
        target: target,
        destroyed: false
    };

    that.update = function(dTime){
        let theta = toolkit.computeDirection(that.pos, that.target.pos);
        let dir = {x: Math.cos(theta), y: Math.sin(theta)};

        // Move in the direction specified by dir
        that.pos.x += dir.x*that.speed;
        that.pos.y += dir.y*that.speed;

        if(!that.target || that.target.destroyed){
            that.destroyed = true;
        }

        else if(toolkit.distance(that.pos, that.target.pos) < that.target.width){
            that.collide();
        }
    };

    that.collide = function() {
        that.destroyed = true;
        that.target.damage(that.damage);
    };

    that.render = function(dTime){
        App.graphics.drawImage(that)
    };

    return that;
}