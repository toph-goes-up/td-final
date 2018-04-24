/**
 * Created by Chris on 4/18/2018.
 */

let Creep = function(texture, width, height, spec){
    let actor = Actor(texture, width, height, spec);
    let that = {
        width: width,
        height: height,
        speed: 0.06,
        orientation: 0,
        rotation: 0,
        pos: actor.pos,
        target: {x:0, y: 0},
        path: null,
        stepPos: null,
        destroyed: false,
        health: 10,
        damageTaken: 0,
        bounty: 0
    };

    let cellSize = App.management.canvas.width / App.settings.nGridCells;

    that.updatePath = function(){
        that.path = App.board.shortestPath(that.pos, that.target);
    };

    that.damage = function(damage){
        that.damageTaken += damage;
        if(that.health <= that.damageTaken){
            that.destroyed = true;
            emitter(deathSpec(that.pos));
            App.controller.cash += that.bounty;
        }
    };

    that.update = function(dTime){
        actor.update(dTime);

        if(that.pos.x < App.management.canvas.width && that.pos.y < App.management.canvas.height){
            // If creep has reached the opposite door, aim off the map
            if(that.path.length === 0){
                if(that.target.y > that.target.x) that.rotation = .5*Math.PI;
                else that.rotation = 0;
            }
            // Otherwise, aim at the next part of the path
            else {
                // Calculate the next step position. This could do with some optimization if I find time.
                let stepCell = that.path[that.path.length - 1];
                that.stepPos = {x: (0.5 + stepCell.x) * cellSize, y: (0.5 + stepCell.y) * cellSize};

                // If we're close to the next step in the path, delete it and aim for the next next step.
                if (toolkit.distance(that.pos, that.stepPos) < 0.5*cellSize){
                    that.path.length -= 1;
                }

                that.rotation = toolkit.computeDirection(this.pos, that.stepPos);
            }

            // Create normal direction vector
            let theta = that.rotation + that.orientation;
            let dir = {x: Math.cos(theta), y: Math.sin(theta)};

            // Move in the direction specified by dir
            that.pos.x += dir.x*that.speed*dTime;
            that.pos.y += dir.y*that.speed*dTime;
            actor.pos = that.pos;
        }
        else{
            App.controller.lives--;
            that.destroyed = true;
        }
    };

    that.render = function(dTime){
        // Draw creeps path for debugging
        /*
        if(that.pos.x < App.management.canvas.width && that.pos.y < App.management.canvas.height) {
            let path = App.board.shortestPath(that.pos, that.target);
            toolkit.drawPath(path);
            App.graphics.drawRect('rgba(0, 255, 0, 1)', that.pos.x, that.pos.y, 10, 10)
        }
        */
        // Manually update the actors rotation.
        // Necessary because rotation is a number, so it is passed by value rather than reference.
        actor.rotation = that.rotation;
        actor.render(dTime);

        App.graphics.drawRect('red', that.pos.x, that.pos.y - that.height/3, that.width, that.width/5);
        let percentDamage = that.damageTaken / that.health;
        App.graphics.drawRect('green', that.pos.x - (that.width*percentDamage/2), that.pos.y - that.height/3, that.width*(1-percentDamage), that.width/5);
    };
    return that
};

let NormalCreep = function(pos){
    let  creep = Creep('assets/textures/creep/creep-1-blue/sheet.png', 25, 25, normalCreepSpec);
    creep.pos = pos;
    creep.health = 90;
    creep.speed = .06;
    creep.target = {x: App.management.canvas.width - pos.x, y: App.management.canvas.height - pos.y};
    creep.rotation = toolkit.computeDirection(creep.pos, creep.target);
    creep.bounty = 1;
    creep.updatePath();

    return creep;
};

let HeavyCreep = function(pos){
    let  creep = Creep('assets/textures/creep/creep-3-red/sheet.png', 35, 35, heavyCreepSpec);
    creep.pos = pos;
    creep.health = 800;
    creep.speed = 0.02;
    creep.target = {x: App.management.canvas.width - pos.x, y: App.management.canvas.height - pos.y};
    creep.rotation = toolkit.computeDirection(creep.pos, creep.target);
    creep.bounty =  8;
    creep.updatePath();

    return creep;
};

let FlyingCreep = function(pos){
    let  creep = Creep('assets/textures/creep/creep-2-yellow/sheet.png', 25, 25, flyingCreepSpec);
    creep.pos = pos;
    creep.health = 120;
    creep.speed = 0.04;
    creep.target = {x: App.management.canvas.width - pos.x, y: App.management.canvas.height - pos.y};
    creep.rotation = toolkit.computeDirection(creep.pos, creep.target);
    creep.bounty =  4;

    creep.updatePath = function(){
        creep.path = App.board.shortestPath(creep.target, creep.target);
    };

    creep.updatePath();

    return creep;
};

let Creeps = {
    NormalCreep: NormalCreep,
    HeavyCreep: HeavyCreep,
    FlyingCreep: FlyingCreep
};

let deathSpec = function(pos) {
    return {
        anchor: null,
        lifetime: 100,
        density: 70,
        pos: pos,
        shape: {width: 5, height: 5},
        speed: {mean: .2, sd: .1},
        accel: {mean: 0.7, sd: 0},
        size: {mean: 5, sd: .2},
        particleLifetime: {mean: 200, sd: 100},
        fill: 'rgba(255, 0, 0, .5)',
        texture: 'assets/textures/yellowbullet.png'
    }
};

let normalCreepSpec = {
    spriteCount: 6,
    size: {width: 46, height: 46},
    timing: [500, 150, 150, 150, 150, 150]
};

let heavyCreepSpec = {
    spriteCount: 4,
    size: {width: 46, height: 46},
    timing: [1000, 200, 200, 200]
};

let flyingCreepSpec = {
    spriteCount: 4,
    size: {width: 46, height: 46},
    timing: [200, 1000, 200, 600]
};
