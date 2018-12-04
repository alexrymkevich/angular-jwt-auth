import { OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';

export class AutoUnsubscribe implements OnDestroy {
    protected subscriptions: Subscription[] = [];

    public ngOnDestroy() {
        this.subscriptions.forEach((subscription) => {
            subscription.unsubscribe();
        });
    }
}
