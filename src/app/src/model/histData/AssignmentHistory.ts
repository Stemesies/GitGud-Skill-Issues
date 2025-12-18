import { Account } from "../Account";

export interface AssignmentHistory {
    added: Account[]
    removed: Account[]
    selfAssign: boolean
}