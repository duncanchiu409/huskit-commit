import {
  createConsola,
  ConsolaInstance,
  ConsolaOptions,
  PromptOptions,
} from "consola";

enum LogLevel {
  INFO = "info",
  START = "start",
  BOX = "box",
  SUCCESS = "success",
  WARN = "warn",
  ERROR = "error",
}

class LoggerHelperV2 {
  private logger: ConsolaInstance;

  constructor(options?: Partial<ConsolaOptions>) {
    const defaultOptions: Partial<ConsolaOptions> = {
      level: 999,
    };
    this.logger = createConsola({ ...defaultOptions, ...options });
    this.log = this.log.bind(this);
  }

  log(level: LogLevel, message: string, error?: Error) {
    switch (level) {
      case LogLevel.INFO:
        this.logger.info(message);
        break;
      case LogLevel.START:
        this.logger.start(message);
        break;
      case LogLevel.BOX:
        this.logger.box(message);
        break;
      case LogLevel.SUCCESS:
        this.logger.success(message);
        break;
      case LogLevel.WARN:
        this.logger.warn(message);
        break;
      case LogLevel.ERROR:
        this.logger.error(error);
        break;
    }
  }

  async prompt(message: string, options: PromptOptions) {
    return await this.logger.prompt(message, options);
  }
}

export { LoggerHelperV2, LogLevel };
