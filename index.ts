import "dotenv/config";
// import GitHelper from './src/git';
// import { cwd } from 'node:process';
// import { join } from 'node:path';
// import { readFile } from 'node:fs/promises';
// import OllamaService from './src/service/ollamaService';
import NpmService from "./src/service/npmService";

(async () => {
  // console.log("");
  // console.log("---------- Running Huskit Commit Handler ----------");
  // const diff = await GitHelper.get_staged_diff();
  // const current_dir = cwd();
  // const commitFilePath = join(current_dir, ".git", "COMMIT_EDITMSG");
  // const commitMessage = await readFile(commitFilePath, "utf8");
  // console.log("---------- Start of Your Commit Message -----------");
  // console.log("");
  // console.log(commitMessage.trim());
  // console.log("");
  // console.log("---------- End of Your Commit Message -------------");
  // const ollamaService = new OllamaService("deepseek-r1:8b");
  // const condensedMessage = await ollamaService.chat(commitMessage, diff);
  // console.log("---------- Start of Condensed Message -------------");
  // console.log("");
  // console.log(condensedMessage);
  // console.log("");
  // console.log("---------- End of Condensed Message ---------------");
  // console.log("");
  // console.log("---------- End of Huskit Commit Handler -----------");
  // console.log("");

  // const parser = new ArgumentParser({
  //   description: "A simple CLI tool to generate commit messages",
  // });

  // const sum = (ints: number[]) => ints.reduce((a, b) => a + b, 0);
  // const max = (ints: number[]) =>
  //   ints.reduce((a, b) => Math.max(a, b), -Infinity);

  // parser.add_argument("integers", {
  //   metavar: "N",
  //   type: "int",
  //   nargs: "+",
  //   help: "an integer for the accumulator",
  // });

  // parser.add_argument("--sum", {
  //   dest: "accumulate",
  //   action: "store_const",
  //   const: sum,
  //   default: max,
  //   help: "sum the integers (default: find the max)",
  // });

  // const args = parser.parse_args();
  // console.log(args.accumulate(args.integers));

  const latestVersion = await NpmService.get_latest_package_version();
  console.log(latestVersion);
})();
