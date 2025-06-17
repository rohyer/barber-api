import EmployeeModel from "./employee.model.js";
import getConnectionDatabase from "../../shared/config/db.js";

jest.mock("../config/db");

describe("EmployeeModel", () => {
  describe("getEmployees", () => {
    it("Should return an array of objects", async () => {
      const mockExecute = jest.fn().mockResolvedValue([
        [
          {
            id: 1,
            name: "Guilherme R.",
            address: "Rual tal",
            sex: "M",
            phone: "(99) 99999-9999",
            birth: "1996-05-01T03:00:00.000Z",
            id_admin: 35,
          },
          {
            id: 2,
            name: "Lucas S.",
            address: "Rua tal",
            sex: "M",
            phone: "(99) 99999-9999",
            birth: "1996-05-01T03:00:00.000Z",
            id_admin: 35,
          },
        ],
      ]);

      getConnectionDatabase.mockReturnValue({ execute: mockExecute });

      const idAdmin = 35;

      const result = await EmployeeModel.getEmployees(idAdmin);

      expect(mockExecute).toHaveBeenCalledWith(
        "SELECT * FROM employee WHERE id_admin = ?",
        [idAdmin],
      );
      expect(result).toEqual([
        {
          id: 1,
          name: "Guilherme R.",
          address: "Rual tal",
          sex: "M",
          phone: "(99) 99999-9999",
          birth: "1996-05-01T03:00:00.000Z",
          id_admin: 35,
        },
        {
          id: 2,
          name: "Lucas S.",
          address: "Rua tal",
          sex: "M",
          phone: "(99) 99999-9999",
          birth: "1996-05-01T03:00:00.000Z",
          id_admin: 35,
        },
      ]);
    });
  });

  describe("getEmployeeById", () => {
    it("Should return only one data", async () => {
      const mockExecute = jest.fn().mockResolvedValue([
        [
          {
            id: 1,
            name: "Guilherme R.",
            address: "Rual tal",
            sex: "M",
            phone: "(99) 99999-9999",
            birth: "1996-05-01T03:00:00.000Z",
            id_admin: 35,
          },
        ],
      ]);

      getConnectionDatabase.mockReturnValue({ execute: mockExecute });

      const id = 1;

      const result = await EmployeeModel.getEmployeeById(id);

      expect(mockExecute).toHaveBeenCalledWith(
        "SELECT * FROM employee WHERE id = ? LIMIT 1",
        [id],
      );
      expect(mockExecute).toHaveBeenCalledTimes(1);
      expect(result).toEqual([
        {
          id: 1,
          name: "Guilherme R.",
          address: "Rual tal",
          sex: "M",
          phone: "(99) 99999-9999",
          birth: "1996-05-01T03:00:00.000Z",
          id_admin: 35,
        },
      ]);
    });
  });

  describe("setEmployee", () => {
    it("should create one employee", async () => {
      const mockExecute = jest.fn().mockResolvedValue([
        {
          fieldCount: 0,
          affectedRows: 1,
          insertId: 22,
          info: "",
          serverStatus: 2,
          warningStatus: 2,
          changedRows: 0,
        },
      ]);

      getConnectionDatabase.mockReturnValue({ execute: mockExecute });

      const name = "Guilherme R.";
      const address = "Rual tal";
      const sex = "M";
      const phone = "(99) 99999-9999";
      const birth = "2000-01-01";
      const idAdmin = 35;

      const result = await EmployeeModel.setEmployee(
        name,
        address,
        sex,
        phone,
        birth,
        idAdmin,
      );

      expect(mockExecute).toHaveBeenCalledWith(
        "INSERT INTO employee (name, address, sex, phone, birth, id_admin) VALUES (?, ?, ?, ?, ?, ?)",
        [name, address, sex, phone, birth, idAdmin],
      );
      expect(mockExecute).toHaveBeenCalledTimes(1);
      expect(result).toEqual({
        fieldCount: 0,
        affectedRows: 1,
        insertId: 22,
        info: "",
        serverStatus: 2,
        warningStatus: 2,
        changedRows: 0,
      });
    });
  });

  describe("updateEmployee", () => {
    it("should update one employee", async () => {
      const mockExecute = jest.fn().mockResolvedValue([
        {
          fieldCount: 0,
          affectedRows: 1,
          insertId: 0,
          info: "",
          serverStatus: 2,
          warningStatus: 2,
          changedRows: 0,
        },
      ]);

      getConnectionDatabase.mockReturnValue({ execute: mockExecute });

      const name = "Guilherme R.";
      const address = "Rual tal";
      const sex = "M";
      const phone = "(99) 99999-9999";
      const birth = "2000-01-01";
      const id = 1;

      const result = await EmployeeModel.updateEmployee(
        name,
        address,
        sex,
        phone,
        birth,
        id,
      );

      expect(mockExecute).toHaveBeenCalledWith(
        "UPDATE employee SET name = ?, address = ?, sex = ?, phone = ?, birth = ? WHERE id = ?",
        [name, address, sex, phone, birth, id],
      );
      expect(mockExecute).toHaveBeenCalledTimes(1);
      expect(result).toEqual({
        fieldCount: 0,
        affectedRows: 1,
        insertId: 0,
        info: "",
        serverStatus: 2,
        warningStatus: 2,
        changedRows: 0,
      });
    });
  });
});
