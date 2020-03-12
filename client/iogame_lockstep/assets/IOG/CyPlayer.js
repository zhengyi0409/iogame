
window.CyPlayer = cc.Class({

    properties: {

        sessionId:null,
        isLocal:false,
        input:[]
    },

    // 构造函数
    ctor: function () {
        this.input.mlb = false
        this.input.mrb = false
        this.input.dir = cc.Vec2.ZERO
        this.input.mpos = cc.Vec2.ZERO
    },


    updateInput(cmd){
        this.input.mlb = cmd.mlb;
        this.input.mrb = cmd.mrb;
        this.input.dir.x = cmd.dir.x;
        this.input.dir.y = cmd.dir.y;
        this.input.mpos.x = cmd.mpos.x;
        this.input.mpos.y = cmd.mpos.y;
    }

});
