/**
 * Created by Chris on 3/4/2018.
 */
/** Set up a new actor. spriteSpec includes:
 * spriteCount: int
 * timing: []
 */
function Actor(img, width = 10, height = 10, spriteSpec = null, sx = null, sy = null, sWidth = null, sHeight = null){
    let that = {
        pos: {x: 50, y: 50},
        rotation: 0,
        width: width,
        height: height,
        sx: sx,
        sy: sy,
        sWidth: sWidth,
        sHeight: sHeight,
        texture: null,
        col: {width: width, height: height}
    };

    that.image = new Image;
    that.ready = false;
    that.image.src = img;

    that.image.onload = function(){
        that.ready = true;
        if(spriteSpec){
            that.eTime = 0;
            that.sprite = 0;

            // Initialize subimage values to render the correct sprite
            that.sWidth = spriteSpec.size.width;
            that.sHeight = spriteSpec.size.height;
            that.sx = spriteSpec.size.width * that.sprite;
            that.sy = 0;
        }
    };

    that.update = function(dTime){
        if(spriteSpec) updateSprite(dTime);
    };

    // Simple container method that is easily overwritten for more complicated forms.
    that.render = function(dTime){
        App.graphics.drawActor(that);
    };

    let updateSprite = function(dTime){
        that.eTime += dTime;
        // Check to see if we need to cycle sprites
        if(that.eTime > spriteSpec.timing[that.sprite]){
            // Reset time for the next sprite
            that.eTime %= spriteSpec.timing[that.sprite];

            // Cycle to the next sprite
            that.sprite = (that.sprite + 1) % spriteSpec.spriteCount;

            // Update subimage values to render the correct sprite
            that.sWidth = spriteSpec.size.width;
            that.sHeight = spriteSpec.size.height;
            that.sx = spriteSpec.size.width * that.sprite;
            that.sy = 0;
        }
    };

    return that;
};