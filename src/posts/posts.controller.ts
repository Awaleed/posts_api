import express from "express";
import Controller from "../interfaces/controller.interface";
import Post from "./post.interface";
import postModel from "./posts.model";
import PostNotFoundException from "../exceptions/PostNotFoundException";
import validationMiddleware from "../middleware/validation.middleware";
import CreatePostDto from "./post.dto";
import authMiddleware from "../middleware/auth.middleware";
import RequestWithUser from "../interfaces/requestWithUser.interface";
import NotAuthorizedException from "../exceptions/NotAuthorizedException";

class PostsController implements Controller {
  public path = "/posts";
  public router = express.Router();
  public api: boolean = true;
  
  private post = postModel;

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(this.path, this.getAllPosts);
    this.router.get(`${this.path}/:id`, this.getPostById);
    this.router
      .all(`${this.path}/*`, authMiddleware)
      .patch(
        `${this.path}/:id`,
        validationMiddleware(CreatePostDto, true),
        this.modifyPost
      )
      .delete(`${this.path}/:id`, this.deletePost)
      .post(this.path, validationMiddleware(CreatePostDto), this.createPost);
  }

  private getAllPosts = (
    request: express.Request,
    response: express.Response,
    next: express.NextFunction
  ) => {
    this.post
      .find()
      .populate("author", "-password")
      .exec((err: any, posts: Post[]) => {
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
    this.post
      .findById(id)
      .populate("author", "-password")
      .exec((err: any, post: Post) => {
        if (err || !post) {
          return next(new PostNotFoundException(id));
        }
        response.send(post);
      });
  };

  private modifyPost = (
    request: RequestWithUser,
    response: express.Response,
    next: express.NextFunction
  ) => {
    const id = request.params.id;
    const postData: Post = request.body;
    this.post.findById(id, (err, post) => {
      if (err || !post) {
        return next(new PostNotFoundException(id));
      } else if (request.user._id.toString !== post?.author?.toString) {
        return next(new NotAuthorizedException());
      } else {
        post.updateOne(postData, { new: true }, (err, post) => {
          if (err) {
            return next(new Error(err.message));
          }
          response.send(post);
        });
      }
    });
  };

  private createPost = (
    request: RequestWithUser,
    response: express.Response,
    next: express.NextFunction
  ) => {
    const postData: Post = request.body;
    this.post.create(
      { ...postData, author: request.user._id },
      (err: any, post: Post) => {
        if (err) {
          return next(new Error(err));
        }
        response.send(post);
      }
    );
  };

  private deletePost = (
    request: RequestWithUser,
    response: express.Response,
    next: express.NextFunction
  ) => {
    const id = request.params.id;
    this.post.findById(id, (err, post) => {
      if (err || !post) {
        return next(new PostNotFoundException(id));
      } else if (request.user._id.toString !== post?.author?.toString) {
        return next(new NotAuthorizedException());
      } else {
        post.remove((err, post) => {
          if (err) {
            return next(new Error(err.message));
          }
          response.send(post);
        });
      }
    });
  };
}

export default PostsController;
