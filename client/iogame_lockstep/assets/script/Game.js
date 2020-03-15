
cc.Class({
    extends: cc.Component,

    properties: {

        roundPrefab:{
            default: null,
            type: cc.Prefab,
            displayName: "游戏Prefab"
        },

        playerPrefab:{
            default: null,
            type: cc.Prefab,
        },

        roundContainer:{
            default: null,
            type: cc.Node,
            displayName: "游戏位置",
        },

        pickablePrefab:{
            default: null,
            type: cc.Prefab,
        },

        _maxBotsCount:3,

    },

    onLoad () {
        this.cyEngine = CyEngine.getInstance();
        this.inputManager = this.node.getComponent("inputManager")
    },

    start () {
        let roundNode = cc.instantiate(this.roundPrefab);
        this.roundContainer.addChild(roundNode);
        for (let i = 0; i < 10; i++) {
            let pickableNode = cc.instantiate(this.pickablePrefab);
            let pos = cc.p(this.cyEngine.seededRandom(-320,320),this.cyEngine.seededRandom(-320,320));
            pickableNode.position = pos;
            roundNode.addChild(pickableNode);
        }

        this.addPlayer()
    },

    onDestroy() {
        Notification.removeListenersByObj(this);
    },


    //update (dt) {},


    /**
     *添加AI机器人
     * @memberof Ai
     */
    addBot(){
        for(let i=0;i<this._maxBotsCount;i++){
            let playerNode = cc.instantiate(this.playerPrefab);
            let pos = cc.p(this.cyEngine.seededRandom(320, -320), this.cyEngine.seededRandom(320, -320));
            playerNode.position = pos;
            this.roundContainer.addChild(playerNode);
        }
    },

    /**
     *添加玩家
     */
    addPlayer() {
        let playerNode = cc.instantiate(this.playerPrefab);
        let hand = playerNode.getChildByName("hand");
        hand.active = true
        let pos = cc.p(this.cyEngine.seededRandom(320, -320), this.cyEngine.seededRandom(320, -320));
        playerNode.position = pos;
        this.roundContainer.addChild(playerNode);
    },


    /**
     *当玩家可以控制的时候
     */
    onReadyToControl() {
        //this.cyEngine.sendToRoom(["cmd", ["addplayer"]]);
    },


    /**
     *离开房间
     */
    exitGameCall(){
        CyEngine.getInstance().leaveRoom();
        cc.director.loadScene("login");
    },
});
