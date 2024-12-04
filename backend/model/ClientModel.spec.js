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
            name: "Cliente 1"
          },
          {
            id: 1,
            name: "Cliente 1"
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
          name: "Cliente 1"
        },
        {
          id: 1,
          name: "Cliente 1"
        }
      ]);
    });
  });
});
