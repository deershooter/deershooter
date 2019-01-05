const i18n = require('LanguageData');
var Global = cc.Class({
    extends: cc.Component,
    statics: {
        ip:"ws://192.168.1.113:8080/websocket/chat",
        // ws://39.106.196.100:8025/chat
        socket:null,
        isPinging:false,
        fnDisconnect:null,
        HearbeatId:null,
        pingTime:null,
        pingTime_2:null,
        reconnectCount:3,
        handlers:{},
        needReconnect:false, //标识是否需要重连
        netClosedCall:null,//网络关闭完成回调
        addHandler:function(event,fn){
            if(this.handlers[event]){
                console.log("event:" + event + "' handler has been registered.");
                return;
            }
            var handler = function(data){
                //console.log(event + "(" + typeof(data) + "):" + (data? data.toString():"null"));
                if(event != "disconnect" && typeof(data) == "string"){
                    data = JSON.parse(data);
                }
                fn(data);
            };
            this.handlers[event] = handler; 
        },
        connect:function(fnConnect,fnError,netClosedCall) {
            this.netClosedCall = netClosedCall
            var self = this;
            var ip = cc.vv.net.ip
            cc.log("socket:ip")
            cc.log(ip)
            self.socket = new WebSocket(ip);
            self.socket.onopen = function (event) {
                self.needReconnect = true
                self.reconnectCount = 3
                cc.log("Send Text WS was opened.");
                fnConnect()
                self.startHearbeat();
            };
            self.socket.onmessage = function (event) {
                self.pingTime_2 = Date.now() - self.pingTime
                cc.log("数据发送和收到消息的间隔--" + self.pingTime_2)
                cc.log("response text msg: " + event.data);
                var data = null;
                var data = JSON.parse(event.data);
                cc.log(data)
                if(data.code){
                    if(data.code == 1){
                        console.log('game_pong');
                        self.lastRecieveTime = Date.now(); 
                    }else{
                        self.handlers["" + data.code](data)
                    }
                }
               
            };
            self.socket.onerror = function (event) {
                cc.log("Send Text fired an error");
                //发生错误直接回主界面
                fnError()
            };
            self.socket.onclose = function (event) {
                cc.log("WebSocket instance closed.");
                //判断是否需要重连
                self.socket = null
                self.isPinging = false
                window.clearInterval(self.HearbeatId)
                self.HearbeatId = null
                cc.log("self.needReconnect")
                cc.log(self.needReconnect)
                if(self.needReconnect){
                    if(cc.vv){
                        cc.log("重连计数")
                        cc.log(self.reconnectCount)
                        if(self.reconnectCount == 0){
                            //重连三次连不上回大厅
                            cc.vv.EventEmitter.emit("gameError",{})
                        }else{
                            self.reconnectCount = self.reconnectCount - 1
                            //cc.vv.wc.show(i18n.t("label.gameTip_38"))
                            cc.vv.EventEmitter.emit("userReconnectGame",{restart:false})
                        } 
                    }
                }
               
            }; 
        },
        
        startHearbeat:function(){
            this.lastRecieveTime = Date.now();
            var self = this;
            console.log("心跳");
            if(!self.isPinging){
                console.log("心跳2");
                self.isPinging = true;
                self.HearbeatId = setInterval(function(){
                    console.log("心跳3");
                    if(self.socket && self.socket.readyState == 1){
                        console.log(4);
                        console.log("心跳4");
                        if(Date.now() - self.lastRecieveTime > 15000){
                            cc.log("心跳死了")
                            self.close();
                            cc.log("关闭")
                            this.needReconnect = true 
                            cc.vv.EventEmitter.emit("gameError",{})
                        }
                        else{
                            self.ping();
                        }                        
                    }
                },5000);
                cc.log("self.HearbeatId")
                cc.log(self.HearbeatId)
            }   
        },
        send:function(data){
            this.pingTime = Date.now();
            if(this.socket && this.socket.readyState == 1){
                if(data != null && (typeof(data) == "object")){
                    data = JSON.stringify(data);
                    console.log("send text msg:" + data);  
                    this.socket.send(data);            
                } 
            }else{ //无法发送数据尝试重连
                // if(cc.vv.Game.game_type != 0 ){
                //    this.socket.close()
                // }
            }
        },
        
        ping:function(){
            cc.log("game_ping")
            var data ={
                code:"1",
                data:"game_ping",
                uid:"" +cc.vv.userMgr.uid
            }
            this.send(data);
        },
        
        close:function(){
            console.log('close');
            if(this.socket){
                this.socket.close()
                this.socket = null
                this.isPinging = false
                window.clearInterval(this.HearbeatId)
                this.HearbeatId = null
            }
        },
    },
});