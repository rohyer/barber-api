type OfferingEntityProps = {
    id: number;
    name: string;
    value: number;
    idAdmin: number;
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
            value: row.value,
            idAdmin: row.idAdmin,
        });
    }
    
}