export interface IClientModel {
  id: number;
  name: string;
  sex: "M" | "F" | "Outro";
  phone: string;
  address: string;
  birth: string;
  idAdmin: number;
}
