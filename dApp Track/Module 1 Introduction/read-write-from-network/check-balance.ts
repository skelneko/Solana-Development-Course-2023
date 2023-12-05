import { Connection, PublicKey, LAMPORTS_PER_SOL, clusterApiUrl } from "@solana/web3.js";
import { resolve, NameRegistryState, getAllDomains } from "@bonfida/spl-name-service"; // SNS SDK from Bonfida: https://github.com/Bonfida/sns-sdk

 const NETWORK = "devnet";    // Testnet
//const NETWORK = "mainnet-beta"; // Mainnet


const SNS = "toly.sol"; // the exersice for querying real SNS, require Bonfida 
                        // side note: Quick-node article is referring to latency codebase of Bonfida, instead of using getDomainKey, we just use resolve as imported above


const connection = new Connection(clusterApiUrl(NETWORK));

try{
    const WALLET = await resolve(connection, SNS);
    try{
        const address = new PublicKey(WALLET);
        const balanceInLamports = await connection.getBalance(address);
        const balanceInSol = balanceInLamports / LAMPORTS_PER_SOL;
    
        console.log(
            `Finished. The balance for the wallet at address ${address} is ${balanceInSol}.`
        );
    
    } catch (error){
        console.log (`Invalid address: ${error}`);      // error capturing
    } 

} catch (error){
    console.log(`Failed to fetch SNS owner: ${error}`);

}


