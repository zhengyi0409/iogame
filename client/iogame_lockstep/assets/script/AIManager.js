
cc.Class({
    extends: cc.Component,

    properties: {
        playerPrefab:{
            default: null,
            type: cc.Prefab,
        },

        players:[],

    },


    onLoad () {
        this.cyEngine = CyEngine.getInstance();
        this.maxBotsCount = 3
    },

    start () {
        for(let i=0;i<this.maxBotsCount;i++){
            this.addBot();
        }
    },


    /**
     *添加AI机器人
     *
     * @memberof AIManager
     */
    addBot(){
        //let player = new CyPlayer();
        let playerNode = cc.instantiate(this.playerPrefab);
        playerNode.position = cc.p(this.cyEngine.seededRandom(-120,120), this.cyEngine.seededRandom(-120,120))
        this.node.addChild(playerNode);
        //this.players.push(player);
    }

});
