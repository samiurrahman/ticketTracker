export interface ITicket {
    Id: number;
    Description: string;
    Type: number;
    Status: number;
}
export enum TaskStatus {
    COMPLETED = 1,
    IN_PROGRESS = 2,
    NOT_STARTED = 3
}
export interface ITicketCategory {
    tasks: ITicket[];
    bugs: ITicket[];
    completed: ITicket[];
    in_progress: ITicket[];
    not_started: ITicket[];
}
export enum TicketType {
    TASK = 1,
    BUG = 2
}
