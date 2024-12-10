const ServiceModel = require("./serviceModel");
const getDatabaseConnection = require("../config/db");

jest.mock("../config/db");

describe("ServiceModel", () => {
  describe("createService", () => {
    it("should create a service", async () => {
      const mockExecute = jest.fn().mockResolvedValue([
        {
          fieldCount: 0,
          affectedRows: 1,
          insertId: 22,
          info: "",
          serverStatus: 2,
          warningStatus: 2,
          changedRows: 0
        }
      ]);

      const name = "Corte de cabelo";
      const value = 50.0;
      const idAdmin = 1;

      getDatabaseConnection.mockReturnValue({ execute: mockExecute });

      const result = await ServiceModel.createService(name, value, idAdmin);

      expect(mockExecute).toHaveBeenCalledWith(
        "INSERT INTO service (name, value, id_admin) VALUES (?, ?, ?)",
        [name, value, idAdmin]
      );
      expect(result).toEqual({
        fieldCount: 0,
        affectedRows: 1,
        insertId: 22,
        info: "",
        serverStatus: 2,
        warningStatus: 2,
        changedRows: 0
      });
    });
  });

  describe("getServices", () => {
    it("should return an array of objects", async () => {
      const mockExecute = jest.fn().mockResolvedValue([
        [
          {
            id: 1,
            name: "Corte de cabelo 100",
            value: "50.00",
            id_admin: 1,
            created_at: "2024-12-05T14:21:57.000Z",
            updated_at: "2024-12-05T14:21:57.000Z"
          },
          {
            id: 1,
            name: "Corte de cabelo 100",
            value: "50.00",
            id_admin: 1,
            created_at: "2024-12-05T14:21:57.000Z",
            updated_at: "2024-12-05T14:21:57.000Z"
          }
        ]
      ]);

      getDatabaseConnection.mockReturnValue({ execute: mockExecute });

      const idAdmin = 1;

      const result = await ServiceModel.getServices(idAdmin);

      expect(mockExecute).toHaveBeenCalledWith(
        "SELECT * FROM service WHERE id_admin = ?",
        [idAdmin]
      );
      expect(result).toEqual([
        {
          id: 1,
          name: "Corte de cabelo 100",
          value: "50.00",
          id_admin: 1,
          created_at: "2024-12-05T14:21:57.000Z",
          updated_at: "2024-12-05T14:21:57.000Z"
        },
        {
          id: 1,
          name: "Corte de cabelo 100",
          value: "50.00",
          id_admin: 1,
          created_at: "2024-12-05T14:21:57.000Z",
          updated_at: "2024-12-05T14:21:57.000Z"
        }
      ]);
    });
  });

  describe("updateService", () => {
    it("should update a service", async () => {
      const mockExecute = jest.fn().mockResolvedValue([
        {
          fieldCount: 0,
          affectedRows: 1,
          insertId: 0,
          info: "",
          serverStatus: 2,
          warningStatus: 2,
          changedRows: 0
        }
      ]);

      getDatabaseConnection.mockReturnValue({ execute: mockExecute });

      const name = "Corte de cabelo";
      const value = 50.0;
      const id = 1;

      const result = await ServiceModel.updateService(name, value, id);

      expect(mockExecute).toHaveBeenCalledWith(
        "UPDATE service SET name = ?, value = ? WHERE id = ? LIMIT 1",
        [name, value, id]
      );
      expect(result).toEqual({
        fieldCount: 0,
        affectedRows: 1,
        insertId: 0,
        info: "",
        serverStatus: 2,
        warningStatus: 2,
        changedRows: 0
      });
    });
  });

  describe("deleteService", () => {
    it("should delete a service", async () => {
      const mockExecute = jest.fn().mockResolvedValue([
        {
          fieldCount: 0,
          affectedRows: 1,
          insertId: 0,
          info: "",
          serverStatus: 2,
          warningStatus: 0,
          changedRows: 0
        }
      ]);

      getDatabaseConnection.mockReturnValue({ execute: mockExecute });

      const id = 1;

      const result = await ServiceModel.deleteService(id);

      expect(mockExecute).toHaveBeenCalledWith(
        "DELETE FROM service WHERE id = ?",
        [id]
      );
      expect(mockExecute).toHaveBeenCalledTimes(1);
      expect(result).toEqual({
        fieldCount: 0,
        affectedRows: 1,
        insertId: 0,
        info: "",
        serverStatus: 2,
        warningStatus: 0,
        changedRows: 0
      });
    });
  });
});
