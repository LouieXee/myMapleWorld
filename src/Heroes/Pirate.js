var Pirate = Hero.extend({
    MAX_SPEED: 3,
    JUMP_SPEED: 15,
    SIZE: {width: 111, height: 133},
    MAX_HP: 1000,
    NAME: "Pirate",
    skillList: [
        {
            name: "attack1",
            key: GC.CONTROLS.ATTACK,
            damageScale: 1.1,
            range: [-315, 0, 630, 50]
        },
        {
            name: "attack3",
            key: GC.CONTROLS.ATTACK2,
            damageScale: 2,
            range: [-50, 0, 300, 10]
        }
    ],
    ctor: function(){
        this._super();
        this.damageRange = [10, 20];
        cc.spriteFrameCache.addSpriteFrames(res.piratePlist);
        cc.spriteFrameCache.addSpriteFrames(res.pirateAttack1Plist)
        cc.spriteFrameCache.addSpriteFrames(res.pirateAttack3Plist)
        this.animations.stand = utils.createAnim("pirateStand", 4, 0.15).repeatForever();
        this.animations.move = utils.createAnim("pirateMove", 6, 0.1).repeatForever();
        this.animations.jump = utils.createAnim("pirateMove", 6, 0.1).repeatForever();
        this.animations.skill = utils.createAnim("pirateSkill1_", 12, 0.1);
        this.animations.attack1 = utils.createAnim("pirateAttack1_", 17, 0.1);
        this.animations.attack3 = utils.createAnim("pirateAttack3_", 30, 0.05);
        this.animations.hit = utils.createAnim("pirateHit", 1, 9999);
        this.animations.die = utils.createAnim("pirateDie", 9, 0.1);
    },
    /*
         处理攻击1逻辑
         @method handleAttackOne
         @for Pirate
     */
    handleAttackOne: function(){
        var callFunc = this._getHitCallFunc(this.getMyHero().skillList[0]);
        this._hero.handleSkill.call(this, cc.spawn(this._hero.animations.attack1, cc.sequence(cc.delayTime(0.6), callFunc, cc.delayTime(0.1), callFunc, cc.delayTime(0.1), callFunc, cc.delayTime(0.1), callFunc, cc.delayTime(0.1), callFunc, cc.delayTime(0.1), callFunc, cc.delayTime(0.1), callFunc)));
    },
    /*
         处理攻击3逻辑
         @method handleAttackThree
         @for Pirate
     */
    handleAttackThree: function(){
        var callFunc = this._getHitCallFunc(this.getMyHero().skillList[1]);
        this._hero.handleSkill.call(this, cc.spawn(this._hero.animations.attack3, cc.sequence(cc.delayTime(0.9), callFunc, cc.delayTime(0.4), callFunc)));
    },
    /*
        处理buff技能逻辑
        @method handleBuff
        @for Pirate
    */
    handleBuff: function(){
        var _this = this;
        this._hero.handleSkill.call(this, this._hero.animations.skill);
        this._hero.damageScale = 2;
        this.scheduleOnce(function(){
            _this._hero.damageScale = 1;
        }, 10)
    },
    /*
        重载_updateControlLogic，添加技能逻辑
        @method _updateControlLogic
    */
    _updateControlLogic: function(){
        this._super();
        if(this._controls[GC.CONTROLS.ATTACK]){
            this._hero.handleAttackOne.call(this);
        }if(this._controls[GC.CONTROLS.ATTACK2]){
            this._hero.handleAttackThree.call(this)
        }else if(this._controls[GC.CONTROLS.SKILL]){
            this._hero.handleBuff.call(this)
        }
    }
});