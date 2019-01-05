cc.Class({
    extends: cc.Component,

    properties: {
        account: null,
        userId: null,
        userName: null,
        lv: 0,
        exp: 0,
        coins: 0,
        gems: 0,
        sign: 0,
        ip: "",
        sex: 0,
        roomData: null,

        oldRoomId: null,
        //BetPanel:cc.Node,
        //EndPanel:cc.Node,
        our_Info_node:cc.Node,
        mainScene:cc.Node,
        //moneyLabel:cc.Label,
        music_icon:cc.Sprite,
        musicEffec_icon:cc.Sprite,
        main_music_icon:cc.Sprite,
        main_musicEffec_icon:cc.Sprite,
        gameEndPanel:cc.Node,
        guidePanel:cc.Node,
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        // var resList = [
        //     // "pics",
        //     // "prefabs",
        //     // "fonts",
        //     // "anims",
        //     "Texture",
        // ]
        // cc.myAssets = {}
        // var count = 0
        // for (var i = 0; i < resList.length; i++) {
        //     cc.loader.loadRes(resList[i], function (i, err, assets) {
        //         cc.myAssets[resList[i]] = assets
        //         cc.log("资源加载完成" + count)
        //         count++
        //         if(count >= resList.length){
        //             //为了前置加载音效，这里直接为这个场景添加所有声音的组件
        //             // for (var j = 0; j < soundResList.length; j++) {
        //             //     cc.audioEngine.playEffect(cc.url.raw(soundResList[j]), false, 0)
        //             // }


        //             //开始游戏
        //             //cc.director.loadScene("startScene")
        //             //var node = this.node.getChildByName("StartBtn")
        //             //node.active = true
        //         }
        //     }.bind(this, i))
        // }
        this.mainSceneControl = this.mainScene.getComponent("mainScene")
    },

    start () {
       //cc.vv.userMgr.login()
    },
    closeGame:function(){
        window.location.href = 'http://47.94.229.131:8013/' 
    },
    onEnable:function(){
        this.setUserInfo()
        cc.vv.audioMgr.playBGM("music_start_01.mp3");
        if(cc.vv.audioMgr.getPlayBgMusicState()){
            this.music_icon.node.active = false
            this.main_music_icon.node.active = false
        }else{
            this.music_icon.node.active = true
            this.main_music_icon.node.active = true
        }

        if(cc.vv.audioMgr.getPlayEffecMusicState()){
            this.musicEffec_icon.node.active = false
            this.main_musicEffec_icon.node.active = false
        }else{
            this.musicEffec_icon.node.active = true
            this.main_musicEffec_icon.node.active = true
        }
    },
    OnloadMusicAndEffect:function(){
        this.setUserInfo()
        this.node.getChildByName("startBtn").active = true
        this.node.getChildByName("loading").active = false
        if(cc.vv.audioMgr.getPlayBgMusicState()){
            this.music_icon.node.active = false
            this.main_music_icon.node.active = false
        }else{
            this.music_icon.node.active = true
            this.main_music_icon.node.active = true
        }

        if(cc.vv.audioMgr.getPlayEffecMusicState()){
            this.musicEffec_icon.node.active = false
            this.main_musicEffec_icon.node.active = false
        }else{
            this.musicEffec_icon.node.active = true
            this.main_musicEffec_icon.node.active = true
        }
    },
    BtnStartScene:function(){
        //是否为新手教程，false表示是新手教程
        // var bJiaoCheng = cc.sys.localStorage.getItem('caaaaabb');
        // if(bJiaoCheng)
        // {
        //     this.BetPanel.active = true
        // }
        // //this.BetPanel.active = true
        this.node.active = false  
        this.gameEndPanel.active = false     
        // this.EndPanel.active = false
        cc.vv.userMgr.start()
        this.mainSceneControl.resetScene()

        this.mainSceneControl.playerControl.bDie = false
        this.mainSceneControl.playerControl.StoneDropDie = false
        this.mainSceneControl.rouKuai.active = true
        this.mainSceneControl.playerControl.stand()
        cc.vv.audioMgr.playSFX("sound_tap_01.mp3");
        this.mainSceneControl.startGame()
    },
    setUserInfo:function(){
        //设置自己的ui
        var ourData = {name:cc.vv.userMgr.nick_name,
                constellation_icon:cc.vv.userMgr.constellation_icon,
                avatar:cc.vv.userMgr.avatar,
                gender:cc.vv.userMgr.gender,
                age:cc.vv.userMgr.age,
                city:cc.vv.userMgr.city,
                country_icon:cc.vv.userMgr.country_icon}

        this.our_Info_node.getComponent("user_info").setInfo(ourData)
        // if(cc.args.coin_type == "free"){
        //     this.moneyLabel.string  = "free"
        // }else{
        //     this.moneyLabel.string  = "pay"
        // } 
    },

    musicBtnClick:function(){
        //cc.vv.gameNetMgr.dispatchEvent("heartDead")
        if(cc.vv.audioMgr.getPlayBgMusicState()){
            cc.vv.audioMgr.setPlayBgMusicState("0")
            cc.audioEngine.stop(cc.vv.audioMgr.bgmAudioID);
            this.music_icon.node.active = true
            this.main_music_icon.node.active = true
        }else{
            cc.vv.audioMgr.setPlayBgMusicState("1")
            cc.vv.audioMgr.playBGM("music_start_01.mp3");
            this.music_icon.node.active = false
            this.main_music_icon.node.active = false
        }
        cc.vv.audioMgr.playSFX("sound_tap_01.mp3");
    },

    musicEffecBtnClick:function(){       
        if(cc.vv.audioMgr.getPlayEffecMusicState()){
            cc.vv.audioMgr.setPlayEffecMusicState("0")
            this.musicEffec_icon.node.active = true
            this.main_musicEffec_icon.node.active = true
        }else{
            cc.vv.audioMgr.setPlayEffecMusicState("1")
            this.musicEffec_icon.node.active = false
            this.main_musicEffec_icon.node.active = false
        }
        cc.vv.audioMgr.playSFX("sound_tap_01.mp3");
    },
    onClickHelp:function(){
        cc.vv.audioMgr.playSFX("sound_tap_01.mp3");
        console.log("帮助")
        this.guidePanel.active = true
        this.guidePanel.opacity = 255
        var guideControl = this.guidePanel.getComponent("GameGuideUI")
        guideControl.showClipping(1)
    },
    // update (dt) {},
});
