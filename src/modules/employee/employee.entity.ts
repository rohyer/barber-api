export type EmployeeEntityProps = {
    id?: number;
    name: string;
    sex: "M" | "F" | "Outro";
    phone: string;
    address: string;
    birth: string;
    idAdmin: number;
    createdAt?: string;
    updatedAt?: string;
};

export class EmployeeEntity {
    private props: EmployeeEntityProps;

    constructor(props: EmployeeEntityProps) {
        this.props = props;
    }

    get data() {
        return { ...this.props };
    }

    static createFromDatabase(row: any): EmployeeEntity {
        return new EmployeeEntity({
            id: row.id,
            name: row.name,
            sex: row.sex,
            phone: row.phone,
            address: row.address,
            birth: row.birth,
            idAdmin: row.idAdmin,
            createdAt: row.createdAt,
            updatedAt: row.updatedAt,
        });
    }

    public update(data: Pick<EmployeeEntityProps, "name" | "sex" | "phone" | "address" | "birth">) {
        this.props = {
            ...this.props,
            ...data,
        };
    }
}
