//var URL = "http://175.41.226.221:8050/";//正式包
var URL = "http://qcapi.dsgame.iqiyi.com/";//测试包
var G_number = 0
// var URL = "http://192.168.1.251:5555/";

cc.VERSION = 20161227;
var HTTP = cc.Class({
    extends: cc.Component,

    statics:{
        sessionId : 0,
        userId : 0,
        master_url:URL,
        url:URL,
       
        sendRequest : function(path,data,handler,extraUrl){
            cc.log("sendRequest11111111111111111")
            G_number +=1 
            var xhr = cc.loader.getXMLHttpRequest();
            xhr.G_number = G_number
            cc.log("xhr----------------------")
            cc.log("888888888888888")
            cc.log(xhr.G_number)
            cc.log(xhr)
            cc.log(xhr.readyState)
            cc.log(xhr.status)
            // xhr.timeout = 30000;
            // xhr.withCredentials = true;
            var str = "?";
            for(var k in data){
                if(str != "?"){
                    str += "&";
                }
                str += k + "=" + data[k];
            }
            if(extraUrl == null){
                extraUrl = HTTP.url;
            }
            cc.log("urlStr")
            cc.log(str)
            var requestURL = extraUrl + path + encodeURI(str);
            cc.log("requestURL")
            cc.log(requestURL)
            console.log("RequestURL:" + requestURL);
            
            // if (cc.sys.isNative){
                // xhr.setRequestHeader("gzip,deflate","text/html;charset=UTF-8","Access-Control-Allow-Origin");
            // }
            
            xhr.onreadystatechange = function() {
                 cc.log("onreadystatechange 1111")
                 cc.log(xhr.G_number)
                 cc.log(xhr.readyState)
                cc.log(xhr.status)
                 cc.log("onreadystatechange 22222")
                if(xhr.readyState === 4 && (xhr.status >= 200 && xhr.status < 400)){
                    cc.log("ssddsdsdsds")
                    cc.log(xhr)
                    console.log("http res("+ xhr.responseText.length + "):" + xhr.responseText);
                    // try {
                        var ret = JSON.parse(xhr.responseText);
                        cc.log("消息")
                        cc.log(ret)
                        cc.log(handler)
                        if(handler !== null){
                            handler(ret);
                        }                        /* code */
                    // } catch (e) {
                    //     console.log("err:" + e);
                    //     //handler(null);
                    //     // if(cc.vv && cc.vv.wc){
                    //     //     cc.vv.wc.show("err:" + e);    
                    //     // }
                    // }
                    // finally{
                      
                    // }
                    cc.log("xhr.statusText")
                    cc.log("888888888888888")
                    cc.log(xhr.G_number)
                    cc.log(xhr.readyState)
                    cc.log(xhr.status)
                    cc.log("sendRequest4444444444444444444")
                }
             
               
            };
            
            xhr.onerror = function (data) {
                console.log("** An error occurred during the transaction");
                cc.log(data)
                // if(cc.vv && cc.vv.wc){
                //     cc.vv.wc.show("请求服务器发生错误");    
                // }
                cc.log("888888888888888")
                cc.log(xhr.G_number)
            cc.log(xhr.readyState)
            cc.log(xhr.status)
            };
            xhr.ontimeout = function(e) {
                console.log("Timeout!!")
                if(cc.vv && cc.vv.wc){
                    //cc.vv.wc.show("网络极差，请求超时");    
                }
                cc.log("888888888888888")
                cc.log(xhr.G_number)
            cc.log(xhr.readyState)
            cc.log(xhr.status)
            }
            
            xhr.open("GET",requestURL, true);

            xhr.send();
            cc.log("xhr.statusText 11111111")
            cc.log("888888888888888")
            cc.log(xhr.G_number)
            cc.log(xhr.readyState)
            cc.log(xhr.status)
            cc.log("sendRequest22222222222222222")
            return xhr;
        },
    },
});