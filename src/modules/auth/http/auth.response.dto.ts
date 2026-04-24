export type LoginResponse = {
    token: string;
    data: {
        id: number;
        name: string;
        email: string;
        city: string;
        state: string;
        phone: string;
    };
};
