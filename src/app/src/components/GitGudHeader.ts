import { Component, EventEmitter, Output } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { AccountLogger } from "../services/AccountLogger";
import { Account } from "../model/Account";
import { Observable, of } from "rxjs";

@Component({
    selector: 'gigut-header',
    standalone: true,
    imports: [ CommonModule, FormsModule ],
    templateUrl: '../layout/gitGudHeader/l.html',
    styleUrls: ['../layout/gitGudHeader/l.scss']
})

export class GitGudHeader {

    triedToSaveWithoutName: boolean = false
    account: Account | undefined = undefined
    username: string = ""
    pfp: string = ""
    error: string = ""
    accountLogger: AccountLogger

    state: 'register' | 'login' | 'none' = 'none'

    constructor(accountLogger: AccountLogger) {
        this.accountLogger = accountLogger;
        accountLogger.load()
        this.account = accountLogger.current;
    }

    logIn() {
        if(this.state != 'login') {
            this.state = 'login'
            return;
        }
        if(this.account != undefined)
            return;
        if(this.username.length == 0)
            return;
        this.account = this.accountLogger.logIn(this.username)
        this.state = 'none'
    }

    register() {
        if(this.state != 'register') {
            this.state = 'register'
            return;
        }
        if(this.account != undefined)
            return;
        if(this.username.length == 0) {
            this.error = 'Username can not be empty.'
            return;
        }
        this.account = this.accountLogger.register(this.username, this.pfp)
        if(this.account == undefined)
            this.error = 'Username already exists.'
        else {
            this.state = 'none'
        }
    }

    logOut() {
        this.account = undefined
        this.accountLogger.logOut()
        this.state = 'none'
    }
}