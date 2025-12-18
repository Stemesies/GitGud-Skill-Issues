import { Component, inject, model, NgModule, OnInit } from "@angular/core";
import { Issue } from "../model/Issue";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { IssueTrackerService } from "../services/IssueTrackerService";
import { ActivatedRoute, Router } from "@angular/router";
import { IssueItem } from "./IssueItem";
import { GitGudHeader } from "./GitGudHeader";

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

    constructor(private issueTrackerService: IssueTrackerService) {}

    ngOnInit(): void {
        this.issueTrackerService.load()
        this.load()
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