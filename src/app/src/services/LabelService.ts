import { Injectable } from "@angular/core";
import { Issue } from "../model/Issue";
import { BehaviorSubject, Observable, Subject } from "rxjs";
import { Label } from "../model/Label";
import { Color } from "../model/Color";


@Injectable({
    providedIn: 'root'
})
export class LabelService {
    private readonly MAX_ID_KEY = "labels-max-id"
    private readonly KEY = "labels"
    
    maxId: number = 1;
    list: Label[] = [];

    load(): Label[] {
        var smaxid = localStorage.getItem(this.MAX_ID_KEY)
        if(smaxid != null)
            this.maxId = Number.parseInt(smaxid)
        else
            this.maxId = 1;

        var json = localStorage.getItem(this.KEY)
        this.list = json ? JSON.parse(json) : []
        return this.list
    }

    save() {
        localStorage.setItem(this.MAX_ID_KEY, this.maxId.toString())
        var json = JSON.stringify(this.list)
        localStorage.setItem(this.KEY, json)
    }

    addItem(label: Label) {
        label.id = this.maxId++;
        this.list.push(label); 
        this.save();
    }

    deleteItem(label: Label) {
        this.list = this.list.filter(item => item.id != label.id)
        this.save();
    }

    getLabels(labels: number[], showDeleted: boolean = true): Label[] {
        var list = this.list.filter(it=> labels.find(it2=>it2 == it.id) != undefined)
        if(showDeleted) {
            while(list.length < labels.length)
                list.push({id:0, name:'deleted label', description:'', color:{r:255, g:0, b:0, h:0, s:255, l:255}})
        }
        return list
    }

    hexToColor(hex: string): Color | null {
        var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        if(!result) return null;
        var r = parseInt(result[1], 16)
        var g = parseInt(result[2], 16)
        var b = parseInt(result[3], 16)
        var ro = r
        var go = g
        var bo = b

        r /= 255
        g /= 255
        b /= 255;
        var max = Math.max(r, g, b)
        var min = Math.min(r, g, b);
        var h = (max + min) / 2;
        var s = (max + min) / 2;
        var l = (max + min) / 2;

        if(max == min){
            h = s = 0; // achromatic
        } else {
            var d = max - min;
            s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
            switch(max) {
                case r: h = (g - b) / d + (g < b ? 6 : 0); break;
                case g: h = (b - r) / d + 2; break;
                case b: h = (r - g) / d + 4; break;
            }
            h /= 6;
        }

        s = s*100;
        s = Math.round(s);
        l = l*100;
        l = Math.round(l);
        h = Math.round(360*h);

        return { r: ro, g: go, b: bo, h: h, s: s, l: l };
    }

    rgbToHex(r: number, g: number, b: number) {
        return "#" + (1 << 24 | r << 16 | g << 8 | b).toString(16).slice(1);
    }

    colorToHex(color: Color) {
        return "#" + (1 << 24 | color.r << 16 | color.g << 8 | color.b).toString(16).slice(1);
    }

    generateRandom(): Color {
        var hex = this.rgbToHex(
            Math.round(Math.random()*255),
            Math.round(Math.random()*255),
            Math.round(Math.random()*255)
        )
        return this.hexToColor(hex)!

    }
}