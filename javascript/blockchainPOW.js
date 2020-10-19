// POW是在第一个区块链被创造之前就已经存在的一种机制。这是一项简单的技术，通过一定数量的计算来防止滥用。工作量是防止垃圾填充和篡改的关键。如果它需要大量的算力，那么填充垃圾就不再值得。
// 比特币通过要求hash以特定0的数目来实现POW。这也被称之为难度
// 不过等一下！一个区块的hash怎么可以改变呢？在比特币的场景下，一个区块包含有各种金融交易信息。我们肯定不希望为了获取正确的hash而混淆了那些数据。
// 为了解决这个问题，区块链添加了一个nonce值。Nonce是用来查找一个有效Hash的次数。而且，因为无法预测hash函数的输出，因此在获得满足难度条件的hash之前，只能大量组合尝试。寻找到一个有效的hash（创建一个新的区块）在圈内称之为挖矿。
// 在比特币的场景下，POW确保每10分钟只能添加一个区块。你可以想象垃圾填充者需要多大的算力来创造一个新区块，他们很难欺骗网络，更不要说篡改整个链。

const SHA256 = require("crypto-js/sha256");

class Block {
    constructor(index, timestamp, data, previousHash = " ") {
        this.index = index;
        this.timestamp = timestamp;
        this.data = data;
        this.previousHash = previousHash;
        this.nonce = 0;
        this.hash = this.calculateHash();
    }

    calculateHash() {
        return SHA256(this.index + this.timestamp + this.previousHash + JSON.stringify(this.data) 
        + this.nonce).toString();
    }

    mineBlock(difficulty) {
        while (this.hash.substring(0, difficulty) !== Array(difficulty + 1).join("0")) {
            this.nonce++;
            this.hash = this.calculateHash();
        }
        console.log("Block Mined: " + this.hash);
    }
}

class BlockChain {
    constructor() {
        this.chain = [this.createGenesisBlock()];
        this.difficulty = 5;
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
        // newBlock.hash = newBlock.calculateHash();
        newBlock.mineBlock(this.difficulty);
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
console.log("Mining Block 1: ")
chain.addBlock(new Block(0, "2020-10-17 15:56", {amount : 4}));
console.log("Mining Block 2: ")
chain.addBlock(new Block(1, "2020-10-17 15:59", {amount : 8}));
console.log("Is chain valid? " + chain.isChainValid());

