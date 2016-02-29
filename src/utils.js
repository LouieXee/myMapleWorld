var utils = {};
/*
    删除数组中的匹配项
    @method deleteOne
    @param {Array} arr 数组
    @param {object} item 数组项
*/
utils.deleteOne = function(arr, item){
	for(var i=0,l=arr.length; i<l; i++){
		if(arr[i] == item){
			arr.splice(i, 1);
			break;
		}
	}
};
/*
	创建动画
	@method createAnim
	@param {string} name 动画名称
	@param {number} length 动画帧总长
	@param {number} framerate 帧率
	@return {cc.Animate} 创建完成的动画
*/
utils.createAnim = function(name, length, framerate){
	var frames = [],
		str = "";
	for(var i=0; i<length; i++){
		str = name+i+".png";
		frames.push(cc.spriteFrameCache.getSpriteFrame(str));
	}
	return cc.animate(new cc.Animation(frames, framerate));
};
/*
	克隆对象
	@method clone
	@param {Object} obj
	@return {Object}
*/
utils.clone = function(obj){
	var result = {};
	for(var name in obj){
		result[name] = obj[name];
	}
	return result;
};