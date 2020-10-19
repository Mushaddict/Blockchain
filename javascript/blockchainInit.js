const SHA256 = require("crypto-js/sha256");
//https://www.cnblogs.com/wzwd/p/8581513.html
class Block {
    constructor(index, timestamp, data, previousHash = " ") {
        this.index = index;
        this.timestamp = timestamp;
        this.data = data;
        this.previousHash = previousHash;
        this.hash = this.calculateHash();
    }

    calculateHash() {
        return SHA256(this.index + this.timestamp + this.previousHash + JSON.stringify(this.data)).toString();
    }
}

class BlockChain {
    constructor() {
        this.chain = [this.createGenesisBlock()];
    }

    createGenesisBlock() {
        return new Block(0, "2020/10/14 14:00", "GenesisBlock", "0");
    }

    /**
     * @param {} 
     * @return {Block}
     */
    getLastestBlock() {
        return this.chain[this.chain.length - 1];
    }

    /**
     * @param {Block} newBlock
     * @return {void 0}
     */
    addBlock(newBlock) {
        newBlock.previousHash = this.getLastestBlock().hash;
        newBlock.hash = newBlock.calculateHash();
        this.chain.push(newBlock);
    }

    isChainValid() {
        for (let i = 1; i < this.chain.length; i++) {
            const currentBlock = this.chain[i];
            const previousBlock = this.chain[i - 1];

            if (currentBlock.hash !== currentBlock.calculateHash()) {
                return false;
            }

            if (currentBlock.previousHash !== previousBlock.hash) {
                return false;
            }
        }
        return true;
    }


}

let chain = new BlockChain();
chain.addBlock(new Block(0, "2020-10-17 15:56", {amount : 4}));
chain.addBlock(new Block(1, "2020-10-17 15:59", {amount : 8}));
console.log("Is chain valid? " + chain.isChainValid());

