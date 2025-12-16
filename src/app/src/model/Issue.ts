import { IssueStatus } from "./IssueStatus";
import { Label } from "./Label";

export interface Issue {
    id: number
    status: IssueStatus
    title: string
    description: string
    owner: string

    created: number
    updated: number

    assignees: string[]
    labels: Label[]
}