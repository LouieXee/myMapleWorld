/*
    对话界面
    @class TalkLayout
    @param {Array} words 数组项为字符串，为对话内容
    @param {Function} callback 对话结束回调函数
    @param {NPC} npc 在对话界面中展示的npc
*/
var TalkLayout = ccui.Layout.extend({
    WIDTH: 480,
    HEIGHT: 180,
    TEXT_WIDTH: 350,
    TEXT_HEIGHT: 150,
    ctor: function(opt){
        this._super();
        this._words = opt.words.slice(0);
        this._callback = opt.callback;
        this.setContentSize(this.WIDTH, this.HEIGHT);
        this.setAnchorPoint(0.5, 0.5);
        this.setPosition(GC.winSize.width/2, GC.winSize.height/2);
        this.setBackGroundColorType(ccui.Layout.BG_COLOR_SOLID);
        this.setBackGroundColor(cc.color.WHITE);
        this._text = new ccui.Text(this._words.shift(), "宋体", 16);
        this._text.setTextColor(cc.color.BLACK);
        this._text.ignoreContentAdaptWithSize(false);
        this._text.setContentSize(this.TEXT_WIDTH, this.TEXT_HEIGHT);
        this._text.setTextHorizontalAlignment(cc.TEXT_ALIGNMENT_LEFT);
        this._text.setAnchorPoint(0, 1);
        this._text.setPosition(15, this.HEIGHT-15);
        var npc = new window[opt.npc]({x: this.WIDTH-50, y: this.HEIGHT/2}),
            okBtn = new ccui.Button(),
            cancelBtn = new ccui.Button();
        okBtn.loadTextures("res/UI/okBtn.png", "res/UI/okBtnPressed.png", "");
        cancelBtn.loadTextures("res/UI/cancelBtn.png", "res/UI/cancelBtnPressed.png", "");
        okBtn.setTouchEnabled(true);
        cancelBtn.setTouchEnabled(true);
        okBtn.setPosition(50, 20);
        cancelBtn.setPosition(100, 20);
        okBtn.addTouchEventListener(this.nextTalk, this);
        cancelBtn.addTouchEventListener(function(sender, type){
            if(type == ccui.Widget.TOUCH_ENDED){
                PLAYER.isTalk = false;
                this.runAction(cc.removeSelf());
            }
        }, this)
        npc.setAnchorPoint(0.5, 0.5);
        this.addChild(npc);
        this.addChild(this._text);
        this.addChild(okBtn);
        this.addChild(cancelBtn);
    },
    /*
        切换到下一段对话
        @method nextTalk
    */
    nextTalk: function(sender, type){
        if(type == ccui.Widget.TOUCH_BEGAN){
        }else if(type == ccui.Widget.TOUCH_MOVED){
        }else if(type = ccui.Widget.TOUCH_ENDED){
            var temp = this._words.shift();
            if(temp){
                this._text.setString(temp);
            }else{
                if(this._callback){
                    this._callback();
                }
                PLAYER.isTalk = false;
                this.runAction(cc.removeSelf());
            }
        }
    }
});