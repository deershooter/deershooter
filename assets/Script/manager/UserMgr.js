// require("md5");
const i18n = require('LanguageData');
cc.Class({
    extends: cc.Component,
    properties: {
        uid:null,               
        nick_name:"",         
        gender:0,            
        avatar:"",            
        expires_in:"",        
        update_time:"",       
        age:0,               
        city:"",              
        country:"",           
        country_icon:"",      
        constellation:"",     
        constellation_icon:"",
        assets:"",            
        access_token:0,
        refresh_token:null,
        carids:"",
        gtc_count:0,
        //匹配成功后
        game_ip:null,
        game_port:null,
        batRoom_id:null,
        battle_other_Car_id:0,
        other_gender:"",       
        other_avatar:"",     
        other_age:0,      
        other_city:"",     
        other_country:"",   
        other_country_icon:"",    
        other_constellation:"",    
        other_constellation_icon:"",
        pkuid:null,
        othernickname:null,
        //
        battleCar_id:0,
        battleRoom_id:null,
        betMoney:1000,
        //是否确认下注
        isbetOver:false,
        //战斗模式
        //0 ---pvp ----1----pve
        battle_type:0,

        Robot:null,
        Chonglian:null,
        //匹配弹窗
        mappingLayout:null,
        macthing:false,
        bRobot:false
    },
    
    getBetMoney:function(){
        return this.betMoney
    },
    setBetMoney:function(bet){
        this.betMoney = bet
    },
    guestAuth:function(){
        var account = cc.args["account"];
        if(account == null){
            account = cc.sys.localStorage.getItem("account");
        }
        
        if(account == null){
            account = Date.now();
            cc.sys.localStorage.setItem("account",account);
        }
        
        cc.vv.http.sendRequest("/guest",{account:account},this.onAuth);
    },
    
    login:function(){
        var self = this;
        var onLogin = function(ret){
            console.log(ret);
            if(ret.code == "0"){
                // {"uid":511,"nick_name":"nbplayer1","gender":0,"avatar":"","expires_in":"2246-05-10%2016:13:24","update_time":"2018-03-01%2006:06:39","assets":{"btc":1000000,"frozen_btc":0,"eth":1000000,"frozen_eth":0,"gtc":999918,"frozen_gtc":0,"trx":1000000,"frozen_trx":0}}
                console.log("ret.data")
                console.log(ret.data);
           
                self.uid               = ret.data.uid
                self.nick_name         = ret.data.nick_name
                self.gender            = ret.data.gender
                self.avatar            = ret.data.avatar
                self.expires_in        = ret.data.expires_in
                self.update_time       = ret.data.update_time
                self.age               = ret.data.age
                self.city              = ret.data.city
                self.country           = ret.data.country
                self.country_icon      = ret.data.country_icon
                self.constellation     = ret.data.constellation
                self.constellation_icon= ret.data.constellation_icon
                self.assets            = ret.data.assets
                if(self.assets){
                     self.gtc_count         = self.assets.gtc / 100000000
                }
                self.battleCar_id      = ret.data.battleCar_id

                self.refresh_token     = ret.refresh_token
                self.access_token      = ret.access_token
                self.Chonglian         = ret.Chonglian

                if(self.Chonglian === "true"){
                    self.game_ip = ret.ip,
                    self.game_port = ret.port,
            
                    self.pkuid = ret.pkuid == "Robot"?ret.pkuid:ret.uid,
                    self.othernickname = ret.nick_name
                    self.other_gender  = ret.gender      
                    self.other_avatar  = ret.avatar
                    self.other_age     = ret.age    
                    self.other_city    = ret.city    
                    self.other_country = ret.country 
                    self.other_country_icon = ret.country_icon   
                    self.other_constellation = ret.constellation  
                    self.other_constellation_icon = ret.constellation_icon
                    if(ret.bet){
                        cc.args.bet = ret.bet
                        cc.args.coin_type = ret.coin_type
                    }

                    // self.pkuid = ret.pkuid,
                    // self.othernickname = ret.nickname
                    self.batRoom_id = ret.roomid
                    cc.vv.net.ip = "ws://" + self.game_ip + ":" + self.game_port + "/chat/" + self.uid + "/" + self.batRoom_id;
                    // cc.vv.wc.show("游戏尚在进行中,尝试重连中。。。")
                    //cc.vv.wc.show(i18n.t("label.gameTip_21"))
                    cc.vv.EventEmitter.emit("userReconnectGame",{restart:true})
                }
        
                // cc.sys.localStorage.setItem("logintoken",ret.logintoken);
                // cc.director.loadScene("mainScnen");
                cc.vv.EventEmitter.emit("updataUserInfo",{})
                //cc.vv.wc.hide()
                console.log("userLoginOk")
                cc.vv.EventEmitter.emit("userLoginOk",{})
            }else{   
                cc.log(ret.errorMsg)
                //cc.vv.wc.show(ret.message) 
                // setTimeout(function(){
                //     self.login()
                // },1)
            }
        };
        //cc.vv.wc.show(i18n.t("label.http_get_userInfo"))
        cc.vv.http.sendRequest("user/login",{authorization_code:cc.args.authorization_code,refresh_token:self.refresh_token},onLogin);
       
    },


    start:function(){
        var self = this;
        var onStart = function(ret){
            console.log(ret);
            if(ret.code == "16"){
                console.log("ret.data")
                console.log(ret.data);   
                
                cc.log("匹配数据")

                
                self.game_ip = ret.ip,
                self.game_port = ret.port,
                //self.othernickname = ret.nick_name
                self.batRoom_id = ret.roomid
                //关闭匹配服连接
                //cc.vv.net.close()
                //建立长连接
                //this.node.runAction(cc.sequence)
                cc.vv.net.ip = "ws://" + self.game_ip + ":" + self.game_port + "/chat/" + self.uid + "/" + self.batRoom_id;
                cc.vv.EventEmitter.emit("mappingOk",{})
                cc.vv.EventEmitter.emit("startGame",{})

            }else if(ret.code == "666"){   
                cc.log(ret.errorMsg)
                if(ret.error)
                //cc.vv.EventEmitter.emit("serverError",{error:ret.error})
                var data = {error:ret.error}
                cc.vv.gameNetMgr.dispatchEvent('serverError',{data:data});
            }else{

            }
        };
        var data = {uid:self.uid,
            bet:cc.args.bet,
            nick_name:self.nick_name,
            coin_type:cc.args.coin_type,
            access_token:self.access_token,
            }
        cc.vv.http.sendRequest("user/start",data,onStart);
       
    },
    getUserInfo(){
        var getInfo = function(ret){
            console.log(ret)
        }
        var data = {
            source:4,
            uid:cc.args.user_id,
            game_id:8050,
            time:Date.now(),
            sign:"74ce03afa2e6484d98bd3c4b6667bba1",
        }

        cc.vv.http.sendRequest("minigame/userInfo",data,getInfo);
    },

    matchingScreenings:function(){
        var self = this
        var onmessage = function(ret){
            if(ret.code == "0"){
                if(cc.vv){
                    cc.vv.EventEmitter.emit("canmapping")
                }
            }
        }
        cc.vv.http.sendRequest("Hall/matchingScreenings",{uid:this.uid,coin_type:cc.args.coin_type,access_token:this.access_token},onmessage);

    },
    //robot --标识机器人
    mapping:function(robot){
        var self = this;
        var onmapping = function(ret){
            cc.log(ret)
            if(ret.code == "0"){
                cc.log("mapping data ");
                cc.log(ret)
                self.game_ip = ret.ip,
                self.game_port = ret.port,
                self.battle_other_Car_id = ret.carid,
                self.pkuid = ret.pkuid,
                self.othernickname = ret.nick_name
                self.batRoom_id = ret.roomid

                self.other_gender = ret.gender    
                self.other_avatar = ret.avatar 
                self.other_age    = ret.age   
                self.other_city   = ret.city   
                self.other_country = ret.country
                self.other_country_icon = ret.country_icon   
                self.other_constellation = ret.constellation   
                self.other_constellation_icon = ret.constellation_icon

                self.bRobot = (ret.pkuid == 'Robot')?true:false

                cc.vv.net.ip = "ws://" + self.game_ip + ":" + self.game_port + "/chat/" + self.uid + "/" + self.batRoom_id;

                if(cc.vv){
                    cc.vv.EventEmitter.emit("mappingOk",{})
                    cc.vv.EventEmitter.emit("updataAllUserInfo",{})
                }
                
            }else{

            }
        };

        var data = {uid:this.uid,
            bet:cc.args.bet,
            nick_name:this.nick_name,
            coin_type:cc.args.coin_type,
            access_token:this.access_token,
            gender:this.gender,
            avatar:this.avatar,
            age:this.age,
            city:this.city,
            country:this.country,
            country_icon:this.country_icon,
            constellation_icon:0,//this.constellation_icon,
            constellation:this.constellation}
        cc.log("urldata")
        cc.log(data)
        cc.vv.http.sendRequest("Hall/matching",data,onmapping);
    },
    
    Garage:function(){
        var self = this;
        var GarageResult = function(ret){
            cc.log(ret)
            if(ret.code == "0"){
                self.carids = ret.carids
                self.assets            = ret.data.assets
                if(self.assets){
                     self.gtc_count         = self.assets.gtc / 100000000
                }
                cc.director.loadScene("parkScene");
                cc.vv.wc.hide()
            }else{
                cc.vv.wc.show(ret.message,2)
            }
        };
        cc.vv.http.sendRequest("/user/Garage",{uid:this.uid,refresh_token:self.refresh_token},GarageResult);
    },


    isOwnCar:function(carid){
    
    },

    purchase:function(carid){
        var self = this;
        var purchaseResult = function(ret){
            cc.log(ret)
            if(ret.code == "0"){
                self.carids = ret.carids
                self.gtc_count = ret.gtc / 100000000
                if(cc.vv){
                    cc.vv.EventEmitter.emit("shopOk")
                }
                // cc.vv.wc.hide()

                cc.vv.wc.show("OK",1)
            }else{
                cc.log("错误消息")
                cc.log(ret.message)
                cc.vv.wc.show(ret.message,1)
                // setTimeout(function(){
                //     self.purchase(carid)
                // },0.3)
            } 
        };

        cc.vv.http.sendRequest("/user/purchase",{uid:this.uid,refresh_token:this.refresh_token,carid:carid},purchaseResult);
    },

    gotoBattle:function(){
        var self = this
        cc.vv.net.ip = "ws://" + self.game_ip + ":" + self.game_port + "/chat/" + self.uid + "/" + self.batRoom_id;
        cc.director.loadScene("battleScene");
    },
});
