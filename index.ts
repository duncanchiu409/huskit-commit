import "dotenv/config";
// import GitHelper from './src/git';
// import { cwd } from 'node:process';
// import { join } from 'node:path';
// import { readFile } from 'node:fs/promises';
// import OllamaService from './src/service/ollamaService';
import NpmService from "./src/service/npmService";
import { ArgumentParser } from "argparse";
import { configHandler } from "./src/handler/configHandler";
import { huskyHandler } from "./src/handler/huskyHandler";
import { commitHandler } from "./src/handler/commitHandler";

(async () => {
  const parser = new ArgumentParser({
    description:
      "🚀 A powerful CLI tool to automate and enhance your commit messages using AI.",
  });

  parser.add_argument("-v", "--version", {
    action: "version",
    help: "📦 Show the currently installed version of the package.",
    version: await NpmService.get_package_version(),
  });

  parser.add_argument("-l", "--latest", {
    action: "version",
    help: "🛰️ Check for the latest available version of the package from the npm registry.",
    version: await NpmService.get_latest_package_version(),
  });

  const subparsers = parser.add_subparsers({
    dest: "command",
    help: "Available commands",
  });

  // --- Commit Command ---
  const commitParser = subparsers.add_parser("commit", {
    help: "💬 Generate a commit message using AI.",
    description:
      "Generate a commit message using AI based on the staged changes and the current commit message.",
  });

  commitParser.add_argument("-m", "--message", {
    action: "store",
    help: "💬 Generate a commit message using AI based on the staged changes and the current commit message.",
  });

  // --- Config Command ---
  const configParser = subparsers.add_parser("config", {
    help: "⚙️ Manage the configuration for the AI model and API keys.",
    description:
      "Set or reset the configuration for the AI models and API keys used for generating commit messages.",
  });

  configParser.add_argument("-l", "--list", {
    action: "store_true",
    help: "💾 List the current configuration.",
  });

  configParser.add_argument("-p", "--provider", {
    action: "store",
    help: "🧠 set the provider of the AI model (ollama, deepseek, openai)",
  });

  // --- Deepseek ---
  configParser.add_argument("-m", "--deepseek-model", {
    action: "store",
    help: "🧠 Set the name of the AI model to use (e.g., 'deepseek-r1:8b').",
  });

  configParser.add_argument("-k", "--deepseek-api-key", {
    action: "store",
    help: "🔑 Set the API key for the selected AI service.",
  });

  configParser.add_argument("-ml", "--deepseek-max-length", {
    action: "store",
    help: "set the max length of the commit message",
  });

  configParser.add_argument("-r", "--reset", {
    action: "store_true",
    help: "🔄 Reset the entire configuration to its default settings.",
  });

  // --- Husky Command ---
  const huskyParser = subparsers.add_parser("husky", {
    help: "🐶 Manage the Husky configuration for the commit message hook.",
    description:
      "Set up or check the Husky configuration for the commit message hook.",
  });

  huskyParser.add_argument("-i", "--install", {
    action: "store_true",
    help: "🐶 Install the Husky commit message hook.",
  });

  huskyParser.add_argument("-u", "--uninstall", {
    action: "store_true",
    help: "🐶 Uninstall the Husky commit message hook.",
  });

  const args = parser.parse_args();

  if (args.command === "commit") {
    await commitHandler();
  }

  if (args.command === "config") {
    configHandler(args);
  }

  if (args.command === "husky") {
    await huskyHandler(args);
  }
})();
