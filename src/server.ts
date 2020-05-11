// configure .env
import "dotenv/config";
import { validateEnv } from "./utils/validateEnv";
// Check all values provided
validateEnv();

import App from "./app";
import UserController from "./users/user.controller";

import PostsController from "./posts/posts.controller";

import AuthenticationController from "./authentication/authentication.controller";
import ReportController from "./report/report.controller";

const app = new App([
  new UserController(),
  new PostsController(),
  new AuthenticationController(),
  new ReportController(),
]);

app.listen();
