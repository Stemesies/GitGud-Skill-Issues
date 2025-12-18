import { AfterViewInit, ChangeDetectorRef, Component, computed, inject, model, NgModule, OnInit, Signal, ViewChild, viewChild } from "@angular/core";
import { Issue } from "../model/Issue";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { IssueTrackerService } from "../services/IssueTrackerService";
import { ActivatedRoute, Router } from "@angular/router";
import { IssueStatus } from "../model/IssueStatus";
import { issueRightBlockSettings } from "./IssueRightBlockSettings";
import { GitGudHeader } from "./GitGudHeader";
import { Account } from "../model/Account";
import { History } from "../model/History";
import { HistoryTypes } from "../model/HistoryTypes";
import { HistoryItem } from "./HistoryItem";
import { Observable, Subject } from "rxjs";
import { AccountLogger } from "../services/AccountLogger";

@Component({
    selector: 'issues-displayer',
    standalone: true,
    imports: [CommonModule, FormsModule, issueRightBlockSettings, GitGudHeader, HistoryItem],
    templateUrl: '../layout/issueDisplayer/l.html',
    styleUrls: ['../layout/issueDisplayer/l.scss']
})

export class IssueDisplayer implements AfterViewInit {
    activatedRoute = inject(ActivatedRoute);
    router = inject(Router);
    issueId: number = 0;
    issue: Issue | undefined = undefined;
    account: Account | undefined = undefined
    private accountSubject: Subject<AccountLogger> = new Subject()
    accountLogger$: Observable<AccountLogger> = this.accountSubject.asObservable()
    comment: string = ""

    renaming = false
    newName = ""

    closureDropdownShow = false
    closureType: 'close' | 'reopen' | 'wontfix' = 'close'

    triedToSaveWithoutName: boolean = false

    @ViewChild(GitGudHeader) ggHeader!: GitGudHeader;

    constructor(private issueTrackerService: IssueTrackerService, private changeDetectorRef: ChangeDetectorRef) {
        this.issueTrackerService.load()
        this.activatedRoute.params.subscribe((params) => {
            this.issueId = params['id'];
            this.issue = this.issueTrackerService.list.find(it=>it.id == this.issueId);
            if(this.issue == undefined) {
                console.log("no")
                this.router.navigate(['/'])
                return;
            }

            this.closureType = this.issue.status == IssueStatus.Open? 'close' : 'reopen'
            this.newName = this.issue.title

        });
    }

    ngAfterViewInit(): void {
        this.ggHeader.accountLogger.current$
            .subscribe( (it)=> {
                
                console.log("IssueDisplayer: account updated: ", it)
                this.account = it
            })

        this.account = this.ggHeader.accountLogger.current;
        this.accountSubject.next(this.ggHeader.accountLogger)
        this.changeDetectorRef.detectChanges()
            
    }

    cancelEditing() {
        this.triedToSaveWithoutName = false
        this.renaming = false
        this.newName = this.issue!.title
    }

    rename() {
        if(!this.newName.trim()) {
            this.triedToSaveWithoutName = true
            return
        }
        if(this.newName == this.issue?.title) {
            this.renaming = false
            return
        }

        console.log("Renaming to " + this.issue)
        var history: History = {
            type: HistoryTypes.Rename,
            created: Date.now(),
            owner: this.account!,
            data: {
                oldName: this.issue!.title,
                newName: this.newName
            }
        }
        this.issue!.history.push(history)
        this.issue!.title = this.newName;
        this.issueTrackerService.save()
        this.renaming = false
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

    postComment() {
        console.log("Commenting to " + this.issue)
        var history: History = {
            type: HistoryTypes.Comment,
            created: Date.now(),
            owner: this.account!,
            data: {
                content: this.comment
            }
        }
        this.issue!.history.push(history)
        this.comment = ""
        this.issueTrackerService.save()
    }

    closeIssue() {
        if(this.comment.trim() != "")
            this.postComment()

        var newStatus = IssueStatus.Closed;
        if(this.closureType == 'wontfix')
            newStatus = IssueStatus.Stale;
        else if(this.closureType == 'reopen')
            newStatus = IssueStatus.Open;

        console.log("Closing issue: " + newStatus.toString())

        var history: History = {
            type: HistoryTypes.Closure,
            created: Date.now(),
            owner: this.account!,
            data: {
                newStatus: newStatus
            }
        }
        this.issue!.status = newStatus
        this.issue!.history.push(history)
        this.issueTrackerService.save()

        this.closureType = this.issue!.status == IssueStatus.Open? 'close' : 'reopen'
    }
}