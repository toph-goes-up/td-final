/**
 * Created by Chris on 4/17/2018.
 */
 App.controller = (function(graphics, nGridCells, board, snapToBlock){
     let that = {
         mousePos: {x: 0, y:0},
         heldTower: null,
         cash: 100,
         lives: 15,
         score: 0,
         selected: null
     };

     let gridSize = App.management.canvas.width/nGridCells;

     let livesDisp = document.getElementById('game-lives');
     let cashDisp = document.getElementById('game-cash');
     let scoreDisp = document.getElementById('game-score');

     let towerInfoDisp = {
         type: document.getElementById('game-tower-type'),
         damage: document.getElementById('game-tower-damage'),
         rate: document.getElementById('game-tower-rate'),
         sell: document.getElementById('btn-game-tower-sell'),
         upgrade: document.getElementById('btn-game-tower-upgrade')
     };

     that.newGame = function(){
         that.cash = 100;
         that.lives = 15;
         that.selected = null;
         that.heldTower = null;
     };

     that.grabTower = function(t){
         that.heldTower = towers[t]();
     };

     that.sellTower = function(){
         let t = that.selected;
         if(t.active) {
             App.board.deleteTower(t);
             that.cash += Math.floor(0.8 * t.price);
             emitter(sellSpec(t.pos, t.price));
             that.selected = null;
         }
     };

     that.upgradeTower = function(){
         if(that.selected && that.selected.level < 2){
             let cost = Math.floor(that.selected.price * 0.7);
             if(cost <= that.cash){
                 that.cash -= cost;
                 that.selected.upgrade();
             }
         }
     };

     that.placeTower = function(){
        if(that.heldTower) {
            if (board.isLegalTowerPosition(that.heldTower) && that.heldTower.price <= that.cash) {
                App.screens.game.actors.push(that.heldTower);
                board.placeTower(that.heldTower);
                that.heldTower.active = true;
                that.cash -= that.heldTower.price;

                that.grabTower(that.heldTower.type);
            }
            else{
                that.heldTower = null;
            }
        }
     };


     that.render = function(){
        if(that.heldTower){
            that.heldTower.render();

            let snapPos = snapToBlock(that.mousePos);
            let color = 'rgba(0,0,255, 0.5)';
            if(!board.isLegalTowerPosition(that.heldTower) || that.cash < that.heldTower.price){
                color = 'rgba(255,0,0, 0.5)';
            }
            graphics.drawRect(color, snapPos.x, snapPos.y, gridSize*2, gridSize*2);
        }
        livesDisp.innerHTML = '<3: ' + that.lives;
        cashDisp.innerHTML = '$: ' + that.cash;
        scoreDisp.innerHTML = 'Score: ' + that.score;

        if(that.selected){
            that.selected.showRange();
            towerInfoDisp.type.innerHTML = that.selected.type;
            towerInfoDisp.damage.innerHTML = 'Damage: ' + Math.floor(that.selected.damage);
            towerInfoDisp.rate.innerHTML = 'Rate: ' + Math.floor(1 / (that.selected.rate / 1000));
            towerInfoDisp.sell.innerHTML = 'Sell: $' + Math.floor(that.selected.price * 0.8);
            towerInfoDisp.upgrade.innerHTML = 'Upgrade: $' + Math.floor(that.selected.price * .7);
            towerInfoDisp.upgrade.disabled = !(that.cash >= Math.floor(that.selected.price * .7)) && that.selected.level < 2;
            towerInfoDisp.sell.disabled = false;
        }

        else{
            towerInfoDisp.type.innerHTML = '&nbsp</br>';
            towerInfoDisp.damage.innerHTML = '&nbsp';
            towerInfoDisp.rate.innerHTML = '&nbsp';
            towerInfoDisp.sell.innerHTML = 'Sell';
            towerInfoDisp.upgrade.disabled = true;
            towerInfoDisp.sell.disabled = true;
        }
     };

     that.update = function(){
         if(that.heldTower){
             that.selected = that.heldTower;
             that.heldTower.pos = snapToBlock(that.mousePos);
         }
     };

     return that;
 }(App.graphics, App.settings.nGridCells, App.board, App.management.snapToBlock));

let sellSpec = function(pos, density) {
    return {
        anchor: null,
        lifetime: 50,
        density: density,
        pos: pos,
        shape: {width: 15, height: 15},
        speed: {mean: .04, sd: .01},
        accel: {mean: 0.9, sd: 0},
        size: {mean: 10, sd: 2},
        particleLifetime: {mean: 600, sd: 100},
        fill: 'rgba(255, 0, 0, .5)',
        texture: 'assets/textures/cash.png'
    }
};