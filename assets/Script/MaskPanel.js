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
        _clippingStencil:null    //裁剪模板
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        cc.log("this.getComponent(cc.Mask)._clippingStencil22222222")
        cc.log(this.getComponent(cc.Mask)._clippingStencil)
        this._clippingStencil = this.getComponent(cc.Mask)._clippingStencil
        
    },

    start () {
        
    },

    showClipping:function(result){
        cc.log("this.getComponent(cc.Mask)")
        cc.log(this.getComponent(cc.Mask))
        this.getComponent(cc.Mask).type = result.type
        this.node.width = result.width
        this.node.height =  result.height
        this.getComponent(cc.Mask).segements = result.segements
        // this.getComponent(cc.Mask)._clippingStencil.x = result.pos.x
        // this.getComponent(cc.Mask)._clippingStencil.y = result.pos.y
        var action_1 = cc.moveTo(0.5, result.pos.x, result.pos.y);
        this.getComponent(cc.Mask)._clippingStencil.runAction(action_1);
        cc.log("this.getComponent(cc.Mask)._clippingStencil")
        cc.log(this.getComponent(cc.Mask)._clippingStencil)
       
    }
    // update (dt) {},
});
