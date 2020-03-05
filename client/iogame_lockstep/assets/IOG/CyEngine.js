
const Colyseus = require("colyseus");
const CyEngine = {}


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
        this.getAvailableRooms();

        // this._client.joinOrCreate(this.roomName, {/* options */ }).then(room => {
        //     console.log("joined successfully", room);
        // }).catch(e => {
        //     console.log("join error:\n", e);
        // });
    },



    /**
     *获取可以加入的房间
     * @memberof CyEngine
     */
    getAvailableRooms(){
        let self = this;
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


});

