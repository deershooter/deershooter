cc.Class({
    extends: cc.Component,

    properties: {
        dataEventHandler:null,
        maxHp:5,
        curHp:0,
        otherCurHp:0,
        actionType:0,
        atkIndex:1,
        HitState:0,
        battleAction:null,
        Robot:null,
        battle_round:0,


        isMyRound:false,         //标识是否该自己操作
        curWheel_Result:null,    //当前轮盘显示结果
        curGameCheckerboard:null //当前棋盘状态 --颜色--血量

    },
    
    reset:function(){
     
    },
    
    clear:function(){
        this.dataEventHandler = null;
        if(this.isOver == null){
            this.seats = null;
            this.roomId = null;
            this.maxNumOfGames = 0;
            this.numOfGames = 0;        
        }
    },

    dispatchEvent:function(event,data){
        if(this.dataEventHandler){
            this.dataEventHandler.emit(event,data);
        }    
    },
    
    
    initHandlers:function(){
        cc.log("cc.vv")
        cc.log(cc.vv)
        var self = this;
        //玩家都已经连接进来了
        cc.vv.net.addHandler("2",function(data){
            console.log(data);
            self.isMyRound = data.first == 1 ? true : false
            self.dispatchEvent('game_star',{data:data});
        });

        //服务器发来骰子放置位置
        cc.vv.net.addHandler("3",function(data){
            //console.log(data);
            //self.curWheel_Result = data.lunpan
            self.dispatchEvent('OtherDrop',{data:data});
        });
        //服务器发送对方产生的骰子
        cc.vv.net.addHandler("4",function(data){
            console.log(data);
            self.dispatchEvent('OtherCreateSice',{data:data});
        });

        //骰子无处可放，重置棋盘
        cc.vv.net.addHandler("7",function(data){
            console.log(data);
            self.dispatchEvent('ClearCheckbroad',{data:data});
        });
        cc.vv.net.addHandler("10",function(data){
            console.log(data);
            self.dispatchEvent('battleEnd',{data:data});
        });
        
        cc.vv.net.addHandler("11",function(data){
            console.log(data);
            self.dispatchEvent('battleAgain',{data:data});
        });
        
        cc.vv.net.addHandler("12",function(data){
            console.log(data);
            self.dispatchEvent('battleAgainOk',{data:data});
        });

        cc.vv.net.addHandler("13",function(data){
            console.log(data);
            //self.dispatchEvent('battleTimeOut',{data:data});
            self.dispatchEvent('NotPlayAgain',{data:data})
        });
        //双方在匹配成功时有人离开 -- 解散房间
        cc.vv.net.addHandler("14",function(data){
            console.log(data);
            self.dispatchEvent('battleroomFail',{data:data});
        });
        cc.vv.net.addHandler("15",function(data){
            console.log(data);
            self.dispatchEvent('reconnection',{data:data});
        });
        
        cc.vv.net.addHandler("20",function(data){
            console.log(data);
            self.dispatchEvent('playerleave',{data:data});
        });
        cc.vv.net.addHandler("30",function(data){
            console.log(data);
            self.dispatchEvent('battleTimeOut',{data:data});
        });
        
        //异常消息----战斗服
        cc.vv.net.addHandler("666",function(data){
            console.log(data);
            self.dispatchEvent('serverError',{data:data});
        });
///////////////////////////////////
//匹配服
        //异常消息----匹配服
        // cc.vv.mappingNet.addHandler("666",function(data){
        //     console.log(data);
        //     self.dispatchEvent('serverError',{data:data});
        // });
        // cc.vv.mappingNet.addHandler("16",function(data){
        //     console.log(data);
        //     self.dispatchEvent('mappingData',{data:data});
        // });
    },

    connectGameServer:function(onConnectOKCall,caller,onConnectFailCall){
        this.dissoveData = null;
        // cc.vv.net.ip = data.ip + ":" + data.port;
        //cc.vv.net.ip = "ws://" + "192.168.1.251:5558" + "/chat/" + cc.vv.userMgr.uid 
        console.log(cc.vv.net.ip);
        var self = this;

        var onConnectOK = function(){
            console.log("onConnectOK");
            if(onConnectOKCall){
                onConnectOKCall(caller)
            }
        };
        
        var onConnectFailed = function(){
            if(onConnectFailCall){
                onConnectFailCall(caller)
            }
        };
        // cc.vv.wc.show("正在进入房间");
        cc.vv.net.connect(onConnectOK,onConnectFailed);
    },
    //重连服务器
    reconnectGameServer:function(onConnectOKCall,caller,onConnectFailCall){
        this.dissoveData = null;
        // cc.vv.net.ip = data.ip + ":" + data.port;
        console.log(cc.vv.net.ip);
        var self = this;

        var onConnectOK = function(){
            console.log("onConnectOK");
            if(onConnectOKCall){
                onConnectOKCall(caller)
            }
        };
        
        var onConnectFailed = function(){
            // console.log("failed.");
            // cc.vv.wc.hide();
            if(onConnectFailCall){
                onConnectFailCall(caller)
            }
        };
        // cc.vv.wc.show("正在进入房间");
        cc.vv.net.connect(onConnectOK,onConnectFailed);
    },
    connectGameMappingServer:function(onConnectOKCall,onConnectFailCall,caller){
        //cc.vv.mappingNet.ip = "ws://" + "175.41.226.221:8031" + "/chat/" + cc.vv.userMgr.uid  //正式包
        cc.vv.mappingNet.ip = "ws://" + "175.41.226.221:8043" + "/chat/" + cc.vv.userMgr.uid  //测试包
        console.log(cc.vv.mappingNet.ip);
        var self = this;

        var onConnectOK = function(){
            console.log("onConnectOK");
            if(onConnectOKCall){
                onConnectOKCall(caller)
            }
        };
        
        var onConnectFailed = function(){
            // console.log("failed.");
            // cc.vv.wc.hide();
            if(onConnectFailCall){
                onConnectFailCall(caller)
            }
        };
        // cc.vv.wc.show("正在进入房间");
        cc.vv.mappingNet.connect(onConnectOK,onConnectFailed);
    },

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
