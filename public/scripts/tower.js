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
        damage: 1,
        showRange: false,
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

    that.head.src = headTexture;
    that.base.src = baseTexture;
    that.proj.src = projTexture;

    that.head.onload = function(){ready[0] = true};
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
                image: that.head,
                pos: that.pos,
                width: that.width,
                height: that.height,
                rotation: that.rotation + that.orientation
            });
            for(let i = 0; i < projectiles.length; i++){
                projectiles[i].render(dTime)
            }
            if(that.showRange){
                graphics.drawCircle('rgba(255, 16, 16, 0.7)', that.pos.x, that.pos.y, that.range);
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
                    fire();
                    eTime %= that.rate;
                }
            }
        }
    };

    function fire(){
        projectiles.push(Projectile(that.damage, that.pos.x, that.pos.y, that.target, that.proj));
    }

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
    let that = parentTower('assets/textures/turrets/turret-1-1.png', 'assets/textures/greenbullet.png');
    that.range = 100;
    that.rate = 250;
    that.damage = 3;
    that.price = 5,
    that.type = 'Gun Tower';
    return that;
};

slugTower = function(){
    let that = parentTower('assets/textures/turrets/turret-7-1.png', 'assets/textures/yellowbullet.png');
    that.range = 250;
    that.rate = 800;
    that.damage = 40;
    that.price = 20;
    that.type = 'Slug Tower';
    return that;
};

laserTower = function(){
    let that = parentTower('assets/textures/turrets/turret-5-1.png', 'assets/textures/bluebullet.png');
    that.range = 80;
    that.rate = 30;
    that.damage = 0.5;
    that.price = 15;
    that.type = 'Laser Tower';
    return that;
};

let towers = {
    'Laser Tower': laserTower,
    'Slug Tower': slugTower,
    'Gun Tower': gunTower
}