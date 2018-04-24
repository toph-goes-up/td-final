/**
 * Created by Chris on 4/16/2018.
 */

let parentTower = function(headTexture, projTexture){
    let graphics = App.graphics;
    let that = {
        width: 2 * App.management.canvas.width / App.settings.nGridCells,
        height: 2 * App.management.canvas.height / App.settings.nGridCells,
        pos: {x: 0, y: 0},
        rotation: 0,
        orientation: 0.5*Math.PI,
        type: null,
        price: 0,
        range: 0,
        rate: 500,
        level: 0,
        damage: 1,
        active: false,
        target: null,
        head: new Image,
        base: new Image,
        proj: new Image,
        destroyed: false
    };

    let eTime = 0;
    let ready = [false, false];
    let projectiles = [];
    let baseTexture = 'assets/textures/turrets/turret-base.gif';

    let heads = [
        new Image,
        new Image,
        new Image
    ];

    heads[0].src = headTexture + '-1.png';
    heads[1].src = headTexture + '-2.png';
    heads[2].src = headTexture + '-3.png';

    that.base.src = baseTexture;
    that.proj.src = projTexture;

    heads[0].onload = function(){ready[0] = true};
    that.base.onload = function(){ready[1] = true};
    that.proj.onload = function(){ready[2] = true};

    that.render = function(dTime){
        if(ready[0] && ready[1] && ready[2]){
            //Draw tower base
            graphics.drawImage({
                image: that.base,
                pos: that.pos,
                width: that.width,
                height: that.height,
                rotation: 0
            });
            //Draw tower head
            graphics.drawImage({
                image: heads[that.level],
                pos: that.pos,
                width: that.width,
                height: that.height,
                rotation: that.rotation + that.orientation
            });
            for(let i = 0; i < projectiles.length; i++){
                projectiles[i].render(dTime)
            }
        }
    };

    that.update = function(dTime){
        let keep = [];
        for(let i = 0; i < projectiles.length; i++){
            projectiles[i].update(dTime);
            if(!projectiles[i].destroyed){
                keep.push(projectiles[i]);
            }
        }
        projectiles = keep;

        if(that.active){
            findTarget();
            if (that.target !== null) {
                that.rotation = toolkit.computeDirection(that.pos, that.target.pos);
                eTime += dTime;
                if(eTime >= that.rate){
                    that.fire();
                    eTime %= that.rate;
                }
            }
        }
    };

    that.upgrade = function(){
        if(that.level < 2){
            that.level++;
            that.price = Math.floor(that.price*1.7);
            that.levelUp();
        }
    };

    that.levelUp = function(){};

    that.showRange = function() {
        graphics.drawCircle('rgba(255, 16, 16, 0.7)', that.pos.x, that.pos.y, that.range);
    };

    that.addProjectile = function(p){
        projectiles.push(p)
    };

    that.fire = function(){
        that.addProjectile(Projectile(that.damage, that.pos.x, that.pos.y, that.target, that.proj));
    };

    function findTarget(){
        let creeps = App.screens.game.creeps;
        let inRange = [];
        that.target = null;
        for(let i = 0; i < creeps.length; i++){
            if(toolkit.distance(that.pos, creeps[i].pos) <= that.range && !creeps[i].destroyed){
                if(that.target === null || creeps[i].path.length < that.target.path.length){
                    that.target = creeps[i]
                }
            }
        }
    }

    return that;
};

gunTower = function(){
    let that = parentTower('assets/textures/turrets/turret-1', 'assets/textures/greenbullet.png');
    that.range = 100;
    that.rate = 250;
    that.damage = 2.5;
    that.price = 5;
    that.type = 'Gun Tower';
    that.levelUp = function(){
        that.damage += 1;
        that.rate -= 20;
        that.range += 20;
    };

    return that;
};

slugTower = function(){
    let that = parentTower('assets/textures/turrets/turret-7', 'assets/textures/yellowbullet.png');
    that.range = 250;
    that.rate = 800;
    that.damage = 60;
    that.price = 20;
    that.type = 'Slug Tower';
    that.levelUp = function(){
        that.damage += 10;
        that.range += 40;
    };
    return that;
};

laserTower = function(){
    let that = parentTower('assets/textures/turrets/turret-5', 'assets/textures/bluebullet.png');
    that.range = 80;
    that.rate = 25;
    that.damage = 1.2;
    that.price = 15;
    that.type = 'Laser Tower';
    that.levelUp = function(){
        that.damage += .2;
        that.range += 20;
    };
    return that;
};

blastTower = function(){
    let that = parentTower('assets/textures/turrets/turret-3', 'assets/textures/yellowbullet.png');
    that.range = 120;
    that.rate = 1000;
    that.damage = 20;
    that.price = 40;
    that.blastRadius = 50;
    that.type = 'Blast Tower';
    that.levelUp = function(){
        that.damage += 8;
        that.rate -= 100;
        that.blastRadius += 20;
    };

    that.fire = function(){
        let p = Projectile(that.damage, that.pos.x, that.pos.y, that.target, that.proj);
        p.speed = 3;
        p.width = 10;
        p.height = 10;

        p.collide = function() {
            if (toolkit.distance(p.pos, p.target.pos) < p.target.width || p.target.destroyed) {
                // Damage all creeps in range of the explosion

                let creeps = App.screens.game.creeps;
                for (let i = 0; i < creeps.length; i++){
                    if (toolkit.distance(p.pos, creeps[i].pos) <= that.blastRadius && !creeps[i].destroyed) {
                        creeps[i].damage(p.damage)
                    }
                }
            }
            emitter(deathSpec(p.pos));
            p.destroyed = true;
        };

        that.addProjectile(p);
    };

    return that;
};

let towers = {
    'Laser Tower': laserTower,
    'Slug Tower': slugTower,
    'Gun Tower': gunTower,
    'Blast Tower': blastTower
};