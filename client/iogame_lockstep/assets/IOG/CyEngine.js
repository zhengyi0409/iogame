const Colyseus = require("colyseus");

window.CyEngine = cc.Class({

    // 基类
    extends: cc.Component,


    properties: {

        seed:51,  // 随机种子

    },


    // 构造函数
    ctor: function () {
        //console.log("CyEngine ctor")
        this.room_name = "iogame";                // 房间名称
        this.server_url = 'ws://localhost:2568';  // 服务端地址

        // 创建一个客户端
        this.client = new Colyseus.Client(this.server_url);
    },

    /**
     *获取可以加入的房间
     * @memberof CyEngine
     */
    getAvailableRooms(){
        //console.log("getAvailableRooms")
        this.client.getAvailableRooms(this.room_name).then(rooms => {
            //console.log("rooms length:" + rooms.length)
            rooms.forEach((room) => {
                //console.log("AvailableRooms room_id:" + room.roomId + " room_name:" + room.name);
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
            console.log("create room successfully");
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
        this.client.joinOrCreate(room_name, {/* options */}).then(room => {
            console.log("joined successfully");
            this.room = room
            this.onJoinRoom()
        }).catch(e => {
            console.error("join error", e);
        });
    },



    /**
     *当加入房间时
     * @memberof CyEngine id:房间唯一的标示符    sessionId:玩家唯一标示符
     */
    onJoinRoom(){
        //console.log("onJoinRoom room_id:" + this.room.id + " room_name:" + this.room.name + " room_sessionId:" + this.room.sessionId)

        // This event is triggered when the server updates its state.
        this.room.onStateChange.once((state) => {
            console.log("event this is the first room state:", state);
        });

        this.room.onStateChange((state) => {
            console.log("event the room state has been updated:", state);
        });

        // This event is triggered when the client leave the room.
        this.room.onLeave((code) => {
            console.log("event client leave the room code:" + code);
        });

        // This event is triggered when some error occurs in the room handler.
        this.room.onError((message) => {
            console.log("event oops, error ocurred message:" + message);
        });

        // This event is triggered when the server sends a message directly to the client.
        this.room.onMessage((message) => {
            console.log("event message received from server message:" + message);

            switch(message[0]){
                case "f":
                    //this.onReceiveServerFrame(message);
                    break;
                case "fs":
                    //this.onReceiveServerFrame(message);
                    //把服务器帧同步到本地帧缓存后，读取并执行本地帧缓存
                    //this.nextTick();
                    break;
                default:
                    console.warn("未处理的消息:");
                    console.warn(message);
                    break;
            }

        });

        Notification.dispatch("roomJoined",this.room);
    },



    /**
     *发送信息到服务器房间
     *
     * @param {*} data
     */
    sendToRoom(data){
        this.room.send(data);
    },


    /**
     *离开房间
     * @memberof CyEngine
     */
    leaveRoom(){
        if(this.room && this.room.sessionId){
            console.log("room_sessionId:" + this.room.sessionId + " leave room_id:" + this.room.id + " room_name:" + this.room.name)
            this.room.leave()
        }else{
            console.log("room no exist")
        }
    },



    /**
     *随机函数
     *
     * @param {number} [max=1]
     * @param {number} [min=0]
     * @returns
     * @memberof CyEngine
     */
    seededRandom(max = 1, min = 0) {
        this.seed = (this.seed * 9301 + 49297) % 233280;
        let rnd = this.seed / 233280.0;
        return min + rnd * (max - min);
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
