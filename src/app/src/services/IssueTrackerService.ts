import { Injectable } from "@angular/core";
import { Issue } from "../model/Issue";


@Injectable({
    providedIn: 'root'
})
export class IssueTrackerService {
    private readonly MAX_ID_KEY = "max-id"
    private readonly KEY = "issues"
    
    list: Issue[] = [];
    maxId: number = 1;

    load(): Issue[] {
        var smaxid = localStorage.getItem(this.MAX_ID_KEY)
        if(smaxid != null)
            this.maxId = Number.parseInt(smaxid)
        else
            this.maxId = 1;
        console.log("Max id: " + this.maxId)

        var json = localStorage.getItem(this.KEY)
        console.log("loading" + json)
        this.list = json ? JSON.parse(json) : []
        return this.list
    }

    save() {
        localStorage.setItem(this.MAX_ID_KEY, this.maxId.toString())
        
        var json = JSON.stringify(this.list)
        console.log("saving" + json)
        localStorage.setItem(this.KEY, json)
    }

    addItem(omitItem: Omit<Issue, 'id'>) {
        var item = {  ...omitItem, id: this.maxId++ };
        this.list.push(item); 
        this.save();
        return this.list;
    }

    updateItem(id: number, updates: Partial<Issue>) {
        const index = this.list.findIndex(item => item.id == id);
        if(index == -1)
            return;

        this.list[index] = { ...this.list[index], ...updates};
        this.save();
    }

    deleteItem(id: number) {
        this.list = this.list.filter(item => item.id !== id)
        this.save();
    }
}