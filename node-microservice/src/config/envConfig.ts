import dotenv from 'dotenv';

(() => {
  dotenv.config();
})();

const envConfig = {
  port: process.env.PORT,
  mongoUri: process.env.MONGO_URI,
  githubToken: process.env.GITHUB_TOKEN,
};

export default envConfig;
