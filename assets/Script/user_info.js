// Learn cc.Class:
//  - [Chinese] http://www.cocos.com/docs/creator/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/editors_and_tools/creator-chapters/scripting/class/index.html
// Learn Attribute:
//  - [Chinese] http://www.cocos.com/docs/creator/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/editors_and_tools/creator-chapters/scripting/reference/attributes/index.html
// Learn life-cycle callbacks:
//  - [Chinese] http://www.cocos.com/docs/creator/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/editors_and_tools/creator-chapters/scripting/life-cycle-callbacks/index.html
var Utils = require('Utils');
cc.Class({
    extends: cc.Component,

    properties: {
        uer_icon:cc.Sprite,
        xingbie:cc.Node,
        //xingzuoBg:cc.Node,
        xingzuo:cc.Node,
        name_label:cc.Label,
        city_label:cc.Label,
        country:cc.Node,
        gender_icon_frame:[cc.SpriteFrame]
    },

    // LIFE-CYCLE CALLBACKS:
   
    setInfo:function(ourData){
        var self = this
        //玩家姓名
        this.name_label.string = Utils.cutString(ourData.name,16)
        //设置玩家星座
        if(ourData.constellation_icon != ""){
            self.xingzuo.active = true
            //self.xingzuoBg.active = true
            var constellation_icon_url = ourData.constellation_icon + "?imageView2/1/w/35/h/35/format/png"
            cc.log("constellation_icon_url")
            cc.log(constellation_icon_url)
            cc.loader.load({url: constellation_icon_url, type: 'png'}, function (err, texture) {
                // Use texture to create sprite frame
                cc.log("星座远程资源加载完成")
                var frame = new cc.SpriteFrame(texture);
                var node = new cc.Node("constellation_iconSprite");
                var sprite = node.addComponent(cc.Sprite);
                sprite.spriteFrame = frame;
                node.parent = self.xingzuo;
            });
        }else{
            //self.xingzuoBg.active = false
            self.xingzuo.active = false
        }
        //设置玩家头像
        if(ourData.avatar != ""){
            // imageView2/1/w/91/h/91/format/png/
            var avatar_url = ourData.avatar + "?imageView2/1/w/91/h/91/format/png"
            cc.log("avatar_url")
            cc.log(avatar_url)
            cc.loader.load({url: avatar_url, type: 'png'}, function (err, texture) {
                // Use texture to create sprite frame
                cc.log("远程资源加载完成")
                var frame = new cc.SpriteFrame(texture)
                // var node = new cc.Node("avatar_urlSprite");
                // var sprite = node.addComponent(cc.Sprite);
                // sprite.spriteFrame = frame;
                // node.parent = self.xingzuo;
                cc.log(frame)
                self.uer_icon.spriteFrame = frame
            });
        }
        //设置玩家性别
        if(ourData.gender == 0){
            self.xingbie.active = false
        }else if(ourData.gender == 1){
            self.xingbie.active = true
            self.xingbie.getComponent(cc.Sprite).spriteFrame = self.gender_icon_frame[0]
        }else if(ourData.gender == 2){
            self.xingbie.active = true
            self.xingbie.getComponent(cc.Sprite).spriteFrame = self.gender_icon_frame[1]
        }
        //设置玩家地理信息
        //self.city_label.string = "Age:" + ourData.age + "  " + "City:" + ourData.city
        var ageAndCity = ''
        if(cc.args.lang == "en"){
            ageAndCity = "Age:" + ourData.age + "  " + "City:" + ourData.city
        }else{
            ageAndCity = "年龄:" + ourData.age + "  " + "城市:" + ourData.city
        }
        self.city_label.string = Utils.cutString(ageAndCity,24)
        //设置玩家国籍
        if(ourData.country_icon != ""){
            var country_icon_url = ourData.country_icon + "?imageView2/1/w/50/h/50/format/png"
            cc.log("country_icon_url")
            cc.log(country_icon_url)
            cc.loader.load({url: country_icon_url, type: 'png'}, function (err, texture) {
                // Use texture to create sprite frame
                cc.log("远程资源加载完成")
                cc.log(texture)
                var frame = new cc.SpriteFrame(texture)
                var node = new cc.Node("constellation_iconSprite");
                var sprite = node.addComponent(cc.Sprite);
                sprite.spriteFrame = frame;
                node.parent = self.country;
                node.scale = 0.8
            });
        }
    },

    onLoad () {

    },

    start () {

    },

    // update (dt) {},
});
