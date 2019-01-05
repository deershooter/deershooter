//var GamePanelBase = require('GamePanelBase');
const i18n = require('LanguageData')
cc.Class({
    extends: cc.Component,

    properties: {
        our_Info_node:cc.Node,
        other_Info_node:cc.Node,
        mainPanel:cc.Node,
        moneyLayout:cc.Node,
        meScore:cc.Label,
        otherScore:cc.Label,
        pingjuTip:cc.Label,
        score:cc.Label,
        startPanel:cc.Node,
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {

    },

    start () {

    },
    onEnable:function(){
        this.resetUI()
    },
    setShowIcon:function(is_mine){
        // this.win_icon.spriteFrame = this.ice_sp_frame[is_mine ? 0:1]
        // if(is_mine){
        //     //cc.vv.audioMgr.playSFX("sound_ui_win_01.mp3");
        //     this.our_Info_node.getChildByName("Winner").active = true
        // }else{
        //     this.other_Info_node.getChildByName("Winner").active = true
        // }
    },

    resetUI:function(){
        // this.other_Info_node.getChildByName("Winner").active = false
        // this.other_Info_node.getChildByName("Winner").active = false
        //this.moneyLayout.active = false
        //this.pingjuTip.node.active = false
        //this.our_Info_node.getChildByName("gameTip").getComponent(cc.Label).string = ""

        // this.backBtn.getComponent(cc.Button).interactable = true
        // this.playAgainBtn.getComponent(cc.Button).interactable = true
        // this.changeBtn.getComponent(cc.Button).interactable = true

        //this.our_Info_node.active = true
        //设置自己的ui
        var ourData = {name:cc.vv.userMgr.nick_name,
                constellation_icon:cc.vv.userMgr.constellation_icon,
                avatar:cc.vv.userMgr.avatar,
                gender:cc.vv.userMgr.gender,
                age:cc.vv.userMgr.age,
                city:cc.vv.userMgr.city,
                country_icon:cc.vv.userMgr.country_icon}
    
        this.our_Info_node.getChildByName("user_info").getComponent("user_info").setInfo(ourData)
    },
    playAgainClick:function(){
        if(cc.args.lang == "en"){          
            this.our_Info_node.getChildByName("gameTip").getComponent(cc.Label).string = "Play Again"
        }else{
            this.our_Info_node.getChildByName("gameTip").getComponent(cc.Label).string = "再次挑战"
        }
    },

    otherPlayAgainCall:function(){
        if(cc.args.lang == "en"){          
            this.other_Info_node.getChildByName("gameTip").getComponent(cc.Label).string = "Play Again"
        }else{
            this.other_Info_node.getChildByName("gameTip").getComponent(cc.Label).string = "再次挑战"
        }
    },
    otherPlayLeaveCall:function(){
        this.other_Info_node.getChildByName("gameTip").active = true
        if(cc.args.lang == "en"){          
            this.other_Info_node.getChildByName("gameTip").getComponent(cc.Label).string = "Player Leave"
        }else{
            this.other_Info_node.getChildByName("gameTip").getComponent(cc.Label).string = "用户离开"
        }
    },
    isShow:function(){
        return this.node.active
    },
    showMoneyLayout:function(money){
        this.moneyLayout.active = true
        //this.moneyLayout.getChildByName("label_title").getComponent(cc.Label).string = i18n.t("label_text.Settlement")
        this.moneyLayout.getChildByName("label_money").getComponent(cc.Label).string = i18n.t("label_text.Settlement")+ money 
    },

    setScore:function(meScore,otherScore){
        var mestring = ""
        var otherstring = ""
        if(cc.args.lang == "en"){          
            mestring = "score: "
            otherstring = "Other score: "
        }else{
            mestring = "得分："
            otherstring = "对手得分："
        }
        if(otherScore == undefined)
            otherScore = 0
        if(meScore == undefined)
            meScore = 0
        this.meScore.string = mestring + meScore
        this.otherScore.string = otherstring + otherScore
    },

    showPingJuTip:function(){
        this.pingjuTip.node.active = true
        this.pingjuTip.string = i18n.t("label_text.gameServerTip_8")
    },
    showScore(Score){
        this.score.string = Score
    },
    onclickBack(){
        this.node.active = false
        this.startPanel.active = true
        var mainScene = this.mainPanel.getComponent("mainScene")
        mainScene.resetScene()
    }
    // update (dt) {},
});
