var Button = cc.Sprite.extend({
    _size: null,
    ctor: function(opt){
        this._super();
        this.addChild(opt.sprite);
        this._size = opt.sprite.getContentSize();
        this._initListener(opt.eventName);
        this.setCascadeOpacityEnabled(true);
        this.setOpacity(128);
        this.setPosition(opt.x, opt.y);
    },
    /*
        初始化点击事件
        @method _initListener
        @for Button
        @param {string} eventName 触发的事件名称
    */
    _initListener: function(eventName){
        var _listener = cc.EventListener.create({
            event: cc.EventListener.TOUCH_ONE_BY_ONE,
            target: this,
            swallowTouches: false,
            onTouchBegan: function(touch, event){
                var _this = this.target,
                    _point = _this.convertToNodeSpace(touch.getLocation()),
                    _rect = new cc.Rect(-_this._size.width/2, -_this._size.height/2, _this._size.width, _this._size.height);
                if(cc.rectContainsPoint(_rect, _point)){
                    var _event = new cc.EventCustom(eventName);
                    _event.setUserData(true);
                    cc.eventManager.dispatchEvent(_event);
                    return true;
                }
                return false;
            },
            onTouchEnded: function(){
                var _event = new cc.EventCustom(eventName);
                _event.setUserData(false);
                cc.eventManager.dispatchEvent(_event);
            }
        });
        cc.eventManager.addListener(_listener, this);
    }
});