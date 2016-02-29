var Slope = cc.Sprite.extend({
    _DELTA: GC.BG_HEIGHT,
    ctor: function(opt){
        this._super();
        this._size = {};
        this._isUp = opt.isUp;
        this._checkFn = this._isUp?this._upCheckFn:this._downCheckFn;
        if(opt.texture){
            this._render(cc.textureCache.getTextureForKey(opt.texture), opt.length);
        }else{
            this._size = opt.size;
        }
        this.setPosition(opt.x, opt.y);
    },
    /*
        初始化斜坡的显示
        @method _render
        @for Slope
        @param {cc.Texture2D} texture 渲染用的纹理
        @param {int} length 渲染的数量
    */
    _render: function(texture, length){
        var mainSprite = null,
            size= texture.getContentSize();
        if(length == 1){
            mainSprite = new cc.Sprite(texture),
            mainSprite.setAnchorPoint(0, 0);
        }else{
            var temp = null,
                tempHeight = 0;
            mainSprite = new cc.SpriteBatchNode(texture, length),
            this._DELTA = this._isUp?this._DELTA:-this._DELTA;
            for(var i=0; i<length; i++){
                temp = new cc.Sprite(texture);
                temp.setAnchorPoint(0, 0);
                temp.setPosition(i*size.width, tempHeight);
                mainSprite.addChild(temp);
                tempHeight += this._DELTA;
            }
        }
        this._size.width = size.width*length;
        this.addChild(mainSprite);
    },
    /*
        判断是否接触地面
        @method checkIsHit
        @for Slope
        @param {cc.Sprite} obj 判断目标对象
        @return {bool} 是否接触
    */
    checkIsHit: function(obj){
        if(obj.x>=this.x && obj.x<=this.x+this._size.width){
            var point = this.convertToNodeSpace(obj.getPosition()),
                lastPoint = this.convertToNodeSpace(obj.getLastPoint()),
                parentPoint = this.getParent().getPosition(),
                result = this._checkFn(point.x+parentPoint.x)-parentPoint.y,
                lastResult = this._checkFn(lastPoint.x+parentPoint.x)-parentPoint.y,
                DROP_DELTA = obj.getMaxSpeed();
            if(obj.getDropSpeed() >= 0 && lastPoint.y+DROP_DELTA >= lastResult && point.y <= result+DROP_DELTA){
                obj.setAir(false);
                lastPoint.y = result;
                point.y = result;
                obj.setLastPoint(this.convertToWorldSpace(lastPoint));
                obj.setPosition(this.convertToWorldSpace(point));
                return true;
            }
        }
        obj.setAir(true);
        return false;
    },
    _upCheckFn: function(x){
        return 2/3*x+27;
    },
    _downCheckFn: function(x){
        return -2/3*x+87;
    }
})