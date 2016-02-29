var Wall = cc.Sprite.extend({
    _DELTA: GC.GROUND_HEIGHT,
    ctor: function(opt){
        this._super();
        this._isLeft = opt.isLeft;
        this._checkFn = this._isLeft?this._LEFT_CHECK_FN:this._RIGHT_CHECK_FN;
        this._isInfinite = opt.isInfinite || false;
        if(this._isInfinite){
            this._size = {width: 2, height: -1};
        }else if(opt.texture){
            this._size = {};
            this._render(cc.textureCache.getTextureForKey(opt.texture), opt.length);
        }else{
            this._size = opt.size;
        }
        this.setPosition(opt.x, opt.y);
    },
    /*
         初始化墙的显示
         @method _render
         @for Wall
         @param {cc.Texture2D} texture 渲染用的纹理
         @param {int} length 渲染的数量
     */
    _render: function(texture, length){
        var mainSprite = null,
            size = texture.getContentSize();
        if(length == 1){
            mainSprite = new cc.Sprite(texture),
            mainSprite.setAnchorPoint(0, 0);
        }else{
            var temp = null;
            mainSprite = new cc.SpriteBatchNode(texture, length);
            for(var i=0; i<length; i++){
                temp = new cc.Sprite(texture);
                temp.setAnchorPoint(0, 0);
                temp.setPosition(0, i*size.height);
                mainSprite.addChild(temp);
            }
        }
        this._size.width = size.width;
        this._size.height = size.height*length;
        this.addChild(mainSprite);
    },
    /*
         判断是否接触墙
         @method checkIsHit
         @for Wall
         @param {cc.Sprite} obj 判断目标对象
         @return {bool} 是否接触
     */
    checkIsHit: function(obj){
        var lastPoint = obj.getLastPoint();
        if(((!this._isInfinite && !((obj.y >= this.y+this._DELTA+this._size.height && lastPoint.y >= this.y+this._DELTA+this._size.height) || (obj.y < this.y+this._DELTA && lastPoint.y < this.y+this._DELTA))) || this._isInfinite)
         && this._checkFn(obj, lastPoint)){
            return true;
        }
        return false;
    },
    _LEFT_CHECK_FN: function(obj, lastPoint){
        if(lastPoint.x <= this.x && obj.x >= this.x){
            obj.setPosition(this.x, obj.y);
            return true;
        }
        return false;
    },
    _RIGHT_CHECK_FN: function(obj, lastPoint){
        if(lastPoint.x >= this.x+this._size.width && obj.x <= this.x+this._size.width){
            obj.setPosition(this.x+this._size.width, obj.y);
            return true;
        }
        return false;
    }
})