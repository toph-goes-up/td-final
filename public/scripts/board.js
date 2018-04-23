/**
 * Created by Chris on 4/15/2018.
 */

App.board = (function(graphics, canvas, info){
    this.col = null;
    let doorSize = 100;
    let nGridCells = App.settings.nGridCells;
    let gridColor = 'rgba(55, 55, 255, 0.85)';

    let cellSize = canvas.width/nGridCells;

    //Set up the grid.
    let grid = [];
    for(let x = 0; x < nGridCells; x++){
        grid[x] = [];
        for(let y = 0; y < nGridCells; y++){
            grid[x][y] = {tower: null, n: null, w: null, s: null, e: null, x: x, y: y};
            if(x > 0){
                grid[x][y].w = grid[x-1][y];
                grid[x-1][y].e = grid[x][y];
            }
            if(y > 0){
                grid[x][y].n = grid[x][y-1];
                grid[x][y-1].s = grid[x][y];
            }
        }
    }

    this.isLegalTowerPosition = function(tower){
        let x = tower.pos.x / cellSize;
        let y = tower.pos.y / cellSize;

        // First check if the position is on the board at all
        if(x < 1 || x > nGridCells - 1 || y < 1 || y > nGridCells - 1){
            return false;
        }

        // Check if there are any existing towers in the way
        else if(grid[x][y].tower || grid[x-1][y].tower || grid[x][y-1].tower || grid[x-1][y-1].tower){
            return false;
        }

        else{
            let gridCopy = [];
            placeTower(tower, false);
            if(this.shortestPath({x: canvas.width/2, y: 0}, {x: canvas.width/2, y: canvas.height-1}) === -1 ||
                this.shortestPath({x: 0, y: canvas.height/2}, {x: canvas.width-1, y: canvas.height/2}) === -1){
                deleteTower(tower);
                return false;
            }
            else{
                deleteTower(tower);
            }
        }

        return true;
    };

    this.deleteTower = function(tower){
        let pos = tower.pos;
        let cellSize = canvas.width/nGridCells;
        let x = pos.x / cellSize;
        let y = pos.y / cellSize;

        // c is the southeast square in the tower
        let c = grid[x][y];

        // Link to the tower in all affected squares
        c.tower = c.n.tower = c.n.w.tower = c.w.tower = null;
    };

    this.placeTower = function(tower, updateCreeps = true){
        let pos = tower.pos;
        let cellSize = canvas.width/nGridCells;
        let x = pos.x / cellSize;
        let y = pos.y / cellSize;

        // c is the southeast square in the tower
        let c = grid[x][y];

        // Link to the tower in all affected squares
        c.tower = c.n.tower = c.n.w.tower = c.w.tower = tower;

        if(updateCreeps) {
            for (let i = 0; i < App.screens.game.creeps.length; i++) {
                App.screens.game.creeps[i].updatePath();
            }
        }
    };

    this.selectTower = function(pos){
        let x = Math.floor(pos.x/cellSize);
        let y = Math.floor(pos.y/cellSize);
        if(x >= 0 && x < grid.length && y >= 0 && y < grid.length){
            App.controller.selected = grid[x][y].tower;
        }
    };

    this.shortestPath = function(sPos, tPos){

        sPos.x = toolkit.constrain(sPos.x, 1,  canvas.width-1);
        tPos.x = toolkit.constrain(tPos.x, 1,  canvas.width-1);
        sPos.y = toolkit.constrain(sPos.y, 1,  canvas.height-1);
        tPos.y = toolkit.constrain(tPos.y, 1,  canvas.height-1);

        let s = grid[Math.floor(sPos.x/cellSize)][Math.floor(sPos.y/cellSize)];
        let t = grid[Math.floor(tPos.x/cellSize)][Math.floor(tPos.y/cellSize)];

        let q = [s];
        let cell = null;
        let visited = [s];

        let process = function(other){
            q.push(other);
            visited.push(other);
            other.prev = cell;
        };

        while(q.length > 0 && cell !== t){
            cell = q.shift();
            if(cell.n && !cell.n.tower && visited.indexOf(cell.n) === -1){ process(cell.n) }
            if(cell.s && !cell.s.tower && visited.indexOf(cell.s) === -1){ process(cell.s) }
            if(cell.e && !cell.e.tower && visited.indexOf(cell.e) === -1){ process(cell.e) }
            if(cell.w && !cell.w.tower && visited.indexOf(cell.w) === -1){ process(cell.w) }
        }
        if(cell === t){
            let path = [];
            while(cell){
                path.push(cell);
                t = cell;
                cell = cell.prev;
                t.prev = null;
            }
            return path;
        }
        else return -1;

    };

    this.update = function(){

    };

    this.render = function(){
        graphics.drawRect('red', canvas.width/2, 5, doorSize, 10);
        graphics.drawRect('red', canvas.width/2, canvas.height-5, doorSize, 10);
        graphics.drawRect('red', 5, canvas.height/2, 10, doorSize);
        graphics.drawRect('red', canvas.width-5, canvas.height/2, 10, doorSize);
        if(info.showGrid){
            drawGrid();
        }

        //DEBUGGING TOOL TO SEE THE SHORTEST PATHS
        //toolkit.drawPath(this.shortestPath({x: 0, y: canvas.height/2}, {x: canvas.width-1, y: canvas.height/2}));
        //toolkit.drawPath(this.shortestPath({x: canvas.width/2, y: 0}, {x: canvas.width/2, y: canvas.height-1}));
    };

    function drawGrid(){
        let cellSize = canvas.height/nGridCells;

        for(let i = 0; i < nGridCells; i++){
            graphics.drawLine(gridColor, {x: 0, y: cellSize*i}, {x: canvas.width, y: cellSize*i});
            graphics.drawLine(gridColor, {x: cellSize*i, y: 0}, {x: cellSize*i, y: canvas.height});
        }
    }

    return this;
}(App.graphics, App.management.canvas, App.management.gameInfo));