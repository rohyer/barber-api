export type CreateError = {
    name: string;
    message: string;
    status: number;
};

export const createError = (error: CreateError): CreateError => {
    const { name, message, status } = error;

    return { name, message, status };
};
