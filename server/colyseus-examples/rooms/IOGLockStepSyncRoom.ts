import { Room, Client } from "colyseus";

export class IOGLockStepSyncRoom extends Room{

    FRAME_RATE:number = 20;
    frame_list:any[] = [[]];



    maxClients = 4;

    // When room is initialized
    onCreate (options) {
        console.log("CREATE NEW ROOM");
    }


    onInit (options) {
        console.log("INIT NEW ROOM");
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
                //this.onCmd(client,message);
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

    // When a client leaves the room
    onLeave (client) {
        console.log("IOGLockStepSyncRoom sessionId:", client.sessionId, "leave");
        this.broadcast(`${ client.sessionId } leave`);
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

        this.send(client,["fs",frames])
    }


}
