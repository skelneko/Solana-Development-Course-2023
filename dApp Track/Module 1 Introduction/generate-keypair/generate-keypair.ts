import { Keypair } from "@solana/web3.js";

import * as dotenv from "dotenv";
import { addKeypairToEnvFile, getKeypairFromEnvironment } from "@solana-developers/node-helpers";

const keypair = Keypair.generate();

console.log (`The public key is: `, keypair.publicKey.toBase58());
console.log (`The private key is: `, keypair.secretKey);

// push the keypair to env (Ref: https://github.com/solana-developers/node-helpers)
// this is to avoid incorrectness if students just copy-n-paste the "string" from console onto .env
await addKeypairToEnvFile(keypair, "SECRET_KEY", ".env.local");     // make sure just a local env for cleanness

console.log(`✅ Finished.`);

/**
 * [Note to self]
 * 
 * this may rise the following warning:
 * 
 * ===
 * bigint: Failed to load bindings, pure JS will be used (try npm run rebuild?)
 * ....
 * (node:41688) [DEP0040] DeprecationWarning: The `punycode` module is deprecated. Please use a userland alternative instead.
 * ===
 * 
 * ... but seems the program runs alright per google search, as it switch to use pure js as mentioned in the warning. 
 */


/** Using .env **/ 
dotenv.config();
const env_keypair = getKeypairFromEnvironment("SECRET_KEY");

console.log(`We manage to load the secret key: `, env_keypair.secretKey);