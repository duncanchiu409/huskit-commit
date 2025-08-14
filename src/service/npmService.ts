import packageInfo from "../../package.json";

class NpmService {
  static async get_package_version() {
    return packageInfo.version as string;
  }
}

export default NpmService;
