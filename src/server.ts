// configure .env
import "dotenv/config";
import { validateEnv } from "./utils/validateEnv";
// Check all values provided
validateEnv();

import App from "./app";
import PostsController from "./posts/posts.controller";

const app = new App([new PostsController()]);

app.listen();
