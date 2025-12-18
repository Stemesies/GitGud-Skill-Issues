import { Account } from "./Account";
import { History } from "./History";
import { IssueStatus } from "./IssueStatus";
import { Label } from "./Label";

export interface Issue {
    id: number
    status: IssueStatus
    title: string
    description: string
    owner: Account

    created: number
    updated: number

    assignees: string[]
    labels: Label[]

    history: History[]
}