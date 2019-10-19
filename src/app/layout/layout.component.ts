import { Component, OnDestroy, OnInit } from '@angular/core';
import { AppState } from "../store/states/app.state";
import { Store } from "@ngrx/store";
import { selectFAB } from "../store/selectors/layout.selectors";
import { Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss']
})
export class LayoutComponent implements OnInit, OnDestroy {

  protected showFAB = true;
  protected fabIcon: string = 'add';
  private onDestroy$: Subject<boolean> = new Subject();

  constructor(private store: Store<AppState>) { }

  ngOnInit() {
    this.store.select(selectFAB)
      .pipe(takeUntil(this.onDestroy$))
      .subscribe((fab: string) => {
        if (fab && (fab === 'add' || fab === 'edit')) {
          this.showFAB = true;
          this.fabIcon = fab;
        } else {
          this.showFAB = false;
        }
      });
  }

  ngOnDestroy(): void {
    this.onDestroy$.next(true);
    this.onDestroy$.complete();
  }

}
