const i18n = require('LanguageData')
var Utils = require("Utils")
var posWolfX = [-427,-213,0,213]

//狼、气球、箭，猪，石头碰撞tag分别为 1,2,3,4,5
cc.Class({
    extends: cc.Component,

    properties: {
        wolf:cc.Prefab,
        wolfspeed:200,
        balloon:[cc.Prefab],//气球
        upbtn:cc.Node,//上
        downbtn:cc.Node,//下
        player:cc.Node,//角色
        jian:cc.Prefab,//箭
        maskSprite:cc.Node,//遮罩
        shenzi1:cc.Node,//第一根绳子
        shenzi2:cc.Node,//第二根绳子
        hualun:cc.Node,//滑轮
        stone:cc.Node,
        attackStone:cc.Prefab,
        paoTai:[cc.Node],
        scoreLab:cc.Label,  
        piaoScore:cc.Prefab,  
        ScoreSprite:[cc.SpriteFrame], 
        rouKuai:cc.Node,  
        rouJian:cc.Prefab,
        gameEndPanel:cc.Node,
        StartPanel:cc.Node,
        treeBG:cc.Node,
        hitEffect:cc.Prefab,
        exitPanel:cc.Node,
        exitTip:cc.Label,
        game_tip_panel:cc.Node,
        yaoganSprite:cc.Node,
        wolfSmoke:cc.Prefab,
        timeLab:cc.Label,   
        //timeNode:cc.Node,
        guidePanel:cc.Node,
        attackNode:cc.Node,
        danyaoLab:cc.Label,
        yaoGanSpriteFrame:[cc.SpriteFrame],
        yaoGanSmallSprite:cc.Sprite,
        jianshiNode:[cc.Node],
        jianLou:cc.Node,
        huanDanBtn:cc.Node,
        cdSprite:cc.Sprite,
        goongjiCD:cc.Node,
        sanlu:cc.Node,
    },    

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.speed = 0
        this.direction = 0
        this.Score = 0
        this.time = 200
        this.grade = 0
        //箭的状态
        this.playerAttackStatus = 0
        this.bShot = false
        this.jianCount = 12
        this.danyaoLab.string = "子弹数：" + this.jianCount
        this.playerControl = this.player.getComponent("lulu")
        //狼的数组
        this.wolfArray = []
        this.AllWolfArray = []
        this.jianArray = []
        var self = this
        this.timeCount = 0
        this.bDrop = false
        var visibleSize = cc.director.getVisibleSize()
        this.yaoganSprite.position0 = this.yaoganSprite.position
        this.yaoganSprite.opacity0 = this.yaoganSprite.opacity
        this.jianLou.position0 = this.jianLou.position
        this.shenzi1.position0 = this.shenzi1.position
        this.yaoganSprite.setLocalZOrder(20)
        this.exitPanel.setLocalZOrder(22)

        this.sanLuBones = this.sanlu.getComponent(dragonBones.ArmatureDisplay)
        this.yaoGanSmallSprite.node.position0 = this.yaoGanSmallSprite.node.position
        this.upbtn.on(cc.Node.EventType.TOUCH_START, event => {
            this.speed = 3.5
            this.direction = 1
            this.shenZi1Spine.setAnimation(0, 'animation', true);
            this.shenZi2Spine.setAnimation(0, 'animation', true);
            this.huaLunSpine.setAnimation(0, 'wheel_up', true);
            cc.vv.audioMgr.playSFX("sound_tap_01.mp3");
            this.shenZi1Spine.paused = false
            this.shenZi2Spine.paused = false
            this.huaLunSpine.paused = false
        }, this);
        this.upbtn.on(cc.Node.EventType.TOUCH_END, event => {
            this.speed = 0
            this.direction = 0
            this.shenZi1Spine.paused = true
            this.shenZi2Spine.paused = true
            this.huaLunSpine.paused = true
        }, this);
        this.upbtn.on(cc.Node.EventType.TOUCH_CANCEL, event => {
            this.speed = 0
            this.direction = 0
            this.shenZi1Spine.paused = true
            this.shenZi2Spine.paused = true
            this.huaLunSpine.paused = true
        }, this);

        this.downbtn.on(cc.Node.EventType.TOUCH_START, event => {
            this.speed = -3.5
            this.direction = -1
            //cc.vv.audioMgr.playSFX("sound_tap_01.mp3");
            this.shenZi1Spine.setAnimation(0, 'animation', true);
            this.shenZi2Spine.setAnimation(0, 'animation', true);
            this.huaLunSpine.setAnimation(0, 'wheel_down', true);


            this.shenZi1Spine.paused = false
            this.shenZi2Spine.paused = false
            this.huaLunSpine.paused = false 
        }, this);
        this.downbtn.on(cc.Node.EventType.TOUCH_END, event => {
            this.speed = 0
            this.direction = 0
            this.shenZi1Spine.paused = true
            this.shenZi2Spine.paused = true
            this.huaLunSpine.paused = true
        }, this);
        this.downbtn.on(cc.Node.EventType.TOUCH_CANCEL, event => {
            this.speed = 0
            this.direction = 0
            this.shenZi1Spine.paused = true
            this.shenZi2Spine.paused = true
            this.huaLunSpine.paused = true
        }, this);

        this.node.on(cc.Node.EventType.TOUCH_START, event => {
            //if()
            var posWorld = event.touch._point
            if(posWorld.x - visibleSize.width/2 < 0){
                this.shenZi1Spine.paused = false
                this.shenZi2Spine.paused = false
                this.shenZi1Spine.setAnimation(0, 'animation', true);
                this.shenZi2Spine.setAnimation(0, 'animation', true);
                //this.yaoganSprite.opacity = 125
                this.yaoGanSmallSprite.spriteFrame = this.yaoGanSpriteFrame[1]
                this.yaoganSprite.position = cc.v2(posWorld.x - visibleSize.width/2,posWorld.y - visibleSize.height/2)
            }
        }, this);
        
        this.node.on(cc.Node.EventType.TOUCH_MOVE, event => {
            //if()
            var posWorld = event.touch._point
            if(posWorld.x - visibleSize.width/2 < 0){
                var posY = posWorld.y - visibleSize.height/2 - this.yaoganSprite.y
                if(posWorld.y - visibleSize.height/2 > this.yaoganSprite.y){
                    this.yaoGanSmallSprite.node.y = posY > 50?50:posY
                    if(this.speed <= 0){
                        this.speed = 3.5
                        this.direction = 1
                        this.shenZi1Spine.setAnimation(0, 'animation', true);
                        this.shenZi2Spine.setAnimation(0, 'animation', true);
                        this.huaLunSpine.setAnimation(0, 'wheel_up', true);
                        this.sanLuBones.playAnimation("up")
                        cc.vv.audioMgr.playSFX("sound_tap_01.mp3");
    
                        this.shenZi1Spine.paused = false
                        this.shenZi2Spine.paused = false
                        this.huaLunSpine.paused = false
                    }
                    
                }else{
                    this.yaoGanSmallSprite.node.y = posY < -50?-50:posY
                    if(this.speed >= 0){
                        this.speed = -3.5
                    this.direction = -1
                    //cc.vv.audioMgr.playSFX("sound_tap_01.mp3");
                    this.shenZi1Spine.setAnimation(0, 'animation', true);
                    this.shenZi2Spine.setAnimation(0, 'animation', true);
                    this.huaLunSpine.setAnimation(0, 'wheel_down', true);
                    this.sanLuBones.playAnimation("down")
    
                    this.shenZi1Spine.paused = false
                    this.shenZi2Spine.paused = false
                    this.huaLunSpine.paused = false
                    }
                }
            }
            
        }, this);

        this.node.on(cc.Node.EventType.TOUCH_CANCEL, event => {
            this.speed = 0
            this.direction = 0
            this.shenZi1Spine.paused = true
            this.shenZi2Spine.paused = true
            this.huaLunSpine.paused = true
            this.yaoganSprite.position = this.yaoganSprite.position0
            this.yaoganSprite.opacity = this.yaoganSprite.opacity0
            this.yaoGanSmallSprite.node.position = this.yaoGanSmallSprite.node.position0
            this.yaoGanSmallSprite.spriteFrame = this.yaoGanSpriteFrame[0]
            if(posWorld.x - visibleSize.width/2 < 0)
                this.sanLuBones.playAnimation("stand")
        }, this);

        this.node.on(cc.Node.EventType.TOUCH_END, event => {
            var posWorld = event.touch._point
            this.speed = 0
            this.direction = 0
            this.shenZi1Spine.paused = true
            this.shenZi2Spine.paused = true
            this.huaLunSpine.paused = true
            this.yaoganSprite.position = this.yaoganSprite.position0
            this.yaoganSprite.opacity = this.yaoganSprite.opacity0
            this.yaoGanSmallSprite.node.position = this.yaoGanSmallSprite.node.position0
            this.yaoGanSmallSprite.spriteFrame = this.yaoGanSpriteFrame[0]
            if(posWorld.x - visibleSize.width/2 < 0)
                this.sanLuBones.playAnimation("stand")
        }, this);

        ///射击按钮
        this.attackNode.on(cc.Node.EventType.TOUCH_START, event => {
            if(this.jianCount > 0){
                this.bShot = true
                this.timeCount = 0
            }
            
            //this.playerControl.attack()
        }, this);
        this.attackNode.on(cc.Node.EventType.TOUCH_CANCEL, event => {
            this.bShot = false
            this.playerControl.stand()
        }, this);
        this.attackNode.on(cc.Node.EventType.TOUCH_END, event => {
            this.bShot = false
            this.playerControl.stand()
        }, this);

        // this.yaoganSprite.on(cc.Node.EventType.TOUCH_MOVE, event => {
            
        //     var posWorld = event.touch._point
            
        // }, this);



        var collisionManager = cc.director.getCollisionManager();
        collisionManager.enabled = true;
        //获取绳子的动画
        this.shenZi1Spine = this.shenzi1.getComponent(sp.Skeleton)
        this.shenZi2Spine = this.shenzi2.getComponent(sp.Skeleton)
        //获取滑轮的动画
        this.huaLunSpine = this.hualun.getComponent(sp.Skeleton)
        this.initMgr()
        this.initHandlers()
        this.stone.position0 = this.stone.position
        //this.treeBG.setLocalZOrder(2)
        this.player.position0 = this.player.position
    },

    _updateMove : function (dir) {
        if (this._left && this._right) {
            this.move(dir);
        } else if (this._left) {
            this.move(-1);
        } else if (this._right) {
            this.move(1);
        } else {
            this.move(0);
        }
    },

    move : function(dir) {
        if (this._moveDir === dir) {
            return;
        }

        this._moveDir = dir;
        this._updateAnimation();
    },
    update (dt) {
        var self = this
        if(!this.playerControl.bDie){
            this.player.y += this.speed
            var speed = this.speed
            
            if(this.player.y > 200)
            {
                this.player.y = 200
                speed = 0
            }
                
            if(this.player.y < -160){
                speed = 0
                this.player.y = -160  
            }
                  
            this.shenzi1.y += speed
            this.maskSprite.height = this.player.y - this.maskSprite.y + 112       
        }
        

        for(var i = 0;i < this.AllWolfArray.length;i++){
            var wolfNode = this.AllWolfArray[i]
            var wolfcontrol = wolfNode.getComponent("wolf")
            var worldpos = wolfNode.convertToWorldSpace(wolfNode.position)
            if(worldpos.y - 360 > (this.player.y - 100)&& wolfcontrol.attckStoneNum > 0){
                wolfcontrol.createAttackStone()
                wolfcontrol.attckStoneNum--
            }
        }

        if(this.player.y >= 200 && this.rouKuai.active && this.speed > 0){
            this.playerControl.stand1()
            this.playerAttackStatus = 1
            this.rouKuai.active = false
            cc.vv.audioMgr.playSFX("sound_gettool_01.mp3");
        }
        // //如果是10个狼的话，执行石头砸下动作
        // if(this.wolfArray.length >= 10){
        //     this.gameover()
        // }  
        if(this.bShot && this.timeCount%8 == 0){
            if(this.playerAttackStatus == 0){
                if(this.jianCount > 0)
                {
                    this.scheduleOnce(this.createJian,0.04)
                    if(this.jianCount == 1){
                        // this.scheduleOnce(function(){
                        //     self.jianCount = 12
                        //     for(var i = 0;i < self.jianshiNode.length; i++){
                        //         self.jianshiNode[i].active = true
                        //     }
                        //     self.danyaoLab.string = "子弹数：" + self.jianCount
                        //     if(self.bShot){
                        //         self.playerControl.attack()
                        //     }
                        // },1)
                        this.scheduleOnce(function(){
                            self.huanDanJia(false)
                        },0.1)
                        //this.huanDanJia(false)
                    }
                }else{
                    this.playerControl.stand()
                }            
            }else{
                this.playerControl.attack1()
                this.scheduleOnce(this.createJian,0.04)
            }
        }
        this.timeCount++ 
    },

    start () {
        // this.schedule(this.scheduleCreateWolf,4)
        // this.schedule(this.createBalloon,6)
        //this.guidePanel.active = false
        var self = this
        this.scheduleOnce(function(){
            self.guidePanel.active = false
        },0.1)
        if(cc.args.new_user == "true"){
            var obj =
            {
            type:'dataCount', 
                msg :'role'
            }
            window.top.postMessage(obj,'http://togame.iqiyi.com');
        }
    },
    //创建狼
    createWolf(posX,ballNum){
        var NodeAll = new cc.Node()
        var self = this
        var wolf = cc.instantiate(this.wolf)
        this.node.addChild(NodeAll)
        NodeAll.addChild(wolf,2,4)
        NodeAll.position = cc.v2(-640,-275)
        //把狼加入数组
        this.AllWolfArray.push(wolf)
        //获取run脚本
        var wolfcontrol = wolf.getComponent("wolf")
        wolfcontrol.setBallNum(ballNum)
        //执行跑的动画
        wolfcontrol.run()
        //移动到屏幕中
        NodeAll.runAction(cc.sequence(cc.moveTo((posX + 640)/this.wolfspeed,cc.v2(posX,NodeAll.y)),
        cc.callFunc(function(){
            //播放飞行动画
            wolfcontrol.fly()
            //狼上升
            wolfcontrol.bFly = true
            for(var i = 0;i < ballNum;i++){
                var colorIdx = Utils.rnd(2,4)
                if(ballNum == 3){
                    colorIdx = i + 2
                }
                //添加气球
                var balloon = cc.instantiate(self.balloon[colorIdx])
                var balloonControl = balloon.getComponent("purpleBall")
                balloonControl.ballOrign = ballNum
                balloon.y = 60
                NodeAll.addChild(balloon,1,i)
                if(ballNum == 3){
                    if(i == 0){
                        balloon.rotation = -30
                    }else if( i == 2){
                        balloon.rotation = 30
                    }
                }
                if(ballNum == 2){
                    if(i == 0){
                        balloon.rotation = -20
                    }else if( i == 1){
                        balloon.rotation = 20
                    }
                }
                if(i == ballNum - 1){
                    balloonControl.openCollision(true)
                }
            }
            wolfcontrol.openCollision(true)
            
        })))
    },
    scheduleCreateWolf(){
        var pos = cc.random0To1() * 352 - 210//posWolfX[Utils.rnd(0,3)]
        var ballnum = Utils.rnd(1,3)
        this.createWolf(pos,ballnum)
    },
    //射击按钮
    onclickAttack(){
        // if(this.playerAttackStatus == 0){
        //     if(this.jianArray.length <= 2){
        //         this.playerControl.attack()
        //         this.scheduleOnce(this.createJian,0.04)
        //     }
            
        // }else{
        //     this.playerControl.attack1()
        //     this.scheduleOnce(this.createJian,0.04)
        // }
        
        //this.createJian()
    },

    createJian(){
        var self = this
        if(this.playerAttackStatus == 0){

            if(this.jianCount > 0)
            {
                this.playerControl.attack()
                this.jianCount--
                this.jianshiNode[this.jianCount].active = false
                 if(this.jianCount < 4){
                    for(var i = 0;i < 12;i++){
                        self.jianshiNode[i].color = cc.Color.RED
                    }
                }
                this.danyaoLab.string = "子弹数：" + this.jianCount
                var jianNode = cc.instantiate(this.jian)
                jianNode.position = cc.v2(this.player.x + 5, this.player.y - 70)
                jianNode.parent = this.node

                jianNode.runAction(cc.sequence(cc.moveBy(0.9,cc.v2(-1000,0)),cc.callFunc(function(){
                    for(var i = 0;i < self.jianArray.length; i++){
                        if(self.jianArray[i] == jianNode){
                            self.jianArray.splice(i,1)
                        }
                    }
                    jianNode.destroy()
                })))
                cc.vv.audioMgr.playSFX("sound_arrowshot_01.mp3");
                this.jianArray.push(jianNode)
            }else{
                // this.scheduleOnce(function(){
                //     self.jianCount = 15
                //     self.danyaoLab.string = "子弹数：" + self.jianCount
                // },0.5)
            }
            
        }else{
            var jianNode = cc.instantiate(this.rouJian)
            jianNode.position = cc.v2(-25, -60)
            jianNode.parent = this.player
            jianNode.runAction(cc.sequence(cc.delayTime(2),cc.removeSelf()))
            var ani = jianNode.getComponent(cc.Animation)
            ani.play("rouJian")
            this.scheduleOnce(this.ShowRouKuai,15)
            cc.vv.audioMgr.playSFX("sound_arrowshot_01.mp3");
        }
        this.playerAttackStatus = 0
    },


    createBalloon(){
        var self = this
        var paoTaiIdx = Utils.rnd(0,2)
        var ballIdx = 0//Utils.rnd(0,1)
        this.paoTai[paoTaiIdx].getComponent("paotai").createBall(ballIdx)
        this.node.runAction(cc.sequence(cc.delayTime(0.4),cc.callFunc(function(){
            var balloonNode = cc.instantiate(self.balloon[ballIdx])
            self.node.addChild(balloonNode)
            balloonNode.position = cc.v2(self.paoTai[paoTaiIdx].x,self.paoTai[paoTaiIdx].y + 30)
            var ballControl = balloonNode.getComponent("purpleBall")
            ballControl.bsingelBall = true
            //开启碰撞
            ballControl.openCollision(true)
        })))
    },
    showScore(pos,idx){
        var piaoScoreNode = cc.instantiate(this.piaoScore)
        this.node.addChild(piaoScoreNode)
        piaoScoreNode.position = pos
        var sprite = piaoScoreNode.getComponent(cc.Sprite)
        sprite.spriteFrame = this.ScoreSprite[idx]
        //var ani = piaoScoreNode.getComponent(cc.Animation)
        //ani.play("piaoScore")
        piaoScoreNode.runAction(cc.sequence(cc.moveBy(0.4,cc.v2(0,100)),cc.removeSelf()))

        var data = {code:"3",uid:"" +cc.vv.userMgr.uid,score:this.Score
            };          
        cc.vv.net.send(data)
        var grade = 0
        if(this.Score > 600){
            grade =  Math.floor((this.Score - 600)/100) + 3
        }else if(this.Score > 500){
            grade = 2
        }else if(this.Score > 300)(
            grade = 1
        )
        if(grade > this.grade){
            this.grade = grade
            this.setGrade(this.grade)
        }
    },
    //显示游戏结束界面
    showGameEndPanel(bShow){
        this.gameEndPanel.active = true
    },
    setGrade(grade){
        this.unschedule(this.scheduleCreateWolf)
        var subtime = 0
        if(grade > 2){
            subtime = 0.9 +  (grade - 2) * 0.2
        }
        if(grade == 2){
            subtime = 0.9
        }else if(grade == 1){
            subtime = 0.5
        }
        subtime = subtime > 3?3:subtime
        this.schedule(this.scheduleCreateWolf,4 - subtime)
    },

    //初始化
    initMgr:function(){
        cc.vv = {}
        var EventEmitter = require("EventEmitter")
        cc.vv.EventEmitter = new EventEmitter();

        var UserMgr = require("UserMgr");
        cc.vv.userMgr = new UserMgr();

        cc.vv.http = require("HTTP");
        cc.vv.net = require("Net");
        //cc.vv.mappingNet = require("MappingNet");

        var GameNetMgr = require("GameNetMgr");
        cc.vv.gameNetMgr = new GameNetMgr();
        cc.vv.gameNetMgr.initHandlers();

        var AudioMgr = require("AudioMgr");
        cc.vv.audioMgr = new AudioMgr();
        cc.vv.audioMgr.init();

        cc.args = this.urlParse();
        console.log("cc.args---------")
        console.log(cc.args)

         //设置语言
        if(cc.args.lang == "en"){
            i18n.init("en");
        }else{
            i18n.init("zh");
        }

        var obj = {
            type:'dataCount', 
            msg :'server'       
        }
        window.top.postMessage(obj,'http://togame.iqiyi.com');

        cc.vv.userMgr.getUserInfo() 
        
        //i18n.init("en");
        //cc.vv.wc = this.loaddingLayer
    },

    urlParse:function(){
        var params = {};
        if(window.location == null){
            return params;
        }
        var name,value; 
        var str=window.location.href; //取得整个地址栏
        var num=str.indexOf("?") 
        str=str.substr(num+1); //取得所有参数   stringvar.substr(start [, length ]
        
        var arr=str.split("&"); //各个参数放到数组里
        for(var i=0;i < arr.length;i++){ 
            num=arr[i].indexOf("="); 
            if(num>0){ 
                name=arr[i].substring(0,num);
                value=arr[i].substr(num+1);
                params[name]=value;
            } 
        }
        return params;
    },

    //初始化事件监听
    initHandlers:function(){
        var self = this
        cc.log("dataEventHandler")
        cc.log(this.node)
        cc.vv.gameNetMgr.dataEventHandler = this.node;
        cc.vv.dataEventHandler = this.node;
        // this.node.on("game_star",this._game_star,this);
        // this.node.on("OtherDrop",this.OtherDropSice,this);
        // this.node.on("OtherCreateSice",this.OtherCreateSice,this);
        cc.vv.EventEmitter.on("userLoginOk",this.userLoginOk,this);
        // this.node.on("battleAgain",this._battleAgain,this);
        // this.node.on("battleAgainOk",this._battleAgainOk,this);
        // this.node.on("playerleave",this._playerleave,this);
        // //重连服务器返回的数据
        // this.node.on("reconnection",this.reconnection,this);
        // //匹配成功
        cc.vv.EventEmitter.on("mappingOk",this.mappingOk,this);
        // //长连接匹配数据
        // this.node.on("mappingData",this.mappingData,this);
        // //重启客户端后的重连
        // cc.vv.EventEmitter.on("userReconnectGame",this.userReconnectGame,this)
        // this.node.on("NotPlayAgain",this.NotPlayAgain,this);
        // // //游戏结束
        // this.node.on("battleEnd",this._battleEnd,this);
        // this.node.on("ClearCheckbroad",this.clearData,this);
        // this.node.on("heartDead",this.heartDead,this);
        // this.node.on("battleTimeOut",this._battleTimeOut,this);
        this.node.on("serverError",this._serverError,this);
        cc.vv.EventEmitter.on("startGame",this.startGame,this);
        //cc.vv.EventEmitter.on("serverError",this._serverError,this);
        // //游戏出现错误
        // cc.vv.EventEmitter.on("gameError",this.heartDead,this);
    },
//登录成功隐藏loading界面
    userLoginOk:function(){
        // this.StartPanel.getChildByName("start_btn").active = true
        // this.StartPanel.getChildByName("load_label").active = false
        // if(cc.vv.userMgr.Chonglian == "false")
        //     this.loaddingLayer.active = false
        this.StartPanel.getComponent("StartScene").OnloadMusicAndEffect()
    },

    mappingOk(data){
        var selfCro = this

        var onConnectOKCall = function(self){
            //selfCro.connectCount = 3
            //发送骰子信息
            var data = {code:"2",uid:"" +cc.vv.userMgr.uid,
            };          
            cc.vv.net.send(data)
        }
        var onConnectFailCall = function(self){
            //异常处理
            // cc.vv.wc.show(i18n.t("label.gameTip_37"))
            // self.scheduleOnce(function() {
            //     cc.vv.wc.hide()
            //     self.fsm_bet_cancel()
            // }, 1);
            console.log("连接失败")
            // if(selfCro.connectCount > 0){
            //     selfCro.connectCount--
            //     console.log("开始第" + 4 - selfCro.connectCount + "次连接")
            //     cc.vv.gameNetMgr.connectGameServer(onConnectOKCall,selfCro,onConnectFailCall);    
            // }         
            
        }       
        cc.vv.gameNetMgr.connectGameServer(onConnectOKCall,this,onConnectFailCall);    
    },

    startGame(){
        this.grade = 0
        this.resetScene()
        this.schedule(this.scheduleCreateWolf,4)
        this.schedule(this.createBalloon,6)
        this.time = 200
        //this.schedule(this.timeSchedule,1)
        //this.timeNode.active = true
        
        //this.schedule(this.ShowRouKuai,15)
        this.playerControl.bDie = false
        this.playerControl.StoneDropDie = false
        this.playerControl.bDropStone = false
        this.rouKuai.active = true
        this.playerControl.stand()
        cc.vv.audioMgr.playBGM("music_fight_01.mp3");
        var obj =
        {
            type:'dataCount', 
            msg :'start'       
        }
        window.top.postMessage(obj,'http://togame.iqiyi.com');

    },

    gameover(){
        this.showGameEndPanel(true)
        this.unschedule(this.scheduleCreateWolf)
        this.unschedule(this.createBalloon)
        this.unschedule(this.ShowRouKuai)
        //this.unschedule(this.timeSchedule)
        //this.timeNode.active = false
        var endControl = this.gameEndPanel.getComponent("GameEnd")
        endControl.showScore(this.Score)
        for(var i = 0;i < this.AllWolfArray.length;i++){
            this.AllWolfArray[i].parent.removeFromParent()
        }
        this.AllWolfArray = []
        var data = {code:"4",uid:"" +cc.vv.userMgr.uid,score:this.Score
            };          
            cc.vv.net.send(data)
        this.scheduleOnce(function(){
            cc.vv.net.needReconnect = false
            cc.vv.net.close()
        },1)
        cc.vv.audioMgr.playSFX("music_faild_01.mp3");
    },

    ShowRouKuai(){
        this.rouKuai.active = true
    },

    //重置场景
    resetScene(){
        this.unschedule(this.scheduleCreateWolf)
        this.unschedule(this.createBalloon)
        this.unschedule(this.ShowRouKuai)
        this.Score = 0
        this.timeCount = 0
        this.bDrop = false
        this.scoreLab.string = 0        
        for(var i = 0;i < this.jianshiNode.length; i++){
            this.jianshiNode[i].active = true
        }
        this.jianCount = 12
        this.danyaoLab.string = "子弹数：" + this.jianCount
        for(var i = 0;i < this.wolfArray.length;i++){
            this.wolfArray[i].removeFromParent()
        }
        for(var i = 0;i < this.AllWolfArray.length;i++){
            this.AllWolfArray[i].parent.removeFromParent()
        }
        this.wolfArray = []
        this.AllWolfArray = []
        this.stone.position = this.stone.position0
        this.player.position = this.player.position0
        this.shenzi1.position = this.shenzi1.position0
        

    },

    showHitEffect(pos,idx,target){
        var hitNode = cc.instantiate(this.hitEffect)
        target.addChild(hitNode)
        hitNode.position = pos
        var hitSpine = hitNode.getComponent(sp.Skeleton)
        //播放射爆气球的特效
        if(idx == 1){
            hitSpine.setAnimation(0, 'wolf_hit', false);
            hitNode.scaleX = -1
        }else if(idx == 2){
            hitSpine.setAnimation(0, 'stone_hit', false);
            hitNode.scale = 0.33
        }
        hitNode.runAction(cc.sequence(cc.delayTime(1),cc.removeSelf()))
    },    
    closeSchedule(){
        this.unschedule(this.scheduleCreateWolf)
        this.unschedule(this.createBalloon)
        this.unschedule(this.ShowRouKuai)
        for(var i = 0;i < this.AllWolfArray.length;i++){
            this.AllWolfArray[i].parent.removeFromParent()
        }
        this.AllWolfArray = []
    },

    showSureToExit(){
        this.exitPanel.active = true
        this.exitTip.string = i18n.t("label_text.exitTip")
        cc.vv.audioMgr.playSFX("sound_tap_01.mp3");
        cc.director.pause()
    },
    onClickBack(){
        cc.director.resume()
        cc.vv.audioMgr.playSFX("sound_tap_01.mp3");
        this.exitPanel.active = false
    },
    onClickReturnHall(){
        cc.director.resume()
        cc.vv.audioMgr.playSFX("sound_tap_01.mp3");
        this.exitPanel.active = false
        this.gameover()
    },

    showCommonTip:function(content){
        this.game_tip_panel.getComponent("GameTipUI").showCommonTip(content)
    },

    _serverError:function(data){
        var self = this
        var serverData = data.detail.data
        cc.log("发生严重错误 -- ")
        cc.log(serverData)
        if(Number(serverData.error) == 1){
            this.showCommonTip(i18n.t("label_text.gameServerTip_2"))
            this.StartPanel.active = true
        }else if(Number(serverData.error) == 2){
            this.showCommonTip(i18n.t("label_text.gameServerTip_3"))
            this.mapPanel.active = false
            this.StartPanel.active = true
        }else if(Number(serverData.error) == 3){
            this.showCommonTip(i18n.t("label_text.gameServerTip_4"))
            //this.mapPanel.active = false
            this.StartPanel.active = true
        }else if(Number(serverData.error) == 4){
            this.showCommonTip(i18n.t("label_text.gameServerTip_5"))
            cc.vv.net.needReconnect = false
            cc.vv.net.close()
            this.mapPanel.active = false
            this.StartPanel.active = true
            this.loaddingLayer.active = false
        }else if(Number(serverData.error) == 5){
            console.log("切换为免费场")
            this.mapPanel.getComponent("GameBetUI").closeConnect()
            cc.args.Tempbet = cc.args.bet 
            cc.args.Tempcoin_type = cc.args.coin_type
            cc.args.bet = "1"
            cc.args.coin_type = "free"
            this.mapPanel.active = false
            this.mapPanel.active = true
            //this.showCommonTip(i18n.t("label_text.gameServerTip_6"))
            this.mapPanel.getComponent("GameBetUI").showChangeBetTip(true)
        }
        
    },
    //狼落地的烟尘
    showWolfSmoke(pos){
        var smoke = cc.instantiate(this.wolfSmoke)
        this.node.addChild(smoke)
        smoke.position = pos
        smoke.runAction(cc.sequence(cc.delayTime(0.3),cc.removeSelf()))

    },
    timeSchedule(){
        this.time--
        this.timeLab.string = this.time
        if(this.time == 0){
            this.gameover()
        }  
    },
    onClickHuanDan(){
        this.huanDanJia(true)
    },
    huanDanJia(bZhuDong){
        if(this.jianCount == 12)
            return
        this.huanDanBtn.active = false
        var self = this
        this.cdSprite.node.active = true
        this.cdSprite.fillRange = 0
        
        this.danyaoLab.string = "子弹数：" + this.jianCount
        this.goongjiCD.active = true
        this.bShot = false
        if(bZhuDong){
            // this.schedule(function(){
            //     self.cdSprite.fillRange += 0.1
            // }, 0.2,9);
            
            // this.jianLou.runAction(cc.sequence(cc.moveBy(0.2,cc.v2(1500,0)),cc.callFunc(function(){
            //     for(var i = 0;i < self.jianshiNode.length; i++){
            //         self.jianshiNode[i].active = true
            //     }
            // }),cc.moveTo(0.2,this.jianLou.position0),cc.callFunc(function(){
            //     self.jianCount = 12
            //     self.danyaoLab.string = "子弹数：" + self.jianCount
            //     self.huanDanBtn.active = true
            //     self.cdSprite.node.active = false
            //     self.goongjiCD.active = false
            // })))
            var idx = this.jianCount - 1
            
            this.schedule(function(){              
                self.jianshiNode[idx].color = cc.Color.YELLOW
                self.jianshiNode[idx].active = true
                self.cdSprite.fillRange += 1/(12 - this.jianCount)
                idx++
            },0.1,12 - this.jianCount)
            this.scheduleOnce(function(){
                self.jianCount = 12
                self.danyaoLab.string = "子弹数：" + self.jianCount
                self.huanDanBtn.active = true
                self.cdSprite.node.active = false
                self.goongjiCD.active = false
                for(var i = 0;i < 12;i++){
                    self.jianshiNode[i].color = cc.Color.WHITE
                }
                if(self.bShot){
                    self.playerControl.attack()
                }
            },0.1*(12 - this.jianCount) + 0.3)
            this.jianCount = 0
            

        }else{
            this.schedule(function(){
                self.cdSprite.fillRange += 0.05
            }, 0.2,9);
            // this.jianLou.runAction(cc.sequence(cc.moveBy(0.5,cc.v2(1500,0)),cc.callFunc(function(){
            //     for(var i = 0;i < self.jianshiNode.length; i++){
            //         self.jianshiNode[i].active = true
            //     }
            // }),cc.moveTo(0.5,this.jianLou.position0),cc.callFunc(function(){
            //     self.jianCount = 12
            //     self.danyaoLab.string = "子弹数：" + self.jianCount
            //     self.huanDanBtn.active = true
            //     self.cdSprite.node.active = false
            //     self.goongjiCD.active = false
            //     if(self.bShot){
            //         self.playerControl.attack()
            //     }
            // })))
            var idx = 0
            this.schedule(function(){
                self.jianshiNode[idx].color = cc.Color.YELLOW
                self.jianshiNode[idx].active = true
                idx++
            },0.1,11)
            this.scheduleOnce(function(){
                self.jianCount = 12
                self.danyaoLab.string = "子弹数：" + self.jianCount
                self.huanDanBtn.active = true
                self.cdSprite.node.active = false
                self.goongjiCD.active = false
                for(var i = 0;i < 12;i++){
                    self.jianshiNode[i].color = cc.Color.WHITE
                }
                if(self.bShot){
                    self.playerControl.attack()
                }
            },1.6)
        }
        

    }

});
