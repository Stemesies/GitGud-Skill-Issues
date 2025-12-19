import { Component, EventEmitter, inject, Input, OnInit, Optional, Output  } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { Issue } from "../model/Issue";
import { IssueStatus } from "../model/IssueStatus";
import { Router } from "@angular/router";
import { HistoryTypes } from "../model/HistoryTypes";
import { History } from "../model/History";
import { LabelService } from "../services/LabelService";
import { LabelElement } from "./LabelElement";
import { PriorityTypes } from "../model/PriorityTypes";

@Component({
    selector: 'issue-item',
    standalone: true,
    imports: [CommonModule, FormsModule, LabelElement],
    templateUrl: '../layout/item/l.html',
    styleUrls: ['../layout/item/l.scss']
})

export class IssueItem implements OnInit {
    router = inject(Router);
    
    isSelected = false

    @Input() labelService!: LabelService;
    @Input() item!: Issue;
    @Output() select = new EventEmitter<number>();

    comments: History[] = []

    ngOnInit() {
        var a = this.item.history.filter(it=>it.type == HistoryTypes.Comment)
        this.comments = a? a : []
    }

    isOpen(): boolean {
        return this.item.status == IssueStatus.Open
    }

    isClosed(): boolean {
        return this.item.status == IssueStatus.Closed
    }

    isNotPlanned(): boolean {
        return this.item.status == IssueStatus.Stale
    }

    gotoIssue() {
        this.router.navigate(['/', this.item.id.toString()])
    }

    getPriority() {
        return PriorityTypes[this.item.priority]
    }
}