import { LoggerHelperV2, LogLevel } from "../logger";
import HuskyService from "../service/huskyService";
// import GitHelper from '../service/gitService';
// import ConfigService from '../service/configService';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function huskyHandler(args: any) {
  const logger = new LoggerHelperV2();
  const isInstalled = await HuskyService.is_husky_installed();

  if (isInstalled === false) {
    return false;
  }

  if (args.install) {
    await HuskyService.install_husky_hook();
    logger.log(LogLevel.INFO, "🐶 Husky commit message hook installed");
    return true;
  }

  if (args.commit) {
    // const diff = await GitHelper.get_staged_diff();
    // const commitMessage = await GitHelper.get_commit_message();
    // const config = ConfigService.read_config_file();
  }
}

export { huskyHandler };
