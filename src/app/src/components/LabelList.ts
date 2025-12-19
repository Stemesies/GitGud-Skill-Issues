import { Component, inject, OnInit, ViewChild } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { IssueTrackerService } from "../services/IssueTrackerService";
import { Router } from "@angular/router";
import { IssueItem } from "./IssueItem";
import { GitGudHeader } from "./GitGudHeader";
import { Label } from "../model/Label";
import { LabelService } from "../services/LabelService";
import { LabelItem } from "./LabelItem";
import { LabelElement } from "./LabelElement";

@Component({
    selector: 'label-list',
    standalone: true,
    imports: [CommonModule, FormsModule, LabelItem, LabelElement, GitGudHeader],
    templateUrl: '../layout/labelList/l.html',
    styleUrls: ['../layout/labelList/l.scss']
})

export class LabelList implements OnInit {
    router = inject(Router);
    filteredList: Label[] = [];
 
    searchString = '';
    searchDraft = '';

    showMoreDialog = false
    showCreationDialog = false

    triedToSaveWithoutName = false
    newLabel: Label
    newLabelColorHex: string = ""
    isColorHexValid = true

    deletingLabel = false
    labelToEdit: Label | undefined = undefined

    sortBy: 'name' | 'issues' = 'name'
    sortOrder: 'descending' | 'ascending' = 'descending'

    @ViewChild(GitGudHeader) ggHeader!: GitGudHeader;

    issueTrackerService: IssueTrackerService
    labelService: LabelService
    constructor(issueTrackerService: IssueTrackerService, labelService: LabelService) {
        issueTrackerService.load()
        labelService.load()

        this.issueTrackerService = issueTrackerService
        this.labelService = labelService
        this.newLabel = {id:0, name:"", description:"", color:labelService.generateRandom()}
        this.resetNewLabel()
    }

    ngOnInit(): void {
        this.issueTrackerService.load()
        this.load()
    }

    countIssues(label: Label) {
        return this.issueTrackerService.list.filter(it=>it.labels.find(l=>l == label.id)).length
    }

    compare(a: Label, b: Label): number {
        switch(this.sortBy) {
            case "name": {
                if(this.sortOrder == 'descending')
                    return b.name.localeCompare(a.name);
                else
                    return a.name.localeCompare(b.name);
            }
            case "issues": {
                var al = this.countIssues(a)
                var bl = this.countIssues(b)
                if(this.sortOrder == 'descending')
                    return bl - al;
                else
                    return al - bl;
            }
        }
    }

    load() {
        var list: Label[] = this.labelService.list;
        console.log("Searching '" + this.searchString + "'")

        if(this.searchString.trim()) {
            list = this.labelService.list
                .filter(it=>
                    it.name.toLowerCase()
                    .includes(this.searchString.toLowerCase())
                );
        }

        list.sort((a, b) => this.compare(a, b) )

        this.filteredList = list;
        console.log(this.filteredList)
 
    }

    setRandomColor() {
        this.newLabel.color = this.labelService.generateRandom()
        this.newLabelColorHex = this.labelService.colorToHex(this.newLabel.color)
        this.isColorHexValid = true
    }

    setColor() {
        var color = this.labelService.hexToColor(this.newLabelColorHex)
        if(color == null) {
            this.isColorHexValid = false
            return
        }
        this.isColorHexValid = true
        this.newLabel.color = color
    }

    search() {
        this.searchString = this.searchDraft;
        this.load();
    }

    resetNewLabel() {
        this.newLabel = {id:0, name: "", description: "", color: this.labelService.generateRandom()}
        this.newLabelColorHex = this.labelService.colorToHex(this.newLabel.color)
        this.isColorHexValid = true
    }

    createNewLabel() {
        this.showCreationDialog = false;
        if(!this.newLabel.name.trim()) {
            this.triedToSaveWithoutName = true
            return
        }
        this.labelService.addItem(this.newLabel)
        this.resetNewLabel()
    }

    saveEditChanges() {
        console.log("Saving label ", this.newLabel.name, " changes")
        this.labelToEdit!.name = this.newLabel.name
        this.labelToEdit!.description = this.newLabel.description
        this.labelToEdit!.color = this.newLabel.color
        this.labelService.save()
        this.discardCreatingOrEditing()
    }

    discardCreatingOrEditing() {
        this.deletingLabel = false;
        this.showCreationDialog = false
        this.labelToEdit = undefined;
        this.resetNewLabel();
    }

    editLabel(label: Label) {
        this.newLabel = {id:label.id, name:label.name, description:label.description, color:label.color}
        this.labelToEdit = label
        console.log("Editing label ", label.name)
        this.showCreationDialog = true
    }

    deleteLabel() {
        console.log("Deleting ", this.labelToEdit?.name)
        this.labelService.deleteItem(this.labelToEdit!);
        this.load()
        this.discardCreatingOrEditing()
    }

}