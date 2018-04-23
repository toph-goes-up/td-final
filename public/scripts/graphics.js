/**
 * Created by Chris on 4/13/2018.
 */
App.graphics = (function(){
    let ctx = App.management.ctx;

    function drawImage(actor){
        ctx.save();
        ctx.translate(actor.pos.x, actor.pos.y);
        ctx.rotate(actor.rotation);
        ctx.drawImage(
            actor.image,
            -actor.width/2,
            -actor.height/2,
            actor.width,
            actor.height
        );
        ctx.restore();
    }

    function drawCircle(color, x, y, radius){
        ctx.beginPath();
        ctx.arc(x, y, radius, 0, Math.PI*2);
        ctx.stroke();
        ctx.closePath();
    }

    function drawLine(color, pt1, pt2){
        ctx.save();
        ctx.beginPath();
        ctx.moveTo(pt1.x, pt1.y);
        ctx.lineTo(pt2.x, pt2.y);
        ctx.strokeStyle = color;
        ctx.stroke();
        ctx.closePath();
        ctx.restore();
    }

    function drawRect(color, x, y, width, height){
        ctx.save();
        ctx.beginPath();
        ctx.rect(x - width/2, y - height/2, width, height);
        ctx.fillStyle = color;
        ctx.fill();
        //ctx.stroke();
        ctx.closePath();
        ctx.restore()
    }

    let drawActor = function(actor){
        if(actor.ready){
            ctx.save();
            ctx.translate(actor.pos.x, actor.pos.y);
            ctx.rotate(actor.rotation);

            if (actor.sWidth && actor.sHeight && actor.sx !== null && actor.sy !== null) ctx.drawImage(
                actor.image,
                actor.sx, actor.sy,
                actor.sWidth, actor.sHeight,
                -(actor.width/2),
                -(actor.height/2),
                actor.width,
                actor.height
            );

            else ctx.drawImage(
                actor.image,
                -(actor.width/2),
                -(actor.height/2),
                actor.width,
                actor.height
            );

            ctx.restore();
        }
    };

    return{
        drawImage: drawImage,
        drawActor: drawActor,
        drawRect: drawRect,
        drawLine: drawLine,
        drawCircle: drawCircle
    }
}());