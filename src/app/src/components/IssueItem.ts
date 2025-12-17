import { Component, EventEmitter, inject, Input, Optional, Output  } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { Issue } from "../model/Issue";
import { IssueStatus } from "../model/IssueStatus";
import { Router } from "@angular/router";
import { GitGudHeader } from "./GitGudHeader";

@Component({
    selector: 'issue-item',
    standalone: true,
    imports: [CommonModule, FormsModule],
    templateUrl: '../layout/item/l.html',
    styleUrls: ['../layout/item/l.scss']
})

export class IssueItem {
    router = inject(Router);
    
    @Input() item!: Issue;
    @Output() select = new EventEmitter<number>();


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
}