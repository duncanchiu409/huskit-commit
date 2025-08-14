import { createLogger, format, Logger, transports } from "winston";

class LoggerHelper {
  private logger: Logger;

  constructor() {
    this.logger = createLogger({
      level: "verbose",
      format: format.combine(format.colorize()),
      transports: [new transports.Console()],
    });
    this.log = this.log.bind(this);
  }

  async log(message: string) {
    this.logger.info(message);
  }
}

export default LoggerHelper;
