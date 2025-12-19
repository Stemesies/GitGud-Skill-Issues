import { AfterViewInit, Component, inject, model, NgModule, OnInit, ViewChild } from "@angular/core";
import { Issue } from "../model/Issue";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { IssueTrackerService } from "../services/IssueTrackerService";
import { ActivatedRoute, Router } from "@angular/router";
import { IssueItem } from "./IssueItem";
import { GitGudHeader } from "./GitGudHeader";
import { IssueStatus } from "../model/IssueStatus";
import { Account } from "../model/Account";
import { Label } from "../model/Label";
import { PriorityTypes } from "../model/PriorityTypes";

@Component({
    selector: 'issues-list',
    standalone: true,
    imports: [CommonModule, FormsModule, IssueItem, GitGudHeader],
    templateUrl: '../layout/issuesList/l.html',
    styleUrls: ['../layout/issuesList/l.scss']
})

export class IssuesList implements OnInit {
    router = inject(Router);
    selectedIssues: Issue[] = [];
    filteredIssues: Issue[] = [];
 
    searchString = '';
    searchDraft = '';

    filterSearchField = ""
    showFilters: 'priority' | 'author' | 'labels' | 'assignees' | 'none' = 'none'
    filterStatus: 'closed' | 'open' = 'open'
    selectedAll = false

    filterPriority: string | undefined = undefined
    filterAssignees: Account | undefined = undefined
    filterAuthor: Account | undefined = undefined
    filterOnlyNoLabels = true
    filterLabels: Label[] = []

    authorList: Account[] = []
    assigneeList: Account[] = []

    @ViewChild(GitGudHeader) ggHeader!: GitGudHeader;
    constructor(private issueTrackerService: IssueTrackerService) {}

    ngOnInit(): void {
        this.issueTrackerService.load()
        this.load()
    }

    countOpenedIssues() {
        return this.issueTrackerService.list.filter(it=>it.status == IssueStatus.Open).length
    }

    countClosedIssues() {
        return this.issueTrackerService.list.filter(it=>it.status != IssueStatus.Open).length
    }

    searchFilter() {
        this.assigneeList = this.ggHeader.accountLogger.list
        this.authorList = this.ggHeader.accountLogger.list

        if(this.filterSearchField.trim()) {
            if(this.showFilters == 'assignees') {
                this.assigneeList = this.ggHeader.accountLogger.list
                    .filter(it=> it.username.includes(this.filterSearchField))
            } else if(this.showFilters == 'author') {
                this.authorList = this.ggHeader.accountLogger.list
                    .filter(it=> it.username.includes(this.filterSearchField))
            }
        }
    }

    switchFilterDialog(a: 'priority' | 'author' | 'labels' | 'assignees' | 'none') {
        this.filterSearchField = ''
        this.showFilters = this.showFilters == a? 'none' : a
        this.searchFilter()
    }

    load() {
        var list: Issue[] = this.issueTrackerService.list;
        console.log("Searching '" + this.searchString + "'")

        if(this.searchString.trim()) {
            list = this.issueTrackerService.list
                .filter(it=>
                    it.title.toLowerCase()
                    .includes(this.searchString.toLowerCase())
                );
        }
        if(this.filterStatus == 'open') {
            list = list.filter(it=> it.status == IssueStatus.Open)
        } else {
            list = list.filter(it=> it.status != IssueStatus.Open)
        }

        if(this.filterAuthor) {
            list = list.filter(it=> it.owner.username == this.filterAuthor!.username)
        }
        if(this.filterAssignees) {
            list = list.filter(it=> it.assignees.find(it2=>it2.username == this.filterAssignees!.username) != undefined)
        }
        if(this.filterOnlyNoLabels) {
            list = list.filter(it=> it.labels.length == 0)
        } else if(this.filterLabels) {
            // list = list.filter(it=> {
            //     this.filterLabels.
            //     it.labels.find(it2=>it2.name == this.filterLabels?.name) != undefined
            // } )
        }

        var priority = PriorityTypes.Average
        switch(this.filterPriority) {
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
        if(this.filterPriority) {
            list = list.filter(it=> it.priority == priority)
        }


        this.filteredIssues = list;
        console.log(this.filteredIssues)
 
    }

    search() {
        this.searchString = this.searchDraft;
        this.load();
    }

     reset() {
        this.issueTrackerService.list = []
        this.issueTrackerService.maxId = 1
        this.issueTrackerService.save()
    }

}