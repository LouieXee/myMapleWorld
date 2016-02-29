var GC = GC || {},
    PLAYER = null,
    TOUCH_LAYER;
GC.DIR = {
    "DEFAULT": 0,
    "UP_LEFT": 1,
    "LEFT": 2,
    "DOWN_LEFT": 3,
    "DOWN": 4,
    "DOWN_RIGHT": 5,
    "RIGHT": 6,
    "UP_RIGHT": 7,
    "UP": 8
};
GC.STATUS = {
    "STAND": 0,    //在地面无动作状态
    "MOVE": 1,     //在地面左右键按下状态
    "SKILL": 2,    //释放技能状态
    "JUMP": 3,     //空中无动作状态或空中左右键按下状态
    "HIT": 4,       //击中并僵直状态
    "DEAD": 5
};
GC.GROUND_HEIGHT = 27;
GC.HALF_GROUND_WIDTH = 37;
GC.BG_HEIGHT = 60;
GC.CONTROLS = {
    "LEFT": cc.KEY.left,
    "RIGHT": cc.KEY.right,
    "UP": cc.KEY.up,
    "DOWN": cc.KEY.down,
    "ATTACK": cc.KEY.z,
    "ATTACK2": cc.KEY.s,
    "SKILL": cc.KEY.a,
    "JUMP": cc.KEY.x,
    "CHANGE_HERO": cc.KEY.q,
    "TALK": cc.KEY.space,
    "DOUBLE_JUMP": "MY_CONTROL_DOUBLE_JUMP"
};
GC.TYPE = {
    "PLAYER": 0,
    "MONSTER": 1
};
GC.QUEST_TYPE = {
    "HUNT": 0,     //狩猎怪物
    "COLLECT": 1   //收集物品
};
GC.QUEST_LIST = {};
GC.QUEST_LIST.huntCola = {
    questWords: ["骚年~既然你已经熟悉了操作，赶紧去活动活动筋骨吧~", "下面有一堆萌萌的可乐等着你~去击败十只再来找我吧~"],
    finishedWords: ["哟嚯~ 你竟然真的打败十只可乐~我真的要对你刮目相看了","接下来要面对更加困难的任务了哦~去准备一下然后再来找我吧~"],
    unfinishedWords: ["骚年不能偷懒哦~你还没打败十只可乐哦~继续努力吧"],
    questConfig: [{
        type: GC.QUEST_TYPE.HUNT,
        target: "Cola",
        number: 10
    }],
    finishedCallback: function(){
        GC.MAPS_CONFIG.sunsetCity.NPCS.Ninja.questList.push("huntPirate");
    }
};
GC.QUEST_LIST.huntPirate = {
    questWords: ["你真的已经准备好要去面对更强的挑战了吗", "既然你心意已决，那么去吧!骚年！小心别挂了哦！\n传送门已经为你开启！(打败boss将为你开启彩蛋哦)"],
    finishedWords: ["没想到你已经将本游戏一期中最强的怪物解决了！骚年！你太厉害啦！", "想知道彩蛋是什么吗~ 你已经成功解锁boss海盗的角色，拥有更强的攻击，z键、s键都是攻击技能，a键为buff技能，将在十秒内将伤害提升一倍哦~现在你只需要按下q键即可变身~"],
    unfinishedWords: ["哈哈~ 你又回来啦~ 没关系，打不过BOSS也不会有人嘲笑你的~ 毕竟是BOSS嘛~"],
    questConfig: [{
        type: GC.QUEST_TYPE.HUNT,
        target: "Pirate",
        number: 1
    }],
    callback: function(){
        GC.MAPS_CONFIG.sunsetCity.DOORS[0].isShow = true;
        PLAYER.getParent().getParent()._doors[0].show();
    },
    finishedCallback: function(){
        PLAYER.heroes.push(new Pirate());
    },
};
GC.MAPS_CONFIG = {};
GC.MAPS_CONFIG.sunsetCity = {
    width: 2500,
    height: 1000,
    bg: "res/Sound/Subway.mp3",
    NPCS: {
        "Ninja": {npc: "Ninja", x: 1100, y: 353, words: [ "你好骚年~  你可以叫我Ninja~"], questList: ["huntCola"]}
    },
    MONSTERS: [
        {x: 100, y: 27, hero: "Cola"},
        {x: 200, y: 27, hero: "Cola"},
        {x: 300, y: 27, hero: "Cola"},
        {x: 400, y: 27, hero: "Cola"},
        {x: 1000, y: 87, hero: "Cola"},
        {x: 1100, y: 87, hero: "Cola"},
        {x: 1200, y: 87, hero: "Cola"},
        {x: 1400, y: 27, hero: "Cola"},
        {x: 1500, y: 27, hero: "Cola"},
        {x: 1600, y: 27, hero: "Cola"},
        {x: 1700, y: 27, hero: "Cola"},
        {x: 1800, y: 27, hero: "Cola"},
        {x: 1900, y: 27, hero: "Cola"},
        {x: 2000, y: 27, hero: "Cola"},
        {x: 2100, y: 27, hero: "Cola"},
        {x: 2200, y: 27, hero: "Cola"},
        {x: 2300, y: 27, hero: "Cola"}
    ],
    BACKGROUNDS: [
        {texture: res.background0Png, x:0, y: 0, xLength: 2, y: 100},
        {texture: res.background1Png, xLength: 6, x:0, y: 100},
        {texture: res.background2Png, xLength: 2, x:0, y: 0}
    ],
    WALL_BACKGROUNDS: [
        {texture: res.backgroundPng, xLength: 9, yLength: 3, x:787, y: 27},
        {texture: res.backgroundPng, xLength: 3, yLength: 1, x:787, y: 207},
        {texture: res.backgroundPng, xLength: 3, yLength: 2, x:1057, y: 206},
        {texture: res.backgroundPng, xLength: 1, yLength: 2, x:1597, y: 26},
        {texture: res.backgroundPng, xLength: 1, yLength: 1, x:1687, y: 26},
        {texture: res.backgroundPng, xLength: 8, yLength: 1, x:540, y: 0},
        {texture: res.backgroundPng, xLength: 3, yLength: 1, x:630, y: 60}
    ],
    GROUNDS: [
        {texture: res.groundPng, length: 5, x: 0, y: 0},
        {texture: res.groundPng, edgeLeftTexture: res.edgePng, length: 1, x: 660, y: 146},
        {texture: res.groundPng, edgeLeftTexture: res.edgePng, length: 3, x: 750, y: 266},
        {texture: res.groundPng, edgeRightTexture: res.edgePng, length: 1, x: 1867, y: 26},
        {texture: res.groundPng, edgeLeftTexture: res.edgePng, edgeRightTexture: res.edgePng, length: 3, x: 1020, y: 326},
        {texture: res.groundPng, length: 3, x: 1327, y: 206},
        {texture: res.groundPng, length: 3, x: 630, y: 120},
        {texture: res.groundPng, length: 3, x: 990, y: 60},
        {texture: res.groundPng, length: 14, x: 1346, y: 0}
    ],
    SLOPES: [
        {texture: res.slopeUpPng, length: 2, x: 450, y: 0, isUp: true},
        {texture: res.slopeDownPng, length: 1, x: 900, y: 60, isUp: false},
        {texture: res.slopeDownPng, length: 1, x: 1260, y: 0, isUp: false},
        {texture: res.slopeDownPng, length: 3, x: 1597, y: 146, isUp: false}
    ],
    WALLS: [
        {texture: res.wallLeftPng, length: 2, x: 756, y: 146, isLeft: true},
        {texture: res.wallLeftPng, length: 2, x: 1026, y: 206, isLeft: true},
        {texture: res.wallRightPng, length: 2, x: 1327, y: 206, isLeft: false}
    ],
    DOORS: [
        {targetMap: "sunsetCityCorner", x: 900, y: 290, targetX: 100, targetY: 87, isShow: false}
    ]
};
GC.MAPS_CONFIG.sunsetCityCorner = {
    width: 2000,
    height: 1000,
    bg: "res/Sound/FinalFight.mp3",
    MONSTERS: [
        {x: 700, y: 87, hero: "Pirate", isAutoAttack: true},
    ],
    BACKGROUNDS: [
        {texture: res.background0Png, x:0, y: 0, xLength: 2, y: 100},
        {texture: res.background1Png, xLength: 6, x:0, y: 100},
        {texture: res.background2Png, xLength: 2, x:0, y: 0}
    ],
    WALL_BACKGROUNDS: [
        {texture: res.backgroundPng, xLength: 23, yLength: 1, x:0, y: 0},
    ],
    GROUNDS: [
        {texture: res.groundPng, length: 23, x: 0, y: 60}
    ],
    DOORS: [
        {targetMap: "sunsetCity", x: 100, y: 87, targetX: 900, targetY: 293}
    ]
}
