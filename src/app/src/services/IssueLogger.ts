import { Injectable } from "@angular/core";
import { Issue } from "../model/Issue";
import { IssueTrackerService } from "./IssueTrackerService";
import { HistoryTypes } from "../model/HistoryTypes";
import { AccountLogger } from "./AccountLogger";
import { History } from "../model/History";
import { IssueStatus } from "../model/IssueStatus";
import { Account } from "../model/Account";
import { PriorityTypes } from "../model/PriorityTypes";
import { Label } from "../model/Label";


@Injectable({
    providedIn: 'root'
})
export class IssueLogger {
    issueTrackerService: IssueTrackerService | undefined = undefined
    accountLogger: AccountLogger | undefined = undefined

    link(issueTrackerService: IssueTrackerService) {
        this.issueTrackerService = issueTrackerService
    }
    linkAL(accountLogger: AccountLogger) {
        this.accountLogger = accountLogger
    }

    requireServiceConnection() {
        if(this.accountLogger == undefined) {
            console.log("IssueLogger: Account logger didn't set.")
            return false
        }
        if(this.issueTrackerService == undefined) {
            console.log("IssueLogger: Issue tracker didn't set.")
            return false
        }
        if(this.accountLogger.current == undefined) {
            console.log("IssueLogger: Undefined account.")
            return false
        }
        return true
    }

    rename(issue: Issue, newName: string) {
        if(!newName.trim()) {
            return
        }
        if(newName == issue.title) {
            return
        }

        if(!this.requireServiceConnection())
            return

        console.log("Renaming " + issue.title + " to " + newName)
        var history: History = {
            type: HistoryTypes.Rename,
            created: Date.now(),
            owner: this.accountLogger!.current!,
            data: {
                oldName: issue.title,
                newName: newName
            }
        }
        issue.history.push(history)
        issue.title = newName;
        this.issueTrackerService!.save()
    }

    postComment(issue: Issue, comment: string) {
        if(!comment.trim()) {
            return
        }

        if(!this.requireServiceConnection())
            return
        
        console.log("Commenting to " + issue.title)
        var history: History = {
            type: HistoryTypes.Comment,
            created: Date.now(),
            owner: this.accountLogger!.current!,
            data: {
                content: comment
            }
        }
        issue.history.push(history)
        this.issueTrackerService!.save()
    }

    closeIssue(issue: Issue, newStatus: IssueStatus) {
        if(issue.status == newStatus) {
            return
        }

        if(!this.requireServiceConnection())
            return

        console.log("Closing issue: " + issue.title)

        var history: History = {
            type: HistoryTypes.Closure,
            created: Date.now(),
            owner: this.accountLogger!.current!,
            data: {
                newStatus: newStatus
            }
        }
        issue.status = newStatus
        issue.history.push(history)
        this.issueTrackerService!.save()
    }

    changePriority(issue: Issue | Omit<Issue, 'id'>, newPriority: PriorityTypes) {
        if(issue.priority == undefined)
            issue.priority = PriorityTypes.Average

        if(issue.priority == newPriority) {
            return
        }

        if(!this.requireServiceConnection())
            return

        console.log("Setting priority: " + issue.title)

        var history: History = {
            type: HistoryTypes.Priority,
            created: Date.now(),
            owner: this.accountLogger!.current!,
            data: {
                newPriority: newPriority
            }
        }
        if(!this.issueExists(issue)) {
            issue.history = issue.history.filter(it=>it.type != history.type)
        }
        issue.priority = newPriority
        issue.history.push(history)

        if(this.issueExists(issue))
            this.issueTrackerService!.save()
        else {
            console.log("Not saving: issue not exists")
        }
    }

    assignYourself(issue: Issue | Omit<Issue, 'id'>) {
        if(!this.requireServiceConnection())
            return

        var history: History = {
            type: HistoryTypes.Assign,
            created: Date.now(),
            owner: this.accountLogger!.current!,
            data: {
                added: [],
                removed: [],
                selfAssign: true
            }
            
        }

        if(!this.issueExists(issue)) {
            issue.history = issue.history.filter(it=>it.type != history.type)
        }

        issue.assignees.push(this.accountLogger!.current!)
        issue.history.push(history)

        if(this.issueExists(issue))
            this.issueTrackerService!.save()
        else {
            console.log("Not saving: issue not exists")
        }
    }

     issueExists(issue: Issue | Omit<Issue, 'id'>) {
        return (<Issue> issue).id !== undefined
    }

    assignee(issue: Issue | Omit<Issue, 'id'>, newList: Account[]) {
        if(!this.requireServiceConnection())
            return

        if(!this.issueExists(issue))
            issue.assignees = []

        var added: Account[] = []
        var removed: Account[] = []

        newList.forEach(neww => { 
            if(!issue.assignees.find(it=>it.username == neww.username)) added.push(neww)
        })
        issue.assignees.forEach(neww => { 
            if(!newList.find(it=>it.username == neww.username)) removed.push(neww)
        })

        console.log("Issue Assignees: ", issue.assignees)
        console.log("Added: ", added)
        console.log("Removed: ", removed)

        if(added.length != 0 || removed.length != 0) {
            var history: History = {
                type: HistoryTypes.Assign,
                created: Date.now(),
                owner: this.accountLogger!.current!,
                data: {
                    added: added,
                    removed: removed,
                    selfAssign: false
                }
            }

            if(!this.issueExists(issue)) {
                issue.history = issue.history.filter(it=>it.type != history.type)
            }

            issue.history.push(history)
        }

        issue.assignees = []
        newList.forEach(it=> issue.assignees.push(it))
        if(this.issueExists(issue))
            this.issueTrackerService!.save()
        else {
            console.log("Not saving: issue not exists")
        }
        
    }


    label(issue: Issue | Omit<Issue, 'id'>, newList: number[]) {
        if(!this.requireServiceConnection())
            return

        if(!this.issueExists(issue))
            issue.labels = []

        var added: number[] = []
        var removed: number[] = []

        newList.forEach(neww => { 
            if(!issue.labels.find(it=>it == neww)) added.push(neww)
        })
        issue.labels.forEach(neww => { 
            if(!newList.find(it=>it == neww)) removed.push(neww)
        })

        console.log("Issue labels: ", issue.labels)
        console.log("Added: ", added)
        console.log("Removed: ", removed)

        if(added.length != 0 || removed.length != 0) {
            var history: History = {
                type: HistoryTypes.Label,
                created: Date.now(),
                owner: this.accountLogger!.current!,
                data: {
                    added: added,
                    removed: removed
                }
            }

            if(!this.issueExists(issue)) {
                issue.history = issue.history.filter(it=>it.type != history.type)
            }

            issue.history.push(history)
        }

        issue.labels = []
        newList.forEach(it=> issue.labels.push(it))
        if(this.issueExists(issue))
            this.issueTrackerService!.save()
        else {
            console.log("Not saving: issue not exists")
        }
        
    }
}