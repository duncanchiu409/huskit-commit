import { join } from "node:path";
import { cwd } from "node:process";
import { createLogger, format, Logger, transports } from "winston";
import { LOG_FILE } from "../constant";

class LoggerHelper {
  private logger: Logger;

  constructor(level: string = "verbose") {
    this.logger = createLogger({
      level: level,
      format: format.combine(format.colorize(), format.simple()),
      transports: [
        new transports.Console(),
        new transports.File({
          filename: join(cwd(), "logs", LOG_FILE),
        }),
      ],
    });
    this.log = this.log.bind(this);
  }

  async log(level: string, message: string) {
    this.logger.log(level, message);
  }
}

import { createConsola, ConsolaInstance, ConsolaOptions } from "consola";

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
}

export { LoggerHelper, LoggerHelperV2, LogLevel };
