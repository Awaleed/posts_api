import { cleanEnv, str, port } from "envalid";

export function validateEnv() {
  cleanEnv(process.env, {
    MONGO_PATH: str(),
    JWT_SECRET: str(),
    PORT: port(),
  });
}
