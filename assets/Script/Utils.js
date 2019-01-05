const i18n = require('LanguageData');
//随机
var rnd = function(n, m){
    var random = Math.floor(Math.random()*(m-n+1)+n);
    return random;
}
//数组乱序
var shuffle = function(v){
    for(var j, x, i = v.length; i; j = parseInt(Math.random() * i), x = v[--i], v[i] = v[j], v[j] = x);
    return v;
};
//多维数组拷贝
var deepcopy = function(obj) {
    var out = [],i = 0,len = obj.length;
    for (; i < len; i++) {
        if (obj[i] instanceof Array){
            out[i] = deepcopy(obj[i]);
        }
            else out[i] = obj[i];
        }
    return out;
};
//对象深度拷贝
var deepClone = function(obj){
    var newObj = obj.constructor === Array ? []:{};
    if(typeof obj !== 'object'){
        return
    }else{
        for(var i in obj){
            if(obj.hasOwnProperty(i)){
                newObj[i] = typeof obj[i] === 'object'?deepClone(obj[i]):obj[i];
            }
        }
    }
    return newObj
}
//检测选中的冰块是否可行
//result --任务
//value  --冰块值
var checkSelectIsOk = function(result,value){
    var is_ok_1 = false
    var is_ok_2 = false
    var is_ok = false
    if(result.value_1 != null){
        if(result.value_1 == value){
            is_ok_1 = true
        }else{
            is_ok_1 = false
        }
    }
    if(result.value_2 != null){
        if(result.value_2 == value){
            is_ok_2 = true
        }else{
            is_ok_2 = false
        }
    }
    if(is_ok_1 || is_ok_2){
       is_ok = true
    }
    return is_ok
}

var get_next_to_ice = function(row_x,row_y,span,game){
    var self = game
    span = span || 1
    var next_to_ice_pos = []
    // cc.log("上")
    var cur_row_y = row_y - (2 * span) > 0 ? row_y -2 : 0
    var cur_row_x = row_x
    next_to_ice_pos.push({row_x:cur_row_x,row_y:cur_row_y})
    // cc.log("右上")
    var cur_row_y = row_y - (1 * span) > 0 ? row_y -1 : 0
    var cur_row_x = row_x + (1 * span) < self.row_x ? row_x + 1 : self.row_x - 1
    next_to_ice_pos.push({row_x:cur_row_x,row_y:cur_row_y})
    // cc.log("右下")
    var cur_row_y = row_y + (1 * span) < self.row_y ? row_y + 1 : self.row_y -1
    var cur_row_x = row_x + (1 * span) < self.row_x ? row_x + 1 : self.row_x - 1
    next_to_ice_pos.push({row_x:cur_row_x,row_y:cur_row_y})
    // cc.log("下")
    var cur_row_y = row_y + (2 * span) <= self.row_y -1 ? row_y + 2 : self.row_y -1
    var cur_row_x = row_x
    next_to_ice_pos.push({row_x:cur_row_x,row_y:cur_row_y})
    // cc.log("左下")
    var cur_row_y = row_y + (1 * span) < self.row_y ? row_y + 1 : self.row_y -1
    var cur_row_x = row_x - (1 * span) > 0 ? row_x - 1 : 0
    next_to_ice_pos.push({row_x:cur_row_x,row_y:cur_row_y})
    // cc.log("左上")
    var cur_row_y = row_y - (1 * span) > 0 ? row_y -1 : 0
    var cur_row_x = row_x - (1 * span) > 0 ? row_x - 1 : 0
    next_to_ice_pos.push({row_x:cur_row_x,row_y:cur_row_y})
    return next_to_ice_pos
}

//获取正上方
var get_vertical_top = function(row_x,row_y,game){
    var self = game
    var vertical_top = []
    cc.log("获取正上方的数据")
    cc.log("row_x[%s] ,row_y[%s]",row_x,row_y)
    for(var y = row_y - 1;y >= 0;y --){
        cc.log("self.game_ice_tab[%s][%s]----%s",y,row_x,self.game_ice_tab[y][row_x])
        vertical_top.push(self.game_ice_tab[y][row_x])
    }
    cc.log(vertical_top)
    return vertical_top
}
//获取正下方
var get_vertical_down = function(row_x,row_y,game){
    var self = game
    var vertical_down = []
    cc.log("获取正下方的数据")
    cc.log("row_x[%s] ,row_y[%s]",row_x,row_y)
    for(var y = row_y + 1;y < self.row_y;y ++){
        cc.log("self.game_ice_tab[%s][%s]----%s",y,row_x,self.game_ice_tab[y][row_x])
        vertical_down.push(self.game_ice_tab[y][row_x])
    }
    cc.log(vertical_down)
    return vertical_down
}
//获取左上方
var get_top_left_ice = function(row_x,row_y,game){
    var self = game
    var top_left_ice = []
    cc.log("获取左上的数据")
    cc.log("row_x[%s] ,row_y[%s]",row_x,row_y)
    while(row_x > 0 && row_y >0 ){
        row_x --
        row_y --
        cc.log("self.game_ice_tab[%s][%s]----%s",row_y,row_x,self.game_ice_tab[row_y][row_x])
        top_left_ice.push(self.game_ice_tab[row_y][row_x])
    }
    cc.log(top_left_ice)
    return top_left_ice
}
//获取右上方
var get_top_right_ice = function(row_x,row_y,game){
    var self = game
    var top_right_ice = []
    cc.log("获取右上的数据")
    cc.log("row_x[%s] ,row_y[%s]",row_x,row_y)
    while(row_x < self.row_x - 1 && row_y > 0 ){
        row_x ++
        row_y --
        cc.log("self.game_ice_tab[%s][%s]----%s",row_y,row_x,self.game_ice_tab[row_y][row_x])
        top_right_ice.push(self.game_ice_tab[row_y][row_x])
    }
    cc.log(top_right_ice)
    return top_right_ice
}
//获取右上方
var get_top_right_ice = function(row_x,row_y,game){
    var self = game
    var top_right_ice = []
    cc.log("获取右上的数据")
    cc.log("row_x[%s] ,row_y[%s]",row_x,row_y)
    while(row_x < self.row_x - 1 && row_y > 0 ){
        row_x ++
        row_y --
        cc.log("self.game_ice_tab[%s][%s]----%s",row_y,row_x,self.game_ice_tab[row_y][row_x])
        top_right_ice.push(self.game_ice_tab[row_y][row_x])
    }
    cc.log(top_right_ice)
    return top_right_ice
}   
//获取右上方
var get_top_right_ice = function(row_x,row_y,game){
    var self = game
    var top_right_ice = []
    cc.log("获取右上的数据")
    cc.log("row_x[%s] ,row_y[%s]",row_x,row_y)
    while(row_x < self.row_x - 1 && row_y > 0 ){
        row_x ++
        row_y --
        cc.log("self.game_ice_tab[%s][%s]----%s",row_y,row_x,self.game_ice_tab[row_y][row_x])
        top_right_ice.push(self.game_ice_tab[row_y][row_x])
    }
    cc.log(top_right_ice)
    return top_right_ice
}
//获取左下方
var get_down_left_ice = function(row_x,row_y,game){
    var self = game
    var down_left_ice = []
    cc.log("获取左下的数据")
    cc.log("row_x[%s] ,row_y[%s]",row_x,row_y)
    while(row_x > 0 && row_y < self.row_y -1 ){
        row_x --
        row_y ++
        cc.log("self.game_ice_tab[%s][%s]----%s",row_y,row_x,self.game_ice_tab[row_y][row_x])
        down_left_ice.push(self.game_ice_tab[row_y][row_x])
    }
    cc.log(down_left_ice)
    return down_left_ice
}  
//获取右下方
var get_down_right_ice = function(row_x,row_y,game){
    var self = game
    var down_right_ice = []
    cc.log("获取右下的数据")
    cc.log("row_x[%s] ,row_y[%s]",row_x,row_y)
    while(row_x < self.row_x - 1 && row_y < self.row_y -1 ){
        row_x ++
        row_y ++
        cc.log("self.game_ice_tab[%s][%s]----%s",row_y,row_x,self.game_ice_tab[row_y][row_x])
        down_right_ice.push(self.game_ice_tab[row_y][row_x])
    }
    cc.log(down_right_ice)
    return down_right_ice
}
//敲击力量扩散计算公式 (小于50)
var hit_B_lt_50 = function(x,n){
    // B=SQRT(X/50)*X*(N+1)/（10*N）
    return Math.sqrt(x/50)*x*(n+1)/(n*10) * (2.4 - 0.2*n)
}
//敲击力量扩散计算公式 (大于50)
var hit_B_gt_50 = function(x,n){
    // B=SQRT((100-X)/50)*X*(N+1)/（10*N）
    return Math.sqrt((100 - x)/50) * x *(n + 1)/(n * 10) * (2.4 - 0.2*n)
}
//获取轮盘显示提示
var getWheelTipByResult = function(result){
    var tipStr = ""
    if(result.count == 0){
        tipStr = i18n.t("label.gameTip_28")//"恭喜!次回合无需操作"
    }else if(result.count == 1){
        if(result.value_1 ==  0){
            tipStr = i18n.t("label.gameTip_29")//"请敲击一个白色冰块"
        }else if(result.value_1 ==  1){
            tipStr = i18n.t("label.gameTip_30")//"请敲击一个蓝色冰块"
        }
    }else if(result.count == 2){
        if(result.value_1 == result.value_2 && result.value_1 == 0){
            tipStr = i18n.t("label.gameTip_31")//"请敲击俩个白色冰块"
        }else if(result.value_1 == result.value_2 && result.value_1 == 1){
            tipStr = i18n.t("label.gameTip_32")//"请敲击俩个蓝色冰块"
        }else{
            tipStr = i18n.t("label.gameTip_33")//"请敲击一个蓝色和一个白色冰块"
        }
    }
    return tipStr
}

var RichStringformat = function() {
    var newStr = "";
    if (arguments.length > 0){
        if(arguments.length === 1){
            if(arguments[0] && typeof(arguments[0]) == "string"){
                newStr = arguments[0];
            }else{
                logd("string format error");
            }   
        }else{
            if(arguments[0] && typeof(arguments[0]) == "string"){
                var result = arguments[0];
                var newresult = result.split(/(%d|%s)/g);
                var count = 0;

                for(var key in newresult){
                    var value = newresult[key];
                    if(!/(%d|%s)/g.test(value)){
                        newStr = newStr + value;
                    }else{
                        count++;
                        var argvalue = arguments[count];
                        
                        if(typeof(argvalue) == "string" || typeof(argvalue) == "number"){
                            newStr = newStr + argvalue;
                        }else{
                            logd("string format error");
                        }
                    }
                } 
            }
        }
    }
    return newStr;
}

var printf = function(){
    var as=[].slice.call(arguments),fmt=as.shift(),i=0;
    return     fmt.replace(/%(\w)?(\d)?([dfsx])/ig,function(_,a,b,c){
        var s=b?new Array(b-0+1).join(a||''):'';
        if(c=='d') s+=parseInt(as[i++]);
        return b?s.slice(b*-1):s;
    })
}
var cutString = function (str, len) { 
    cc.log("cutString0000000000000000000")
    cc.log(str)
    //length属性读出来的汉字长度为1 
    if(str.length*2 <= len) { 
        return str; 
    } 
    var strlen = 0; 
    var s = ""; 
    for(var i = 0;i < str.length; i++) { 
        s = s + str.charAt(i); 
        if (str.charCodeAt(i) > 128) { 
            strlen = strlen + 2; 
            if(strlen >= len){ 
                return s.substring(0,s.length-1) + "..."; 
            } 
        } else { 
            strlen = strlen + 1; 
            if(strlen >= len){ 
                return s.substring(0,s.length-2) + "..."; 
            } 
        } 
    } 
    return s; 
}
module.exports = {
    rnd:rnd,
    shuffle:shuffle,
    deepcopy:deepcopy,
    deepClone:deepClone,
    checkSelectIsOk:checkSelectIsOk,
    get_next_to_ice:get_next_to_ice,
    hit_B_lt_50:hit_B_lt_50,
    hit_B_gt_50:hit_B_gt_50,
    getWheelTipByResult:getWheelTipByResult,
    printf:printf,
    RichStringformat:RichStringformat,
    cutString:cutString
};
