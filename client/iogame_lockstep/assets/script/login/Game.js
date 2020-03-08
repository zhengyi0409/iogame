
cc.Class({
    extends: cc.Component,

    properties: {

    },

    onLoad () {
        console.log("Game onLoad")
    },

    start () {
        console.log("Game start")
    },

    onDestroy() {
        Notification.removeListenersByObj(this);
    },

    // update (dt) {},

    // 离开房间
    exitGameCall(){
        CyEngine.getInstance().leaveRoom();
        cc.director.loadScene("login");
    },
});
