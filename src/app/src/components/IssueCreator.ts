import { AfterViewInit, ChangeDetectorRef, Component, inject, model, NgModule, OnInit, ViewChild } from "@angular/core";
import { Issue } from "../model/Issue";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { IssueTrackerService } from "../services/IssueTrackerService";
import { ActivatedRoute, Router } from "@angular/router";
import { IssueStatus } from "../model/IssueStatus";
import { issueRightBlockSettings } from "./IssueRightBlockSettings";
import { GitGudHeader } from "./GitGudHeader";
import { Account } from "../model/Account";
import { Subject, Observable } from "rxjs";
import { AccountLogger } from "../services/AccountLogger";
import { PriorityTypes } from "../model/PriorityTypes";
import { Toast } from "./Toast";
import { ToastService } from "../services/ToastService";

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
    private accountSubject: Subject<AccountLogger> = new Subject()
    accountLogger$: Observable<AccountLogger> = this.accountSubject.asObservable()

    createMore = false
    
    issue: Omit<Issue, 'id'> = {
        status: IssueStatus.Open,
        title: "",
        description: "",
        owner: { pfp:"", username:""},
        created: Date.now(),
        updated: Date.now(),
        priority: PriorityTypes.Average,
        assignees: [],
        labels: [],
        history: []
    };

     ngAfterViewInit(): void {
        this.ggHeader.accountLogger.current$
            .subscribe( (it)=> {
                
                console.log("IssueCreator: account updated: ", it)
                this.account = it
            })

        
        this.account = this.ggHeader.accountLogger.current;
        console.log("IssueCreator: current account: ", this.account)
        this.accountSubject.next(this.ggHeader.accountLogger)
        this.changeDetectorRef.detectChanges()
    }

    triedToSaveWithoutName: boolean = false

    issueTrackerService: IssueTrackerService
    constructor(issueTrackerService: IssueTrackerService, private changeDetectorRef: ChangeDetectorRef, private toastService: ToastService) {
        this.issueTrackerService = issueTrackerService
    }

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
        if(this.account == undefined) {
            this.toastService.showToast("You are not logged in")
            return;
        }
        
        if(this.issue.title == "") {
            this.triedToSaveWithoutName = true
            return;
        }
        
        
        this.issue.owner = this.account;
        this.issue.created = Date.now();

        this.issue.history.forEach(it=>it.created=Date.now())

        var id = this.issueTrackerService.addItem(this.issue)
        if(this.createMore) {
            this.issue = {
                status: IssueStatus.Open,
                title: "",
                description: "",
                owner: { pfp:"", username:""},
                created: Date.now(),
                updated: Date.now(),
                priority: PriorityTypes.Average,
                assignees: [],
                labels: [],
                history: []
            }; 
        } else {
            this.router.navigate(['/', id.toString()])
        }
    }
}