
window.CyEngine = cc.Class({
    extends: cc.Component,

    properties: {
        ip: {
            default: "localhost",
            displayName: "服务器IP"
        },

        port: {
            default: 2567,
            displayName: "服务器端口"
        },

        roomName: {
            default: "iogame",
            displayName: "房间名称"
        },

        roundContainer: {
            default: null,
            type: cc.Node,
            displayName: "游戏位置"
        },


    },


    onLoad: function () {
        if (CyEngine.instance == undefined) {
            CyEngine.instance = this;
            console.log("CyEngine 创建单例");
        } else {
            console.log("CyEngine 单例失败");
            return;
        }


    },

    // called every frame
    update: function (dt) {
    },


});

