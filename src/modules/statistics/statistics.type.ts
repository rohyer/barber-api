export interface IStatisticsParams {
    id: number;
    status: "closed";
    date: string;
}

export interface IServicesStatistics {
    amountByService: number;
    services: string;
}

export interface IEmployeesStatistics {
    amountByEmployees: number;
    employees: string;
}

export interface IClientsStatistics {
    amountByClients: number;
    employees: string;
}

export type IDateStatistics = number;

export interface IMonthsStatistics {
    month: number;
    amountByMonth: number;
}

export interface IAllStatistics {
    customerServicesByServices: IServicesStatistics[];
    customerServicesByEmployees: IEmployeesStatistics[];
    customerServicesByClients: IClientsStatistics[];
    customerServicesByDate: IDateStatistics;
}

export interface IAllStatisticsParams {
    id: number;
    month: number;
    year: number;
}
