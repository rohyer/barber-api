export type ClientEntityProps = {
    id?: number;
    name: string;
    sex: "M" | "F" | "Outro";
    phone: string;
    address: string;
    birth: string;
    idAdmin: number;
    createdAt?: string;
    lastCustomerServiceDate?: string | null;
};

export class ClientEntity {
    private props: ClientEntityProps;

    constructor(props: ClientEntityProps) {
        this.props = props;
    }

    get data() {
        return { ...this.props };
    }

    static createFromDatabase(row: any): ClientEntity {
        return new ClientEntity({
            id: row.id,
            name: row.name,
            sex: row.sex,
            phone: row.phone,
            address: row.address,
            birth: row.birth,
            idAdmin: row.idAdmin,
            createdAt: row.createdAt,
            lastCustomerServiceDate: row.lastCustomerServiceDate,
        });
    }

    public update(data: Pick<ClientEntityProps, "name" | "sex" | "phone" | "address" | "birth">) {
        this.props = {
            ...this.props,
            ...data,
        };
    }
}
