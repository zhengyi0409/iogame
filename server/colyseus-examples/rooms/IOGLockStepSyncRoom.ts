import { Room, Client } from "colyseus";

export class IOGLockStepSyncRoom extends Room{

    FRAME_RATE:number = 20;
    frame_index:number = 0;
    frame_interval:any = null;
    frame_list:any[] = [[]];
    frame_acc:number = 3;
    maxClients = 20;

    // When room is initialized
    onCreate (options) {
        console.log("CREATE NEW ROOM");
        this.frame_index = 0;
        this.frame_interval = setInterval(this.tick.bind(this),1000/this.FRAME_RATE);
        this.frame_list = [];
    }

    // onInit 初始化方法没有走进来，可能和服务器版本有关系吧
    // onInit (options) {
    //     console.log("INIT NEW ROOM");
    //     this.frame_index = 0;
    //     this.frame_interval = setInterval(this.tick.bind(this),1000/this.FRAME_RATE);
    //     this.frame_list = [];
    // }

    getFrameByIndex(index){
        if(this.frame_list[index] === undefined){
            this.frame_list[index] = [];
        }
        return this.frame_list[index];
    }

    tick(){
        console.log("FRAMEINTERVAL TICK frame_index:" + this.frame_index);
        let frames = [];
        frames.push([this.frame_index,this.getFrameByIndex(this.frame_index)]);
        //frames = [this.frame_index,[[client.sessionId,["addplayer"]],[client.sessionId,["addplayer"]],[client.sessionId,["addplayer"]]]]
        //frames = [this.frame_index,[[client.sessionId,["input", data]],[client.sessionId,["input", data]],[client.sessionId,["input", data]]]]
        this.broadcast(["f",frames]);
        this.frame_index += this.frame_acc;
    }

    // When client successfully join the room
    onJoin (client, options, auth) {
        console.log("JOINING ROOM sessionId:" + client.sessionId);
        this.broadcast(`${ client.sessionId } joined`);
    }

    // Checks if a new client is allowed to join. (default: `return true`)
    requestJoin (options, isNewRoom: boolean) {
        return (options.create)
            ? (options.create && isNewRoom)
            : this.clients.length > 0;
    }

    // When a client sends a message
    onMessage (client, message: any) {
        switch(message[0]){
            case "cmd":
                this.onCmd(client,message);
                break;
            case "fs":
                this.onGetAllFrames(client,message);
                break;
            default:
                //console.log("接收到未处理的message:")
                console.log(message)
                break;
        }
        console.log("BasicRoom received message from", client.sessionId, ":", JSON.stringify(message));
    }


    // Cleanup callback, called after there are no more clients in the room. (see `autoDispose`)
    onDispose () {
        clearInterval(this.frame_interval);
        console.log("Dispose IOGRoom");
    }


    // When a client leaves the room
    onLeave (client) {
        console.log("IOGLockStepSyncRoom sessionId:", client.sessionId, "leave");
        this.broadcast(`${ client.sessionId } leave`);
    }

    //当收到用户的输入，存入frame_list
    onCmd(client:Client,message:any){
        if(message[0] == "cmd" && message[1][0] == "addplayer"){
            // console.log(message)
        }
        // ["cmd", ["addplayer"]]
        // ["cmd", ["input", data]]
        this.frame_list_push([client.sessionId,message[1]]);
    }

    frame_list_push(data:any){
        if(this.frame_list[this.frame_index] == undefined){
            this.frame_list[this.frame_index] = [];
        }
        this.frame_list[this.frame_index].push(data);
    }


    onGetAllFrames(client:Client,message:any){
        let frames = [];
        for(let i=0,len=this.frame_list.length;i<len;i++){
            if(this.frame_list[i] !== undefined){
                frames.push([i,this.frame_list[i]]);
            }
        }
        if(frames.length == 0){
            frames = [[0,[]]];
        }
        // frames = [[0,[]],[1,[]],[2,[]],[3,[]]......]
        this.send(client,["fs",frames])
    }


}
