var Handsome = Hero.extend({
    MAX_SPEED: 2,
    MAX_HP: 200,
    SIZE: {width: 60, height: 89},
    skillList: [
        {
            name: "attack2",
            key: GC.CONTROLS.ATTACK,
            effect: "res/Sound/HandsomeHit.mp3",
            range: [30, 0, 148, 90],
            damageScale: 1.1,
        }
    ],
    ctor: function(){
        this._super();
        this.damageRange = [10, 20];
        cc.spriteFrameCache.addSpriteFrames(res.handsomePlist);
        this.animations.stand = utils.createAnim("handsomeStand_", 4, 0.2).repeatForever();
        this.animations.move = utils.createAnim("handsomeMove_", 4, 0.2).repeatForever();
        this.animations.jump = utils.createAnim("handsomeJump_", 1, 9999);
        this.animations.hit = utils.createAnim("handsomeHit_", 1, 9999);
        this.animations.die = utils.createAnim("handsomeDie_", 22, 0.1);
        this.animations.attack2 = utils.createAnim("handsomeAttack2_", 17, 0.1);
    },
    /*
     处理攻击2逻辑
     @method handleAttackThree
     @for Pirate
     */
    handleAttackTwo: function(){
        var callFunc = this._getHitCallFunc(this.getMyHero().skillList[0]);
        this._hero.handleSkill.call(this, cc.spawn(this._hero.animations.attack2, cc.sequence(cc.delayTime(0.6), callFunc, cc.delayTime(0.1), callFunc, cc.delayTime(0.1), callFunc, cc.delayTime(0.1), callFunc, cc.delayTime(0.1), callFunc, cc.delayTime(0.1), callFunc)));
    },
    /*
        重载_updateControlLogic，添加技能逻辑
        @method _updateControlLogic
    */
    _updateControlLogic: function(){
        this._super();
        if(this._controls[GC.CONTROLS.ATTACK]){
            this._hero.handleAttackTwo.call(this)
        }
    }
});