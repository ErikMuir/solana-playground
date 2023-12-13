import * as web3 from "@solana/web3.js";
import { confirm } from "./utils/user-input";

const _connection = new web3.Connection(web3.clusterApiUrl("testnet"));
const _secretKeyA = Uint8Array.from([
  234, 11, 82, 41, 59, 246, 177, 156, 185, 74, 18, 98, 6, 29, 231, 175, 128,
  130, 97, 100, 182, 89, 242, 158, 246, 54, 71, 72, 175, 144, 105, 129, 90, 234,
  174, 91, 102, 56, 242, 43, 166, 17, 217, 224, 175, 113, 245, 44, 202, 245,
  139, 67, 8, 73, 173, 110, 56, 50, 37, 129, 216, 53, 223, 5,
]);
const _secretKeyB = Uint8Array.from([
  165, 189, 6, 252, 9, 26, 215, 245, 151, 115, 173, 26, 79, 27, 177, 3, 210,
  172, 70, 203, 181, 86, 191, 147, 248, 209, 133, 142, 176, 63, 55, 224, 91,
  171, 40, 178, 239, 60, 211, 236, 26, 91, 84, 224, 212, 35, 74, 209, 123, 51,
  35, 35, 191, 112, 53, 96, 15, 17, 79, 104, 133, 46, 97, 115,
]);
const _accountA = web3.Keypair.fromSecretKey(_secretKeyA);
const _accountB = web3.Keypair.fromSecretKey(_secretKeyB);

function generateKeypair(): web3.Keypair {
  const keypair = web3.Keypair.generate();
  console.log({
    publicKey: keypair.publicKey.toString(),
    secretKey: keypair.secretKey.toString(),
  });
  return keypair;
}

async function requestAirdrop(publicKey: web3.PublicKey): Promise<void> {
  const airdropSignature = await _connection.requestAirdrop(
    publicKey,
    web3.LAMPORTS_PER_SOL
  );
  // await _connection.confirmTransaction({ signature: airdropSignature });
}

async function transferSol(
  from: web3.Keypair,
  to: web3.Keypair
): Promise<void> {
  const transaction = new web3.Transaction();
  transaction.add(
    web3.SystemProgram.transfer({
      fromPubkey: from.publicKey,
      toPubkey: to.publicKey,
      lamports: web3.LAMPORTS_PER_SOL / 2,
    })
  );
  const txSignature = await web3.sendAndConfirmTransaction(
    _connection,
    transaction,
    [from]
  );
  console.log({ txSignature });
}

async function run(): Promise<void> {
  await confirm("Get balance for Account A");
  const balanceA = await _connection.getBalance(_accountA.publicKey);
  console.log(balanceA);

  await confirm("Get balance for Account B");
  const balanceB = await _connection.getBalance(_accountB.publicKey);
  console.log(balanceB);
}

run()
  .then(() => {
    console.log("Done.");
    process.exit();
  })
  .catch((error) => {
    console.log(error?.message || error);
    process.exit(1);
  });
