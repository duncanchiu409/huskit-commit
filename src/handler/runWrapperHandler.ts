import { commitHandler } from "./commitHandler";
import { LoggerHelperV2, LogLevel } from "../logger";
import Errors from "../error";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function runWrapperHandler(args: any) {
  const logger = new LoggerHelperV2();
  try {
    if (args.command === "commit") {
      await commitHandler(args);
    }
  } catch (error) {
    if (error instanceof Error) {
      logger.log(LogLevel.ERROR, "", error);
    } else {
      logger.log(LogLevel.ERROR, "", new Errors.UnknownError(error));
    }
  }
}

export { runWrapperHandler };
