type employee = {
    id: number;
    name: string;
};

export type OfferingEntityProps = {
    id?: number;
    name: string;
    value: number;
    duration: number;
    idAdmin?: number;
    idEmployees?: number[];
    employees?: employee[];
};

export class OfferingEntity {
    private props: OfferingEntityProps;

    constructor(props: OfferingEntityProps) {
        this.props = { ...props };
    }

    get data() {
        return { ...this.props };
    }

    static createFromDatabase(row: any): OfferingEntity {
        return new OfferingEntity({
            id: row.id,
            name: row.name,
            value: Number(row.value),
            duration: row.duration,
            idAdmin: row.idAdmin,
            employees: row.employees,
        });
    }

    public update(data: Pick<OfferingEntityProps, "name" | "value" | "duration">) {
        this.props = {
            ...this.props,
            ...data,
        };
    }
}