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
        // foo: {
        //     // ATTRIBUTES:
        //     default: null,        // The default value will be used only when the component attaching
        //                           // to a node for the first time
        //     type: cc.SpriteFrame, // optional, default is typeof default
        //     serializable: true,   // optional, default is true
        // },
        // bar: {
        //     get () {
        //         return this._bar;
        //     },
        //     set (value) {
        //         this._bar = value;
        //     }
        // },
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        var res_width = 1280
        var res_height = 720
        var real_H_W = cc.view.getFrameSize().height/cc.view.getFrameSize().width
        cc.log(real_H_W)
        if(real_H_W > res_height/ res_width){
            cc.log("比较高的屏幕")
            res_height = res_width * cc.view.getFrameSize().height / cc.view.getFrameSize().width
        }else{
            cc.log("比较宽的屏幕")
            res_width = res_height * cc.view.getFrameSize().width / cc.view.getFrameSize().height
        }
        cc.log("res_width" + res_width)
        cc.log("res_height" + res_height)
      
        cc.view.setDesignResolutionSize(res_width ,res_height, cc.ResolutionPolicy.SHOW_ALL);
    },

    start () {

    },

    // update (dt) {},
});
