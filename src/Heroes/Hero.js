/*
    各种角色的父类，主要处理各种角色的动作逻辑
    @class Hero
*/
var Hero = cc.Class.extend({
    MAX_SPEED: 3,
    MAX_DROP_SPEED: 20,
    JUMP_SPEED: 15,
    ctor: function(){
        this.animations = {};
        this.damageScale = 1;
    },
    /*
        返回攻击区间内的随机攻击值
        @method getDamage
        @return {number}
    */
    getDamage: function(){
        return (this.damageRange[0]+Math.ceil(Math.random()*(this.damageRange[1]-this.damageRange[0])))*this.damageScale;
    },
    /*
     处理在空中坠落的方法
     @method handleAir
     @for Hero
     */
    handleAir: function(){
        if(this._status != GC.STATUS.DEAD && this._status != GC.STATUS.JUMP && this._status != GC.STATUS.SKILL && this._status != GC.STATUS.HIT){
            this._status = GC.STATUS.JUMP;
            this._changeAnim("jump");
        }
        if(this._dropSpeed < this._hero.MAX_DROP_SPEED) this._dropSpeed++;
        this._lastPoint.y = this.y;
        this.y -= this._dropSpeed;
    },
    /*
        处理扣血事件
        @method handleHit
        public
        @for Hero
        @param {int} hitHP 所减少生命值
        @param {boolean} isLeft 所弹向的方向
        @param {DisplayObj} sourceObj 攻击来源对象
        @param {function} optional callback 回调函数
    */
    handleHit: function(hitHP, isLeft, sourceObj, callback){
        if(this._status != GC.STATUS.DEAD && !this._isHit){
            this._status = GC.STATUS.HIT;
            this.setHP(hitHP);
            this._showDamageNumber(""+Math.abs(hitHP));
            if(this._MAX_HIT_TIME > 0){
                var _this = this;
                this._isHit = true;
                this.runAction(cc.sequence(cc.blink(this._MAX_HIT_TIME, this._MAX_HIT_TIME*10), cc.callFunc(function(){
                   _this._isHit = false;
                })))
            }
            this._changeAnim("hit");
            if(sourceObj && this.setTarget) this.setTarget(sourceObj);
            if(callback) callback.call(this); //TODO
            if(!this._isAir){
                this._dropSpeed = -10;
                this._realSpeed = isLeft?-3:3;
            }
        }
    },
    /*
     处理站立状态
     @method handleStand
     @for Hero
     */
    handleStand: function(){
        if(this._status != GC.STATUS.DEAD && !this._isAir && this._status != GC.STATUS.STAND){
            this._status = GC.STATUS.STAND;
            this._jumpCount = 0;
            this._realSpeed = 0;
            this._changeAnim("stand");
        }
    },
    /*
     处理移动状态
     @method handleMove
     @for Hero
     @param {number} speed 移动速度
     */
    handleMove: function(speed){
        if(this._status != GC.STATUS.DEAD && !this._isAir && this._status == GC.STATUS.STAND){
            this._status = GC.STATUS.MOVE;
            this._changeAnim("move");
        }
        if(!this._isAir && this._status != GC.STATUS.HIT){
            this._realSpeed = this._isLeft?-speed:speed;
        }
    },
    /*
     处理跳跃事件
     @method handleJump
     @for Hero
     */
    handleJump: function(){
        if(this._status != GC.STATUS.DEAD && !this._isAir && this._status != GC.STATUS.SKILL && this._status != GC.STATUS.HIT){
            this._dropSpeed = -this._hero.JUMP_SPEED;
        }
    },
    /*
        处理死亡事件
        @method handleDie
        @for Hero
    */
    handleDie: function(){;
        this.unscheduleUpdate();
        this._changeAnim(cc.sequence(this._hero.animations.die, cc.callFunc(function(){
            var event = new cc.EventCustom("heroDie");
            event.setUserData({
                type: this.getTag(),
                name: this.getName()
            })
            cc.eventManager.dispatchEvent(event);
            this.setVisible(false);
        }, this)));
    },
    /*
     处理释放技能事件
     private
     @method handleSkill
     @for Hero
     @param {cc.Action} skillAction 攻击具体逻辑以及动画
     */
    handleSkill: function(skillAction){
        if(this._status != GC.STATUS.DEAD && this._status != GC.STATUS.SKILL && this._status != GC.STATUS.HIT){
            this._status = GC.STATUS.SKILL;
            this._changeAnim(cc.sequence(skillAction, cc.callFunc(function(){
                 if(this._isAir){
                     this._status = GC.STATUS.JUMP;
                     this._changeAnim("jump");
                 }else{
                     this._hero.handleStand.call(this);
                 }
             }, this)));
        }
    },
    /*
        更新操作逻辑
        @method _updateControlLogic
        @for Hero
    */
    _updateControlLogic: function(){
        //如果死亡，则处理死亡逻辑，并中止对其他逻辑的处理
        if(this._status == GC.STATUS.DEAD && !this._isAir){
            this._hero.handleDie.call(this);
            return false;
        }
        //判断是否需要赋予初始状态Stand或Jump，以便对后续逻辑的处理
        if(this._isAir){
            this._hero.handleAir.call(this);
        }else if((this._status == GC.STATUS.JUMP || this._status == GC.STATUS.HIT) && this._dropSpeed >= 0 && !this._isAir){
            this._hero.handleStand.call(this);
        }
        //如果并非处于释放技能或者僵直状态,允许转向
        if(this._controls[GC.CONTROLS.LEFT] && this._status != GC.STATUS.SKILL && this._status != GC.STATUS.HIT){
            this._isLeft = true;
            this.setFlippedX(!this._isLeft);
        }else if(this._controls[GC.CONTROLS.RIGHT] && this._status != GC.STATUS.SKILL && this._status != GC.STATUS.HIT){
            this._isLeft = false;
            this.setFlippedX(!this._isLeft);
        }
        //判断是否移动或者站立
        if(this._controls[GC.CONTROLS.LEFT] || this._controls[GC.CONTROLS.RIGHT]){
            this._hero.handleMove.call(this, this._hero.MAX_SPEED);
        }else if(this._controls[GC.CONTROLS.TOP] || this._controls[GC.CONTROLS.DOWN] || (this._status == GC.STATUS.MOVE && !this._controls[GC.CONTROLS.LEFT] && !this._controls[GC.CONTROLS.RIGHT])){
             this._hero.handleStand.call(this);
        }
        //判断是否跳跃
        if(this._controls[GC.CONTROLS.JUMP]){
            this._hero.handleJump.call(this);
        }
        //如果处于移动状态或者在空中,则允许_realSpeed对横向坐标操作
        if(this._status == GC.STATUS.MOVE || this._isAir){
            this._lastPoint.x = this.x;
            this.x += this._realSpeed;
        }
    }
})