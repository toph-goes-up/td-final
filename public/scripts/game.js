/**
 * Created by Chris on 4/5/2018.
 */

App.screens['game'] = (function(manager, keyboard, mouse, collision, info, controller){
    let prevTime = 0;
    let particleEmitters = [];
    let things = [];
    let creeps = [];

    function processInput(dTime){
        keyboard.processInput(dTime);
        mouse.processInput(dTime);
    }

    function update(dTime){
        let i = 0;
        let j = 0;
        while(i < things.length){
            things[i].update(dTime);
            if(!things[i].destroyed){
                things[j++] = things[i];
            }
            i++;
        }
        things.length = j;

        i = 0;
        j = 0;
        let keptEmitters = [];
        while(i < particleEmitters.length){
            particleEmitters[i].update(dTime);
            if(!particleEmitters[i].destroyed){
                particleEmitters[j++] = particleEmitters[i];
            }
            i++;
        }
        particleEmitters.length = j;
        // Filter things list for things with a collision box and check them for collisions.
        //collision(things.filter(actor => actor.col));
    }

    function render(dTime){
        manager.ctx.clear();
        for(let i = 0; i < things.length; i++){
            things[i].render(dTime);
        }
        for(let i = 0; i < particleEmitters.length; i++){
            particleEmitters[i].render(dTime);
        }
    }

    function gameLoop(time){
        let dTime = time - prevTime;
        prevTime = time;

        processInput(dTime);
        update(dTime);
        render(dTime);

        requestAnimationFrame(gameLoop);
    }

    function newGame(){
        info.showGrid = true;
        creeps = [];
    }

    function init(){
        keyboard.registerCommand(KeyEvent.DOM_VK_A, true, dTime => {info.showGrid = ! info.showGrid});
        mouse.registerCommand('mousemove', e => {controller.mousePos = manager.getMousePos(e)});
        mouse.registerCommand('mousedown', controller.placeTower);
        mouse.registerCommand('mousedown', e => {App.board.selectTower(controller.mousePos)});

        document.getElementById('btn-game-gun-tower').addEventListener('click', e => {controller.grabTower('Gun Tower')});
        document.getElementById('btn-game-slug-tower').addEventListener('click', e => {controller.grabTower('Slug Tower')});
        document.getElementById('btn-game-laser-tower').addEventListener('click', e => {controller.grabTower('Laser Tower')});
        document.getElementById('btn-game-tower-sell').addEventListener('click', e => {controller.sellTower()});
        document.getElementById('btn-game-start-level').addEventListener('click', e => {App.level.startLevel()});
    }

    function run(){
        newGame();

        things.push(App.board);
        things.push(controller);

        /*

        */

        //particleEmitters.push(emitter(aEmitterSpec, manager.ctx));

        //keyboard.registerCommand(KeyEvent.DOM_VK_RIGHT, false, function(){a.rotation += .2});
        //keyboard.registerCommand(KeyEvent.DOM_VK_LEFT, false, function(){a.rotation -= .2});
        //a.collide = function(){console.log('COLLIDE!')};
        //a.col = {width: 20, height: 20};

        //things.push(a);
        //things.push(Actor('assets/textures/creep/creep-1-blue/sheet.png', 25, 25, creepSpec));


        prevTime = performance.now();
        requestAnimationFrame(gameLoop);
    }

    return {
        run: run,
        init: init,
        actors: things,
        creeps: creeps,
        particleEmitters: particleEmitters
    }
}(App.management, App.input.keyboard(), App.input.mouse(), App.collision, App.management.gameInfo, App.controller));