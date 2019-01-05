// Learn cc.Class:
//  - [Chinese] http://www.cocos.com/docs/creator/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/editors_and_tools/creator-chapters/scripting/class/index.html
// Learn Attribute:
//  - [Chinese] http://www.cocos.com/docs/creator/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/editors_and_tools/creator-chapters/scripting/reference/attributes/index.html
// Learn life-cycle callbacks:
//  - [Chinese] http://www.cocos.com/docs/creator/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/editors_and_tools/creator-chapters/scripting/life-cycle-callbacks/index.html

cc.Class({
    extends: cc.Component,

    properties: {
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {

    },

    onCollisionEnter: function (other, self) {
        if(other.tag === 5){
            var pos = self.node.convertToWorldSpace(self.node.position)
            var mainNode = self.node.parent
            var mainScene = mainNode.getComponent("mainScene")
            mainScene.Score += 5
            mainScene.scoreLab.string = mainScene.Score
            mainScene.showScore(cc.v2(pos.x - 640,pos.y - 360),4)
            for(var i = 0;i < mainScene.jianArray.length; i++){
                if(mainScene.jianArray[i] == self.node){
                    mainScene.jianArray.splice(i,1)
                }
            }
            self.node.destroy()
            other.node.destroy()
            cc.vv.audioMgr.playSFX("sound_hitball_01.mp3");
        }
    },

    // update (dt) {},
});
