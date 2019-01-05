cc.Class({
    extends: cc.Component,

    properties: {
        mainScene:cc.Node,

    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        var spine = this.spine = this.node.getComponent(sp.Skeleton)
        var self = this
        this.spine.setCompleteListener(function(trackEntry){
            var animationName = trackEntry.animation ? trackEntry.animation.name : "";
            if(animationName == "pig_attack" || animationName == "pig_attack1"){
                //self.stand()
                //self.mainScene.getComponent("mainScene").createJian()
            }
        })
        this.bDie = false
        this.StoneDropDie = false
        this.bDropStone = false
    },

    start () {

    },
    //拿箭站立
    stand(){
        this.spine.setAnimation(0, 'pig_stand', true);
    },
    //拿肉站立
    stand1(){
        this.spine.setAnimation(0, 'pig_stand1', true);
    },
    //死亡
    die(){
        this.spine.setAnimation(0, 'pig_die', false);
    },
    //拿箭攻击
    attack(){
        this.spine.setAnimation(0, 'pig_attack', true);
    },
    //拿肉攻击
    attack1(){
        this.spine.setAnimation(0, 'pig_attack1', false);
    },



    update (dt) {
        if(this.StoneDropDie){
            this.node.y -= 18
            if(this.node.y < -300){
                this.node.y = -300
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
            if(!this.bDropStone){
                this.bDropStone = true
                this.node.runAction(cc.sequence(cc.delayTime(0.5),cc.callFunc(function(){
                    selfcontrol.die()
                    cc.vv.audioMgr.playSFX("sound_pigdown_01.mp3");
                }),cc.delayTime(0.5),cc.callFunc(function(){
                    mainScene.gameover() 
                })))
            }
            
        }

        
    },
});
