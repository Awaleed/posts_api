import { cleanEnv, str, port } from "envalid";

export default function validateEnv() {
  cleanEnv(process.env, {
    MONGO_PATH: str(),
    PORT: port(),
  });
}
