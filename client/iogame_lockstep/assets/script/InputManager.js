
window.InputManager = cc.Class({
    extends: cc.Component,

    properties: {
        mousePoint:{
            default: null,
            type: cc.Node,
        },

        _player:null,   // 本地玩家数据
        _mousePosition:cc.Vec2.ZERO,
        _inputDirectionLocal:cc.Vec2.ZERO,
        _leftPressed:false,
        _rightPressed:false,
        _upPressed:false,
        _downPressed:false,
        _instance:null,
    },

    onLoad () {
        if (InputManager._instance == undefined) {
            InputManager._instance = this;
        } else {
            console.log("InputManager 单机失败");
            return;
        }
    },

    start () {
        this.node.on(cc.Node.EventType.TOUCH_START, this.onMouseStart, this);
        this.node.on(cc.Node.EventType.TOUCH_MOVE, this.onMouseMove, this);
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_UP, this.onKeyUp, this);
    },


    onDisable(){
        this.node.off(cc.Node.EventType.MOUSE_MOVE, this.onMouseStart, this);
        this.node.off(cc.Node.EventType.MOUSE_DOWN, this.onMouseMove, this);
        cc.systemEvent.off(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
        cc.systemEvent.off(cc.SystemEvent.EventType.KEY_UP, this.onKeyUp, this);
    },


    onDestroy(){
        this.node.off(cc.Node.EventType.MOUSE_MOVE, this.onMouseStart, this);
        this.node.off(cc.Node.EventType.MOUSE_DOWN, this.onMouseMove, this);
        cc.systemEvent.off(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
        cc.systemEvent.off(cc.SystemEvent.EventType.KEY_UP, this.onKeyUp, this);
    },

    onMouseStart: function onMouseStart(event) {
        var pos = this.node.convertToNodeSpaceAR(event.getLocation());
        this._mousePosition = pos
        this.mousePoint.position = pos

        //this._player.updateInput(this.toServerData())
    },

    onMouseMove: function onMouseMove(event) {
        var pos = this.node.convertToNodeSpaceAR(event.getLocation());
        this._mousePosition = pos
        this.mousePoint.position = pos

        //this._player.updateInput(this.toServerData())
    },


    onKeyDown(event){
        switch (event.keyCode) {
            case cc.macro.KEY.w:
                this._upPressed = true;
                this._inputDirectionLocal.y = this._downPressed?0:1;
                break;
            case cc.macro.KEY.s:
                this._downPressed = true;
                this._inputDirectionLocal.y = this._upPressed ? 0 : -1;
                break;
            case cc.macro.KEY.a:
                this._leftPressed = true;
                this._inputDirectionLocal.x = this._rightPressed?0:-1;
                break;
            case cc.macro.KEY.d:
                this._rightPressed = true;
                this._inputDirectionLocal.x = this._leftPressed?0:1;
                break;
            default:
                break;
        }

        //this._player.updateInput(this.toServerData())
    },

    onKeyUp(event){
        switch (event.keyCode) {
            case cc.macro.KEY.w:
                this._upPressed = false;
                this._inputDirectionLocal.y = this._downPressed?-1:0;
                break;
            case cc.macro.KEY.s:
                this._downPressed = false;
                this._inputDirectionLocal.y = this._upPressed?1:0;
                break;
            case cc.macro.KEY.a:
                this._leftPressed = false;
                this._inputDirectionLocal.x = this._rightPressed?1: 0;
                break;
            case cc.macro.KEY.d:
                this._rightPressed = false;
                this._inputDirectionLocal.x = this._leftPressed?-1: 0;
                break;
            default:
                break;
        }

        //this._player.updateInput(this.toServerData())
    },


    toServerData(){
        return {
            dir:this._inputDirectionLocal,
            mpos:this._mousePosition
        };
    },

});
