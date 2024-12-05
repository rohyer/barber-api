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
});
