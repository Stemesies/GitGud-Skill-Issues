import { Injectable } from "@angular/core";
import { Issue } from "../model/Issue";
import { Account } from "../model/Account";
import { Observable, Subject } from "rxjs";


@Injectable({
    providedIn: 'root'
})
export class AccountLogger {
    private readonly KEY = "accounts"
    private readonly KEY_CURRENT = "current"
    
    list: Account[] = [];
    current: Account | undefined = undefined;
    private currentSubscribtion: Subject<Account | undefined> = new Subject()
    current$: Observable<Account | undefined> = this.currentSubscribtion.asObservable()

    load(): Account[] {
        var json = localStorage.getItem(this.KEY)
        this.list = json ? JSON.parse(json) : []
        
        var cr = localStorage.getItem(this.KEY_CURRENT);
        this.current = this.list.find(it=>it.username == cr)
        this.currentSubscribtion.next(this.current)

        return this.list
    }

    save() {
        var json = JSON.stringify(this.list)
        localStorage.setItem(this.KEY, json)

        if(this.current == undefined)
            localStorage.setItem(this.KEY_CURRENT, "" );
        else
            localStorage.setItem(this.KEY_CURRENT, this.current?.username );
        this.currentSubscribtion.next(this.current)
        
    }

    addItem(item: Account) {
        var item = item;
        this.list.push(item); 
        this.save();
    }

    deleteItem(username: string) {
        this.list = this.list.filter(item => item.username != username)
        this.save();
    }

    logIn(username: string): Account | undefined {
        this.current = this.list.find(it=>it.username == username)
        this.save()
        return this.current;
    }

    logOut() {
        this.current = undefined
        this.save()
    }

    register(username: string, pfp: string): Account | undefined {
        if(this.list.find(it=>it.username == username) != undefined)
            return undefined;
        var account = {username, pfp};
        this.current = account;
        this.addItem(account)
        return account;
    }
}