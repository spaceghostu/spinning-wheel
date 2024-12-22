import { Component, Signal } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { ButtonComponent } from '../../components/button/button.component';
import { Observable } from 'rxjs';
import { Store } from '@ngxs/store';
import { WheelState } from '../../store/wheel/wheel.state';

@Component({
  selector: 'app-complete-page',
  imports: [ButtonComponent, RouterModule],
  templateUrl: './complete-page.component.html',
  styleUrl: './complete-page.component.scss',
})
export class CompletePageComponent {
  prize: Signal<string | null>;

  constructor(private store: Store) {
    this.prize = this.store.selectSignal(WheelState.getPrize);
  }
}
