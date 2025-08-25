export class CommitLogList {
  commitLogs: CommitLog[];

  constructor() {
    this.commitLogs = [];
  }
}

class CommitLog {
  id: string;
  provider: string;
  providerModel: string;
  providerPrompt: string;
  authorCommitMessage: string;
  providerCommitMessage: string;
  createdAt: Date;

  constructor() {
    this.id = "";
    this.provider = "";
    this.providerModel = "";
    this.providerPrompt = "";
    this.authorCommitMessage = "";
    this.providerCommitMessage = "";
    this.createdAt = new Date();
  }
}

export default CommitLog;
