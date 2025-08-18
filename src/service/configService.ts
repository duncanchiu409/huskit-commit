import { homedir } from "node:os";
import { join } from "node:path";
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import HuskitConfig from "../model/huskitConfig";
import { CONFIG_FILE } from "../constant";

class ConfigService {
  static get_config_file_path() {
    const homeDir = homedir();
    const configDir = join(homeDir, CONFIG_FILE);
    return configDir;
  }

  static read_config_file() {
    const configFilePath = this.get_config_file_path();
    if (!existsSync(configFilePath)) {
      const initConfig = new HuskitConfig();
      this.write_config_file(initConfig);
      return initConfig;
    }
    const config = JSON.parse(
      readFileSync(configFilePath, "utf8"),
    ) as HuskitConfig;
    return config;
  }

  static write_config_file(config: HuskitConfig) {
    const configFilePath = this.get_config_file_path();
    writeFileSync(configFilePath, JSON.stringify(config, null, 2));
  }
}

export default ConfigService;
