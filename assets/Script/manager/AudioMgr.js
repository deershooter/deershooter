cc.Class({
    extends: cc.Component,

    properties: {
        // foo: {
        //    default: null,      // The default value will be used only when the component attaching
        //                           to a node for the first time
        //    url: cc.Texture2D,  // optional, default is typeof default
        //    serializable: true, // optional, default is true
        //    visible: true,      // optional, default is true
        //    displayName: 'Foo', // optional
        //    readonly: false,    // optional, default is false
        // },
        // ...
        bgmVolume:1.0,
        sfxVolume:1.0,
        
        bgmAudioID:-1,
        canPlayBgMusic:true,
        canPlayEffecMusic:true,
    },

    // use this for initialization
    init: function () {
        var t = cc.sys.localStorage.getItem("canPlayBgMusic");
        cc.log("var t = cc.sys.localStorage.getItem;")
        cc.log(t)
        if(t != null){
            this.canPlayBgMusic = (t == 1);    
        }
        
        var t = cc.sys.localStorage.getItem("canPlayEffecMusic");
        if(t != null){
            this.canPlayEffecMusic = (t == 1);    
        }

        var t = cc.sys.localStorage.getItem("bgmVolume");
        if(t != null){
            this.bgmVolume = parseFloat(t);    
        }
        
        var t = cc.sys.localStorage.getItem("sfxVolume");
        if(t != null){
            this.sfxVolume = parseFloat(t);    
        }
        
        cc.game.on(cc.game.EVENT_HIDE, function () {
            console.log("cc.audioEngine.pauseAll");
            cc.audioEngine.pauseAll();
        });
        cc.game.on(cc.game.EVENT_SHOW, function () {
            console.log("cc.audioEngine.resumeAll");
            cc.audioEngine.resumeAll();
        });
    },

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
    
    getUrl:function(url){
        return cc.url.raw("resources/audio/" + url);
    },
    
    getPlayBgMusicState:function(){
        var t = cc.sys.localStorage.getItem("canPlayBgMusic");
        cc.log("var t = cc.sys.localStorage.getItem;")
        cc.log(t)
        if(t != null){
            this.canPlayBgMusic = (t == 1);    
        }
        return this.canPlayBgMusic
    },
    setPlayBgMusicState:function(value){
        cc.sys.localStorage.setItem("canPlayBgMusic",value);
        this.canPlayBgMusic = (1 == value)
    },
    getPlayEffecMusicState:function(){
        var t = cc.sys.localStorage.getItem("canPlayEffecMusic");
        if(t != null){
            this.canPlayEffecMusic = (t == 1);    
        }
        return this.canPlayEffecMusic
    },
    setPlayEffecMusicState:function(value){
        cc.sys.localStorage.setItem("canPlayEffecMusic",value);
        this.canPlayEffecMusic = (1 == value);    
    },
    playBGM(url){
        var audioUrl = this.getUrl(url);
        console.log(audioUrl);
        if(this.canPlayBgMusic){
            if(this.bgmAudioID >= 0){
                cc.audioEngine.stop(this.bgmAudioID);
            }
            cc.Audio.useWebAudio = true
            this.bgmAudioID = cc.audioEngine.play(audioUrl,true,this.bgmVolume);
        }
    },
    
    playSFX(url){
        var audioUrl = this.getUrl(url);
        var audioId = null
        if(this.canPlayEffecMusic){
            if(this.sfxVolume > 0){
                cc.Audio.useWebAudio = true
                audioId = cc.audioEngine.play(audioUrl,false,this.sfxVolume);    
            }
        }
        return audioId
    },
    
    setSFXVolume:function(v){
        if(this.sfxVolume != v){
            cc.sys.localStorage.setItem("sfxVolume",v);
            this.sfxVolume = v;
        }
    },
    
    setBGMVolume:function(v,force){
        if(this.bgmAudioID >= 0){
            if(v > 0){
                cc.audioEngine.resume(this.bgmAudioID);
            }
            else{
                cc.audioEngine.pause(this.bgmAudioID);
            }
            //cc.audioEngine.setVolume(this.bgmAudioID,this.bgmVolume);
        }
        if(this.bgmVolume != v || force){
            cc.sys.localStorage.setItem("bgmVolume",v);
            this.bgmVolume = v;
            cc.audioEngine.setVolume(this.bgmAudioID,v);
        }
    },
    
    pauseAll:function(){
        cc.audioEngine.pauseAll();
    },
    
    resumeAll:function(){
        cc.audioEngine.resumeAll();
    }
});
