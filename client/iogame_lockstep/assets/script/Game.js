
cc.Class({
    extends: cc.Component,

    properties: {

        roundPrefab:{
            default: null,
            type: cc.Prefab,
            displayName: "游戏Prefab"
        },


        roundContainer:{
            default: null,
            type: cc.Node,
            displayName: "游戏位置",
         },


    },

    onLoad () {
        //console.log("Game onLoad")
        let roundNode = cc.instantiate(this.roundPrefab);
        //this.round = roundNode.getComponent(CyRoundManager);
        this.roundContainer.addChild(roundNode);
    },

    start () {
        //console.log("Game start")
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
