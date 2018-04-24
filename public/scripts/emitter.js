/**
 * Created by Chris on 4/7/2018.
 */

/**
 *
 * @param spec {anchor: Actor, density: int, pos: {x, y}, lifetime: int(ms), shape: {width, height || radius},
 *                  speed: {mean, sd}, accel: {mean, sd} particleLifetime: {mean, sd}, fill: rgb(), size: {mean, sd}, texture: path}
 * @param ctx
 */
function emitter(spec) {
    let ctx = App.management.ctx;
    let that = {
        destroyed: false
    };
    let particles = [];
    let texture = new Image();
    let eTime = 0;
    let eol = false;
    that.render = function (){};


    texture.src = spec.texture;
    texture.onload = function () {
        that.render = function () {
            for (let i = 0; i < particles.length; i++) {
                let particle = particles[i];

                //Draw the particle
                ctx.save();

                ctx.translate(particle.pos.x, particle.pos.y);
                ctx.rotate(particle.rotation);
                ctx.drawImage(texture, -(particle.size / 2), -(particle.size/2), particle.size, particle.size);

                ctx.restore();
            }
        }
    };

    that.update = function (dTime) {
        let kept = [];
        eTime += dTime;
        if(eTime > spec.lifetime) eol = true;
        if(eol === true && particles.length === 0) that.destroyed = true;

        if (spec.anchor) {
            this.pos = spec.anchor.pos;
        }

        for (let i = 0; i < particles.length; i++) {
            let particle = particles[i];
            particle.alive += dTime;
            particle.pos.x += dTime * particle.speed * particle.dir.x;
            particle.pos.y += dTime * particle.speed * particle.dir.y;
            particle.speed *= (particle.accel)**(dTime/100);

            if (particle.alive <= particle.lifetime) {
                kept.push(particle);
            }
        }

        if(!eol) {
            for (let i = 0; i < spec.density; i++) {
                let p = {
                    pos: {},
                    dir: toolkit.circleVector(),
                    speed: toolkit.gaussian(spec.speed.mean, spec.speed.sd),
                    accel: toolkit.gaussian(spec.accel.mean, spec.accel.sd),
                    lifetime: toolkit.gaussian(spec.particleLifetime.mean, spec.particleLifetime.sd),
                    rotation: 0,
                    alive: 0,
                    size: toolkit.gaussian(spec.size.mean, spec.size.sd),
                    fill: spec.fill,
                    stroke: 'rgb(0, 0, 0)'
                };
                if (!spec.shape.hasOwnProperty('radius')) {
                    p.pos.x = toolkit.uniform(spec.pos.x - spec.shape.width / 2, spec.pos.x + spec.shape.width / 2);
                    p.pos.y = toolkit.uniform(spec.pos.y - spec.shape.height / 2, spec.pos.y + spec.shape.height / 2);
                }
                kept.push(p);
            }
        }
        particles = kept;
    };

    App.screens.game.particleEmitters.push(that);
    return that;
}