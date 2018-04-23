/**
 * Created by Chris on 4/21/2018.
 */

App.level = (function(game){
    let that = {
        active: false
    };
    let level = 0;
    let spawnRate = 500;
    let eTime = 0;


    let creepCounts = {
        NormalCreep: 0,
        HeavyCreep: 0
    };

    let levelSpecs = {
        1: {
            rate: 500,
            NormalCreep: 15,
            HeavyCreep: 1
        },
        2: {
            rate: 400,
            NormalCreep: 35,
            HeavyCreep: 5
        },
        3: {
            rate: 300,
            NormalCreep: 100,
            HeavyCreep: 15
        }
    };

    that.startLevel = function(){
        level++;
        creepCounts.NormalCreep += levelSpecs[level].NormalCreep;
        //creepCounts.FlyingCreep += levelSpecs[level].FlyingCreep;
        creepCounts.HeavyCreep += levelSpecs[level].HeavyCreep;
        console.log(creepCounts);

        that.active = true;
    };

    that.render = function(dTime){};

    that.update = function(dTime){
        if(that.active) {
            eTime += dTime;
            if (eTime > levelSpecs[level].rate) {
                eTime %= spawnRate;
                let chooseCreep = toolkit.uniform(0,3);
                let spawnType = null;
                if(chooseCreep > 2 && creepCounts.HeavyCreep > 0) spawnType = 'HeavyCreep';
                //else if(chooseCreep > 1 && creepCounts.FlyingCreep != 0) spawnType = FlyingCreep;
                else if(creepCounts.NormalCreep > 0) spawnType = 'NormalCreep';
                if(spawnType != null) {
                    // Flip a coin to decide placement
                    if (toolkit.coin()) spawnCreep(Creeps[spawnType], {x: 250, y: 0});
                    else spawnCreep(Creeps[spawnType], {x: 0, y: 250});


                    creepCounts[spawnType]--;
                }

                else that.active = false;
            }
            game.creeps = game.creeps.filter(x => {
                return !x.destroyed
            });
        }
    };

    function spawnCreep(type, pos){
        let creep = type(pos);
        game.actors.push(creep);
        game.creeps.push(creep);
    };

    game.actors.push(that);
    return that;
}(App.screens.game));