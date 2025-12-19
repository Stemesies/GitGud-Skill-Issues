import { Component, CUSTOM_ELEMENTS_SCHEMA, EventEmitter, inject, Input, OnInit, Output } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { AccountLogger } from "../services/AccountLogger";
import { Account } from "../model/Account";
import { Observable, of } from "rxjs";
import { Router } from "@angular/router";
import { ToastService } from "../services/ToastService";
import { Toast } from "./Toast";

@Component({
    selector: 'gigut-header',
    standalone: true,
    imports: [ CommonModule, FormsModule, Toast ],
    templateUrl: '../layout/gitGudHeader/l.html',
    styleUrls: ['../layout/gitGudHeader/l.scss']
})

export class GitGudHeader implements OnInit {
    router = inject(Router);

    @Input() issueCount$!: Observable<number>;
    issueCount: number = 0;

    triedToSaveWithoutName: boolean = false
    account: Account | undefined = undefined
    username: string = ""
    pfp: string = ""
    error: string = ""
    accountLogger: AccountLogger

    state: 'register' | 'login' | 'none' = 'none'

    constructor(accountLogger: AccountLogger, private toastService: ToastService) {
        this.accountLogger = accountLogger;
        accountLogger.load()
        this.account = accountLogger.current;
    }

    ngOnInit(): void {
        this.issueCount$.subscribe(it=> {
            console.log("GitGud Header: updated Issue Count to ", it)
            this.issueCount = it
        })
    }

    logIn() {
        if(this.state != 'login') {
            this.error = ""
            this.state = 'login'
            return;
        }
        if(this.account != undefined)
            return;
        this.state = 'none'
        if(this.username.length == 0) {
            this.error = 'Username can not be empty.'
            return;
        }
        this.account = this.accountLogger.logIn(this.username)

        if(this.account == undefined)
            this.error = 'Unknown user.'

        

        if(this.account != undefined)
            this.toastService.showToast("logged in as " + this.username)
    }

    register() {
        if(this.state != 'register') {
            this.error = ""
            this.state = 'register'
            return;
        }
        if(this.account != undefined)
            return;
         this.state = 'none'

        if(this.username.length == 0) {
            this.error = 'Username can not be empty.'
            return;
        }
        this.account = this.accountLogger.register(this.username, this.pfp)
        if(this.account == undefined)
            this.error = 'Username already exists.'
        
       
        if(this.account != undefined)
            this.toastService.showToast("Successfully registered as " + this.username)
        
    }

    logOut() {
        this.account = undefined
        this.accountLogger.logOut()
        this.state = 'none'
        this.toastService.showToast("logged out")
    }
}