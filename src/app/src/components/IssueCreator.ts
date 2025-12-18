import { AfterViewInit, Component, inject, model, NgModule, OnInit, ViewChild } from "@angular/core";
import { Issue } from "../model/Issue";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { IssueTrackerService } from "../services/IssueTrackerService";
import { ActivatedRoute, Router } from "@angular/router";
import { IssueStatus } from "../model/IssueStatus";
import { issueRightBlockSettings } from "./IssueRightBlockSettings";
import { GitGudHeader } from "./GitGudHeader";
import { Account } from "../model/Account";

@Component({
    selector: 'issues-list',
    standalone: true,
    imports: [ CommonModule, FormsModule, issueRightBlockSettings, GitGudHeader ],
    templateUrl: '../layout/newIssue/l.html',
    styleUrls: ['../layout/newIssue/l.scss']
})

export class IssueCreator implements OnInit, AfterViewInit {
    router = inject(Router);

    account: Account | undefined = undefined
    @ViewChild(GitGudHeader) ggHeader!: GitGudHeader;
    
    issue: Omit<Issue, 'id'> = {
        status: IssueStatus.Open,
        title: "",
        description: "",
        owner: { pfp:"", username:""},
        created: Date.now(),
        updated: Date.now(),
        assignees: [],
        labels: [],
        history: []
    };

     ngAfterViewInit(): void {
        this.ggHeader.accountLogger.current$
            .subscribe( (it)=> {
                
                console.log("IssueCreator: account updated: " + it)
                this.account = it
            })

        this.account = this.ggHeader.accountLogger.current;
    }

    triedToSaveWithoutName: boolean = false

    constructor(private issueTrackerService: IssueTrackerService) {}

    ngOnInit(): void {
        this.issueTrackerService.load()
        this.load()
    }

    load() {
        
    }

    


    dismiss() {
        this.router.navigate(['/'])
    }

    create() {
        if(this.issue.title == "") {
            this.triedToSaveWithoutName = true
            return;
        }
        if(this.account == undefined)
            return;
        this.issue.owner = this.account;
        var id = this.issueTrackerService.addItem(this.issue)
        this.router.navigate(['/', id.toString()])
    }
}