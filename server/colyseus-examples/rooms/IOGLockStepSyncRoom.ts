import { Room, Client } from "colyseus";

export class IOGLockStepSyncRoom extends Room{
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
        console.log("JOINING ROOM");
    }

    // Checks if a new client is allowed to join. (default: `return true`)
    requestJoin (options, isNewRoom: boolean) {
        return (options.create)
            ? (options.create && isNewRoom)
            : this.clients.length > 0;
    }

    // When a client sends a message
    onMessage (client, message: any) {

    }

    // When a client leaves the room
    onLeave (client) {
        console.log("ChatRoom:", client.sessionId, "left!");
    }
    

}
