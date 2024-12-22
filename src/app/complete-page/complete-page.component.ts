import { Component, Signal } from '@angular/core';
import { Router } from '@angular/router';
import { ButtonComponent } from '../../components/button/button.component';
import { Observable } from 'rxjs';
import { Store } from '@ngxs/store';
import { WheelState } from '../../store/wheel/wheel.state';

@Component({
  selector: 'app-complete-page',
  imports: [ButtonComponent],
  templateUrl: './complete-page.component.html',
  styleUrl: './complete-page.component.scss',
})
export class CompletePageComponent {
  prize: Signal<string | null>;

  constructor(
    private router: Router,
    private store: Store,
  ) {
    this.prize = this.store.selectSignal(WheelState.getPrize);
  }

  goToSpinPage(): void {
    this.router.navigate(['/spin']);
  }

  goToWelcomePage(): void {
    this.router.navigate(['/welcome']);
  }
}
