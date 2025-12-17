import { Component, inject, model, NgModule, OnInit } from "@angular/core";
import { Issue } from "../model/Issue";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { IssueTrackerService } from "../services/IssueTrackerService";
import { ActivatedRoute, Router } from "@angular/router";
import { IssueStatus } from "../model/IssueStatus";
import { issueRightBlockSettings } from "./IssueRightBlockSettings";

@Component({
    selector: 'issues-displayer',
    standalone: true,
    imports: [ CommonModule, FormsModule, issueRightBlockSettings],
    templateUrl: '../layout/issueDisplayer/l.html',
    styleUrls: ['../layout/issueDisplayer/l.scss']
})

export class IssueDisplayer implements OnInit {
    activatedRoute = inject(ActivatedRoute);
    router = inject(Router);
    issueId: number = 0;
    issue: Issue | undefined = undefined;

    triedToSaveWithoutName: boolean = false

    constructor(private issueTrackerService: IssueTrackerService) {
         this.issueTrackerService.load()
        this.activatedRoute.params.subscribe((params) => {
            this.issueId = params['id'];
            this.issue = this.issueTrackerService.list.find(it=>it.id == this.issueId);
            if(this.issue == undefined)
                this.router.navigate(['/'])
        });
    }

    ngOnInit(): void {
       
        
        this.load()
    }

    load() {
        
    }

    assignYourself() {

    }

    
    isOpen(): boolean {
        return this.issue?.status == IssueStatus.Open
    }

    isClosed(): boolean {
        return this.issue?.status == IssueStatus.Closed
    }

    isNotPlanned(): boolean {
        return this.issue?.status == IssueStatus.Stale
    }

    edit() {

    }
}