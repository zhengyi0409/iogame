
const Colyseus = require("colyseus");
window.CyEngine = {}


cc.Class({
    extends: cc.Component,

    properties: {
        roundContainer: {
            default: null,
            type: cc.Node,
            displayName: "游戏位置"
        },
    },


    onLoad: function () {
        console.log("CyEngine onLoad")
        this.room_name = "iogame";
        this.server_url = 'ws://localhost:2567';

        if (CyEngine.instance == undefined) {
            CyEngine.instance = this;
            console.log("CyEngine 创建单例");
        } else {
            console.log("CyEngine 单例失败");
            return;
        }

        // 创建一个客户端
        this.client = new Colyseus.Client(this.server_url);
        console.log("client id:" + this.client.id)
        this.getAvailableRooms();

    },



    /**
     *获取可以加入的房间
     * @memberof CyEngine
     */
    getAvailableRooms(){
        this.client.getAvailableRooms(this.room_name).then(rooms => {
            console.log("rooms length:" + rooms.length)
            rooms.forEach((room) => {
                console.log(room.roomId);
                console.log(room.clients);
                console.log(room.maxClients);
                console.log(room.metadata);
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
            console.log("create room successfully", room);
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
    joinRoom(){
        this.client.join(this.room_name, {/* options */}).then(room => {
            console.log("joined room successfully", room);
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
        Notification.dispatch("roomJoined",{ room_id: this.room.id, room_sessionId: this.room.sessionId ,room_name: this.room.name});
        //this.startRound();
    },


    /**
     *离开房间
     * @memberof CyEngine
     */
    leaveRoom(){
        if(this.room && this.room.id){
            this.room.leave()
        }
    }

});

