var Background = cc.Sprite.extend({
    ctor: function(opt){
        this._super();
        this._render(cc.textureCache.getTextureForKey(opt.texture), opt.xLength||1, opt.yLength||1);
        this.setPosition(opt.x||0, opt.y||0);
    },
    /*
        初始化显示
        @method _render
        @for Wall
        @param {cc.Texture2D} texture 渲染用的纹理
        @param {int} x 横向数量长度
        @param {int} y 纵向数量长度
    */
    _render: function(texture, x, y){
        var mainSprite = null,
            size = texture.getContentSize();
        if(x*y == 1){
            mainSprite = new cc.Sprite(texture),
            mainSprite.setAnchorPoint(0, 0);
        }else{
            var temp = null;
            mainSprite = new cc.SpriteBatchNode(texture, x*y);
            for(var i=0; i<y; i++){
                for(var j=0; j<x; j++){
                    temp = new cc.Sprite(texture);
                    temp.setAnchorPoint(0, 0);
                    temp.setPosition(j*size.width, i*size.height);
                    mainSprite.addChild(temp);
                }
            }
        }
        this.addChild(mainSprite);
    }
});