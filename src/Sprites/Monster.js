var Monster = DisplayObj.extend({
    _MAX_HIT_TIME: 0,
    ALERT_TIME: 1200,
    ctor: function(opt){
        this._super(opt);
        this.setName(this._hero.NAME);
        this.setTag(GC.TYPE.MONSTER);
        this._bornPoint = cc.p(opt.x, opt.y);
        this._isAutoAttack = opt.isAutoAttack || false;
        this._range = opt.range || false;
        this._target = null;
        this._last_skill = null;
        this._count = 0;
        this._maxCount = 200;
    },
    /*
        public
        重生
        @method reborn
        @for Monster
    */
    reborn: function(){
        this._super(this._hero.MAX_HP, this._bornPoint)
        this._target = null;
        this.setOpacity(0);
        this.runAction(cc.fadeIn(1));
    },
    /*
        设置目标
        @method setTarget
        @param {Player} target
    */
    setTarget: function(target){
        this._maxCount = this._ALERT_TIME;
        this._count = 0;
        this._target = target;
    },
    /*
        警备攻击逻辑
        @method _alertLogic
    */
    _alertLogic: function(){
        if(!this._isAutoAttack && this._count++ > this._maxCount){
            this._target = null;
            return true;
        }
        var list = this.getMyHero().skillList, skill;
        if(list){
            this._last_skill && (this._controls[this._last_skill.key] = false);
            skill = list[Math.floor(list.length*Math.random())];
            this._last_skill = skill;
        }
        if(skill && this._getHitTarget(skill, [this._target]).length > 0){
            this._controls[GC.CONTROLS.RIGHT] = false;
            this._controls[GC.CONTROLS.LEFT] = false;
            this._controls[GC.CONTROLS.JUMP] = false;
            this._controls[skill.key] = true;
        }else if(this._target.x < this.x-this.getMySize().width){
            this._controls[GC.CONTROLS.RIGHT] = false;
            this._controls[GC.CONTROLS.LEFT] = true;
            this._controls[GC.CONTROLS.JUMP] = false;
        }else if(this._target.x > this.x+this.getMySize().width){
            this._controls[GC.CONTROLS.RIGHT] = true;
            this._controls[GC.CONTROLS.LEFT] = false;
            this._controls[GC.CONTROLS.JUMP] = false;
        }
        if(Math.floor(Math.random()*1000) == 0){
            this._controls[GC.CONTROLS.JUMP] = true;
        }else{
            this._controls[GC.CONTROLS.JUMP] = false;
        }
    },
    /*
        一般逻辑
        @method _normalLogic
    */
    _normalLogic: function(){
        if(this._hero.animations.jump){
            if(Math.floor(Math.random()*1000) == 0){
                this._controls[GC.CONTROLS.JUMP] = true;
            }else{
                this._controls[GC.CONTROLS.JUMP] = false;
            }
        }
        if(this._count < this._maxCount){
             this._count++;
        }else{
            this._count = 0;
            if(this._status == GC.STATUS.STAND){
                this._maxCount = Math.random()*500+100;
                if(Math.ceil(Math.random()*2) == 1){
                    this._controls[GC.CONTROLS.LEFT] = true;
                }else{
                    this._controls[GC.CONTROLS.RIGHT] = true;
                }
            }else if(this._status == GC.STATUS.MOVE){
                this._maxCount = Math.random()*300+100;
                this._controls[GC.CONTROLS.LEFT] = this._controls[GC.CONTROLS.RIGHT] = false;
            }
        }
    },
    /*
        更新AI逻辑
        @method _updateAILogic
    */
    _updateAILogic: function(){
        //如果为主动攻击类型，则自动选择攻击目标
        this._isAutoAttack && !this._target && (this._target = this.getParent().players[0]);
        if(this._target){
            this._alertLogic();
        }else{
            this._normalLogic();
        }
    },
    /*
        重载update，添加怪物AI逻辑
        @method update
    */
    update: function(){
        this._updateAILogic();
        this._super();
        this._range && ((this.x<this._range[0] && (this.x = this._range[0])) || (this.x>this._range[1] && (this.x = this._range[1])))
        var players = this.getParent().players,
            monsterSize = this.getMySize(),
            playerSize, temp;
        for(var i=0,l=players.length; i<l; i++){
            temp = players[i];
            playerSize = temp.getMySize();
            if(cc.rectIntersectsRect(cc.rect(temp.x-playerSize.width/2, temp.y, playerSize.width, playerSize.height), cc.rect(this.x-monsterSize.width/2, this.y, monsterSize.width, monsterSize.height))){
                temp.getMyHero().handleHit.call(temp, -this.getMyHero().getDamage(), this.x>temp.x);
            }
        }
    }
});