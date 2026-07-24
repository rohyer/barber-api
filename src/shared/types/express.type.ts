import { Request as ExpressRequest } from "express";
import { ParamsDictionary } from "express-serve-static-core";

export interface IUserPayload {
    id: number;
}

export interface AuthenticatedRequest<
    Params = ParamsDictionary,
    ResBody = any,
    ReqBody = any,
    ReqQuery = any,
> extends ExpressRequest<Params, ResBody, ReqBody, ReqQuery> {
    user?: IUserPayload;
    cacheKey?: string;
}
