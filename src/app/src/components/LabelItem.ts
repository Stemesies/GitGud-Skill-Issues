import { Component, EventEmitter, Input, Output } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { Label } from "../model/Label";
import { LabelElement } from "./LabelElement";
import { LabelService } from "../services/LabelService";

@Component({
    selector: 'label-item',
    standalone: true,
    imports: [CommonModule, FormsModule, LabelElement],
    templateUrl: '../layout/labelItem/l.html',
    styleUrls: ['../layout/labelItem/l.scss']
})

export class LabelItem {

    @Output() edit = new EventEmitter<Label>()
    @Output() delete = new EventEmitter<Label>()

    @Input() labelService!: LabelService;
    @Input() item!: Label;
    @Input() issues!: number

    showDialog = false
    
}