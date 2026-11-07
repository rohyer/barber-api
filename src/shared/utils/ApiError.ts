export class ApiError extends Error {
    readonly status: number;

    constructor(message: string, status: number) {
        super(message);

        this.name = "ApiError";
        this.status = status;
    }
}

export class BadRequestError extends ApiError {
    constructor(message = "Requisição inválida") {
        super(message, 400);
    }
}

export class UnauthorizedError extends ApiError {
    constructor(message = "Usuário não autenticado") {
        super(message, 401);
    }
}

export class ForbiddenError extends ApiError {
    constructor(message = "Sem permissão") {
        super(message, 403);
    }
}

export class NotFoundError extends ApiError {
    constructor(message = "Recurso não encontrado") {
        super(message, 404);
    }
}