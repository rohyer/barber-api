// const ClientModel = require("./client.model");
// const getDatabaseConnection = require("../../config/db");

// jest.mock("../config/db");

// describe("ClientModel", () => {
//   describe("getClients", () => {
//     it("Should return an array of objects", async () => {
//       const mockExecute = jest.fn().mockResolvedValue([
//         [
//           {
//             id: 1,
//             name: "Guilherme R.",
//             sex: "M",
//             phone: "(84) 98105-6717",
//             address: "Rua teste",
//             birth: "2000-01-01",
//             id_admin: 1
//           },
//           {
//             id: 1,
//             name: "Guilherme R.",
//             sex: "M",
//             phone: "(84) 98105-6717",
//             address: "Rua teste",
//             birth: "2000-01-01",
//             id_admin: 1
//           }
//         ]
//       ]);

//       getDatabaseConnection.mockReturnValue({ execute: mockExecute });

//       const idAdmin = 1;

//       const result = await ClientModel.getClients(idAdmin);

//       expect(mockExecute).toHaveBeenCalledWith(
//         "SELECT * FROM client WHERE id_admin = ?",
//         [idAdmin]
//       );

//       expect(result).toEqual([
//         {
//           id: 1,
//           name: "Guilherme R.",
//           sex: "M",
//           phone: "(84) 98105-6717",
//           address: "Rua teste",
//           birth: "2000-01-01",
//           id_admin: 1
//         },
//         {
//           id: 1,
//           name: "Guilherme R.",
//           sex: "M",
//           phone: "(84) 98105-6717",
//           address: "Rua teste",
//           birth: "2000-01-01",
//           id_admin: 1
//         }
//       ]);
//     });
//   });

//   describe("getClientById", () => {
//     it("Should return only one object", async () => {
//       const mockExecute = jest.fn().mockResolvedValue([
//         [
//           {
//             id: 1,
//             name: "Guilherme R.",
//             sex: "M",
//             phone: "(84) 98105-6717",
//             address: "Rua teste",
//             birth: "2000-01-01",
//             id_admin: 1
//           }
//         ]
//       ]);

//       getDatabaseConnection.mockReturnValue({ execute: mockExecute });

//       const id = 1;

//       const result = await ClientModel.getClientById(id);

//       expect(mockExecute).toHaveBeenCalledWith(
//         "SELECT * FROM client WHERE id = ? LIMIT 1",
//         [id]
//       );
//       expect(result).toEqual([
//         {
//           id: 1,
//           name: "Guilherme R.",
//           sex: "M",
//           phone: "(84) 98105-6717",
//           address: "Rua teste",
//           birth: "2000-01-01",
//           id_admin: 1
//         }
//       ]);
//     });
//   });

//   describe("createClient", () => {
//     it("Should create a client", async () => {
//       const mockExecute = jest.fn().mockResolvedValue([
//         {
//           fieldCount: 0,
//           affectedRows: 1,
//           insertId: 22,
//           info: "",
//           serverStatus: 2,
//           warningStatus: 2,
//           changedRows: 0
//         }
//       ]);

//       getDatabaseConnection.mockReturnValue({ execute: mockExecute });

//       const name = "Guilherme R.";
//       const sex = "M";
//       const phone = "(84) 98105-6717";
//       const address = "Rua tal";
//       const birth = "2000-01-01";
//       const idAdmin = 1;

//       const result = await ClientModel.createClient(
//         name,
//         sex,
//         phone,
//         address,
//         birth,
//         idAdmin
//       );

//       expect(mockExecute).toHaveBeenCalledWith(
//         "INSERT INTO client (name, sex, phone, address, birth, id_admin) VALUES (?, ?, ?, ?, ?, ?)",
//         [name, sex, phone, address, birth, idAdmin]
//       );
//       expect(result).toEqual({
//         fieldCount: 0,
//         affectedRows: 1,
//         insertId: 22,
//         info: "",
//         serverStatus: 2,
//         warningStatus: 2,
//         changedRows: 0
//       });
//     });

//     it("Should throw an error if it fail", async () => {
//       const mockExecute = jest
//         .fn()
//         .mockRejectedValue(new Error("Erro no banco"));

//       getDatabaseConnection.mockReturnValue({ execute: mockExecute });

//       const name = "Guilherme R.";
//       const sex = "M";
//       const phone = "(84) 98105-6717";
//       const address = "Rua tal";
//       const birth = "2000-01-01";
//       const idAdmin = 1;

//       await expect(
//         ClientModel.createClient(name, sex, phone, address, birth, idAdmin)
//       ).rejects.toThrow("Erro no banco");

//       expect(mockExecute).toHaveBeenCalledWith(
//         "INSERT INTO client (name, sex, phone, address, birth, id_admin) VALUES (?, ?, ?, ?, ?, ?)",
//         [name, sex, phone, address, birth, idAdmin]
//       );
//     });
//   });

//   describe("updateClient", () => {
//     it("Should update a client", async () => {
//       const mockExecute = jest.fn().mockResolvedValue([
//         {
//           fieldCount: 0,
//           affectedRows: 1,
//           insertId: 0,
//           info: "",
//           serverStatus: 2,
//           warningStatus: 2,
//           changedRows: 0
//         }
//       ]);

//       getDatabaseConnection.mockReturnValue({ execute: mockExecute });

//       const name = "Guilherme R.";
//       const sex = "M";
//       const phone = "(84) 98105-6717";
//       const address = "Rua tal";
//       const birth = "2000-01-01";
//       const id = 1;

//       const result = await ClientModel.updateClient(
//         name,
//         sex,
//         phone,
//         address,
//         birth,
//         id
//       );

//       expect(mockExecute).toHaveBeenCalledWith(
//         "UPDATE client SET name = ?, sex = ?, phone = ?, address = ?, birth = ? WHERE id = ?",
//         [name, sex, phone, address, birth, id]
//       );
//       expect(result).toEqual({
//         fieldCount: 0,
//         affectedRows: 1,
//         insertId: 0,
//         info: "",
//         serverStatus: 2,
//         warningStatus: 2,
//         changedRows: 0
//       });
//     });
//   });
// });
