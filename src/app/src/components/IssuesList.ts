import { Component, inject, model, NgModule, OnInit } from "@angular/core";
import { Issue } from "../model/Issue";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { IssueTrackerService } from "../services/IssueTrackerService";

@Component({
    selector: 'issues-list',
    standalone: true,
    imports: [ CommonModule, FormsModule ],
    templateUrl: '../layout/issuesList/l.html',
    styleUrls: ['../layout/issuesList/l.scss']
})

export class IssuesList implements OnInit {
    selectedIssues: Issue[] = [];
    filteredIssues: Issue[] = [];

    filterTypes = ['movie', 'series', 'episode'];
    filter: 'movie' | 'series' | 'episode' = 'movie';

    usingCache = "";
 
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
 
    }

    search() {
        this.searchString = this.searchDraft;
        this.load();
    }

}