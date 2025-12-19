import { Component, Input } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { Label } from "../model/Label";
import { Color } from "../model/Color";

@Component({
    selector: 'label',
    standalone: true,
    imports: [CommonModule, FormsModule],
    templateUrl: '../layout/label/l.html',
    styleUrls: ['../layout/label/l.scss']
})

export class LabelElement {

    @Input() name!: string
    @Input() color!: Color

}