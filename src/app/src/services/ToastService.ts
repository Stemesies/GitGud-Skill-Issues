import { Injectable } from "@angular/core";
import { BehaviorSubject, interval, Subject, Subscription, take, timeInterval } from "rxjs";


@Injectable({
    providedIn: 'root'
})
export class ToastService {

    shouldShow = new BehaviorSubject({shouldShow:false, content:""})
    shouldShow$ = this.shouldShow.asObservable()
    secs = interval(1000)
    lastSubscription: Subscription | undefined = undefined

    showToast(message: string) {
        if(this.lastSubscription)
            this.lastSubscription.unsubscribe()

        this.shouldShow.next({shouldShow:true, content:message})
        
        this.lastSubscription = interval(2000)
            .pipe(timeInterval())
            .pipe(take(1))
            .subscribe(it=>{
                this.shouldShow.next({shouldShow:false, content:message})
        })
    }
}