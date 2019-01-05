'use strict';

if (!window.i18n) {
    window.i18n = {};
}

if (!window.i18n.languages) {
    window.i18n.languages = {};
}

window.i18n.languages['zh'] = {
    "label_text":{
        exitTip:"是否确认退出游戏？",
        gameServerTip_1:"账户余额不足，请先充值",
        gameServerTip_2:"玩家免费场异常",
        gameServerTip_3:"创建房间失败",
        gameServerTip_4:"账户余额不足，请先充值",
        gameServerTip_5:"房间已经结算",
        gameServerTip_6:"无法在付费场匹配到用户，已为您切换为免费场进行匹配",
        gameServerTip_7:"没有可供放置的空间，清空棋盘后请继续",
        gameServerTip_8:"双方均未操作，房间已解散",
        Settlement:"结算: ",
        ReconnectionTip:"游戏重连中。。。",
        tryConnectTip:"网络异常，尝试重连中。。。",
        shouquanTip:"用户授权信息有误",
        connectNetworkTip:"正在连接服务器。。。。",
        connectOverTimeTip:"连接服务器超时",
        gamemsg:"弹药数：",
    }
};