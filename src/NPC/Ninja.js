var Ninja = NPC.extend({
    SIZE: {width: 62, height: 91},
    ctor: function(opt){
        this._super(opt);
        this.setName("Ninja");
        cc.spriteFrameCache.addSpriteFrames(res.npc1Plist);
        this._animations.push(utils.createAnim("npc1_stand_", 1, 5));
        this._animations.push(utils.createAnim("npc1_say_", 8, 0.2));
        this._animations.push(utils.createAnim("npc1_borw_", 6, 0.2));
        this._runAnim();
    }
});