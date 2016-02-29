var NPC = cc.Sprite.extend({
    ctor: function(opt){
        this._super();
        this.setAnchorPoint(0.5, 0);
        this.setPosition(opt.x, opt.y);
        this._animations = [];
        this._words = opt.words;
        this._questList = opt.questList;
        this._initListener(opt);
    },
    _initListener: (function(){
        if(cc.sys.capabilities.hasOwnProperty('touches')){
            return function(config){
                cc.eventManager.addListener({
                    event: cc.EventListener.TOUCH_ONE_BY_ONE,
                    target: this,
                    onTouchBegan: function(touch, event){
                        var _this = this.target,
                            point = _this.convertToNodeSpace(touch.getLocation()),
                            size = _this.getContentSize(),
                            rect = cc.rect(0, 0, size.width, size.height);
                        if(!PLAYER.isTalk && cc.rectContainsPoint(rect, point)){
                            _this._talkLogicFn();
                            return true;
                        }
                    }
                }, this)
            };
        }
        if(cc.sys.capabilities.hasOwnProperty('mouse')){
            return function(config){
                cc.eventManager.addListener({
                    event: cc.EventListener.MOUSE,
                    target: this,
                    onMouseDown: function(event){
                        var _this = this.target,
                            point = _this.convertToNodeSpace(event.getLocation()),
                            size = _this.getContentSize(),
                            rect = cc.rect(0, 0, size.width, size.height);
                        if(!PLAYER.isTalk && cc.rectContainsPoint(rect, point)){
                            _this._talkLogicFn();
                            return true;
                        }
                    }
                }, this)
                cc.eventManager.addListener({
                    event: cc.EventListener.KEYBOARD,
                    target: this,
                    onKeyReleased: function(key, event){
                        if(!PLAYER.isTalk && key == GC.CONTROLS.TALK){
                            var _this = this.target,
                                point = PLAYER.getPosition(),
                                size = PLAYER.getContentSize();
                            if(cc.rectIntersectsRect(cc.rect(point.x-size.width/2, point.y, size.width, size.height), cc.rect(_this.x-_this.SIZE.width/2, _this.y, _this.SIZE.width, _this.SIZE.height))){
                                _this._talkLogicFn();
                                return true;
                            }
                        }
                    }
                }, this)
            };
        }
    })(),
    /*
        对话后逻辑处理函数
        @method _talkLogicFn
    */
    _talkLogicFn: function(){
        var _this = this, questName = this._questList[0], config = {npc: this.getName()}, quest;
        if(questName){
            quest = PLAYER.questList[questName];
            if(quest && quest.isFinished()){
                config.words = quest.finishedWords;
                config.callback = function(){
                    quest.finishedCallback && quest.finishedCallback();
                    _this._questList.shift();
                    PLAYER.questList[questName] = null;
                };
            }else if(quest && !quest.isFinished()){
                config.words = quest.unfinishedWords;
            }else if(!quest){
                quest = new Quest(GC.QUEST_LIST[questName]);
                config.words = quest.questWords;
                config.callback = function(){
                    quest.callback && quest.callback()
                    PLAYER.questList[questName] = quest;
                };
            }
        }else{
            config.words = this._words;
        }
        PLAYER.isTalk = true;
        this.getParent().getParent().addChild(new TalkLayout(config));
    },
    /*
        播放动画
        @method _runAnim
        @for NPC
    */
    _runAnim: function(){
        this.stopAllActions();
        this.runAction(cc.sequence(this._animations[Math.floor(Math.random()*this._animations.length)], cc.callFunc(function(){
            this._runAnim();
        }, this)))
    }
});