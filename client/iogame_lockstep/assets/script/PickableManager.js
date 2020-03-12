

cc.Class({
    extends: cc.Component,

    properties: {
        pickablePrefab:{
            default: null,
            type: cc.Prefab,
        },
    },


    onLoad () {
        this.cyEngine = CyEngine.getInstance();
    },

    start () {
        for (let i = 0; i < 10; i++) {
            let pickableNode = cc.instantiate(this.pickablePrefab);
            let pos = cc.p(this.cyEngine.seededRandom(-390,390), this.cyEngine.seededRandom(-390,390));
            pickableNode.position = pos;
            this.node.addChild(pickableNode);
        }
    },


});
