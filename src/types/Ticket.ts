export interface Ticket {
    TICKET_NUMBER: string;
    STATUS: string;
    PRIORITY: string;
    COMPANY: string;
    PROJECT: string;
    TEAM: string;
    ASSIGNED_PERSON: string;
    SERVICE: string;
    DESCRIPTION: string;
    SUBMIT_DATETIME: string; // Dates come as strings in JSON
    RESOLVED_DATETIME: string | null;
}