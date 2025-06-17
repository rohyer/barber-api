import { Request as ExpressRequest } from "express";

export interface IUserPayload {
  id: number;
}

export interface AuthenticatedRequest extends ExpressRequest {
  user?: IUserPayload;
  cacheKey?: string;
}
