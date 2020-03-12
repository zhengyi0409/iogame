
cc.Class({
    extends: cc.Component,

    properties: {

        label: {
            default: null,
            type: cc.Label,
            displayName: "label"
        },

        _roomID:"",
        _roomName:"",
    },

    onLoad () {

    },

    start () {

    },

    joinRoom() {
        if (this._roomID == "createRoom") {
            CyEngine.getInstance().createRoom();
        } else {
            CyEngine.getInstance().joinRoom(this._roomName);
        }
    }
});
