import gitLogger from "../libs/logger.js";
import envConfig from "../config/envConfig.js";

const checkEnvKey = (key: string): boolean => {
  return envConfig.hasOwnProperty(key) ? true : false;
};

const getKeyValue = (key: string) => {
  if (!checkEnvKey(key)) {
    gitLogger.warn(
      `The Key you Requested : ${key} Does not exists in environment config`
    );
    return;
  }
  return envConfig[key];
};

export { checkEnvKey, getKeyValue };
