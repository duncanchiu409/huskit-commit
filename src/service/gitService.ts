import { join } from "node:path";
import { cwd } from "node:process";
import { readFileSync } from "node:fs";
import CLIHelper from "../cli";

class GitHelper {
  static async get_current_branch() {
    await CLIHelper.execute_command("git branch --show-current");
  }

  static async get_staged_diff() {
    const { stdout } = await CLIHelper.execute_command("git diff --cached");
    return stdout;
  }

  static async get_git_directory() {
    const { stdout } = await CLIHelper.execute_command(
      "git rev-parse --git-dir",
    );
    return stdout.trim();
  }

  static async get_commit_message() {
    const commitFilePath = join(cwd(), ".git", "COMMIT_EDITMSG");
    const commitMessage = readFileSync(commitFilePath, "utf8");
    return commitMessage.trim();
  }
}

export default GitHelper;
