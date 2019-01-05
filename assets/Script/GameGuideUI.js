// Learn cc.Class:
//  - [Chinese] http://www.cocos.com/docs/creator/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/editors_and_tools/creator-chapters/scripting/class/index.html
// Learn Attribute:
//  - [Chinese] http://www.cocos.com/docs/creator/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/editors_and_tools/creator-chapters/scripting/reference/attributes/index.html
// Learn life-cycle callbacks:
//  - [Chinese] http://www.cocos.com/docs/creator/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/editors_and_tools/creator-chapters/scripting/life-cycle-callbacks/index.html
var GamePanelBase = require('GamePanelBase');
const i18n = require('LanguageData');
var yaogan = {type:cc.Mask.Type.RECT,width:320,height:520,segements:4,pos:new cc.Vec2(-460,-90)}
var gongji = {type:cc.Mask.Type.RECT,width:300,height:270,segements:4,pos:new cc.Vec2(480,-220)}
var qiqiu = {type:cc.Mask.Type.RECT,width:700,height:400,segements:4,pos:new cc.Vec2(-50,-30)}
var pingguo = {type:cc.Mask.Type.RECT,width:300,height:250,segements:4,pos:new cc.Vec2(450,-20)}
var shitou = {type:cc.Mask.Type.RECT,width:800,height:170,segements:4,pos:new cc.Vec2(-20,280)}



cc.Class({
    extends: GamePanelBase,

    properties: {
        mask:cc.Node,        //遮罩
        maskControl:null,    //遮罩脚本对象
        cur_guide_step:1,    //当前引导步数
        arrow_sp:cc.Node,    //箭头精灵
        tip_label:cc.Node,   //提示标语
        guide_step:null,
        nextBtn:cc.Node,
        FightBtn:cc.Node,
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.maskControl = this.mask.getComponent("MaskPanel")
       
        // var self = this
        // this.mask.on('touchstart', function (event) {
        //     cc.log(event)
        //     cc.log("mask_sp.touchstart")

        //     event.stopPropagation();
        // });
        // this.mask.on('touchend', function (event) {
        //     cc.log("mask_sp.touchend")
        //     event.stopPropagation();
        // });
    
    },

    start () {
        cc.log("this.maskControl._clippingStencil")
        cc.log(this.maskControl._clippingStencil)
        var GUIDE_STEP = {
            1:{config:yaogan,arrow:false,arrow_pos:new cc.Vec2(0,0),tipLabel_txt:i18n.t(""),tipLabel_pos:new cc.Vec2(0,-0)},
            2:{config:gongji,arrow:false,arrow_pos:new cc.Vec2(0,0),tipLabel_txt:i18n.t(""),tipLabel_pos:new cc.Vec2(0,20)},
            3:{config:qiqiu,arrow:false,arrow_pos:new cc.Vec2(0,0),tipLabel_txt:i18n.t(""),tipLabel_pos:new cc.Vec2(0,-250)},
            4:{config:pingguo,arrow:false,arrow_pos:new cc.Vec2(265,-450),tipLabel_txt:i18n.t(""),tipLabel_pos:new cc.Vec2(0,-400)},
            5:{config:shitou,arrow:false,arrow_pos:new cc.Vec2(265,-450),tipLabel_txt:i18n.t(""),tipLabel_pos:new cc.Vec2(96,-266)},
        }
        this.guide_step = GUIDE_STEP
    },

    showClipping:function(guide_step){
        var result = this.guide_step[guide_step]
        var config = result.config
        //this.arrow_sp.active = result.arrow
        if(result.arrow){
             var seq = cc.repeatForever(
             cc.sequence(
                 cc.moveBy(0.5, 0, 30),
                 cc.moveBy(0.5, 0, -30)
             ));
             this.arrow_sp.runAction(seq);
        }
        //this.arrow_sp.x = result.arrow_pos.x
        //this.arrow_sp.y = result.arrow_pos.y 

        // this.tip_label.runAction(cc.repeatForever(cc.blink(2, 2)))
        // this.tip_label.getComponent(cc.Label).string = result.tipLabel_txt
        // this.tip_label.x = result.tipLabel_pos.x
        // this.tip_label.y = result.tipLabel_pos.y
        this.maskControl.showClipping(config)
        this.cur_guide_step = guide_step
    },
    onEnable(){
        this.nextBtn.active = true
        this.FightBtn.active = false
    },
    onClickNext(){
        this.cur_guide_step++
        this.showClipping(this.cur_guide_step)
        if(this.cur_guide_step == 5){
            this.nextBtn.active = false
            this.FightBtn.active = true
        }
    },
    onClickFight(){
        this.node.active = false
    }
    // update (dt) {},
});
