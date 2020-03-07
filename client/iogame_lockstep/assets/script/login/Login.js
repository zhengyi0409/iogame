
cc.Class({
    extends: cc.Component,

    properties: {

        RoomListGroup: {
            default: null,
            type: cc.Node,
            displayName: "RoomListGroup"
        },

        RoomListItemPrefab: {
            default: null,
            type: cc.Prefab,
            displayName: "RoomListItemPrefab"
        },

    },


    onLoad () {
        console.log("Login onLoad")
        Notification.on("getAvailableRooms", this.onGetRoomList, this);
        Notification.on("roomJoined", this.onRoomJoined, this);
    },

    start () {
        // 创建网络客户端clientm请求房间列表
        CyEngine.getInstance().getAvailableRooms();
    },

    onDestroy() {
        Notification.removeListenersByObj(this);
    },

    onGetRoomList(e){
        console.log("onGetRoomList")
        this.RoomListGroup.removeAllChildren();
        if (e.rooms.length > 0) {
            console.log("有房间")
            e.rooms.forEach(element => {
                let item = cc.instantiate(this.RoomListItemPrefab);
                let itemController = item.getComponent("RoomListItem");
                itemController._roomID = element.roomId;
                itemController._roomName = element.name;
                itemController.label.string = "房间:" + element.name + " 房间id:" + element.roomId;
                item.parent = this.RoomListGroup;
            });
        }else{
            console.log("没有房间,新建并加入新房间")
            let item = cc.instantiate(this.RoomListItemPrefab);
            let itemController = item.getComponent("RoomListItem");
            itemController._roomID = "createRoom";
            itemController.label.string = "没有房间,新建并加入新房间";
            item.parent = this.RoomListGroup;
        }
    },

    // 刷新房间
    freshRoomListCall() {
        CyEngine.getInstance().getAvailableRooms();
    },


    onRoomJoined(e) {
        cc.director.loadScene("game");
    }
});
