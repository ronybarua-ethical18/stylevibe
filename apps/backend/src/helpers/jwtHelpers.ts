import jwt, { JwtPayload, SignOptions } from 'jsonwebtoken'

const createToken = (
  payload: Record<string, unknown>,
  secret: string,
  expireTime: number,
): string => {
  const options: SignOptions = { expiresIn: expireTime };
  return jwt.sign(payload, secret, options)
}

const verifyToken = (token: string, secret: string): JwtPayload => {
  return jwt.verify(token, secret) as JwtPayload
}

export const jwtHelpers = {
  createToken,
  verifyToken,
}
