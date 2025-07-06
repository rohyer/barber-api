export interface IEmployee {
    id: number;
    name: string;
    address: string;
    sex: "M" | "F" | "Outro";
    phone: string;
    birth: string;
    idAdmin: number | null;
}
