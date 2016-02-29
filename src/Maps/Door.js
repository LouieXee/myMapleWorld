/*
    传送门
    @class Door
    @param {string} targetMap 目标对象名称
    @param {number} targetX 传送目标位置x值
    @param {number} targetY 传送目标位置y值
    @param {number} x
    @param {number} y
    @param {number} optional width 门的宽度
    @param {number} optional height 门的高度
*/
var defaultDoorAnim = null,
    Door = cc.Sprite.extend({
    _DEFAULT_WIDTH: 89,
    _DEFAULT_HEIGHT: 100,
    ctor: function(opt){
        this._super();
        this._transformTarget = {
            targetMap: opt.targetMap,
            x: opt.targetX,
            y: opt.targetY
        };
        this._isShow = typeof opt.isShow=="undefined"?true:opt.isShow;
        this._rangeRect = cc.rect(opt.x-(opt.width||this._DEFAULT_WIDTH)/2, opt.y, opt.width||this._DEFAULT_WIDTH, opt.height||this._DEFAULT_HEIGHT);
        if(this._isShow){
            if(defaultDoorAnim === null){
                cc.spriteFrameCache.addSpriteFrames(res.doorPlist);
                defaultDoorAnim = utils.createAnim("door_", 8, 0.2).repeatForever();
            }
            this.runAction(defaultDoorAnim);
        }
        this.setAnchorPoint(0.5, 0);
        this.setPosition(opt.x, opt.y);
    },
    /*
        @method show
    */
    show: function(){
        this._isShow = true;
        if(defaultDoorAnim === null){
            cc.spriteFrameCache.addSpriteFrames(res.doorPlist);
            defaultDoorAnim = utils.createAnim("door_", 8, 0.2).repeatForever();
        }
        this.runAction(defaultDoorAnim);
    },
    /*
        判断是否到达门
        @method checkIsHit
        @param {cc.DisplayObj} obj 检测对象
        @return {boolean}
    */
    checkIsHit: function(){
        if(!this._isShow) return false;
        var playerSize = PLAYER.getMySize();
        if(cc.rectIntersectsRect(cc.rect(PLAYER.x, PLAYER.y, playerSize.width, playerSize.height), this._rangeRect)){
            PLAYER.setTransformTarget(this._transformTarget);
            return true;
        }else{
            PLAYER.setTransformTarget(null);
            return false;
        }
    }
});