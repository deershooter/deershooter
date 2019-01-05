cc.Class({
    extends: cc.Component,

    properties: {
        mask: cc.Node
    },

    // use this for initialization
    onLoad: function () {
        this.mask.on('touchstart', function (event) {
            event.stopPropagation();
        });
        this.mask.on('touchend', function (event) {
            cc.log("ModalUI")
            cc.log(this)
            event.stopPropagation();
        });
    },
    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
