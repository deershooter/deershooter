cc.Class({
    extends: cc.Component,

    properties: {
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.bsingelBall = false
        this.openCollision(false)
        //this.ballOrign = 1
    },

    start () {

    },
    setBallScore(num){
        this.ballOrign = num
    },

    onCollisionEnter: function (other, self) {
        if(other.tag === 3){
            cc.vv.audioMgr.playSFX("sound_balloonblast_01.mp3");
            var pos = self.node.convertToWorldSpace(self.node.position)
            if(this.bsingelBall){
                var mainNode = self.node.parent
                var mainControl = mainNode.getComponent("mainScene")
                mainControl.showScore(cc.v2(pos.x - 640,pos.y - 360),0)
                mainControl.showHitEffect(cc.v2(other.node.position.x - 27,other.node.position.y),1,mainNode)
                mainControl.Score += 10
                mainControl.scoreLab.string = mainControl.Score

                for(var i = 0;i < mainControl.jianArray.length; i++){
                    if(mainControl.jianArray[i] == other.node){
                        mainControl.jianArray.splice(i,1)
                    }
                }

                other.node.destroy()
                self.node.destroy()
            }else{
                console.log("箭")
                other.node.stopAllActions()
                var wolfNode = self.node.parent.getChildByName("wolf")
                //var wolfNode = childrens[0]
                console.log(wolfNode)
                var wolfcontrol = wolfNode.getComponent("wolf")
                wolfcontrol.ballNum--
                var mainNode = other.node.parent
                var mainScene = mainNode.getComponent("mainScene")
                mainScene.showHitEffect(cc.v2(other.node.position.x - 27,other.node.position.y),1,mainNode)
                if(wolfcontrol.ballNum == 0){
                    wolfcontrol.die()
                    wolfcontrol.bFly = false
                    wolfcontrol.bDie = true
                    cc.vv.audioMgr.playSFX("sound_wolveshowl_01.mp3");
                    //mainScene.AllWolfArray.remove(wolfNode)
                    for(var i = 0;i < mainScene.AllWolfArray.length; i++){
                        if(mainScene.AllWolfArray[i] == wolfNode){
                            mainScene.AllWolfArray.splice(i,1)
                        }
                    }
                }
                if(wolfcontrol.ballNum > 0){
                    for(var i = 0; i < wolfcontrol.ballNum;i++){
                        if(i == wolfcontrol.ballNum - 1){
                            var nextBallNode = self.node.parent.getChildByTag(i)
                            var nextBallControl = nextBallNode.getComponent("purpleBall")
                            nextBallControl.openCollision(true)
                        }

                        if(wolfcontrol.ballNum == 2){
                            self.node.parent.getChildByTag(0).runAction(cc.rotateTo(0.1,-20)) 
                            self.node.parent.getChildByTag(1).runAction(cc.rotateTo(0.1,20))
                        }
                        if(wolfcontrol.ballNum == 1){
                            self.node.parent.getChildByTag(0).runAction(cc.rotateTo(0.1,0)) 
                        }
                    }
                }
                var idx = 0
                if(this.ballOrign === 1){
                    idx = 3
                    mainScene.Score += 20               
                }else if(this.ballOrign === 2){
                    idx = 2
                    mainScene.Score += 17
                }else{
                    idx = 1
                    mainScene.Score += 14
                }
                mainScene.scoreLab.string = mainScene.Score
                mainScene.showScore(cc.v2(pos.x - 640,pos.y - 360),idx)
                for(var i = 0;i < mainScene.jianArray.length; i++){
                    if(mainScene.jianArray[i] == other.node){
                        mainScene.jianArray.splice(i,1)
                    }
                }
            }  

            other.node.destroy()
            self.node.destroy()
        }
    },

    update (dt) {
        if(this.bsingelBall){
            this.node.y += 3
            if(this.node.y > 400){
                this.node.destroy()
            }

        }
    },
    openCollision(bOpen){
        var colliders = this.getComponents(cc.PolygonCollider);
        colliders[0].enabled = bOpen
    },

});
