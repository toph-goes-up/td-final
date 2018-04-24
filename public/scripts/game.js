/**
 * Created by Chris on 4/5/2018.
 */

App.screens['game'] = (function(manager, keyboard, mouse, collision, info, controller){
    let prevTime = 0;
    let particleEmitters = [];
    let things = [];
    let creeps = [];
    let loss = false;

    function processInput(dTime){
        keyboard.processInput(dTime);
        mouse.processInput(dTime);
    }

    function update(dTime){
        if(!loss) {
            let i = 0;
            let j = 0;
            while (i < things.length) {
                things[i].update(dTime);
                if (!things[i].destroyed) {
                    things[j++] = things[i];
                }
                i++;
            }
            things.length = j;

            i = 0;
            j = 0;
            let keptEmitters = [];
            while (i < particleEmitters.length) {
                particleEmitters[i].update(dTime);
                if (!particleEmitters[i].destroyed) {
                    particleEmitters[j++] = particleEmitters[i];
                }
                i++;
            }
            particleEmitters.length = j;

            // Filter things list for things with a collision box and check them for collisions.
            //collision(things.filter(actor => actor.col));

            // Check for game over.
            if(App.controller.lives <= 0){
                loss = true;
            }
        }
    }

    function render(dTime){
        manager.ctx.clear();
        for(let i = 0; i < things.length; i++){
            things[i].render(dTime);
        }
        for(let i = 0; i < particleEmitters.length; i++){
            particleEmitters[i].render(dTime);
        }

        if(loss) {
            let ctx = manager.ctx;
            ctx.font = '60px Monospace';
            ctx.fontWeight = 1000;
            ctx.fillStyle = 'red';
            ctx.strokeStyle = 'black';
            ctx.textAlign = 'center';
            ctx.fillText('GAME OVER!', 250, 250);
            ctx.strokeText('GAME OVER!', 250, 250);
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
        keyboard.registerCommand(KeyEvent.DOM_VK_U, true, dTime => {controller.upgradeTower()});
        keyboard.registerCommand(KeyEvent.DOM_VK_S, true, dTime => {controller.sellTower()});
        keyboard.registerCommand(KeyEvent.DOM_VK_G, true, dTime => {App.level.startLevel()});
        keyboard.registerCommand(KeyEvent.DOM_VK_ESCAPE, true, dTime => {App.controller.heldTower = null; App.controller.selected = null;});
        mouse.registerCommand('mousemove', e => {controller.mousePos = manager.getMousePos(e)});
        mouse.registerCommand('mousedown', controller.placeTower);
        mouse.registerCommand('mousedown', e => {App.board.selectTower(controller.mousePos)});

        document.getElementById('btn-game-gun-tower').addEventListener('click', e => {controller.grabTower('Gun Tower')});
        document.getElementById('btn-game-slug-tower').addEventListener('click', e => {controller.grabTower('Slug Tower')});
        document.getElementById('btn-game-laser-tower').addEventListener('click', e => {controller.grabTower('Laser Tower')});
        document.getElementById('btn-game-blast-tower').addEventListener('click', e => {controller.grabTower('Blast Tower')});
        document.getElementById('btn-game-tower-sell').addEventListener('click', e => {controller.sellTower()});
        document.getElementById('btn-game-tower-upgrade').addEventListener('click', e => {controller.upgradeTower()});
        document.getElementById('btn-game-start-level').addEventListener('click', e => {App.level.startLevel()});
        document.getElementById('btn-game-show-grid').addEventListener('click', e => {info.showGrid = !info.showGrid});
    }

    function run(){
        newGame();

        things.push(App.board);
        things.push(controller);

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