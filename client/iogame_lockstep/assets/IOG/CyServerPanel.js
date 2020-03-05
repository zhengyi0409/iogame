
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
        console.log("CyServerPanel onLoad")
        Notification.on("getAvailableRooms", this.onGetRoomList, this);
        Notification.on("roomJoined", this.onRoomJoined, this);
    },

    start () {

    },


    onGetRoomList(e){
        console.log("onGetRoomList")
        this.RoomListGroup.removeAllChildren();
        if (e.rooms.length > 0) {
            console.log("有房间")
            e.rooms.forEach(element => {
                let item = cc.instantiate(this.RoomListItemPrefab);
                let itemController = item.getComponent("CyRoomListItem");
                itemController._roomID = element.roomId;
                itemController.label.string = element.roomId + `(${element.clients}/${element.maxClients})`;
                item.parent = this.RoomListGroup;
            });
        }else{
            console.log("没有房间,新建并加入新房间")
            let item = cc.instantiate(this.RoomListItemPrefab);
            let itemController = item.getComponent("CyRoomListItem");
            itemController._roomID = "createRoom";
            itemController.label.string = "没有房间,新建并加入新房间";
            item.parent = this.RoomListGroup;
        }
    },

    onRoomJoined(e) {
        //TODO:如果加入了房间则隐藏房间UI
        console.log("onRoomJoined" + JSON.stringify(e))
        //this.node.active = false;
    },

    freshRoomList() {
        CyEngine.instance.getAvailableRooms();
    },

    leaveRoom() {
        CyEngine.instance.leaveRoom();
    },

});
