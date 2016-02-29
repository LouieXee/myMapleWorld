var Cola = Hero.extend({
    MAX_SPEED: 1,
    JUMP_SPEED: 12,
    MAX_HP: 100,
    SIZE: {width: 63, height: 53},
    NAME: "Cola",
    ctor: function(){
        this._super();
        this.damageRange = [1, 1];
        cc.spriteFrameCache.addSpriteFrames(res.colaPlist);
        this.animations.stand = utils.createAnim("colaStand", 4, 0.2).repeatForever();
        this.animations.move = utils.createAnim("colaMove", 6, 0.1).repeatForever();
        this.animations.jump = utils.createAnim("colaJump", 1, 9999);
        this.animations.die = utils.createAnim("colaDie", 9, 0.1);
        this.animations.hit = utils.createAnim("colaHit", 1, 9999);
    },
});
