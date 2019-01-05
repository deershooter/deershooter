
cc.Class({
    extends: cc.Component,

    properties: {
        attackStone:cc.Prefab,
        biaozhunNode:cc.Node
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        var self = this
        //var spine = this.spine = this.node.getComponent(sp.Skeleton)
        this._armatureDisplay = this.node.getComponent(dragonBones.ArmatureDisplay);
        this.bFly = false
        this.bDie = false
        this.attckStoneNum = (cc.random0To1() > 0.5)?1:0
        this.ballNum = 1
        this.openCollision(false)

        this._armatureDisplay.addEventListener(dragonBones.EventObject.COMPLETE,function(event){
            if (event.type === dragonBones.EventObject.COMPLETE){
                if(event.detail.animationState.name === "atteck"){
                    self.fly()           
                }   
            } 
        })
    },

    start () {

    },

    openCollision(bOpen){
        var colliders = this.getComponents(cc.PolygonCollider);
        colliders[0].enabled = bOpen
    },

    //动作 —— 跑
    run(){
        this._armatureDisplay.playAnimation("run")
    },

    //动作 —— 推
    pushStone(){
        this._armatureDisplay.playAnimation("walk")
    },
    //动作 —— 攻击
    attack(){
        this._armatureDisplay.playAnimation("atteck")
    },
    //动作 —— 飞行
    fly(){
        this._armatureDisplay.playAnimation("fly")
    },
    //动作 —— 死亡
    die(){
        this._armatureDisplay.playAnimation("fall")
    },

    stand(){
        //this.spine.setAnimation(0, 'wolf_stand', true);
    },
    setBallNum(num){
        this.ballNum = num
    },
    update (dt) {
        if(this.bFly){
            var self = this
            var worldpos = this.node.convertToWorldSpace(this.node.position)
            this.node.parent.y += (1.5 + this.ballNum * 0.3)
            //if(this.node.parent.y > this.node.parent.parent.getChildByName("stone").y - 56)
            if(worldpos.y - 360 > this.node.parent.parent.getChildByName("stone").y - 56)
            {             
                var cNode = this.node.parent
                
                var wolfCurPos = cc.v2(worldpos.x - 640,worldpos.y - 360)//cNode.parent.convertToNodeSpace(worldpos)
                this.node.parent = cNode.parent
                
                cNode.destroy()
                this.bFly = false
                this.node.position = wolfCurPos
                //获取到mainScene文件
                var mainScene = this.node.parent.getComponent("mainScene")   
                for(var i = 0;i < mainScene.AllWolfArray.length; i++){
                    if(mainScene.AllWolfArray[i] == this.node){
                        mainScene.AllWolfArray.splice(i,1)
                    }
                }
                //获取到石头        
                var stoneNode = this.node.parent.getChildByName("stone")
                var pos0 = stoneNode.position0
                this.run()
                var posX = stoneNode.x - stoneNode.width/2 - mainScene.wolfArray.length * 35 - 20
                mainScene.wolfArray.push(self.node)
                if(mainScene.wolfArray.length == 10){
                    mainScene.closeSchedule()
                    for(var i = 0;i < mainScene.AllWolfArray.length;i++){
                        mainScene.AllWolfArray[i].parent.removeFromParent()
                    }
                    mainScene.AllWolfArray = []
                }
                if(stoneNode.x - stoneNode.width/2 -  mainScene.wolfArray.length * 35 - 20> this.node.x){
                    this.node.runAction(cc.sequence(cc.moveTo(Math.abs(posX - this.node.x)/400,cc.v2(posX,this.node.y)),
                        cc.callFunc(function(){
                            cc.vv.audioMgr.playSFX("sound_stonerolling_01.mp3");
                            //mainScene.wolfArray.push(self.node)
                            var data = {code:"5",uid:"" +cc.vv.userMgr.uid,wolfnum:mainScene.wolfArray.length
                            };          
                            cc.vv.net.send(data)
                            stoneNode.runAction(cc.spawn(cc.rotateBy(1,60),cc.moveBy(1,cc.v2(50,0))))
                            for(var i = 0;i < mainScene.wolfArray.length;i++){
                                var wolfNode = mainScene.wolfArray[i]
                                var wolfControl = wolfNode.getComponent("wolf")
                                wolfControl.pushStone()
                                wolfNode.runAction(cc.moveBy(1,cc.v2(50,0)))
                                //wolfNode.stopAllActions()
                                //wolfNode.runAction(cc.moveTo(1,cc.v2(pos0.x  + 50*(mainScene.wolfArray.length - 1)- stoneNode.width/2 - 35 * i + 40,wolfNode.y)))
                            }

                        }),cc.delayTime(1.2),cc.callFunc(function(){
                            if(mainScene.wolfArray.length == 10 ){
                                var stoneNode = mainScene.stone
                                var ani = stoneNode.getComponent(cc.Animation)
                                ani.play("dropStone")
                            }                            
                        })
                    ))
                }else{
                    this.node.runAction(cc.sequence(cc.flipX(true),cc.moveTo(Math.abs(posX - this.node.x)/400,cc.v2(posX,this.node.y)),
                        cc.flipX(false),cc.callFunc(function(){
                            //mainScene.wolfArray.push(self.node)
                            cc.vv.audioMgr.playSFX("sound_stonerolling_01.mp3");
                            var data = {code:"5",uid:"" +cc.vv.userMgr.uid,wolfnum:mainScene.wolfArray.length
                            };      
                            cc.vv.net.send(data)
                            stoneNode.runAction(cc.spawn(cc.rotateBy(1,60),cc.moveBy(1,cc.v2(50,0))))
                            for(var i = 0;i < mainScene.wolfArray.length;i++){
                                var wolfNode = mainScene.wolfArray[i]
                                var wolfControl = wolfNode.getComponent("wolf")
                                wolfControl.pushStone()
                                //wolfNode.stopAllActions()
                                //wolfNode.runAction(cc.moveTo(1,cc.v2(pos0.x  + 50*(mainScene.wolfArray.length - 1)- stoneNode.width/2 - 35 * i + 40,wolfNode.y)))
                                wolfNode.runAction(cc.moveBy(1,cc.v2(50,0)))
                            }

                        }),cc.delayTime(1.2),cc.callFunc(function(){
                            if(mainScene.wolfArray.length == 10){
                                var stoneNode = mainScene.stone
                                var ani = stoneNode.getComponent(cc.Animation)
                                ani.play("dropStone")
                            }  
                        })
                    ))
                }             
                this.scheduleOnce(function(){
                    for(var i = 0;i < mainScene.wolfArray.length;i++){
                        var wolfNode = mainScene.wolfArray[i]
                        wolfNode.x = stoneNode.x - stoneNode.width/2 -  (i + 1) *35 + 20 - 5
                        
                    }
                },1)
                


            }
        }
        if(this.bDie){
            this.node.parent.y -= 4
            if(this.node.parent.y < -300){
                var pos = this.node.parent.position
                cc.vv.audioMgr.playSFX("sound_wolfdown_01.mp3");
                var mainNode = this.node.parent.parent
                var mainScene = mainNode.getComponent("mainScene")
                mainScene.showWolfSmoke(pos)
                this.node.parent.destroy()
            }
        }
    },


    onCollisionEnter: function (other, self) {
        if(other.tag === 3){
            console.log("箭")
            other.node.stopAllActions()
            other.node.rotation = -90
            //去掉箭的碰撞
            other.enabled = false
            var mainNode = other.node.parent
            var mainScene = mainNode.getComponent("mainScene")
            other.node.runAction(cc.sequence(cc.moveTo(1,cc.v2(other.node.x,-1000)),cc.callFunc(function(){
                for(var i = 0;i < mainScene.jianArray.length; i++){
                    if(mainScene.jianArray[i] == other.node){
                        mainScene.jianArray.splice(i,1)
                    }
                }
                other.node.destroy()
            })))
            cc.vv.audioMgr.playSFX("sound_wolfparry_01.mp3");
        }else if(other.tag === 7) //肉箭
        {
            
            var mainNode = self.node.parent.parent
            var mainScene = mainNode.getComponent("mainScene")
            for(var i = 0;i < mainScene.AllWolfArray.length; i++){
                if(mainScene.AllWolfArray[i] == self.node){
                    mainScene.AllWolfArray.splice(i,1)
                }
            }
            cc.vv.audioMgr.playSFX("sound_toolhit_01.mp3");
            var oldNode = self.node.parent
            for(var j = 0;j < this.ballNum;j++){
                var ballNode = oldNode.getChildByTag(j)
                var worldPos = ballNode.convertToWorldSpace(ballNode.position)
                var pos = cc.v2(worldPos.x - 640,worldPos.y - 360)
                ballNode.parent = mainNode
                ballNode.position = pos
                ballNode.rotation = 0
                var ballcontrol = ballNode.getComponent("purpleBall")
                ballcontrol.bsingelBall = true

            }
            var NewNode = new cc.Node()
            NewNode.parent = mainNode
            NewNode.position = oldNode.position
            self.node.parent = NewNode

            this.die()
            this.bDie = true
            this.bFly = false
            oldNode.removeFromParent()
        }
    },

    //创建石头
    createAttackStone(){
        var self = this
        var pos = cc.v2(58,65)
        var attackStone = cc.instantiate(this.attackStone)
        this.node.addChild(attackStone)
        attackStone.position = pos
        var ani = attackStone.getComponent(cc.Animation) 
        attackStone.active = false      
        self.attack()
        this.node.runAction(cc.sequence(cc.callFunc(function(){
            ani.play("attackstone")
            attackStone.active = true 
        }),cc.delayTime(1),cc.callFunc(function(){
            if(attackStone)
                attackStone.removeFromParent()
        })))
        
    },

});
