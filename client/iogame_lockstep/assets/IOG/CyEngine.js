
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

        _client:null,
        _room: null,

    },


    onLoad: function () {
        this.room_name = "iogame";
        this.server_url = 'ws://localhost:2567';

        // if (CyEngine.instance == undefined) {
        //     CyEngine.instance = this;
        //     console.log("CyEngine 创建单例");
        // } else {
        //     console.log("CyEngine 单例失败");
        //     return;
        // }

        // 创建一个客户端
        this._client = new Colyseus.Client(this.server_url);
        // this._client.joinOrCreate(this.roomName, {/* options */ }).then(room => {
        //     console.log("joined successfully", room);
        // }).catch(e => {
        //     console.log("join error:\n", e);
        // });


        this._client.create(this.room_name, {/* options */}).then(room => {
            console.log("joined successfully", room);
        }).catch(e => {
            console.error("join error", e);
        });


        //this.getAvailableRooms()
    },

    // called every frame
    update: function (dt) {
    },


    /**
     *获取可以加入的房间
     * @memberof CyEngine
     */
    getAvailableRooms(){
        let that = this;
        this._client.getAvailableRooms(this.roomName).then(rooms => {
            rooms.forEach((room) => {
                console.log(room.roomId);
                console.log(room.clients);
                console.log(room.maxClients);
                console.log(room.metadata);
            });
        }).catch(e => {
            console.error(e);
        });
    },


});

