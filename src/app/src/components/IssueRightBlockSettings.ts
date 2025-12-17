import { Component, EventEmitter, inject, Input, Optional, Output  } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { Issue } from "../model/Issue";
import { IssueStatus } from "../model/IssueStatus";
import { Router } from "@angular/router";

@Component({
    selector: 'issue-right-block-settings',
    standalone: true,
    imports: [CommonModule, FormsModule],
    templateUrl: '../layout/issueRightBlockSettings/l.html',
    styleUrls: ['../layout/issueRightBlockSettings/l.scss']
})

export class issueRightBlockSettings {
    router = inject(Router);
    
    @Input() issue!: Omit<Issue, 'id'> | Issue;
    @Output() select = new EventEmitter<number>();

    assignYourself() {

    }
}