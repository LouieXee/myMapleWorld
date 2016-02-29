var DisplayObj = cc.Sprite.extend({
	_HP_WIDTH: 60,
	_HP_HEIGHT: 6,
	_HP_LINE_WIDTH: 1,
	ctor: function(opt){
		this._super();
		this._hero = opt.hero;
		this._hp = this._hero.MAX_HP;
		this._maxHP = this._hp;
		this._realSpeed = 0;
		this._dropSpeed = 0;
		this._status = GC.STATUS.STAND;
		this._isLeft = true;
		this._isAir = false;
		this._isHit = false; //击中并无敌
		this._controls = {};
		this._changeAnim("stand");
		this.setAnchorPoint(0.5, 0);
		this.setPosition(opt.x, opt.y);
		this._lastPoint = cc.p(opt.x, opt.y);
		this.scheduleUpdate();
		var _point = new cc.DrawNode();
//		_point.drawRect(cc.p(0, 0), cc.p(10, 10), cc.color.RED, this._HP_LINE_WIDTH, cc.color.BLACK)
//		this.addChild(_point);
		this._hpNode = new cc.DrawNode();
		this._hpNode.setPosition(-(this._HP_WIDTH-this.getMySize().width)/2, this.getMySize().height+10);
		this._hpNode.drawRect(cc.p(0, 0), cc.p(this._HP_WIDTH, this._HP_HEIGHT), cc.color.RED, this._HP_LINE_WIDTH, cc.color.BLACK);
		this.addChild(this._hpNode);
	},
	/*
		private
		改变当前动画
		@method _changeAnim
		@for DisplayObj
		@param {string|object} animName 动画的名称或者动画对象
	 */
	_changeAnim: function(animName){
		this.stopActionByTag("action");
		animName = typeof animName == "string"?this._hero.animations[animName]:animName;
		animName.setTag("action");
		this.runAction(animName);
	},
	/*
		private
		获得攻击范围矩形
		@method _getHitRect
		@param {Array} range 攻击范围
		@return {cc.Rect}
	*/
	_getHitRect: function(range){
		return this._isLeft?cc.rect(this.x-range[0]-range[2], this.y+range[1], range[2], range[3]):
               				cc.rect(this.x+range[0], this.y+range[1], range[2], range[3]);
	},
	/*
		private
		获得攻击对象
		@method _getHitTarget
		@param {object} config config.range 攻击范围
		@param {Array} target 检测对象
		@return {Array}
	*/
	_getHitTarget: function(config, target){
		var rangeRect = this._getHitRect(config.range), temp, size, result = [];
		for(var i=0,l=target.length; i<l; i++){
			temp = target[i];
			size = temp.getMySize();
			if(cc.rectIntersectsRect(rangeRect, cc.rect(temp.x-size.width/2, temp.y, size.width, size.height))){
				result.push(temp);
			}
		}
		return result;
	},
	/*
		private
		获得攻击回调函数
		@method _getHitCallFunc
		@param {object} config config.range 攻击范围 config.damageScale 伤害系数
		@param {cc.CallFunc}
	*/
	_getHitCallFunc: function(config){
		var target = this.getTag()==GC.TYPE.PLAYER?this.getParent().monsters:this.getParent().players,
			rangeRect = this._getHitRect(config.range);
		return cc.callFunc(function(){
			var temp = null,
				size = null;
			for(var i=0,l=target.length; i<l; i++){
				temp = target[i];
				size = temp.getMySize();
				if(!temp.isDead() && cc.rectIntersectsRect(rangeRect, cc.rect(temp.x-size.width/2, temp.y, size.width, size.height))){
					config.effect && cc.audioEngine.playEffect(config.effect, false);
					temp._hero.handleHit.call(temp, -Math.ceil(this.getMyHero().getDamage()*config.damageScale), this.x>temp.x, this);
				}
			}
		}, this);
	},
	/*
		private
		显示伤害数字
		@method _showDamageNumber
		@param {string} num 伤害数值
	*/
	_showDamageNumber: function(num){
		num = num.match(/\d/g);
		cc.spriteFrameCache.addSpriteFrames(res.damageNumberPlist);
		var damage = new cc.Sprite(),
			temp = null,
			DELTA_X = 20;
		for(var i=0,l=num.length; i<l; i++){
			temp = new cc.Sprite("#damage_"+num[i]+".png");
			temp.setPosition(DELTA_X*i, 0);
			damage.addChild(temp);
		}
		damage.setAnchorPoint(0.5, 0);
		damage.setPosition(this.getMySize().width/2, this.getMySize().height);
		damage.setCascadeOpacityEnabled(true);
		damage.runAction(cc.sequence(cc.spawn(cc.moveBy(1, 0, 70), cc.fadeOut(1)), cc.removeSelf()));
		this.addChild(damage);
	},
	/*
		private
		重绘HP条
		@method _repaintHP
	*/
	_repaintHP: function(){
		this._hpNode.clear();
		this._hpNode.drawRect(cc.p(0, 0), cc.p(this._HP_WIDTH, this._HP_HEIGHT), null, this._HP_LINE_WIDTH, cc.color.BLACK);
		this._hp && this._hpNode.drawRect(cc.p(1, 1), cc.p(this._HP_WIDTH*(this._hp/this._maxHP)-2, this._HP_HEIGHT-1), cc.color.RED, 0, cc.color.RED);
	},
	/*
		public
		返回英雄
		@method getMyHero
		@return {Hero}
	*/
	getMyHero: function(){
		return this._hero;
	},
	/*
		public
		返回降落速度
		@method getDropSpeed
		@for DisplayObj
		@return {int} 降落速度
	 */
	getDropSpeed: function(){
		return this._dropSpeed;
	},
	/*
	 *  public
	 *	返回最大水平移动速度
	 *	@method getMaxSpeed
	 *	@for DisplayObj
	 *	@return {int}
	 * */
	getMaxSpeed: function(){
		return this._hero.MAX_SPEED;
	},
	/*
	 * 返回实际水平移动速度
	 * @method getRealSpeed
	 * @for DisplayObj
	 * @return {int}
	 * */
	getRealSpeed: function(){
		return this._realSpeed
	},
	/*
	 *	返回精灵站立时的尺寸
	 *  	@method getMySize
	 *  	@for DisplayObj
	 *  	@return {object}
	 * */
	getMySize: function(){
		return this._hero.SIZE;
	},
	/*
		返回上一帧坐标
		@method getLastPoint
		@for DisplayObj
		public
		@return {cc.Point}
	*/
	getLastPoint: function(){
		return this._lastPoint;
	},
	/*
		设置上一坐标
		@method setLastPoint
		@for DisplayObj
		public
		@param {number} x
		@param {number} y
	*/
	setLastPoint: function(x, y){
		if(typeof x === "object"){
			this._lastPoint.x = x.x;
			this._lastPoint.y = x.y;
			return true;
		}
		x && (this._lastPoint.x = x);
		y && (this._lastPoint.y = y);
	},
	/*
	 设置isAir
	 @method setAir
	 @for DisplayObj
	 @param {bool} isAir
	 */
	setAir: function(isAir){
		if(this._isAir && !isAir){
			this._dropSpeed = 0;
		}
		this._isAir = isAir;
	},
	/*
		public
		是否死亡
		@method isDead
		@for DisplayObj
	*/
	isDead: function(){
		return this._status==GC.STATUS.DEAD;
	},
	/*
		设置hp
		public
		@method setHP
		@for DisplayObj
		@param {int} deltaHP hp改变量
	*/
	setHP: function(deltaHP){
		if(this._status == GC.STATUS.DEAD) return false;
		this._hp += deltaHP;
		if(this._hp < 0) this._hp = 0;
		else if(this._hp > this._maxHP) this._hp = this._maxHP;
		if(this._repaintHP) this._repaintHP();
		if(this._hp == 0) this._status = GC.STATUS.DEAD;
	},
	/*
		public
		重生
		@method reborn
		@for DisplayObj
		@param {number} hp
		@param {cc.Point} bornPoint
	*/
	reborn: function(hp, bornPoint){
		this._hp = hp || this._hero.MAX_HP;
		this._status = GC.STATUS.STAND;
		this._isLeft = true;
		this._isAir = false;
		this._realSpeed = 0;
		this._dropSpeed = 0;
		this._controls = {};
		this._changeAnim("stand");
		bornPoint && this.setPosition(bornPoint);
		bornPoint && (this._lastPoint = bornPoint);
		this.scheduleUpdate();
		this._repaintHP();
		this.setVisible(true);
	},
	update: function(){
		this._hero._updateControlLogic.call(this);
	}
});