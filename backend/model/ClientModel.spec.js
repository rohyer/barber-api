const ClientModel = require("./ClientModel");
const getDatabaseConnection = require("../config/db");

jest.mock("../config/db");

describe("ClientModel", () => {
  describe("getClients", () => {
    it("Deve retornar uma lista (array de objetos) de clientes", async () => {
      const mockExecute = jest.fn().mockResolvedValue([
        [
          {
            id: 1,
            name: "Guilherme R.",
            sex: "M",
            phone: "(84) 98105-6717",
            address: "Rua teste",
            birth: "2000-01-01",
            id_admin: 1
          },
          {
            id: 1,
            name: "Guilherme R.",
            sex: "M",
            phone: "(84) 98105-6717",
            address: "Rua teste",
            birth: "2000-01-01",
            id_admin: 1
          }
        ]
      ]);

      getDatabaseConnection.mockReturnValue({ execute: mockExecute });

      const idAdmin = 1;

      const result = await ClientModel.getClients(idAdmin);

      expect(mockExecute).toHaveBeenCalledWith(
        "SELECT * FROM client WHERE id_admin = ?",
        [idAdmin]
      );

      expect(result).toEqual([
        {
          id: 1,
          name: "Guilherme R.",
          sex: "M",
          phone: "(84) 98105-6717",
          address: "Rua teste",
          birth: "2000-01-01",
          id_admin: 1
        },
        {
          id: 1,
          name: "Guilherme R.",
          sex: "M",
          phone: "(84) 98105-6717",
          address: "Rua teste",
          birth: "2000-01-01",
          id_admin: 1
        }
      ]);
    });
  });

  describe("getClientById", () => {
    it("Should return only one object", async () => {
      const mockExecute = jest.fn().mockResolvedValue([
        [
          {
            id: 1,
            name: "Guilherme R.",
            sex: "M",
            phone: "(84) 98105-6717",
            address: "Rua teste",
            birth: "2000-01-01",
            id_admin: 1
          }
        ]
      ]);

      getDatabaseConnection.mockReturnValue({ execute: mockExecute });

      const id = 1;

      const result = await ClientModel.getClientById(id);

      expect(mockExecute).toHaveBeenCalledWith(
        "SELECT * FROM client WHERE id = ? LIMIT 1",
        [id]
      );
      expect(result).toEqual([
        {
          id: 1,
          name: "Guilherme R.",
          sex: "M",
          phone: "(84) 98105-6717",
          address: "Rua teste",
          birth: "2000-01-01",
          id_admin: 1
        }
      ]);
    });
  });
});
