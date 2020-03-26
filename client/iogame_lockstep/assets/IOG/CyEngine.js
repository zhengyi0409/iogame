const Colyseus = require("colyseus");

window.CyEngine = cc.Class({

    // 基类
    extends: cc.Component,


    properties: {

        seed:51,                   // 随机种子
        players:null,              // 玩家列表,存储玩家输入
        readyToControl:false,      // 是否可以开始接受玩家输入，等待追帧结束之后才可以接受玩家输入。
        frame_inv:0,               // 每帧间隔，如果帧缓存里未渲染帧数过多，则减小间隔以追上服务器进度
        frames:[],                 // 所有帧缓存
        serverFrameAcc:3,          // 服务器帧插值
        serverFrameRate:20,        // 服务器帧数(需要和服务端确定好)
        frame_index:0,             // 当前帧
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
        Notification.dispatch("roomJoined",this.room);

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
            this.onMessage(message)
        });

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
     *开始游戏
     *
     * @memberof CyEngine
     */
    startRound(){
        this.readyToControl = false;
        this.players = new Array()
        this.frame_inv = 0

        //锁定帧数
        cc.game.pause();
        //获取服务器上所有帧缓存
        this.sendToRoom(["fs"]);
        //以固定时间间隔上传用户输入指令
        setInterval(this.sendCMD.bind(this), 1000 / this.serverFrameRate);

    },


    /**
     *发送玩家输入到服务器
     *
     * @memberof CyEngine
     */
    sendCMD() {
        let data = InputManager._instance.toServerData()
        this.sendToRoom(["cmd", ["input", data]]);
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
     *处理服务器消息
     *
     * @param {*} message 消息
     * @memberof CyEngine
     */
    onMessage(message){
        switch(message[0]){
            case "f":
                //this.onReceiveServerFrame(message);
                break;
            case "fs":
                this.onReceiveServerFrame(message);
                //把服务器帧同步到本地帧缓存后，读取并执行本地帧缓存
                this.nextTick();
                break;
            default:
                console.warn("未处理的消息:");
                console.warn(message);
                break;
        }
    },

    /**
     *处理帧
     *
     * @memberof CyEngine
     */
    runTick() {
        let frame = null;
        if(this.frames.length > 1){
            //第一帧延时处理，以免在初始的时候丢失第一帧
            frame = this.frames[this.frame_index];
        }

        if (frame) {
            if (frame.length > 0) {
                frame.forEach((cmd) => {
                    if (typeof this["cmd_" + cmd[1][0]] == "function") {
                        this["cmd_" + cmd[1][0]](cmd);
                    } else {
                        console.log("服务器处理函数cmd_" + cmd[1][0] + " 不存在");
                    }
                })
            }
            this.frame_index++;
            cc.game.step();
        }

    },

    /**
     *下一帧
     *
     * @memberof CyEngine
     */
    nextTick() {
        this.runTick();
        if(this.frames.length - this.frame_index > 100){
            //当缓存帧过多时，一次处理多个帧信息
            console.log("跳帧追帧:" + (this.frames.length - this.frame_index))
            // for (let i = 0; i < 50; i++) {
            //     this.runTick();
            // }
            this.frame_inv = 0;
        }else if(this.frames.length - this.frame_index > this.serverFrameAcc){
            // console.log("追帧:" + (this.frames.length - this.frame_index))
            // for (let i = this.frame_index; i < this.frames.length; i++) {
            //     this.runTick();
            // }
            this.frame_inv = 0;
        }else{
            if (this.readyToControl == false) {
                this.readyToControl = true;

            }

        }
        setTimeout(this.nextTick.bind(this), this.frame_inv)
    },


    /**
     *从服务器获取帧信息
     *
     * @param {*} message 帧信息
     * @memberof CyEngine
     */
    onReceiveServerFrame(message){
        this.addFrames(message[1]);
    },


    /**
     *添加帧信息到帧缓存
     *
     * @param {Array<any>} frames 待添加的帧信息
     * @memberof CyEngine
     */
    addFrames(_frames) {
        _frames.forEach((m) => {
            this.frames[m[0]] = m[1];
            for (let i = m[0]; i > m[0] - this.serverFrameAcc; i--) {
                if (this.frames[i] == undefined) {
                    this.frames[i] = [];
                }
            }
        });
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
