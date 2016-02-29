var Rocker = cc.Sprite.extend({
	_main: null,
	_radius: 0,
	ctor: function(opt){
		this._super();
		this._initBase();
		this._initListener();
		this.setPosition(opt.x, opt.y);
	},
	_initBase: function(){
		var _base = new cc.Sprite(res.controlBase),
			_size = _base.getContentSize();
		this._main = new cc.Sprite(res.controlMain);
		this.addChild(_base);
		this.addChild(this._main);
		this.setCascadeOpacityEnabled(true);
		this.setOpacity(128);
		this._radius = 2*_size.width/5;
	},
	_initListener: function(){
		var _listener = cc.EventListener.create({
			event: cc.EventListener.TOUCH_ONE_BY_ONE,
			swallowTouches: false,
			target: this,
			onTouchBegan: this._onTouchBegan,
			onTouchMoved: this._onTouchMoved,
			onTouchEnded: this._onTouchEnded
		});
		cc.eventManager.addListener(_listener, this);
	},
	_onTouchBegan: function(touch, event){
		var _this = this.target,
			_main = _this._main,
			_point = _main.convertToNodeSpace(touch.getLocation()),
			_size = _main.getContentSize(),
			_rect = new cc.Rect(0, 0, _size.width, _size.height);
		if(cc.rectContainsPoint(_rect, _point)){
			_main.setColor(cc.color.RED);
			return true;
		}
		return false;
	},
	_onTouchMoved: function(touch, event){
		var _this = this.target,
			_main = _this._main,
			_point = _this.convertToNodeSpace(touch.getLocation()),
			_deltaLength = Math.sqrt(_point.x*_point.x+_point.y*_point.y),
			_angle = _point.y<0?(2*Math.PI-Math.acos(_point.x/_deltaLength)):Math.acos(_point.x/_deltaLength),
			_event = null;
		
		if(_deltaLength > _this._radius){
			_deltaLength = _this._radius;
			_point.x = _this._radius*Math.cos(_angle);
			_point.y = _this._radius*Math.sin(_angle);
		}
		_main.setPosition(_point);
		_event = new cc.EventCustom("rockerMove");
		_event.setUserData({
			dir: _this._getDir(_angle),
			lengthScale: _deltaLength/_this._radius
		})
		cc.eventManager.dispatchEvent(_event);
		return true;
	},
	_onTouchEnded: function(touch, event){
		var _this = this.target,
			_main = _this._main;
		_main.setColor(cc.color.WHITE);
		_main.setPosition(0, 0);
		_event = new cc.EventCustom("rockerEnd");
		cc.eventManager.dispatchEvent(_event);
	},
	_getDir: function(angle){
		if(angle > Math.PI/4 && angle <= 3*Math.PI/4){
			return GC.DIR.UP;
		}else if(angle > 7*Math.PI/4 || angle <= Math.PI/4){
			return GC.DIR.RIGHT;
		}else if(angle > 5*Math.PI/4 && angle <= 7*Math.PI/4){
			return GC.DIR.DOWN;
		}else if(angle > 3*Math.PI/4 && angle <= 5*Math.PI/4){
			return GC.DIR.LEFT;
		}
	}
});