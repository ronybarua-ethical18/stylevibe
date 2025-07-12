import { NextFunction, Request, Response } from 'express'
import httpStatus from 'http-status'
import { Secret } from 'jsonwebtoken'
import config from '../config'
import ApiError from '../errors/ApiError'
import { jwtHelpers } from '../helpers/jwtHelpers'

const auth =
  (...requiredRoles: string[]) =>
  async (req: Request, _res: Response, next: NextFunction) => {
    try {
      //get authorization token
      const token = req.headers.authorization
      if (!token) {
        throw new ApiError(httpStatus.UNAUTHORIZED, 'You are not authorized')
      }
      // verify token
      let verifiedUser = null

      verifiedUser = jwtHelpers.verifyToken(token, config.jwt.secret as string)

      req.user = verifiedUser

      // set guard by role
      if (requiredRoles.length && !requiredRoles.includes(verifiedUser.role)) {
        throw new ApiError(httpStatus.FORBIDDEN, 'Forbidden')
      }
      next()
    } catch (error) {
      next(error)
    }
  }

export default auth
