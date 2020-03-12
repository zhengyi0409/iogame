
cc.Class({
    extends: cc.Component,

    properties: {
        playerPrefab:{
            default: null,
            type: cc.Prefab,
        },


        AIPrefab:{
            default: null,
            type: cc.Prefab,
        },

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



    }

});
