import express from "express";
import mongoose from "mongoose";
import Controller from "interfaces/controller.interface";
import errorMiddleware from "./middleware/error.middleware";

class App {
  public app: express.Application;

  constructor(controllers: Controller[]) {
    this.app = express();

    this.connectToTheDatabase();
    this.initializeMiddlewares();
    this.initializeControllers(controllers);
    this.initializeErrorHandling();
  }

  private connectToTheDatabase() {
    const { MONGO_PATH } = process.env;
    mongoose.connect(
      `${MONGO_PATH}`,
      { useUnifiedTopology: true, useNewUrlParser: true },
      (err) => {
        if (err) {
          return console.error("db: error", err);
        }
        console.log("db: ready");
      }
    );
  }

  private initializeMiddlewares() {
    this.app.use(express.json());
  }

  private initializeControllers(controllers: Controller[]) {
    controllers.forEach((controller) => {
      this.app.use("/", controller.router);
    });
  }

  private initializeErrorHandling() {
    this.app.use(errorMiddleware);
  }

  public listen() {
    this.app.listen(process.env.PORT, () => {
      console.log(`App listening on the port ${process.env.PORT}`);
    });
  }
}

export default App;
