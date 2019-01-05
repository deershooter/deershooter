
cc.Class({
    extends: cc.Component,

    properties: {

    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        var spine = this.spine = this.node.getComponent(sp.Skeleton)
        this.powerSpine = this.node.getChildByName("ball1").getComponent(sp.Skeleton)
        this.whiteSpine = this.node.getChildByName("ball2").getComponent(sp.Skeleton)

        var self = this
        this.powerSpine.setCompleteListener(function(trackEntry){
            var animationName = trackEntry.animation ? trackEntry.animation.name : "";
            if(animationName == "animation"){
                self.node.getChildByName("ball1").active = false
            }
        })

        this.whiteSpine.setCompleteListener(function(trackEntry){
            var animationName = trackEntry.animation ? trackEntry.animation.name : "";
            if(animationName == "animation"){
                self.node.getChildByName("ball2").active = false
            }
        })
    },

    start () {

    },
    createBall(colorIdex){
        //炮台动作
        this.spine.setAnimation(0, 'animation', false);

        if(colorIdex == 0){
            var powerNode = this.node.getChildByName("ball1")
            // powerNode.runAction(cc.sequence(cc.delayTime(0.05),cc.callFunc(function(){
                
            // })))
            powerNode.active = true
            this.powerSpine.setAnimation(0, 'animation', false);
        }else{
            this.whiteSpine.setAnimation(0, 'animation', false);
            var whiteNode = this.node.getChildByName("ball2")
            // whiteNode.runAction(cc.sequence(cc.delayTime(0.05),cc.callFunc(function(){
                
            // })))
            whiteNode.active = true
        }
    }

    // update (dt) {},
});
