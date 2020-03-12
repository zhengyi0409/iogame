
window.CyPlayer = cc.Class({

    sessionId:null,
    isLocal:false,
    input:{mlb:false, mlb:false, dir:cc.Vec2.ZERO, mpos:cc.Vec2.ZERO},

    updateInput(cmd){
        this.input.mlb = cmd.mlb;
        this.input.mrb = cmd.mrb;
        this.input.dir.x = cmd.dir.x;
        this.input.dir.y = cmd.dir.y;
        this.input.mpos.x = cmd.mpos.x;
        this.input.mpos.y = cmd.mpos.y;
    }

});
