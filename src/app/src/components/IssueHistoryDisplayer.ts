import { Component, Input } from "@angular/core";
import { Issue } from "../model/Issue";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { HistoryItem } from "./HistoryItem";
import { LabelService } from "../services/LabelService";
import { RelativeTime } from "../model/RelativeTime";

@Component({
    selector: 'issue-history-displayer',
    standalone: true,
    imports: [CommonModule, FormsModule, HistoryItem],
    templateUrl: '../layout/issueHistory/l.html',
    styleUrls: ['../layout/issueHistory/l.scss']
})

export class IssueHistoryDisplayer {
    @Input() issue: Issue | undefined = undefined;
    @Input() labelService!: LabelService;
 
    
     getDatetime() {
        return  RelativeTime.format(this.issue!.created)
    }
    getDatetimeFormatted() {
        var date = new Date(this.issue!.created);
        return date.toLocaleDateString() + " " + date.toLocaleTimeString()
    }
}
