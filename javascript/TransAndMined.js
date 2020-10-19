//加旷工奖励

const SHA256 = require("crypto-js/sha256");

class Block {
    constructor(timestamp, transactoins, previousHash = " ") {
        this.timestamp = timestamp;
        this.transactoins = transactoins;
        this.previousHash = previousHash;
        this.nonce = 0;
        this.hash = this.calculateHash();
    }

    calculateHash() {
        return SHA256(this.timestamp + this.previousHash + JSON.stringify(this.transactoins) 
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

class Transaction {
    constructor(fromAddress, toAddress, amount) {
        //发起方
        this.fromAddress = fromAddress;
        //接收方
        this.toAddress = toAddress;
        this.amount = amount;
    }
}

class BlockChain {
    constructor() {
        this.chain = [this.createGenesisBlock()];
        this.difficulty = 5;

        // 在区块产生之间存储交易的地方
        this.pendingTransactions = [];

        // 挖矿回报
        this.miningReward = 100;
    }

    createTransaction(transaction) {
        //这里应该有一些校验

        //推入待处理交易数组
        this.pendingTransactions.push(transaction);
    }

    minePendingTransactions(miningRewardAddress) {
        //用所有待交易来创建新的区块并挖矿
        let block = new Block(Date.now(), this.pendingTransactions);
        block.mineBlock(this.difficulty);

        //将新挖的矿加到链上
        this.chain.push(block);

        // 重置待处理交易列表并且发送奖励
        this.pendingTransactions =  [new Transaction(null, miningRewardAddress, this.miningReward)];
    }

    // 地址的余额
    getBalanceOfAddress(address) {
        let balance = 0;

        // 遍历每个区块以及每个区块内的交易
        for (const block of this.chain) {
            for (const trans of block.transactoins) {

                // 如果地址是发起方 -> 减少余额
                if (trans.fromAddress === address) {
                    balance -= trans.amount;
                }

                // 如果地址是接收方 -> 增加余额
                if (trans.toAddress === address) {
                    balance += trans.amount;
                }
            }
        }
        return balance;
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
console.log("Creating some transactions... ");
chain.createTransaction(new Transaction("address1", "address2", 100));
chain.createTransaction(new Transaction("address2", "address1", 50));
//这些交易目前都处于等待状态，为了让他们得到证实，我们必须开始挖矿：

console.log('Starting the miner...');
chain.minePendingTransactions('block-address');
console.log('Balance of block address is', chain.getBalanceOfAddress('block-address'));
// 0

console.log('Starting the miner again!');
chain.minePendingTransactions("block-address");
console.log('Balance of block address is', chain.getBalanceOfAddress('block-address'));
//100

console.log('Starting the miner again!');
chain.minePendingTransactions("block-address");
console.log('Balance of block address is', chain.getBalanceOfAddress('block-address'));

