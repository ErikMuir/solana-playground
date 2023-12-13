import readline from "readline";

function getReadLine(): readline.Interface {
  return readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
}

export function question(msg: string): Promise<string> {
  const rl = getReadLine();
  return new Promise<string>(resolve => rl.question(msg, ans => {
    rl.close();
    resolve(ans);
  }));
}

export async function confirm(msg: string): Promise<void> {
  const ans = await question(`${msg} [Y/n] `);
  if (ans && ans.trim().charAt(0).toLowerCase() === "n") {
    throw new Error("Aborted by user.");
  }
}
