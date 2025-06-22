import { RowDataPacket } from "mysql2";
import getDatabaseConnection from "../../shared/config/db.js";
import { formatMonthYearForLike } from "./statistics.helper.js";
import {
  IAllStatistics,
  IServicesStatistics,
  IEmployeesStatistics,
  IClientsStatistics,
  IDateStatistics,
  IStatisticsParams,
  IAllStatisticsParams,
} from "./statistics.type.js";

const getCustomerServicesByServices = async ({
  id,
  status,
  date,
}: IStatisticsParams): Promise<IServicesStatistics[]> => {
  const db = getDatabaseConnection();

  const [result] = await db.execute<RowDataPacket[]>(
    "SELECT count(*) as amountByService, s.name as service FROM customer_service cs JOIN service s ON cs.id_service = s.id WHERE cs.id_admin = ? AND cs.status = ? AND cs.date LIKE ? GROUP BY s.name",
    [id, status, date],
  );

  return result as IServicesStatistics[];
};

const getCustomerServicesByEmployees = async ({
  id,
  status,
  date,
}: IStatisticsParams): Promise<IEmployeesStatistics[]> => {
  const db = getDatabaseConnection();

  const [result] = await db.execute<RowDataPacket[]>(
    "SELECT count(*) as amountByEmployee, e.name as employee FROM customer_service cs JOIN employee e ON cs.id_employee = e.id WHERE cs.id_admin = ? AND status = ? AND cs.date LIKE ? GROUP BY e.name",
    [id, status, date],
  );

  return result as IEmployeesStatistics[];
};

const getCustomerServicesByClients = async ({
  id,
  status,
  date,
}: IStatisticsParams): Promise<IClientsStatistics[]> => {
  const db = getDatabaseConnection();

  const [result] = await db.execute<RowDataPacket[]>(
    "SELECT count(*) as amount_by_employee, c.name as client FROM customer_service cs JOIN client c ON cs.id_client = c.id WHERE cs.id_admin = ? AND status = ? AND cs.date Like ? GROUP BY c.name",
    [id, status, date],
  );

  return result as IClientsStatistics[];
};

const getCustomerServicesByDate = async ({
  id,
  status,
  date,
}: IStatisticsParams): Promise<IDateStatistics> => {
  const db = getDatabaseConnection();

  const [result] = await db.execute<RowDataPacket[]>(
    "SELECT count(*) as amount FROM customer_service WHERE id_admin = ? AND date LIKE ? AND status = ?",
    [id, date, status],
  );

  return result[0].amount as IDateStatistics;
};

export const getAllStatistics = async ({
  id,
  month = new Date().getMonth() + 1,
  year = new Date().getFullYear(),
}: IAllStatisticsParams): Promise<IAllStatistics> => {
  const status = "closed";

  const date = formatMonthYearForLike(month, year);

  const customerServicesByServicesPromise = getCustomerServicesByServices({
    id,
    status,
    date,
  });

  const customerServicesByEmployeesPromise = getCustomerServicesByEmployees({
    id,
    status,
    date,
  });

  const customerServicesByClientsPromise = getCustomerServicesByClients({
    id,
    status,
    date,
  });

  const customerServicesByDatePromise = getCustomerServicesByDate({
    id,
    status,
    date,
  });

  const [
    customerServicesByServices,
    customerServicesByEmployees,
    customerServicesByClients,
    customerServicesByDate,
  ] = await Promise.all([
    customerServicesByServicesPromise,
    customerServicesByEmployeesPromise,
    customerServicesByClientsPromise,
    customerServicesByDatePromise,
  ]);

  const statistics = {
    customerServicesByServices,
    customerServicesByEmployees,
    customerServicesByClients,
    customerServicesByDate,
  };

  return statistics;
};
