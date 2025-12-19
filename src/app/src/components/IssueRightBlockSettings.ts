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
import { IssueLogger } from "../services/IssueLogger";
import { PriorityTypes } from "../model/PriorityTypes";

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

    showPriorityPropdown = false
    selectedPriority: string = "Average"

    showDeletionConfirmation = false
    
    constructor(private issueTrackerService: IssueTrackerService, private issueLogger: IssueLogger) {
        issueLogger.link(issueTrackerService)
     }

    ngOnInit(): void {
        console.log("Issue exists? ", this.issueExists())
        this.accountLogger$.subscribe((it)=> {
            this.accountLogger = it
            this.issueLogger.linkAL(this.accountLogger)
            this.search()
            this.assigneeSelected = []
            this.issue.assignees.forEach(it=> this.assigneeSelected.push(it))
            this.selectedPriority = PriorityTypes[this.issue.priority]
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

        this.assigneeSelected.push(this.accountLogger!.current!)

        if(this.issueExists()) {
            this.issueLogger.assignYourself(<Issue> this.issue!)
        } else {
            this.issue!.assignees.push(this.accountLogger!.current!)
            console.log("Issue does not exist. Not saving.")
        }
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

    selectPriority() {
        if(!this.showPriorityPropdown) {
            if(this.accountLogger?.current != undefined)
                this.showPriorityPropdown = true
            else
                console.log("Not logged in")
            return
        }
        this.showPriorityPropdown = false

        var priority = PriorityTypes.Average
        switch(this.selectedPriority) {
            case 'SuperLow': {
                priority = PriorityTypes.SuperLow
                break
            }
            case 'Low': {
                priority = PriorityTypes.Low
                 break
            }
            case 'High': {
                priority = PriorityTypes.High
                 break
            }
            case 'Extreme': {
                priority = PriorityTypes.Extreme
                 break
            }
        }

        if(!this.issueExists()) {
            this.issue.priority = priority
            console.log("Issue does not exist. Not saving.")
        } else {
            this.issueLogger.changePriority(<Issue> this.issue!, priority)
        }

    }

    assignee() {
        if(!this.showAssigneeDropdown) {
            if(this.accountLogger?.current != undefined)
                this.showAssigneeDropdown = true
            else
                console.log("Not logged in")
            return
        }
        this.showAssigneeDropdown = false

        if(!this.issueExists()) {
            this.issue.assignees = []
            this.assigneeSelected.forEach(it=> this.issue.assignees.push(it))
            console.log("Issue does not exist. Not saving.")
        } else {
            this.issueLogger.assignee(<Issue> this.issue!, this.assigneeSelected)
        }

    }

    getParticipants() {
        var notHashseted = this.issue.history.map(it=>it.owner)
        var hashset: Account[] = []
        notHashseted.forEach(it=> {
            if(!hashset.find(it2=> it2.username == it.username)) {
                hashset.push(it)
            }
        })
        return hashset
    }

    deleteIssue() {
        if(!this.issueExists())
            return

        this.issueTrackerService.deleteItem((<Issue>this.issue).id)
        this.router.navigate(['/'])
    }
}