import { cwd } from "node:process";
import { join } from "node:path";
import { readFile } from "node:fs/promises";
import { NPM_REGISTRY_URL } from "../constant";
import packageInfo from "../../package.json";
import { LoggerHelperV2, LogLevel } from "../logger";
import chalk from "chalk";

class NpmService {
  static async get_package_version() {
    return packageInfo.version as string;
  }

  static async get_latest_package_version() {
    const packageName = packageInfo.name;
    const response = await fetch(`${NPM_REGISTRY_URL}/${packageName}`);
    const data = await response.json();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return (data! as any)["dist-tags"].latest as string;
  }

  static async is_package_installed(packageName: string) {
    const logger = new LoggerHelperV2();
    logger.log(
      LogLevel.INFO,
      `📦 Checking if ${chalk.green(packageName)} is installed`,
    );
    const cwdPath = cwd();
    const packageJsonPath = join(cwdPath, "package.json");
    const packageJson = await readFile(packageJsonPath, "utf8");
    const packageJsonData = JSON.parse(packageJson);
    const isInstalled =
      packageJsonData.devDependencies[packageName] !== undefined;

    logger.log(
      LogLevel.INFO,
      `📦 ${chalk.green(packageName)} is ${isInstalled ? "installed" : "not installed"}`,
    );
    return isInstalled;
  }
}

export default NpmService;
