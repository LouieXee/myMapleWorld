var TouchLayer = cc.Layer.extend({
    ctor: function(){
        this._super();
        this.addChild(new Rocker({x: 100, y: 100}), 65535);
        var temp = new cc.Sprite(res.controlMain);
        temp.setColor(cc.color.RED);
        this.addChild(new Button({x: GC.winSize.width-150, y: 70, sprite: temp, eventName: "attack"}))
        temp = new cc.Sprite(res.controlMain);
        temp.setColor(cc.color(0, 64, 255));
        this.addChild(new Button({x: GC.winSize.width-70, y: 140, sprite: temp, eventName: "jump"}))
    }
});