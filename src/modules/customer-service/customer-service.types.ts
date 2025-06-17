export interface ICustomerServices {
  id: number;
  date: string;
  time: string;
  status: "open" | "closed";
  idService: number | null;
  idClient: number | null;
  idEmployee: number | null;
  idAdmin: number | null;
}
