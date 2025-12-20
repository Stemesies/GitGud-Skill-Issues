import { Component, EventEmitter, inject, Input, OnInit, Optional, Output  } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { Issue } from "../model/Issue";
import { Router } from "@angular/router";
import { AccountLogger } from "../services/AccountLogger";
import { IssueTrackerService } from "../services/IssueTrackerService";
import { LabelService } from "../services/LabelService";
import { Observable } from "rxjs";
import { Account } from "../model/Account";
import { IssueLogger } from "../services/IssueLogger";
import { PriorityTypes } from "../model/PriorityTypes";
import { Label } from "../model/Label";
import { LabelElement } from "./LabelElement";
import { ToastService } from "../services/ToastService";

@Component({
    selector: 'issue-right-block-settings',
    standalone: true,
    imports: [CommonModule, FormsModule, LabelElement],
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

    showLabelDropdown = false
    labelSearchString: string = ""
    filteredLabels: Label[] = []
    labelsSelected: number[] = []

    showPriorityPropdown = false
    selectedPriority: string = "Average"

    showDeletionConfirmation = false
    
    labelService: LabelService
    constructor(private issueTrackerService: IssueTrackerService, private issueLogger: IssueLogger, labelService: LabelService, private toastService: ToastService) {
        issueLogger.link(issueTrackerService)
        labelService.load()
        this.labelService = labelService
     }

    ngOnInit(): void {
        console.log("Issue exists? ", this.issueExists())
        this.accountLogger$.subscribe((it)=> {
            this.accountLogger = it
            this.issueLogger.linkAL(this.accountLogger)
            this.search()
            this.assigneeSelected = []
            this.labelsSelected = []
            this.issue.assignees.forEach(it=> this.assigneeSelected.push(it))
            this.issue.labels.forEach(it=> this.labelsSelected.push(it))
            this.selectedPriority = PriorityTypes[this.issue.priority]
            console.log("Assignees selected: ", this.assigneeSelected)
            console.log("Labels selected: ", this.labelsSelected)
        })
    }

    assigneeAddOrRemove(account: Account): void {
        if(this.assigneeSelected.includes(account))
            this.assigneeSelected = this.assigneeSelected
                .filter(it => it.username != account.username)
        else
            this.assigneeSelected.push(account)
    }
    labelAddOrRemove(account: Label): void {
        if(this.labelsSelected.includes(account.id))
            this.labelsSelected = this.labelsSelected
                .filter(it => it != account.id)
        else
            this.labelsSelected.push(account.id)

        console.log("SELECTED LABELS: ", this.labelsSelected)
    }

    assignYourself() {
        if(this.accountLogger?.current == undefined) {
            console.log("Not logged in")
            return;
        }
        console.log("Assigning yourself")

        this.assigneeSelected.push(this.accountLogger!.current!)

        this.issueLogger.assignYourself(this.issue!)
    }

    issueExists() {
        return (<Issue> this.issue).id !== undefined
    }

    isSelected(prof: Account) {
        return this.assigneeSelected.find(it=> it.username == prof.username)
    }
    isLabelSelected(prof: Label) {
        return this.labelsSelected.find(it=> it == prof.id)
    }

    search() {
        if(!this.assigneeSearchString.trim())
            this.filteredAssignees = this.accountLogger?.list!
        else {
            var f = this.accountLogger?.list!
                .filter(it=> it.username.includes(this.assigneeSearchString))
            this.filteredAssignees = f ? f : []
        }

        if(!this.labelSearchString.trim())
            this.filteredLabels = this.labelService?.list!
        else {
            var ff = this.labelService?.list!
                .filter(it=> it.name.includes(this.labelSearchString))
            this.filteredLabels = ff ? ff : []
        }
    }

    selectPriority() {
        if(!this.showPriorityPropdown) {
            if(this.accountLogger?.current != undefined)
                this.showPriorityPropdown = true
            else {
                console.log("Not logged in")
                this.toastService.showToast("You are not logged in")
            }
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

        this.issueLogger.changePriority(this.issue!, priority)

        this.toastService.showToast("Successfully updated priority")

    }

    label() {
        if(!this.showLabelDropdown) {
            if(this.accountLogger?.current != undefined)
                this.showLabelDropdown = true
            else {
                console.log("Not logged in")
                this.toastService.showToast("You are not logged in")
            }
            return
        }
        this.showLabelDropdown = false

        this.issueLogger.label(this.issue!, this.labelsSelected)

        this.toastService.showToast("Successfully updated label list")
    }

    assignee() {
        if(!this.showAssigneeDropdown) {
            if(this.accountLogger?.current != undefined)
                this.showAssigneeDropdown = true
            else {
                console.log("Not logged in")
                this.toastService.showToast("You are not logged in")
            }
            return
        }
        this.showAssigneeDropdown = false

        this.issueLogger.assignee(this.issue!, this.assigneeSelected)

        this.toastService.showToast("Successfully updated assignee list")

    }

    getParticipants() {
        var notHashseted = this.issue.history.map(it=>it.owner)
        var hashset: Account[] = []
        hashset.push(this.issue.owner)
        notHashseted.forEach(it=> {
            if(!hashset.find(it2=> it2.username == it.username)) {
                hashset.push(it)
            }
        })
        return hashset
    }

    showDeleteIssue() {
        if(this.accountLogger?.current == undefined) {
            console.log("Not logged in")
            this.toastService.showToast("You are not logged in")
            return
        }
        
        this.showDeletionConfirmation=true
    }

    deleteIssue() {
        if(!this.issueExists())
            return

        this.issueTrackerService.deleteItem((<Issue>this.issue).id)
        this.router.navigate(['/'])
        this.toastService.showToast("Deleted issue " + this.issue.title)
    }
}