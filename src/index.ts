import * as web3 from "@solana/web3.js";

async function run(): Promise<void> {
  console.log("Generating keypairs");
  const fromKeypair = web3.Keypair.generate();
  const toKeypair = web3.Keypair.generate();
  console.log({ fromKeypair, toKeypair });

  console.log("Establishing testnet connection");
  const connection = new web3.Connection(web3.clusterApiUrl("testnet"));

  console.log("Requesting airdrop");
  const airdropSignature = await connection.requestAirdrop(
    fromKeypair.publicKey,
    web3.LAMPORTS_PER_SOL
  );

  console.log("Awaiting airdrop confirmation");
  await connection.confirmTransaction({ signature: airdropSignature });

  console.log("Transfering sol");
  const transaction = new web3.Transaction();
  transaction.add(
    web3.SystemProgram.transfer({
      fromPubkey: fromKeypair.publicKey,
      toPubkey: toKeypair.publicKey,
      lamports: web3.LAMPORTS_PER_SOL / 2,
    })
  );
  const txSignature = await web3.sendAndConfirmTransaction(
    connection,
    transaction,
    [fromKeypair],
  );

  console.log(txSignature);
}

run()
  .then(() => {
    console.log("Done.");
    process.exit();
  })
  .catch((error) => {
    console.log(error);
    process.exit(1);
  });
