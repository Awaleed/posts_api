import * as bcrypt from "bcryptjs";
import * as express from "express";
import jwt from "jsonwebtoken";
import UserWithThatEmailAlreadyExistsException from "../exceptions/UserWithThatEmailAlreadyExistsException";
import WrongCredentialsException from "../exceptions/WrongCredentialsException";
import Controller from "../interfaces/controller.interface";
import validationMiddleware from "../middleware/validation.middleware";
import CreateUserDto from "../users/user.dto";
import userModel from "./../users/user.model";
import LogInDto from "./logIn.dto";
import User from "users/user.interface";
import TokenData from "interfaces/tokenData.interface";
import DataStoredInToken from "interfaces/dataStoredInToken";
import AuthenticationService from "./authentication.service";

class AuthenticationController implements Controller {
  public path = "/auth";
  public router = express.Router();
  public api: boolean = true;

  public authenticationService = new AuthenticationService();
  private user = userModel;

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post(
      `${this.path}/register`,
      validationMiddleware(CreateUserDto),
      this.registration
    );
    this.router.post(
      `${this.path}/login`,
      validationMiddleware(LogInDto),
      this.loggingIn
    );
    this.router.post(`${this.path}/logout`, this.loggingOut);
  }

  private registration = async (
    request: express.Request,
    response: express.Response,
    next: express.NextFunction
  ) => {
    const userData: CreateUserDto = request.body;
    try {
      const { cookie, user } = await this.authenticationService.register(
        userData
      );
      response.setHeader("Set-Cookie", [cookie]);
      response.send(user);
    } catch (error) {
      next(error);
    }
  };

  private loggingIn = async (
    request: express.Request,
    response: express.Response,
    next: express.NextFunction
  ) => {
    const logInData: LogInDto = request.body;
    try {
      const { cookie, user } = await this.authenticationService.login(
        logInData
      );
      response.setHeader("Set-Cookie", [cookie]);
      response.send(user);
    } catch (error) {
      next(error);
    }
  };

  private loggingOut = (
    request: express.Request,
    response: express.Response
  ) => {
    response.setHeader("Set-Cookie", ["Authorization=;Max-age=0"]);
    response.send(200);
  };
}

export default AuthenticationController;
