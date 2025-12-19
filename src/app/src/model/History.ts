import { Account } from "./Account";
import { AssignmentHistory } from "./histData/AssignmentHistory";
import { ClosureHistory } from "./histData/ClosureHistory";
import { CommentHistory } from "./histData/CommentHistory";
import { PriorityHistory } from "./histData/PriorityHistory";
import { RenameHistory } from "./histData/RenameHistory";
import { HistoryTypes } from "./HistoryTypes";

export interface History {
    type: HistoryTypes
    created: number
    owner: Account

    data: CommentHistory | ClosureHistory | AssignmentHistory | RenameHistory | PriorityHistory
}