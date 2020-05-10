import express from "express";
import Controller from "../interfaces/controller.interface";
import Post from "./post.interface";
import postModel from "./posts.model";
import PostNotFoundException from "../exceptions/PostNotFoundException";
import validationMiddleware from "middleware/validation.middleware";
import CreatePostDto from "./post.dto";

class PostsController implements Controller {
  public path = "/posts";
  public router = express.Router();
  private post = postModel;

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(this.path, this.getAllPosts);
    this.router.get(`${this.path}/:id`, this.getPostById);
    this.router.delete(`${this.path}/:id`, this.deletePost);
    this.router.patch(
      `${this.path}/:id`,
      validationMiddleware(CreatePostDto, true),
      this.modifyPost
    );
    this.router.post(
      this.path,
      validationMiddleware(CreatePostDto),
      this.createPost
    );
  }

  private getAllPosts = (
    request: express.Request,
    response: express.Response,
    next: express.NextFunction
  ) => {
    this.post.find((err: any, posts: Post[]) => {
      if (err) {
        return next(new Error(err));
      }
      response.send(posts);
    });
  };

  private getPostById = (
    request: express.Request,
    response: express.Response,
    next: express.NextFunction
  ) => {
    const id = request.params.id;
    this.post.findById(id, (err: any, post: Post) => {
      if (err) {
        return next(new PostNotFoundException(id));
      }
      response.send(post);
    });
  };

  private modifyPost = (
    request: express.Request,
    response: express.Response,
    next: express.NextFunction
  ) => {
    const id = request.params.id;
    const postData: Post = request.body;
    this.post.findByIdAndUpdate(id, postData, { new: true }, (err, post) => {
      if (err) {
        return next(new PostNotFoundException(id));
      }
      response.send(post);
    });
  };

  private createPost = (
    request: express.Request,
    response: express.Response,
    next: express.NextFunction
  ) => {
    const postData: Post = request.body;
    this.post.create(postData, (err: any, post: Post) => {
      if (err) {
        return next(new Error(err));
      }
      response.send(post);
    });
  };

  private deletePost = (
    request: express.Request,
    response: express.Response,
    next: express.NextFunction
  ) => {
    const id = request.params.id;
    this.post.findByIdAndDelete(id, (err, post) => {
      if (err) {
        return next(new PostNotFoundException(id));
      }
      response.send(post);
    });
  };
}

export default PostsController;
