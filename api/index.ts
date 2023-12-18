import express from "express";
import { getRequired } from "../env";

const PORT = 3001;

const app = express();

let _tokenMetadata: any[] | undefined;
async function getTokenMetadata() {
  if (!_tokenMetadata) {
    console.log("Fetching token metadata...");
    const response = await fetch(getRequired("TOKEN_LIST_CDN_URL"));
    const json = await response.json();
    _tokenMetadata = json.tokens;
    console.log(`Fetched metadata for ${json.tokens.length} tokens`);
  }
  return _tokenMetadata;
}

app.get("/tokens/:accountPublicKey", async (req, res) => {
  const accountPublicKey = req.params["accountPublicKey"];
  const rpcUrl = getRequired("RPC_URL");
  const requestBody = {
    jsonrpc: "2.0",
    id: 1,
    method: "getTokenAccountsByOwner",
    params: [
      accountPublicKey,
      {
        programId: getRequired("PROGRAM_ID"),
      },
      {
        encoding: "jsonParsed",
      },
    ],
  };
  const response = await fetch(rpcUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(requestBody),
  });
  const json = await response.json();
  const tokenMetadata = await getTokenMetadata();
  const accountFungibleTokens = json.result.value
    .filter(
      (token: any) =>
        token.account.data.parsed.info.tokenAmount.amount > 0 &&
        token.account.data.parsed.info.tokenAmount.decimals > 0
    )
    .map((accountToken: any) => {
      const { mint } = accountToken.account.data.parsed.info;
      const metadata = tokenMetadata?.find((tm) => tm.address === mint);
      return {
        name: metadata?.name,
        symbol: metadata?.symbol,
        mintAddress: mint,
        tokenAccountAddress: accountPublicKey,
        amount:
          accountToken.account.data.parsed.info.tokenAmount.uiAmountString,
        imageUrl: metadata?.logoURI,
      };
    });
  res.send(accountFungibleTokens);
});

app.listen(PORT, async () => {
  await getTokenMetadata();
  console.log(`Listening on port ${PORT}`);
});
