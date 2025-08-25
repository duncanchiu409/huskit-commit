import { LoggerHelperV2, LogLevel } from "../logger";
import OllamaService from "./ollamaService";
import { PACKAGE_NAME } from "../constant";
import ollama from "ollama";
import chalk from "chalk";
import Errors from "../error";

class FineTuningService {
  private logger: LoggerHelperV2;
  private selectedProvider: string;
  private selectedModel: string;
  private trainingModel: string;

  constructor(provider: string, model: string, logger: LoggerHelperV2) {
    this.selectedProvider = provider;
    this.selectedModel = model;
    this.logger = logger;
    this.trainingModel = "";
  }

  async initFineTuningModel(): Promise<boolean> {
    if (this.selectedProvider === "ollama") {
      const ollamaService = new OllamaService(this.selectedModel);
      const ollamaAvailableModels = await ollamaService.get_available_models();
      this.trainingModel = this.selectedModel + `_${PACKAGE_NAME}`;
      if (ollamaAvailableModels.includes(this.trainingModel)) {
        this.logger.log(
          LogLevel.INFO,
          `🚀 You have selected the ollama model: ${this.selectedModel}`,
        );
        try {
          await ollama.copy({
            source: this.selectedModel,
            destination: this.trainingModel,
          });
          this.logger.log(
            LogLevel.INFO,
            `🚀 Copied the ollama model: ${this.selectedModel} to ${this.trainingModel}`,
          );
          return true;
        } catch (error) {
          if (error instanceof Error) {
            this.logger.log(LogLevel.ERROR, "", error);
          } else {
            this.logger.log(
              LogLevel.ERROR,
              "",
              new Errors.OllamaCopyError(
                this.selectedModel,
                this.trainingModel,
              ),
            );
          }
          return false;
        }
      } else {
        this.logger.log(
          LogLevel.WARN,
          `🚨 The ollama model: ${this.selectedModel} is not available`,
        );
        this.logger.log(
          LogLevel.INFO,
          `Please pull the ollama model: ${chalk.red(this.selectedModel)} to your local machine first\nBy running: ollama pull ${this.selectedModel}`,
        );
        return false;
      }
    } else {
      this.logger.log(
        LogLevel.WARN,
        `🚨 Fine-tuning with ${this.selectedProvider} is not supported yet`,
      );
      return false;
    }
  }

  async fine_tune_model() {
    // const trainingData = await this.initFineTuningModel();
  }
}

export default FineTuningService;
