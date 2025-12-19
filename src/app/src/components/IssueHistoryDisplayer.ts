import { AfterViewInit, ChangeDetectorRef, Component, computed, inject, Input, model, NgModule, OnInit, Signal, ViewChild, viewChild } from "@angular/core";
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
import { Title } from "@angular/platform-browser";
import { IssueLogger } from "../services/IssueLogger";

@Component({
    selector: 'issue-history-displayer',
    standalone: true,
    imports: [CommonModule, FormsModule, HistoryItem],
    templateUrl: '../layout/issueHistory/l.html',
    styleUrls: ['../layout/issueHistory/l.scss']
})

export class IssueHistoryDisplayer {
    @Input() issue: Issue | undefined = undefined;
    
}
