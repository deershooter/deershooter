// Learn cc.Class:
//  - [Chinese] http://www.cocos.com/docs/creator/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/editors_and_tools/creator-chapters/scripting/class/index.html
// Learn Attribute:
//  - [Chinese] http://www.cocos.com/docs/creator/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/editors_and_tools/creator-chapters/scripting/reference/attributes/index.html
// Learn life-cycle callbacks:
//  - [Chinese] http://www.cocos.com/docs/creator/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/editors_and_tools/creator-chapters/scripting/life-cycle-callbacks/index.html

cc.Class({
    extends: cc.Component,

    properties: {
      
        _listeners:{
            default: [],
            type: [cc.String] 
        },
    },

    on:function (evt, handler, context) {
        var handlers = this._listeners[evt];
        if (handlers === undefined) {
            handlers = [];
            this._listeners[evt] = handlers;
        }
        var item = {
            handler: handler,
            context: context
        };
        handlers.push(item);
        return item;
    },
    off:function (evt, handler, context) {
        var handlers = this._listeners[evt];
        if (handlers !== undefined) {
            var size = handlers.length;
            for (var i = 0; i < size; i++) {
                var item = handlers[i];
                if (item.handler === handler && item.context === context) {
                    handlers.splice(i, 1);
                    return;
                }
            }
        }
    },
    emit:function (type, event) {
        var hanlders = this._listeners[type];
        if (hanlders !== undefined) {
            var size = hanlders.length;
            cc.log("EventEmitter-------------------size")
            cc.log(size)
            for (var i = 0; i < size; i++) {
                var ef = hanlders[i];
                var handler = ef.handler;
                var context = ef.context;
                handler.apply(context, [event]);
            }
        }
    },
    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {

    },

    // update (dt) {},
});
