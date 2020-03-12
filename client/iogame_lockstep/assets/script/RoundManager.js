

cc.Class({
    extends: cc.Component,

    properties: {

        playerPrefab:{
            default: null,
            type: cc.Prefab,
            displayName:"玩家Prefab",
        },

        objectsNode:{
            default: null,
            type: cc.Node,
            displayName:"物体显示层",
        },

    },


    onLoad () {
        this.cyEngine = CyEngine.getInstance();
    },


    /**
     *添加玩家
     * @param {CyPlayer} player
     * @memberof RoundManager
     */
    addPlayer(player) {
        let playerNode = cc.instantiate(this.playerPrefab);
        //let controller: CharacterController = playerNode.getComponent(CharacterController);
        //controller.player = player;
        let pos = cc.p(this.cyEngine.seededRandom(120, -120), this.cyEngine.seededRandom(120, -120));
        playerNode.position = pos;
        this.node.addChild(playerNode);
    },


    /**
     *当玩家可以控制的时候
     * @memberof RoundManager
     */
    onReadyToControl() {
        //this.cyEngine.sendToRoom(["cmd", ["addplayer"]]);
    }


});
