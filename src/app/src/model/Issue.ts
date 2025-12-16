import { IssueStatus } from "./IssueStatus";
import { Label } from "./Label";

export interface Issue {
    id: number
    status: IssueStatus
    title: String
    owner: string

    created: Date
    updated: Date

    assignees: string[]
    labels: Label[]
}