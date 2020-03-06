const Colyseus = require("colyseus");

window.CyEngine = cc.Class({


    ctor: function () {
        console.log("CyEngine ctor")
        this.room_name = "iogame";
        this.server_url = 'ws://localhost:2567';

        // 创建一个客户端
        this.client = new Colyseus.Client(this.server_url);
        this.getAvailableRooms();
    },



    /**
     *获取可以加入的房间
     * @memberof CyEngine
     */
    getAvailableRooms(){
        console.log("getAvailableRooms")
        this.client.getAvailableRooms(this.room_name).then(rooms => {
            console.log("rooms length:" + rooms.length)
            rooms.forEach((room) => {
                console.log("AvailableRooms room_id:" + room.roomId + " room_name:" + room.name);
            });
            Notification.dispatch("getAvailableRooms",{rooms});
        }).catch(e => {
            console.error(e);
        });
    },


    /**
     *创建房间
     * @memberof CyEngine
     */
    createRoom(){
        this.client.create(this.room_name, {/* options */}).then(room => {
            console.log("create room successfully", JSON.stringify(room));
            this.room = room
            this.onJoinRoom()
        }).catch(e => {
            console.error("join error", e);
        });
    },


    /**
     *加入房间
     * @memberof CyEngine
     */
    joinRoom(room_name){
        this.client.join(room_name, {/* options */}).then(room => {
            console.log("joined successfully", JSON.stringify(room));
            this.room = room
            this.onJoinRoom()
        }).catch(e => {
            console.error("join error", e);
        });
    },


    /**
     *当加入房间时
     * @memberof CyEngine
     */
    onJoinRoom(){
        console.log("加入房间 room_id:" + this.room.id + " room_name:" + this.room.name + " room_sessionId:" + this.room.sessionId)
        Notification.dispatch("roomJoined",{ room_id: this.room.id, room_sessionId: this.room.sessionId ,room_name: this.room.name});
    },


    /**
     *离开房间
     * @memberof CyEngine
     */
    leaveRoom(){
        if(this.room && this.room.id){
            console.log("room leave")
            this.room.leave()
        }else{
            console.log("room is not exist")
        }
    }

});

// 客户端单例
CyEngine.instance = null;
CyEngine.getInstance = function () {
    if (CyEngine.instance == null) {
        CyEngine.instance = new CyEngine();
    }
    return CyEngine.instance;
};

CyEngine.CreateClient = function () {
    if (CyEngine.instance == null) {
        CyEngine.instance = new CyEngine();
    }
    return CyEngine.instance;
};
