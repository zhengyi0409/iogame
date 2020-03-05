
cc.Class({
    extends: cc.Component,

    properties: {

        label: {
            default: null,
            type: cc.Label,
            displayName: "label"
        },

        _roomID:""
    },

    onLoad () {

    },

    start () {

    },

    joinRoom() {
        if (this._roomID == "createRoom") {
            CyEngine.instance.createRoom();
        } else {
            CyEngine.instance.joinRoom();
        }
    }
});
