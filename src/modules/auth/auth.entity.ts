export type AuthEntityInput = {
    name: string;
    email: string;
    password: string;
    city: string;
    state: string;
    phone: string;
    premiumExpiresAt: Date;
};

export type AuthEntityProps = AuthEntityInput & {
    id: number;
};

export class AuthEntity {
    private props: AuthEntityProps;

    constructor(props: AuthEntityProps) {
        this.props = { ...props };
    }

    get data() {
        return { ...this.props };
    }

    static createFromDatabase(row: any): AuthEntity {
        return new AuthEntity({
            id: row.id,
            name: row.name,
            email: row.email,
            password: row.password,
            city: row.city,
            state: row.state,
            phone: row.phone,
            premiumExpiresAt: row.premiumExpiresAt,
        });
    }
}