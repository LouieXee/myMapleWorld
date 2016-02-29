var Ground = cc.Sprite.extend({
    ctor: function(opt){
        this._super();
        this._size = {
            width: 0,
            height: GC.GROUND_HEIGHT
        };
        if(opt.texture){
            this._render(cc.textureCache.getTextureForKey(opt.texture), opt.length, opt.edgeLeftTexture, opt.edgeRightTexture);
        }else{
            this._size = opt.size;
        }
        this.setPosition(opt.x, opt.y);
    },
    /*
        初始化地面的显示
        @method _render
        @for Ground
        @param {cc.Texture2D} texture 渲染用的纹理
        @param {int} length 渲染的数量
        @param {cc.Texture2D} edgeLeftTexture optional 左边缘纹理
        @param {cc.Texture2D} edgeRightTexture optional 右边缘纹理
    */
    _render: function(texture, length, edgeLeftTexture, edgeRightTexture){
        var mainSprite = null,
            edgeLeftSprite = edgeLeftTexture?new cc.Sprite(edgeLeftTexture, cc.rect(0, 0, 37, 27)): null,
            edgeRightSprite = edgeRightTexture?new cc.Sprite(edgeRightTexture, cc.rect(37, 0, 37, 27)): null,
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
                temp.setPosition(i*size.width, 0);
                mainSprite.addChild(temp);
            }
        }
        this._size.width = length*size.width;
        if(edgeLeftSprite){
            edgeLeftSprite.setAnchorPoint(0, 0);
            edgeLeftSprite.setPosition(0, 0);
            mainSprite.setPosition(GC.HALF_GROUND_WIDTH, 0);
            this._size.width += GC.HALF_GROUND_WIDTH;
            this.addChild(edgeLeftSprite);
        }
        if(edgeRightSprite){
            edgeRightSprite.setAnchorPoint(0, 0);
            edgeRightSprite.setPosition(this._size.width, 0);
            this._size.width += GC.HALF_GROUND_WIDTH;
            this.addChild(edgeRightSprite);
        }
        this.addChild(mainSprite);
    },
    /*
        判断是否接触地面
        @method checkIsHit
        @for Ground
        @param {cc.Sprite} obj 判断目标对象
        @return {bool} 是否接触
    */
    checkIsHit: function(obj){
        var realSpeed = Math.abs(obj.getRealSpeed()),
            dropSpeed = obj.getDropSpeed();
        if(dropSpeed >= 0
         && obj.y+dropSpeed >= this.y+this._size.height-realSpeed
         && obj.x >= this.x
         && obj.x <= this.x+this._size.width
         && obj.y-realSpeed <= this.y+this._size.height){
            obj.setAir(false);
            obj.y = this.y+this._size.height;
            return true;
        }
        obj.setAir(true);
        return false;
    }
})