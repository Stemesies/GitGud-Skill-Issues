import { Component, CUSTOM_ELEMENTS_SCHEMA, Input } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { History } from "../model/History";
import { HistoryTypes } from "../model/HistoryTypes";
import RelativeTimeElement from "@github/relative-time-element";
import { CommentHistory } from "../model/histData/CommentHistory";
import { ClosureHistory } from "../model/histData/ClosureHistory";
import { IssueStatus } from "../model/IssueStatus";
import { AssignmentHistory } from "../model/histData/AssignmentHistory";
import { RenameHistory } from "../model/histData/RenameHistory";
import { PriorityHistory } from "../model/histData/PriorityHistory";
import { PriorityTypes } from "../model/PriorityTypes";
import { LabelHistory } from "../model/histData/LabelHistory";
import { LabelService } from "../services/LabelService";
import { LabelElement } from "./LabelElement";

@Component({
    selector: 'history-item',
    standalone: true,
    imports: [CommonModule, FormsModule, LabelElement],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
    templateUrl: '../layout/hist-item/l.html',
    styleUrls: ['../layout/hist-item/l.scss']
})

export class HistoryItem {
    
    @Input() item!: History;
    @Input() labelService!: LabelService;

    getDatetime() {
        return new Date(this.item.created).toISOString()
    }

    isComment() {
        return this.item.type == HistoryTypes.Comment
    }

    dataAsCommentHistory() {
        return this.item.data as CommentHistory
    }
    
    isClosure() {
        return this.item.type == HistoryTypes.Closure
    }
    dataAsClosureHistory() {
        return this.item.data as ClosureHistory
    }

    isClosureHistoryClosed() {
        return this.isClosure() && this.dataAsClosureHistory().newStatus == IssueStatus.Closed
    }
    isClosureHistoryStaled() {
        return this.isClosure() && this.dataAsClosureHistory().newStatus == IssueStatus.Stale
    }
    isClosureHistoryReopened() {
        return this.isClosure() && this.dataAsClosureHistory().newStatus == IssueStatus.Open
    }

    isAssignee() {
        return this.item.type == HistoryTypes.Assign
    }
    dataAsAssigneeHistory() {
        return this.item.data as AssignmentHistory
    }

    isRename() {
        return this.item.type == HistoryTypes.Rename
    }
    dataAsRenameHistory() {
        return this.item.data as RenameHistory
    }

    isPriority() {
        return this.item.type == HistoryTypes.Priority
    }
    dataAsPriorityHistory() {
        return this.item.data as PriorityHistory
    }
    getPriorityString() {
        return PriorityTypes[this.dataAsPriorityHistory().newPriority]
    }

    isLabel() {
        return this.item.type == HistoryTypes.Label
    }
    dataAsLabelHistory() {
        return this.item.data as LabelHistory
    }

    getAddedLabels() {
        return this.labelService.getLabels(this.dataAsLabelHistory().added)
    }

    getRemovedLabels() {
        return this.labelService.getLabels(this.dataAsLabelHistory().removed)
    }


}