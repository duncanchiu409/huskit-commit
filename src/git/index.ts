import CLIHelper from "../cli";

class GitHelper {
  static async get_current_branch() {
    await CLIHelper.execute_command("git branch --show-current");
  }

  static async get_staged_diff() {
    const { stdout } = await CLIHelper.execute_command("git diff --cached");
    return stdout;
  }
}

export default GitHelper;
