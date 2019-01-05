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
        tip_label_1:cc.Label,
        tip_label_2:cc.Label,
        // tip_sp:cc.Node,
        // tip_sp_frames:[cc.SpriteFrame], //提示标语文本图片
    },

    // LIFE-CYCLE CALLBACKS:
    _showAniEnd:function(event){
        // cc.log("showCommonTip--" + "player over")
        // cc.log(this)
        this.node.active = false
    },

    showCommonTip:function(content){
        // cc.log("showCommonTip--" + content)
        cc.vv.audioMgr.playSFX("sound_ui_tips_01.mp3");

        this.node.active = true
        this.tip_label_1.string = content
        this.tip_label_2.string = content
        // this.tip_sp.spriteFrame = this.tip_sp_frames[1]
        var animation = this.getComponent(cc.Animation)
        animation.play("game_tip_ui_tip");
        animation.on('finished',this._showAniEnd, this);
    },

    onLoad () {
       
    },

    start () {

    },

    // update (dt) {},
});
