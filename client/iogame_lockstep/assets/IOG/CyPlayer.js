
window.CyPlayer = cc.Class({

    properties: {
        sessionId:null,
        isLocal:true,   // 是否玩家本人
        input:[]
    },



    // 构造函数
    ctor: function () {
        this.input.dir = cc.Vec2.ZERO
        this.input.mpos = cc.Vec2.ZERO
    },


    updateInput(cmd){
        this.input.dir.x = cmd.dir.x;
        this.input.dir.y = cmd.dir.y;
        this.input.mpos.x = cmd.mpos.x;
        this.input.mpos.y = cmd.mpos.y;
    }

});
