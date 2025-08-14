import packageInfo from "../../package.json";

class NpmService {
  static async get_package_version() {
    return packageInfo.version as string;
  }

  static async get_latest_package_version() {
    const response = await fetch(
      `https://registry.npmjs.org/${packageInfo.name}`,
    );
    const data = await response.json();
    return data.version as string;
  }
}

export default NpmService;
