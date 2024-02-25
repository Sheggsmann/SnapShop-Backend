/* eslint-disable @typescript-eslint/no-unused-vars */
import { AuthUserPayload } from '@auth/interfaces/auth.interface';
import { NotAuthorizedError } from '@global/helpers/error-handler';
import { config } from '@root/config';
import { Role } from '@user/interfaces/user.interface';
import { Request, Response, NextFunction } from 'express';
import JWT from 'jsonwebtoken';

class AuthMiddleware {
  public protect(req: Request, res: Response, next: NextFunction): void {
    let token = '';

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) throw new NotAuthorizedError('Token is not available. Please login.');

    try {
      const payload: AuthUserPayload = JWT.verify(token, config.JWT_TOKEN!) as AuthUserPayload;
      req.currentUser = payload;
    } catch (err) {
      throw new NotAuthorizedError('Token is invalid. Please login');
    }

    next();
  }

  public restrictTo(roles: (keyof typeof Role)[]) {
    return (req: Request, res: Response, next: NextFunction): void => {
      let isAuthenticated = false;
      roles.forEach((role) => {
        if (req.currentUser!.roles.includes(role)) {
          isAuthenticated = true;
        }
      });

      if (isAuthenticated) {
        next();
      } else {
        throw new NotAuthorizedError('You do not have the permissions to access this route.');
      }
    };
  }

  public checkAuth(req: Request, res: Response, next: NextFunction): void {
    if (!req.currentUser) throw new NotAuthorizedError('Authentication is required to access this route');
    next();
  }
}

export const authMiddleware: AuthMiddleware = new AuthMiddleware();
