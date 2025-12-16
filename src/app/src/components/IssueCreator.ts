import { Component, inject, model, NgModule, OnInit } from "@angular/core";
import { Issue } from "../model/Issue";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { IssueTrackerService } from "../services/IssueTrackerService";
import { ActivatedRoute, Router } from "@angular/router";
import { IssueStatus } from "../model/IssueStatus";

@Component({
    selector: 'issues-list',
    standalone: true,
    imports: [ CommonModule, FormsModule ],
    templateUrl: '../layout/newIssue/l.html',
    styleUrls: ['../layout/newIssue/l.scss']
})

export class IssueCreator implements OnInit {
    router = inject(Router);
    
    issue: Omit<Issue, 'id'> = {
        status: IssueStatus.Open,
        title: "",
        description: "",
        owner: "Stemie",
        created: Date.now(),
        updated: Date.now(),
        assignees: [],
        labels: []
    };

    triedToSaveWithoutName: boolean = false

    constructor(private issueTrackerService: IssueTrackerService) {}

    ngOnInit(): void {
        this.issueTrackerService.load()
        this.load()
    }

    load() {
        
    }

    assignYourself() {

    }

    create() {
        if(this.issue.title == "") {
            this.triedToSaveWithoutName = true
            return;
        }
        this.issueTrackerService.addItem(this.issue)
        this.router.navigate(['/'])
    }
}