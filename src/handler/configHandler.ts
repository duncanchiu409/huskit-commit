import ConfigService from "../service/configService";
import HuskitConfig from "../model/huskitConfig";
import { LogLevel, LoggerHelperV2 } from "../logger";
import chalk from "chalk";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function configHandler(args: any) {
  const logger = new LoggerHelperV2();
  const config = ConfigService.read_config_file();

  if (args.reset) {
    ConfigService.write_config_file(new HuskitConfig());
    logger.log(LogLevel.INFO, "🗑️ Reset the configuration to default");
    return;
  }

  if (args.list) {
    logger.log(LogLevel.INFO, `💾 Current configuration:`);
    logger.log(LogLevel.INFO, `Your current provider is ${config.provider}`);
    logger.log(
      LogLevel.BOX,
      `🧠 Ollama model: ${config.ollama_model}\n🔗 Ollama url: ${config.ollama_api_url}\n🔑 Ollama api key: ${config.ollama_api_key}\n📏 Ollama max length: ${config.ollama_max_commit_message_length}`,
    );
    logger.log(
      LogLevel.BOX,
      `🧠 Deepseek model: ${config.deepseek_model}\n🔗 Deepseek url: ${config.deepseek_api_url}\n🔑 Deepseek api key: ${config.deepseek_api_key}\n📏 Deepseek max length: ${config.deepseek_max_commit_message_length}`,
    );
    return;
  }

  let isConfigUpdated = false;

  if (args.provider && args.provider !== config.provider) {
    logger.log(
      LogLevel.INFO,
      `🧠 Set the provider from ${chalk.red(config.provider)} to ${chalk.green(args.provider)}`,
    );
    config.provider = args.provider;
    isConfigUpdated = true;
  }

  // --- Ollama ---
  // if (args.ollama_model && args.ollama_model !== config.ollama_model) {
  //   logger.log(
  //     LogLevel.INFO,
  //     `🧠 Set the ollama model from ${chalk.red(config.ollama_model)} to ${chalk.green(args.ollama_model)}`
  //   );
  //   config.ollama_model = args.ollama_model;
  //   isConfigUpdated = true;
  // }

  // if (args.ollama_url && args.ollama_url !== config.ollama_api_url) {
  //   config.ollama_api_url = args.ollama_url;
  //   logger.log(
  //     LogLevel.INFO,
  //     `🔗 Set the ollama url from ${chalk.red(config.ollama_api_url)} to ${chalk.green(args.ollama_url)}`
  //   );
  //   isConfigUpdated = true;
  // }

  // if (args.ollama_api_key && args.ollama_api_key !== config.ollama_api_key) {
  //   config.ollama_api_key = args.ollama_api_key;
  //   logger.log(
  //     LogLevel.INFO,
  //     `🔑 Set the ollama api key from ${chalk.red(config.ollama_api_key)} to ${chalk.green(args.ollama_api_key)}`
  //   );
  //   isConfigUpdated = true;
  // }

  // if (
  //   args.ollama_max_length &&
  //   args.ollama_max_length !== config.ollama_max_commit_message_length
  // ) {
  //   config.ollama_max_commit_message_length = args.ollama_max_length;
  //   logger.log(
  //     LogLevel.INFO,
  //     `📏 Set the ollama max length from ${chalk.red(config.ollama_max_commit_message_length)} to ${chalk.green(args.ollama_max_length)}`
  //   );
  //   isConfigUpdated = true;
  // }

  // --- Deepseek ---
  if (args.deepseek_model && args.deepseek_model !== config.deepseek_model) {
    logger.log(
      LogLevel.INFO,
      `🧠 Set the deepseek model from ${chalk.red(config.deepseek_model)} to ${chalk.green(args.deepseek_model)}`,
    );
    config.deepseek_model = args.deepseek_model;
    isConfigUpdated = true;
  }

  if (
    args.deepseek_api_key &&
    args.deepseek_api_key !== config.deepseek_api_key
  ) {
    logger.log(
      LogLevel.INFO,
      `🔑 Set the deepseek api key from ${chalk.red(config.deepseek_api_key)} to ${chalk.green(args.deepseek_api_key)}`,
    );
    config.deepseek_api_key = args.deepseek_api_key;
    isConfigUpdated = true;
  }

  if (
    args.deepseek_api_url &&
    args.deepseek_api_url !== config.deepseek_api_url
  ) {
    config.deepseek_api_url = args.deepseek_api_url;
    logger.log(
      LogLevel.INFO,
      `🔗 Set the deepseek url from ${chalk.red(config.deepseek_api_url)} to ${chalk.green(args.deepseek_api_url)}`,
    );
    isConfigUpdated = true;
  }

  if (
    args.deepseek_max_length &&
    args.max_length !== config.deepseek_max_commit_message_length
  ) {
    config.deepseek_max_commit_message_length = args.max_length;
    logger.log(
      LogLevel.INFO,
      `📏 Set the deepseek max length from ${chalk.red(config.deepseek_max_commit_message_length)} to ${chalk.green(args.deepseek_max_length)}`,
    );
    isConfigUpdated = true;
  }

  if (isConfigUpdated) {
    ConfigService.write_config_file(config);
    logger.log(LogLevel.SUCCESS, "💾 Configuration saved successfully");
  } else {
    logger.log(LogLevel.WARN, "🤔 No configuration changes detected");
  }
}

export { configHandler };
