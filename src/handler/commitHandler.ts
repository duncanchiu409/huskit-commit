import { generate_system_prompt, generate_user_prompt } from "../prompt";
import DeepseekService, { DeepSeekModels } from "../service/deepseekService";
import { LoggerHelperV2, LogLevel } from "../logger";
import ConfigService from "../service/configService";
import GitService from "../service/gitService";
import OllamaService from "../service/ollamaService";
import Error from "../error";
import chalk from "chalk";
import { v4 as uuidv4 } from "uuid";
import CommitLog from "../model/commitLog";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function commitHandler(args: any) {
  const startTime = Date.now();
  const logger = new LoggerHelperV2();
  const config = ConfigService.read_config_file();
  const gitDiff = await GitService.get_staged_diff();
  let commitMessage = await GitService.get_commit_message();

  if (args.message) {
    logger.log(
      LogLevel.INFO,
      `🚀 Using the provided commit message: ${chalk.yellow(args.message)}`,
    );
    commitMessage = args.message;
    GitService.write_commit_message(commitMessage);
  } else {
    logger.log(
      LogLevel.WARN,
      `🚀 You didn't provide a commit message, using the current commit message: ${chalk.yellow(commitMessage)}`,
    );
  }

  if (!config.provider) {
    logger.log(LogLevel.ERROR, "", new Error.ProviderNotSetError());
    return;
  }

  let service: OllamaService | DeepseekService;
  let providerModel: string;

  switch (config.provider) {
    case "ollama": {
      if (!config.ollama_model) {
        logger.log(LogLevel.ERROR, "", new Error.ModelNotSetError("ollama"));
        return;
      }

      service = new OllamaService(config.ollama_model);
      const availableModels = await service.get_available_models();
      logger.log(
        LogLevel.INFO,
        `🚀 Selected model: ${chalk.green(config.ollama_model)}`,
      );
      if (!availableModels.includes(config.ollama_model)) {
        logger.log(
          LogLevel.ERROR,
          "",
          new Error.ModelNotAvailableError(`ollama ${config.ollama_model}`),
        );
        return;
      } else {
        providerModel = config.ollama_model;
      }
      break;
    }
    case "deepseek": {
      if (!config.deepseek_model) {
        logger.log(LogLevel.ERROR, "", new Error.ModelNotSetError("deepseek"));
        return;
      }
      if (!config.deepseek_api_url) {
        logger.log(LogLevel.ERROR, "", new Error.ApiUrlNotSetError("deepseek"));
        return;
      }
      if (!config.deepseek_api_key) {
        logger.log(LogLevel.ERROR, "", new Error.ApiKeyNotSetError("deepseek"));
        return;
      }

      service = new DeepseekService(
        config.deepseek_model as DeepSeekModels,
        config.deepseek_api_url,
        config.deepseek_api_key,
      );
      providerModel = config.deepseek_model;
      break;
    }
    default:
      logger.log(LogLevel.ERROR, "", new Error.ProviderNotSetError());
      return;
  }

  const systemPrompt = generate_system_prompt(200);
  const userPrompt = generate_user_prompt(gitDiff, commitMessage);
  const response = await service.chat_completions(systemPrompt, userPrompt);
  logger.log(LogLevel.INFO, `🚀 Commit message: ${chalk.yellow(response)}`);

  const endTime = Date.now();
  const executionTime = (endTime - startTime) / 1000;
  logger.log(LogLevel.INFO, `Execution time: ${executionTime}s`);
  const result = await logger.prompt("Do you like the message?", {
    type: "confirm",
    initial: true,
  });

  if (result) {
    const commitLog = new CommitLog();
    commitLog.id = uuidv4();
    commitLog.provider = config.provider;
    commitLog.providerModel = providerModel;
    commitLog.providerPrompt = userPrompt;
    commitLog.authorCommitMessage = commitMessage;
    commitLog.providerCommitMessage = response ?? "";
    config.commit_log_list.push(commitLog);
    ConfigService.write_config_file(config);
    logger.log(LogLevel.INFO, `🚀 Commit log: ${commitLog.id} saved`);
  }
}

export { commitHandler };
