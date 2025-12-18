import { Account } from "./Account";
import { ClosureHistory } from "./histData/ClosureHistory";
import { CommentHistory } from "./histData/CommentHistory";
import { HistoryTypes } from "./HistoryTypes";

export interface History {
    type: HistoryTypes
    created: number
    owner: Account

    data: CommentHistory | ClosureHistory
}