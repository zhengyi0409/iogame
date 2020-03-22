
const PlayerState = {
    idle:1,
    walk:2,
}


cc.Class({
    extends: cc.Component,

    properties: {
        avatarNode:{
            default: null,
            type: cc.Node,
        },

        handNode:{
            default: null,
            type: cc.Node,
        },


        animation:{
            default: null,
            type: cc.Animation,
        },

        _player:null,   // 玩家数据
        _rb:null,
        _moveSpeed:200,
        _distance:cc.Vec2.ZERO,
        _state:PlayerState.idle,
        _faceDirection:1,
        _dirDown:cc.v2(0,-1),
        _velocity:cc.Vec2.ZERO,
    },


    onLoad () {
        console.log("----------------------- characterController onLoad ")
        this._rb = this.node.getComponent(cc.RigidBody);
        this._rb.enabledContactListener = true;
    },


    start () {

    },


    update (dt) {

        //移动
        this._velocity = this._player.input.dir.normalize();
        if (this._velocity.magSqr() > 0) {
            this._velocity.mulSelf(this._moveSpeed);
            if(this._state == PlayerState.idle){
                this.setState(PlayerState.walk)
            }
            if (this._state == PlayerState.walk) {
                console.log("--------------------------- walk")
                this._rb.linearVelocity = this._velocity;
            }
        }else{
            if (this._state == PlayerState.walk) {
                this.setState(PlayerState.idle)
            }
            console.log("--------------------------- idle")
            this._rb.linearVelocity = this._velocity;
        }


        this._distance = this._player.input.mpos.sub(this.node.position);
        if (this._distance.magSqr() > 1) {
            let direction = this._distance.signAngle(this._dirDown) < 0 ? 1 : 0;
            this.setFaceDirection(direction)
        }

        if (this._player.isLocal) {
            this.handNode.rotation = cc.misc.radiansToDegrees(this._distance.signAngle(this._dirDown));
        }

    },


    setState(value){
        if(this._state != value){
            this._state = value

            if(value == PlayerState.walk){
                this.animation.play("player1_walk",0);
            }else if(value == PlayerState.idle){
                this.animation.play("player1_idle",0);
            }
        }

    },


    setFaceDirection(value){
        if(this._faceDirection != value){
            this._faceDirection = value;
            if(value == 0){
                this.avatarNode.scaleX = -Math.abs(this.avatarNode.scaleX);
            }else{
                this.avatarNode.scaleX = Math.abs(this.avatarNode.scaleX);
            }
        }
    },

});
