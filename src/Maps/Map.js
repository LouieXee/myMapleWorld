/*
	@Class Map
	@param {string} mapConfig 地图名称
	@param {function} callback 回调函数
*/
var Map = cc.Scene.extend({
	ctor: function(opt){
		this._super();
		this._mapConfig = GC.MAPS_CONFIG[opt.mapConfig];
		this.callback = opt.callback;
		this._mapLayer = new cc.Layer();
		this._bgLayer = new cc.Layer();
		this._grounds = []; //地面，包括斜坡
		this._walls = [];   //墙
		this._doors = [];   //传送门
		this._displayObjs = []; //包括怪物和主角,用以检测地面是否接触物体从而判断是否悬空,以及判断墙体是否接触物体从而判断是否阻止前进
		this._mapLayer.monsters = [];
		this._mapLayer.players = [];
		this._loadBg();
		this._loadMap();
		this._mapLayer.runAction(cc.follow(PLAYER, new cc.Rect(0, 0, this._mapConfig.width, this._mapConfig.height)));
		this.scheduleUpdate();
        this.schedule(this._updateMonster, 60);
        cc.audioEngine.playMusic(this._mapConfig.bg, true);
	},
	onEnter: function(){
		this._super();
		this.callback && this.callback.call(this);
	},
	/*
	    public
	    添加玩家
	    @method addPlayer
	    @param {Player} player
	*/
	addPlayer: function(player){
	    this._mapLayer.addChild(player);
	    this._mapLayer.players.push(player);
	    this._displayObjs.push(player);
	    TOUCH_LAYER && this.addChild(TOUCH_LAYER);
	},
	/*
	    public
	    移除玩家
	    @method removePlayer
	    @param {Player} player
	*/
	removePlayer: function(player){
        this._mapLayer.removeChild(player, false);
        this.removeChild(TOUCH_LAYER, false);
        utils.deleteOne(this._mapLayer.players, player);
        this._mapLayer.stopAllActions();
	},
	_loadBg: function(){
	    for(var i=0,l=this._mapConfig.BACKGROUNDS.length; i<l; i++){
	        this._bgLayer.addChild(new Background(this._mapConfig.BACKGROUNDS[i]));
	    }
		this._bgLayer.bake();
		this.addChild(this._bgLayer);
	},
	_loadMap: function(){
		var opt, temp, i, l;
		if(this._mapConfig.WALL_BACKGROUNDS){
			for(i=0,l=this._mapConfig.WALL_BACKGROUNDS.length; i<l; i++){
				this._mapLayer.addChild(new Background(this._mapConfig.WALL_BACKGROUNDS[i]));
			}
		}
		if(this._mapConfig.SLOPES){
			for(i=0,l=this._mapConfig.SLOPES.length; i<l; i++){
				temp = new Slope(this._mapConfig.SLOPES[i]);
				this._grounds.push(temp);
				this._mapLayer.addChild(temp);
			}
		}
		if(this._mapConfig.GROUNDS){
			for(i=0,l=this._mapConfig.GROUNDS.length; i<l; i++){
				temp = new Ground(this._mapConfig.GROUNDS[i]);
				this._grounds.push(temp);
				this._mapLayer.addChild(temp);
			}
		}
		if(this._mapConfig.WALLS){
			for(i=0,l=this._mapConfig.WALLS.length; i<l; i++){
				temp = new Wall(this._mapConfig.WALLS[i]);
				this._walls.push(temp);
				this._mapLayer.addChild(temp);
			}
		}
		this._walls.push(new Wall({x: 0, y: 0, isLeft: false, isInfinite: true}));
		this._walls.push(new Wall({x: this._mapConfig.width, y: 0, isLeft: true, isInfinite: true}));
		if(this._mapConfig.NPCS){
			for(i in this._mapConfig.NPCS){
				temp = this._mapConfig.NPCS[i];
				this._mapLayer.addChild(new window[temp.npc](temp));
			}
		}
		if(this._mapConfig.MONSTERS){
			for(i=0,l=this._mapConfig.MONSTERS.length; i<l; i++){
				opt = utils.clone(this._mapConfig.MONSTERS[i]);
				opt.hero = new window[opt.hero];
				temp = new Monster(opt);
				this._displayObjs.push(temp);
				this._mapLayer.monsters.push(temp);
				this._mapLayer.addChild(temp);
			}
		}
		if(this._mapConfig.DOORS){
			for(i=0,l=this._mapConfig.DOORS.length; i<l; i++){
				temp = new Door(this._mapConfig.DOORS[i]);
				this._doors.push(temp);
				this._mapLayer.addChild(temp);
			}
		}
		this._mapLayer.bake();
		this.addChild(this._mapLayer);
	},
	update: function(){
		for(var i=0,l=this._displayObjs.length; i<l; i++){
			var temp = this._displayObjs[i];
			for(var a=0,b=this._walls.length; a<b; a++){
				if(this._walls[a].checkIsHit(temp)) break;
			}
			for(a=0,b=this._grounds.length; a<b; a++){
				if(this._grounds[a].checkIsHit(temp)) break;
			}
		}
		for(i=0,l=this._doors.length; i<l; i++){
			if(this._doors[i].checkIsHit(PLAYER)) break;
		}
	},
	/*
		private
		刷新怪物
		@method _updateMonster
	*/
	_updateMonster: function(){
		for(var i=0,l=this._mapLayer.monsters.length; i<l; i++){
			if(this._mapLayer.monsters[i].isDead()){
                this._mapLayer.monsters[i].reborn();
			}
		}
	}
});
