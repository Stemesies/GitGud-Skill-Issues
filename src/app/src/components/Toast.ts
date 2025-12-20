import { ChangeDetectorRef, Component, OnDestroy, OnInit  } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { ToastService } from "../services/ToastService";
import { Subscription } from "rxjs";

@Component({
    selector: 'toast',
    standalone: true,
    imports: [CommonModule, FormsModule],
    templateUrl: '../layout/toast/l.html',
    styleUrls: ['../layout/toast/l.scss']
})
export class Toast implements OnInit, OnDestroy {
  

    sub: Subscription | undefined = undefined
    show: boolean = false
    content: string = ""

    constructor(private toastService: ToastService, private changeDetectorRef: ChangeDetectorRef) {}

    ngOnInit() {
        this.sub=this.toastService.shouldShow$.subscribe(it=>{
            console.log("IM KILLING MYSELF: ", it.shouldShow)
            this.show = false
            this.changeDetectorRef.detectChanges()
            this.show = it.shouldShow
            this.content = it.content
            this.changeDetectorRef.detectChanges()
        })
    }

    ngOnDestroy(): void {
        if(this.sub)
            this.sub.unsubscribe()
        this.sub = undefined
    }

}