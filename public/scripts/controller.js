/**
 * Created by Chris on 4/17/2018.
 */
 App.controller = (function(graphics, nGridCells, board, snapToBlock){
     let that = {
         mousePos: {x: 0, y:0},
         heldTower: null,
         cash: 50,
         lives: 15,
         selected: null
     };
     let gridSize = App.management.canvas.width/nGridCells;

     let livesDisp = document.getElementById('game-lives');
     let cashDisp = document.getElementById('game-cash');

     let towerInfoDisp = {
         type: document.getElementById('game-tower-type'),
         damage: document.getElementById('game-tower-damage'),
         rate: document.getElementById('game-tower-rate'),
         sell: document.getElementById('btn-game-tower-sell')
     };

     that.newGame = function(){
         that.cash = 50;
         that.lives = 15;
         that.selected = null;
         that.heldTower = null;
     };

     that.grabTower = function(t){
         that.heldTower = towers[t]();
         that.heldTower.showRange = true;
     };

     that.sellTower = function(){
         t = that.selected;
        App.board.deleteTower(t);
        that.cash += Math.floor(0.8*t.price);
        that.selected = null;
     };

     that.placeTower = function(){
        if(that.heldTower) {
            if (board.isLegalTowerPosition(that.heldTower) && that.heldTower.price <= that.cash) {
                App.screens.game.actors.push(that.heldTower);
                board.placeTower(that.heldTower);
                that.heldTower.active = true;
                that.cash -= that.heldTower.price;

                that.heldTower.showRange = false;
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

        if(that.selected) {
            towerInfoDisp.type.innerHTML = that.selected.type;
            towerInfoDisp.damage.innerHTML = 'Damage: ' + that.selected.damage;
            towerInfoDisp.rate.innerHTML = 'Rate: ' + Math.floor(1 / (that.selected.rate / 1000));
            towerInfoDisp.sell.innerHTML = 'Sell for $' + Math.floor(that.selected.price * 0.8);
            towerInfoDisp.sell.disabled = false;
        }

        else{
            towerInfoDisp.type.innerHTML = ' ';
            towerInfoDisp.damage.innerHTML = ' ';
            towerInfoDisp.rate.innerHTML = ' ';
            towerInfoDisp.sell.innerHTML = 'Sell';
            towerInfoDisp.sell.disabled = true;
        }
     };

     that.update = function(){
         if(that.heldTower){
             that.heldTower.pos = snapToBlock(that.mousePos);
         }
     };

     return that;
 }(App.graphics, App.settings.nGridCells, App.board, App.management.snapToBlock));