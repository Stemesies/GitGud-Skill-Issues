import { Account } from "./Account";
import { History } from "./History";
import { IssueStatus } from "./IssueStatus";
import { Label } from "./Label";
import { PriorityTypes } from "./PriorityTypes";

export interface Issue {
    id: number
    status: IssueStatus
    title: string
    description: string
    owner: Account
    priority: PriorityTypes

    created: number
    updated: number

    assignees: Account[]
    labels: number[]

    history: History[]
}