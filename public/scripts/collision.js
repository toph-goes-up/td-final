/**
 * Created by Chris on 4/7/2018.
 */

//Check all actors for collision using a quadtree.
App.collision = function(actors, xmin = 0, xmax = App.management.canvas.width, ymin = 0, ymax = App.management.canvas.height){
    //Check if two actors are in collision
    //SEEMS TO BE TOO LOOSE, NEEDS MORE TESTING WITH BETTER BOUND SPRITES
    let checkCollide = function(s, d){
        if(Math.abs(s.pos.x - d.pos.x) < (s.col.width/2 + d.col.width/2)){
            if(Math.abs(s.pos.y - d.pos.y) < (s.col.height/2 + d.col.height/2)){
                if(s.hasOwnProperty('collide')) s.collide(d);
                if(d.hasOwnProperty('collide')) d.collide(s);
            }
        }
    };

    //Split up actors recursively into a quad tree if necessary
    //QUAD TREE IS UNTESTED AT PRESENT
    if(actors.length > App.settings.collisionGroupSize){
        let groups = [[],[],[],[]];
        for(let i = 0; i < actors.length; i++){
            let actor = actors[i];
            if(actor.pos.x + actor.width/2 >= xmax/2 && actor.pos.y + actor.height/2 >= ymax/2)
                groups[0].append(actor);
            if(actor.pos.x - actor.width/2 <= xmax/2 && actor.pos.y + actor.height/2 >= ymax/2)
                groups[1].append(actor);
            if(actor.pos.x - actor.width/2 <= xmax/2 && actor.pos.y - actor.height/2 <= ymax/2)
                groups[2].append(actor);
            if(actor.pos.x + actor.width/2 >= xmax/2 && actor.pos.y - actor.height/2 <= ymax/2)
                groups[3].append(actor)
        }
        //Call appropriate recursions with new bounding boxes
        App.collision(groups[0], xmax/2, xmax, ymax/2, ymax);
        App.collision(groups[1], xmin, xmax/2, ymax/2, ymax);
        App.collision(groups[2], xmin, xmax/2, ymin, ymax/2);
        App.collision(groups[3], xmax/2, xmax, ymin, ymin/2);
    }

    //Loop through to test all actors against all other actors
    else{
        for(let i = 0; i < actors.length - 1; i++){
            for(let j = i+1; j < actors.length; j++){
                checkCollide(actors[i], actors[j]);
            }
        }
    }
};