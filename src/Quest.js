/*
    任务类
    @class Quest
    @param {string} name
    @param {Array} questWords
    @param {Array} unfinishedWords
    @param {Array} finishedWords
    @param {Array} questConfig
    @param {Function} callback
*/
var Quest = cc.Class.extend({
    ctor: function(opt){
        this._name = opt.name;
        this.questWords = opt.questWords;
        this.callback = opt.callback;
        this.unfinishedWords = opt.unfinishedWords;
        this.finishedWords = opt.finishedWords;
        this.finishedCallback = opt.finishedCallback;
        this._finishedTarget = opt.questConfig.length;
        this._finishedCount = 0;
        this._initListner(opt.questConfig);
    },
    _initListner: function(config){
        for(var i=0,l=config.length; i<l; i++){
            switch(config[i].type){
                case GC.QUEST_TYPE.HUNT:
                    this._initHunt(config[i]);
                    break;
                default:
                    break;
            }
        }
    },
    /*
        添加对狩猎事件的监听
        @method _initHunt
        @param {object} config config.type 任务类型 config.target 狩猎对象名称 config.number 狩猎数额
    */
    _initHunt: function(config){
        var _count = 0, label,
            _listener = cc.EventListener.create({
                event: cc.EventListener.CUSTOM,
                eventName: "heroDie",
                target: this,
                callback: function(event){
                    var temp = event.getUserData();
                    if(temp.type == GC.TYPE.MONSTER && temp.name == config.target){
                        _count++;
                        label && label.runAction(cc.removeSelf());
                        label = new cc.LabelTTF(temp.name+" "+_count+"/"+config.number, "宋体", 21);
                        label.setColor(cc.color.GRAY);
                        label.runAction(cc.sequence(cc.fadeOut(2), cc.removeSelf()));
                        label.setPosition(GC.winSize.width/2, GC.winSize.height-100);
                        PLAYER.getParent().getParent().addChild(label);
                        if(_count == config.number){
                            cc.eventManager.removeListener(_listener);
                            this.target._finishedCount++;
                        }
                    }
                }
            });
        cc.eventManager.addListener(_listener, PLAYER);
    },
    /*
        任务是否完成
        @method isFinished
        @return {bool}
    */
    isFinished: function(){
        return this._finishedCount == this._finishedTarget;
    }
});