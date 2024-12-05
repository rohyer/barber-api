const CustomerServiceModel = require("./CustomerServiceModel");
const getConnectionDatabase = require("../config/db");

jest.mock("../config/db");

describe("CustomerServicModel", () => {
  describe("getCustomerServices", () => {
    it("Should return an array of object with data", async () => {
      const mockExecute = jest.fn().mockResolvedValue([
        [
          {
            id: 2,
            date: "2024-12-10T03:00:00.000Z",
            time: "14:00:00",
            status: "open",
            id_service: 1,
            id_client: 1,
            id_employee: 5,
            id_admin: 1,
            created_at: "2024-12-05T14:21:00.000Z",
            updated_at: "2024-12-05T14:21:00.000Z"
          },
          {
            id: 2,
            date: "2024-12-10T03:00:00.000Z",
            time: "14:00:00",
            status: "open",
            id_service: 1,
            id_client: 1,
            id_employee: 5,
            id_admin: 1,
            created_at: "2024-12-05T14:21:00.000Z",
            updated_at: "2024-12-05T14:21:00.000Z"
          }
        ]
      ]);

      getConnectionDatabase.mockReturnValue({ execute: mockExecute });

      const idAdmin = 1;

      const result = await CustomerServiceModel.getCustomerServices(idAdmin);

      expect(mockExecute).toHaveBeenCalledWith(
        "SELECT * FROM customer_service WHERE id_admin = ?",
        [idAdmin]
      );
      expect(result).toEqual([
        {
          id: 2,
          date: "2024-12-10T03:00:00.000Z",
          time: "14:00:00",
          status: "open",
          id_service: 1,
          id_client: 1,
          id_employee: 5,
          id_admin: 1,
          created_at: "2024-12-05T14:21:00.000Z",
          updated_at: "2024-12-05T14:21:00.000Z"
        },
        {
          id: 2,
          date: "2024-12-10T03:00:00.000Z",
          time: "14:00:00",
          status: "open",
          id_service: 1,
          id_client: 1,
          id_employee: 5,
          id_admin: 1,
          created_at: "2024-12-05T14:21:00.000Z",
          updated_at: "2024-12-05T14:21:00.000Z"
        }
      ]);
    });
  });

  describe("getCustomerServiceById", () => {
    it("Should return only one data", async () => {
      const mockExecute = jest.fn().mockResolvedValue([
        [
          {
            id: 2,
            date: "2024-12-10T03:00:00.000Z",
            time: "14:00:00",
            status: "open",
            id_service: 1,
            id_client: 1,
            id_employee: 5,
            id_admin: 1,
            created_at: "2024-12-05T14:21:00.000Z",
            updated_at: "2024-12-05T14:21:00.000Z"
          }
        ]
      ]);

      getConnectionDatabase.mockReturnValue({ execute: mockExecute });

      const id = 1;

      const result = await CustomerServiceModel.getCustomerServiceById(id);

      expect(mockExecute).toHaveBeenCalledWith(
        "SELECT * FROM customer_service WHERE id = ? LIMIT 1",
        [id]
      );
      expect(mockExecute).toHaveBeenCalledTimes(1);
      expect(result).toEqual([
        {
          id: 2,
          date: "2024-12-10T03:00:00.000Z",
          time: "14:00:00",
          status: "open",
          id_service: 1,
          id_client: 1,
          id_employee: 5,
          id_admin: 1,
          created_at: "2024-12-05T14:21:00.000Z",
          updated_at: "2024-12-05T14:21:00.000Z"
        }
      ]);
    });
  });

  describe("createCustomerService", () => {
    it("should create one customer service", async () => {
      const mockExecute = jest.fn().mockResolvedValue([
        {
          fieldCount: 0,
          affectedRows: 1,
          insertId: 5,
          info: "",
          serverStatus: 2,
          warningStatus: 0,
          changedRows: 0
        }
      ]);

      getConnectionDatabase.mockReturnValue({ execute: mockExecute });

      const date = "2024-12-10";
      const time = "14:00:00";
      const idService = 1;
      const idClient = 1;
      const idEmployee = 5;
      const idAdmin = 1;

      const result = await CustomerServiceModel.createCustomerService(
        date,
        time,
        idService,
        idClient,
        idEmployee,
        idAdmin
      );

      expect(mockExecute).toHaveBeenCalledWith(
        "INSERT INTO customer_service (date, time, id_service, id_client, id_employee, id_admin) VALUES (?, ?, ?, ?, ?, ?)",
        [date, time, idService, idClient, idEmployee, idAdmin]
      );
      expect(result).toEqual({
        fieldCount: 0,
        affectedRows: 1,
        insertId: 5,
        info: "",
        serverStatus: 2,
        warningStatus: 0,
        changedRows: 0
      });
    });
  });

  describe("updateCustomerService", () => {
    it("should update one customer service", async () => {
      const mockExecute = jest.fn().mockResolvedValue([
        {
          fieldCount: 0,
          affectedRows: 1,
          insertId: 0,
          info: "Rows matched: 1  Changed: 0  Warnings: 0",
          serverStatus: 2,
          warningStatus: 0,
          changedRows: 0
        }
      ]);

      getConnectionDatabase.mockReturnValue({ execute: mockExecute });

      const date = "2024-12-10";
      const time = "14:00:00";
      const status = "open";
      const idService = 1;
      const idEmployee = 5;
      const id = 1;

      const result = await CustomerServiceModel.updateCustomerService(
        date,
        time,
        status,
        idService,
        idEmployee,
        id
      );

      expect(mockExecute).toHaveBeenCalledWith(
        "UPDATE customer_service SET date = ?, time = ?, status = ?, id_service = ?, id_employee = ? WHERE id = ?",
        [date, time, status, idService, idEmployee, id]
      );
      expect(result).toEqual({
        fieldCount: 0,
        affectedRows: 1,
        insertId: 0,
        info: "Rows matched: 1  Changed: 0  Warnings: 0",
        serverStatus: 2,
        warningStatus: 0,
        changedRows: 0
      });
    });
  });
});
