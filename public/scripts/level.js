/**
 * Created by Chris on 4/21/2018.
 */

App.level = (function(game){
    let that = {
        active: false
    };
    let level = 0;
    let wave = 0;
    let spawnRate = 500;
    let eTime = 0;
    let pauseTime = 0;


    let creepCounts = {
        NormalCreep: 0,
        HeavyCreep: 0
    };

    let levelSpecs = {
        1: {
            rate: 700,
            waves:[
                {
                    NormalCreep: 10,
                    HeavyCreep: 0,
                    FlyingCreep: 0
                },
                {
                    NormalCreep: 20,
                    HeavyCreep: 0,
                    FlyingCreep: 0
                },
                {
                    NormalCreep: 0,
                    HeavyCreep: 1,
                    FlyingCreep: 0
                },
                {
                    NormalCreep: 20,
                    HeavyCreep: 1,
                    FlyingCreep: 0
                },
                {
                    NormalCreep: 45,
                    HeavyCreep: 0,
                    FlyingCreep: 0
                },
                {
                    NormalCreep: 30,
                    HeavyCreep: 2,
                    FlyingCreep: 0
                },
            ]
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
        if(!that.active) {
            level++;
            wave = -1;
            nextWave();
            console.log(creepCounts);

            that.active = true;
        }
    };

    let nextWave = function(){
        wave++;
        creepCounts.NormalCreep += levelSpecs[level].waves[wave].NormalCreep;
        //creepCounts.FlyingCreep += levelSpecs[level].FlyingCreep;
        creepCounts.HeavyCreep += levelSpecs[level].waves[wave].HeavyCreep;
    };

    that.render = function(dTime){};

    that.update = function(dTime){
        if(that.active) {
            // Update the elapsed time
            eTime += dTime;
            console.log(dTime);

            //Check if its time to spawn a new creep
            if (eTime > levelSpecs[level].rate * (1 - wave/8)) {

                // Choose a random creep to spawn from the pool.
                let chooseCreep = toolkit.uniform(0,3);
                let spawnType = null;
                if(chooseCreep > 2 && creepCounts.HeavyCreep > 0) spawnType = 'HeavyCreep';
                //else if(chooseCreep > 1 && creepCounts.FlyingCreep != 0) spawnType = FlyingCreep;
                else if(creepCounts.NormalCreep > 0) spawnType = 'NormalCreep';

                //if we chose a creep successfully, spawn it and reset the spawn timer.
                if(spawnType != null) {
                    // Reset spawn timer
                    eTime %= spawnRate;
                    // Flip a coin to decide placement
                    if (toolkit.coin() || level === 1) spawnCreep(Creeps[spawnType], {x: 0, y: 250});
                    else spawnCreep(Creeps[spawnType], {x: 250, y: 0});

                    creepCounts[spawnType]--;
                }

                // Wave is over. Launch next wave, or end the level
                else{
                    if(wave < levelSpecs[level].waves.length - 1) {
                        pauseTime += dTime;
                        if (pauseTime >= 6000) {
                            pauseTime = 0;
                            nextWave();
                        }
                    }
                    else that.active = false;
                }
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