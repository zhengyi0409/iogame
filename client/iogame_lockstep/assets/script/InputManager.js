
cc.Class({
    extends: cc.Component,

    properties: {

        mousePoint:{
            default: null,
            type: cc.Node,
        },

    },

    onLoad () {


    },

    start () {
        this.node.on(cc.Node.EventType.TOUCH_START, this.onMouseStart, this);
        this.node.on(cc.Node.EventType.TOUCH_MOVE, this.onMouseMove, this);
        this.node.on(cc.Node.EventType.TOUCH_END, this.onMouseEnd, this);
    },



    onMouseStart: function onMouseStart(event) {
        var pos = this.node.convertToNodeSpaceAR(event.getLocation());
        //console.log("------------------------ mousestart x:" + pos.x + " y:" + pos.y)
        this.mousePoint.position = pos
    },

    onMouseMove: function onMouseMove(event) {
        var pos = this.node.convertToNodeSpaceAR(event.getLocation());
        this.mousePoint.position = pos
    },

    onMouseEnd: function onMouseEnd(event) {


    },



});
