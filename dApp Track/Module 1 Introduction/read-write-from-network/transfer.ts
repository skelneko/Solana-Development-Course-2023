import * as web3 from "@solana/web3.js";
import * as dotenv from "dotenv";
import base58 from "bs58";
import { getKeypairFromEnvironment } from "@solana-developers/node-helpers";

const NETWORK = "devnet";

// use a random to Address
// const newKeypair = web3.Keypair.generate();
const pubkey = "szeL1vQM4ncdauQFypFBmWPzAscyL7q5CFk6CPsyzcg";
const toPubkey = new web3.PublicKey (pubkey);  

// load .env
dotenv.config();

const senderKeypair = getKeypairFromEnvironment("SECRET_KEY");
const connection = new web3.Connection(web3.clusterApiUrl(NETWORK), "confirmed");

console.log(`✅ Loaded our own keypair ${senderKeypair.publicKey}, the destination public key ${toPubkey}, and connected to Solana`);

// refactor to simplify getting balance
const getAddressBalanceInSol = async (connection, address): Promise<number | string> => {
    try {
        const balanceInLamports = await connection.getBalance(address);
        const balanceInSol = balanceInLamports / web3.LAMPORTS_PER_SOL;
        return balanceInSol;

    } catch (error) {
        return error.message;
    }
}

// check sernder balance
// you can get $SOL from https://solfaucet.com/
console.log(`=== Current Balances ===`);
console.log(`Finished. The balance for the wallet at address ${senderKeypair.publicKey} is ${await getAddressBalanceInSol(connection, senderKeypair.publicKey)}`);
console.log(`Finished. The balance for the wallet at address ${toPubkey} is ${await getAddressBalanceInSol(connection, toPubkey)} $SOL.`);


// creating transaction
const transaction = new web3.Transaction();
const LAMPORTS_TO_SEND = 1200;



const sendSolInstruction = web3.SystemProgram.transfer({
    fromPubkey: senderKeypair.publicKey,
    toPubkey: toPubkey,
    lamports: LAMPORTS_TO_SEND,
});

const start_time = new Date();

transaction.add(sendSolInstruction);

// get the recentBlockhash
let blockhash = (await connection.getLatestBlockhash('finalized')).blockhash;
transaction.recentBlockhash = blockhash;
transaction.feePayer = senderKeypair.publicKey;

// check the transaction fee
const fee = (await connection.getFeeForMessage(transaction.compileMessage())).value;
console.log(`This transaction will require ${fee} lamports as fee.`);


// sign the txn
// here would throw errors for insufficient fund, which seems to be a min. holdings of lamports that one address must hold for any operations. More details here: https://solana.stackexchange.com/questions/7793/error-failed-to-send-transaction-transaction-simulation-failed-transaction-re
const signature = await web3.sendAndConfirmTransaction(connection, transaction, [
    senderKeypair,
]);

const time_taken = new Date() - start_time;

console.log(`Finished! Sent ${LAMPORTS_TO_SEND} to the address ${toPubkey}. Time taken: ${time_taken} ms.`);
console.log(`Transaction signature is ${signature}! Check your transaction here: https://explorer.solana.com/tx/${signature}?cluster=devnet`);


console.log(`=== After Transaction ===`);
console.log(`The balance for the wallet at address ${senderKeypair.publicKey} is ${await getAddressBalanceInSol(connection, senderKeypair.publicKey)}`);
console.log(`The balance for the wallet at address ${toPubkey} is ${await getAddressBalanceInSol(connection, toPubkey)} $SOL.`);
