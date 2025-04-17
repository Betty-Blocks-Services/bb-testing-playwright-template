import path from "path";
import { Director } from "../director";
import ConfigBase from "./base";

/**
 * Edit this interface to define the keys in your configuration.
 */
export interface IConfig {
  someValueFromConfig: string;
}

/**
 * Define the default values of your config with javascripts constructors.
 * @example const DEFAULT_CONFIG: IConfig = {
 *  someValueToStore: String()
 * }
 * To allow any value in the config typing, change
 * const DEFAULT_CONFIG: IConfig
 * to
 * const DEFAULT_CONFIG: any = ...
 */
export const DEFAULT_CONFIG: IConfig = {
  someValueFromConfig: String(),
};

export class Config extends ConfigBase {
  /**
   * Example function to get a value from the loaded config.
   * Define these for every value in your config
   */
  get someValueFromConfig() {
    return this.config?.someValueFromConfig;
  }
}

const config = new Config();

export default config;
