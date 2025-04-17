import path from "path";
import { Director } from "../../director";
import { IConfig } from "..";

export default class ConfigBase {
  config?: IConfig;
  configPath: string = path.resolve("config.json");
  defaultConfig: IConfig;

  constructor(configPath?: string) {
    this.configPath = configPath || this.configPath;
    this.config = this.ensureConfig();
  }

  /**
   * Ensures the config is loaded.
   * If it doesn't exist yet, a config.json file is created at the configured configPath. Default: "<cwd>/config.json"
   */
  ensureConfig() {
    if (!Director.pathExists(this.configPath)) {
      const pathToConfig = path.resolve(this.configPath);

      Director.writeFile(pathToConfig, JSON.stringify(this.defaultConfig));

      return this.defaultConfig;
    }

    try {
      const content = Director.readFile(this.configPath) || "{}"; // Transform empty string if config.json is empty or JSON.parse fails

      return JSON.parse(content as string);
    } catch (err) {
      throw new Error("Unable to load config! Here's what we know:", err);
    }
  }

  /**
   * Updates the config file with the provided configuration.
   * Uses [deepMerge()] to merge original with new config.
   *
   * NOTE: It's not necessary to provide the complete configuration.
   * NOTE: Already uses saveConfig() to write the config to the config.json!
   */
  updateConfig(newConfig: Partial<IConfig>) {
    this.config = { ...this.config, ...newConfig } as IConfig;
    this.saveConfig();
  }

  /**
   * Saves the config to the configured configPath.
   */
  private saveConfig() {
    if (!this.config) {
      throw new Error(
        `ERROR: Unable to save config to ${this.configPath}: \r\n REASON: Config is empty`,
      );
    }
    Director.writeFile(this.configPath, JSON.stringify(this.config));
  }
}
