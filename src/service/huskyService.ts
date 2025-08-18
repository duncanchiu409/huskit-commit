import { join } from "node:path";
import { cwd } from "node:process";
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import NpmService from "./npmService";
import { appendFile } from "node:fs/promises";
import { LoggerHelperV2, LogLevel } from "../logger";

const HUSKY_CONFIG_PATH = ".husky/_";
const HUSKY_HOOK_COMMAND = "node huskit-commit";

class HuskyService {
  static async is_husky_installed() {
    const isInstalled = await NpmService.is_package_installed("husky");

    if (isInstalled === false) {
      return false;
    }

    const huskyConfigPath = join(cwd(), HUSKY_CONFIG_PATH);
    const isConfigExists = existsSync(huskyConfigPath);
    return isConfigExists;
  }

  static async install_husky_hook() {
    const logger = new LoggerHelperV2();
    const file = join(cwd(), ".husky", "prepare-commit-msg");
    if (existsSync(file)) {
      await appendFile(file, HUSKY_HOOK_COMMAND);
    } else {
      writeFileSync(file, HUSKY_HOOK_COMMAND);
    }
    logger.log(LogLevel.INFO, "🐶 Husky commit message hook installed");
  }

  static async uninstall_husky_hook() {
    const logger = new LoggerHelperV2();
    const file = join(cwd(), ".husky", "prepare-commit-msg");
    if (existsSync(file)) {
      const fileContent = readFileSync(file, "utf8");
      const lines = fileContent.split("\n");
      const newLines = lines.filter(
        (line) => line.trim() !== HUSKY_HOOK_COMMAND,
      );
      writeFileSync(file, newLines.join("\n"));
      logger.log(LogLevel.INFO, "🐶 Husky commit message hook uninstalled");
    }
  }
}

export default HuskyService;
