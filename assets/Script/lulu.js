cc.Class({
    extends: cc.Component,

    properties: {

    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        
        this._armatureDisplay = this.node.getComponent(dragonBones.ArmatureDisplay);
        this.bDie = false
        this.StoneDropDie = false
        var self = this
        this._armatureDisplay.addEventListener(dragonBones.EventObject.COMPLETE,function(event){
            if (event.type === dragonBones.EventObject.COMPLETE){
                if(event.detail.animationState.name === "atteck1" || event.detail.animationState.name === "atteck2"){
                    self.stand()           
                }   
            } 
        })
    },

    start () {
        
    },
    //拿箭站立
    stand(){
        this._armatureDisplay.playAnimation("stand1")
    },
    //拿肉站立
    stand1(){
        this._armatureDisplay.playAnimation("stand2")
    },
    //死亡
    die(){
        this._armatureDisplay.playAnimation("die")
    },
    //拿箭攻击
    attack(){
        this._armatureDisplay.playAnimation("atteck1")
    },
    //拿肉攻击
    attack1(){
        this._armatureDisplay.playAnimation("atteck2")
    },



    update (dt) {
        if(this.StoneDropDie){
            this.node.y -= 11
            if(this.node.y < -200){
                this.node.y = -200
            }

        }
    },

    onCollisionEnter: function (other, self) {
        //石头击中猪
        var selfcontrol = this
        if(other.tag === 5 && self.tag === 4){
            console.log("被石头击中")
            this.die()
            var pos = other.node.position
            var mainNode = self.node.parent
            var mainScene = mainNode.getComponent("mainScene")
            mainScene.showHitEffect(pos,2,other.node.parent)
            other.node.removeFromParent()
            this.bDie = true
            this.node.runAction(cc.sequence(cc.delayTime(0.5),cc.callFunc(function(){
                mainScene.gameover()
            })))
            cc.vv.audioMgr.playSFX("sound_ballhit_01.mp3");
        }
        //石头击中伞
        if(other.tag === 5 && self.tag === 6){
            console.log("被石头击中")
            var pos = other.node.position
            other.node.stopAllActions()
            other.node.position = pos           
            var mainNode = self.node.parent
            var mainScene = mainNode.getComponent("mainScene")
            mainScene.showHitEffect(pos,2,other.node.parent)
            // var ani = other.node.getComponent(cc.Animation)
            // ani.play("stoneDrop")
            cc.vv.audioMgr.playSFX("sound_closehit_01.mp3");
            other.node.destroy()
        }
        if(other.tag === 8 && self.tag === 6){
            var mainNode = self.node.parent
            var mainScene = mainNode.getComponent("mainScene")
            cc.vv.audioMgr.playSFX("sound_pigfall_01.mp3");
            //mainScene.gameover() 
            this.StoneDropDie = true
            this.bDie = true
            // var ani = other.node.getComponent(cc.Animation)
            // ani.play("dropStone")
            this.node.runAction(cc.sequence(cc.delayTime(0.5),cc.callFunc(function(){
                selfcontrol.die()
                cc.vv.audioMgr.playSFX("sound_pigdown_01.mp3");
            }),cc.delayTime(0.5),cc.callFunc(function(){
                mainScene.gameover() 
            })))
        }

        
    },
});
