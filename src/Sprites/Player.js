var Player = DisplayObj.extend({
	_MAX_HIT_TIME: 2,
	ctor: function(opt){
		this._super(opt);
		this.setTag(GC.TYPE.PLAYER);
		this.isTalk = false; //TODO 对话界面重复显示的优化 NPC PLAYER TalkLayout 中含有isTalk这个属性，后期优化记得移除
		this.questList = {};
		this.heroes = [opt.hero];
		this._heroesIndex = 0;
		this._rockerLengthScale = -1;
		this._jumpCount = 0;
		this._transformTarget = null;
		this._initListener();
	},
	/*
	 初始化事件
	 @method _initListener
	 @for Player
	 */
	_initListener: function(){
		if(cc.sys.capabilities.hasOwnProperty('touches')){
			TOUCH_LAYER = new TouchLayer(),
			cc.eventManager.addListener({
				event: cc.EventListener.CUSTOM,
				target: this,
				eventName: "rockerMove",
				callback: this._handleRockerMove
			}, this);
			cc.eventManager.addListener({
				event: cc.EventListener.CUSTOM,
				target: this,
				eventName: "rockerEnd",
				callback: this._handleRockerEnd
			}, this);
			cc.eventManager.addListener({
				event: cc.EventListener.CUSTOM,
				target: this,
				eventName: "attack",
				callback: function(event){
					this.target._controls[GC.CONTROLS.ATTACK] = event.getUserData();
				}
			}, this)
			cc.eventManager.addListener({
				event: cc.EventListener.CUSTOM,
				target: this,
				eventName: "jump",
				callback: function(event){
					var _this = this.target,
						temp = event.getUserData();
					this.target._controls[GC.CONTROLS.JUMP] = temp;
					if(temp && _this._isAir && _this._jumpCount == 1){
						_this._controls[GC.CONTROLS.DOUBLE_JUMP] = true;
					}
					 if(!temp && _this._isAir){
						_this._jumpCount++;
					}
				}
			}, this)
		}
		if (cc.sys.capabilities.hasOwnProperty('keyboard')){
			cc.eventManager.addListener({
				event: cc.EventListener.KEYBOARD,
				target: this,
				onKeyPressed: this._handleKeyPressed,
				onKeyReleased: this._handleKeyReleased
			}, this);
		}
		//TODO 改成更具一般性的方法
		cc.eventManager.addListener({
			event: cc.EventListener.CUSTOM,
			target: this,
			eventName: "heroDie",
			callback: function(event){
				if(event.getUserData().type == GC.TYPE.PLAYER){
					var _this = this.target;
					_this.handleTransform(function(){
						_this.reborn(_this._hero.MAX_HP, cc.p(1200, 500));
						this.addChild(new TalkLayout({
							npc: "Ninja",
							words: ["哈哈~  不小心挂了吧~  这游戏就是没有血药~"]
						}))
					}, {x: 1200, y: 500, targetMap: "sunsetCity"});
				}
			}
		}, this);
	},
	/*
	 处理摇杆的移动事件
	 @method _handleRockerMove
	 @for Player
	 */
	_handleRockerMove: function(event){
		var _this = this.target,
			_data = event.getUserData();

		_this._rockerLengthScale = _data.lengthScale;
		_this._controls[GC.CONTROLS.UP] = _this._controls[GC.CONTROLS.DOWN] = _this._controls[GC.CONTROLS.LEFT] = _this._controls[GC.CONTROLS.RIGHT] = false;
		switch(_data.dir){
			case GC.DIR.UP:
				_this._controls[GC.CONTROLS.UP] = true;
				break;
			case GC.DIR.DOWN:
				_this._controls[GC.CONTROLS.DOWN] = true;
				break;
			case GC.DIR.LEFT:
				_this._controls[GC.CONTROLS.LEFT] = true;
				break;
			case GC.DIR.RIGHT:
				_this._controls[GC.CONTROLS.RIGHT] = true;
				break;
			default:
				break;
		}
	},
	/*
	 处理摇杆释放事件
	 @method _handleRockerEnd
	 @for Player
	 */
	_handleRockerEnd: function(){
		var _this = this.target;
		_this._rockerLengthScale = 0;
		_this._controls[GC.CONTROLS.UP] = _this._controls[GC.CONTROLS.DOWN] = _this._controls[GC.CONTROLS.LEFT] = _this._controls[GC.CONTROLS.RIGHT] = false;
	},
	/*
	 处理键盘按下事件
	 @method _handleKeyPressed
	 @for Player
	 */
	_handleKeyPressed: function(key, event){
		var _this = this.target;
		_this._controls[key] = true;
		if(key == GC.CONTROLS.JUMP && _this._isAir && _this._jumpCount == 1){
			_this._controls[GC.CONTROLS.DOUBLE_JUMP] = true;
		}
	},
	/*
	 处理键盘释放事件
	 @method _handleKeyReleased
	 @for Player
	 */
	_handleKeyReleased: function(key, event){
		var _this = this.target;
		_this._controls[key] = false;
		if(key == GC.CONTROLS.JUMP && _this._isAir){
			_this._jumpCount++;
		}
		if(key == GC.CONTROLS.CHANGE_HERO && !_this._isAir){
			_this.handleChangeHero();
		}
	},
	/*
		public
		设置传送参数对象
		@method setTransformTarget
		@param {object} obj 参数对象 包括目标地图名称targetMap，目标位置x坐标和目标位置y坐标
	*/
	setTransformTarget: function(obj){
		this._transformTarget = obj;
	},
	/*
		处理传送事件
		@method handleTransform
		@param {function} optional callback
		@param {object} optional myTransformTarget 传送对象
	*/
	handleTransform: function(callback, myTransformTarget){
		myTransformTarget && (this._transformTarget = myTransformTarget);
		var map = new Map({mapConfig: this._transformTarget.targetMap, callback: callback});
		cc.director.getRunningScene().removePlayer(this);
		cc.director.runScene(new cc.TransitionFade(1, map));
		this.setPosition(this._transformTarget.x, this._transformTarget.y);
		this.setLastPoint(this._transformTarget.x, this._transformTarget.y);
		this._controls = {};
        map.addPlayer(this);
		this._transformTarget = null;
		this._controls[GC.CONTROLS.UP] = false;
	},
	/*
		处理二段跳事件
		@method handleDoubleJump
		@for Player
	*/
	handleDoubleJump: function(){
		if(this._status != GC.STATUS.DEAD && this._status != GC.STATUS.SKILL && this._status != GC.STATUS.HIT){
			this._controls[GC.CONTROLS.DOUBLE_JUMP] = false;
			this._dropSpeed = -this._hero.JUMP_SPEED;
			this._realSpeed = this._isLeft?-10:10;
		}
	},
	/*
		处理角色变化
		@method handleChangeHero
		@for Player
	*/
	handleChangeHero: function(){
		this._controls[GC.CONTROLS.CHANGE_HERO] = false;
		this._heroesIndex++;
		this._hero = this.heroes[this._heroesIndex%this.heroes.length];
		this._hpNode.setPosition(-(this._HP_WIDTH-this.getMySize().width)/2, this.getMySize().height+10);
		this._changeAnim("stand");
	},
	/*
		重载update，添加用户操作逻辑
		@method _addtionalUpdate
	*/
	update: function(){
		this._super();
		if(this._controls[GC.CONTROLS.JUMP] && this._status != GC.STATUS.DEAD && !this._isAir && this._status != GC.STATUS.SKILL && this._status != GC.STATUS.HIT){
			cc.audioEngine.playEffect("res/Sound/Jump.mp3");
		}
		if(this._transformTarget && this._controls[GC.CONTROLS.UP]){
			this.handleTransform();
		}
		if(this._controls[GC.CONTROLS.DOUBLE_JUMP]){
			this.handleDoubleJump();
		}
	}
});