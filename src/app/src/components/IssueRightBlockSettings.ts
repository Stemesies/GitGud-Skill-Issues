import { Component, EventEmitter, inject, Input, OnInit, Optional, Output  } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { Issue } from "../model/Issue";
import { IssueStatus } from "../model/IssueStatus";
import { Router } from "@angular/router";
import { HistoryTypes } from "../model/HistoryTypes";
import { History } from "../model/History";
import { AccountLogger } from "../services/AccountLogger";
import { IssueTrackerService } from "../services/IssueTrackerService";
import { Observable } from "rxjs";
import { Account } from "../model/Account";

@Component({
    selector: 'issue-right-block-settings',
    standalone: true,
    imports: [CommonModule, FormsModule],
    templateUrl: '../layout/issueRightBlockSettings/l.html',
    styleUrls: ['../layout/issueRightBlockSettings/l.scss']
})

export class issueRightBlockSettings implements OnInit {
    router = inject(Router);
    
    @Input() issue!: Omit<Issue, 'id'> | Issue;
    @Input() accountLogger$!: Observable<AccountLogger>;
    @Output() select = new EventEmitter<number>();

    accountLogger: AccountLogger | undefined = undefined

    showAssigneeDropdown = false
    assigneeSearchString: string = ""
    filteredAssignees: Account[] = []
    assigneeSelected: Account[] = []
    
    constructor(private issueTrackerService: IssueTrackerService) { }

    ngOnInit(): void {
        console.log("Issue exists? ", this.issueExists())
        this.accountLogger$.subscribe((it)=> {
            this.accountLogger = it
            this.search()
            this.assigneeSelected = []
            this.issue.assignees.forEach(it=> this.assigneeSelected.push(it))
            console.log("Assignees: ", this.assigneeSelected)
        })
    }

    assigneeAddOrRemove(account: Account): void {
        if(this.assigneeSelected.includes(account))
            this.assigneeSelected = this.assigneeSelected
                .filter(it => it.username != account.username)
        else
            this.assigneeSelected.push(account)
    }

    assignYourself() {
        if(this.accountLogger?.current == undefined) {
            console.log("Not logged in")
            return;
        }
        console.log("Assigning yourself")
        
        var history: History = {
            type: HistoryTypes.Assign,
            created: Date.now(),
            owner: this.accountLogger!.current!,
            data: {
                added: [],
                removed: [],
                selfAssign: true
            }
        }
        this.assigneeSelected.push(this.accountLogger!.current!)
        this.issue!.assignees.push(this.accountLogger!.current!)
        this.issue!.history.push(history)
        this.issueTrackerService.save()
        
    }

    issueExists() {
        return (<Issue> this.issue).id !== undefined
    }

    isSelected(prof: Account) {
        return this.assigneeSelected.find(it=> it.username == prof.username)
    }

    search() {
        if(!this.assigneeSearchString.trim())
            this.filteredAssignees = this.accountLogger?.list!
        else {
            var f = this.accountLogger?.list!
                .filter(it=> it.username.includes(this.assigneeSearchString))
            this.filteredAssignees = f ? f : []
        }
    }

    assignee() {
        if(!this.showAssigneeDropdown) {
            if(this.accountLogger?.current != undefined)
                this.showAssigneeDropdown = true
            return
        }
        this.showAssigneeDropdown = false

        var added: Account[] = []
        var removed: Account[] = []

        this.assigneeSelected.forEach(neww => { 
            if(!this.issue.assignees.find(it=>it.username == neww.username)) added.push(neww)
        })
        this.issue.assignees.forEach(neww => { 
            if(!this.assigneeSelected.find(it=>it.username == neww.username)) removed.push(neww)
        })

        console.log("Added: ", added)
        console.log("Removed: ", removed)

        if(added.length != 0 || removed.length != 0) {
            var history: History = {
                type: HistoryTypes.Assign,
                created: Date.now(),
                owner: this.accountLogger!.current!,
                data: {
                    added: added,
                    removed: removed,
                    selfAssign: false
                }
            }
            this.issue!.history.push(history)
        }

        this.issue.assignees = []
        this.assigneeSelected.forEach(it=> this.issue.assignees.push(it))
        this.issueTrackerService.save()
    }
}