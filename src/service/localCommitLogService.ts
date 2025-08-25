import fs from "node:fs/promises";
import CommitLog from "../model/commitLog";
import ConfigService from "./configService";

class LocalCommitLogService {
  private filePath: string;

  constructor() {
    this.filePath = ConfigService.get_config_file_path();
  }

  async readCommitLogs(): Promise<CommitLog[]> {
    const commitLog = await fs.readFile(this.filePath, "utf8");
    return JSON.parse(commitLog) as CommitLog[];
  }

  async appendCommitLog(commitLog: CommitLog): Promise<void> {
    const commitLogs = await this.readCommitLogs();
    commitLogs.push(commitLog);
    await fs.writeFile(this.filePath, JSON.stringify(commitLogs, null, 2));
  }
}

export default LocalCommitLogService;
