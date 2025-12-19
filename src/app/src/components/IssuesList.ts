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
import { HistoryTypes } from "../model/HistoryTypes";
import { LabelService } from "../services/LabelService";

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
    showFilters: 'more' | 'priority' | 'author' | 'labels' | 'assignees' | 'none' = 'none'
    filterStatus: 'closed' | 'open' = 'open'
    selectedAll = false

    sortBy: 'creationTime' | 'updateTime' | 'priority' | 'comments' = 'creationTime'
    sortOrder: 'descending' | 'ascending' = 'descending'

    filterPriority: string | undefined = undefined
    filterAssignees: Account | undefined = undefined
    filterAuthor: Account | undefined = undefined
    filterOnlyNoLabels = false
    filterLabels: Label[] = []

    authorList: Account[] = []
    assigneeList: Account[] = []
    labelList: Label[] = []

    @ViewChild(GitGudHeader) ggHeader!: GitGudHeader;

    issueTrackerService: IssueTrackerService
    labelService: LabelService
    constructor(issueTrackerService: IssueTrackerService, labelService: LabelService) {
        this.issueTrackerService = issueTrackerService
        this.labelService = labelService
    }

    ngOnInit(): void {
        this.issueTrackerService.load()
        this.labelService.load()
        this.load()
    }

    countOpenedIssues() {
        return this.issueTrackerService.list.filter(it=>it.status == IssueStatus.Open).length
    }

    countClosedIssues() {
        return this.issueTrackerService.list.filter(it=>it.status != IssueStatus.Open).length
    }

    isLabelSelected(prof: Label) {
        return this.filterLabels.find(it=> it.id == prof.id)
    }

    labelAddOrRemove(account: Label): void {
        if(this.filterLabels.includes(account))
            this.filterLabels = this.filterLabels
                .filter(it => it != account)
        else
            this.filterLabels.push(account)

        console.log("SELECTED LABELS: ", this.filterLabels)
        this.load()
    }

    searchFilter() {
        this.assigneeList = this.ggHeader.accountLogger.list
        this.authorList = this.ggHeader.accountLogger.list
        this.labelList = this.labelService.list

        if(this.filterSearchField.trim()) {
            if(this.showFilters == 'assignees') {
                this.assigneeList = this.ggHeader.accountLogger.list
                    .filter(it=> it.username.includes(this.filterSearchField))
            } else if(this.showFilters == 'author') {
                this.authorList = this.ggHeader.accountLogger.list
                    .filter(it=> it.username.includes(this.filterSearchField))
            } else if(this.showFilters == 'labels') {
                this.labelList = this.labelService.list
                    .filter(it=> it.name.includes(this.filterSearchField))
            }
        }
    }

    switchFilterDialog(a: 'more' | 'priority' | 'author' | 'labels' | 'assignees' | 'none') {
        this.filterSearchField = ''
        this.showFilters = this.showFilters == a? 'none' : a
        this.searchFilter()
    }

    compare(a: Issue, b: Issue): number {
        switch(this.sortBy) {
            case "creationTime": {
                if(this.sortOrder == 'descending')
                    return b.created - a.created;
                else
                    return a.created - b.created;
            }
            case "updateTime": {
                var al = a.history.length == 0 ? a.created : a.history[a.history.length-1].created
                var bl = b.history.length == 0 ? b.created : b.history[b.history.length-1].created
                if(this.sortOrder == 'descending')
                    return bl - al;
                else
                    return al - bl;
            }
            case "priority": {
                if(this.sortOrder == 'descending')
                    return b.priority - a.priority 
                else
                    return a.priority - b.priority
            }
            case "comments": {
                var al1 = a.history.filter(it=>it.type == HistoryTypes.Comment)
                var bl1 = b.history.filter(it=>it.type == HistoryTypes.Comment)
                if(this.sortOrder == 'descending')
                    return (bl1? bl1: []).length - (al1 ? al1 : []).length
                else 
                    return (al1? al1: []).length - (bl1 ? bl1 : []).length
                
            }
        }
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
        } else if(this.filterLabels.length > 0) {
            list = list.filter(it=> {
                console.log("Filtering ", it.title, "..... ", this.filterLabels.filter(it2=>
                    it.labels.find(it3=>it3 == it2.id) != undefined
                ).length == this.filterLabels.length)
                return this.filterLabels.filter(it2=>
                    it.labels.find(it3=>it3 == it2.id) != undefined
                ).length == this.filterLabels.length
            } )
            console.log(list)
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

        list.sort((a, b) => this.compare(a, b) )

        


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