import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ButtonComponent } from '../../components/button/button.component';

@Component({
  selector: 'app-complete-page',
  imports: [ButtonComponent],
  templateUrl: './complete-page.component.html',
  styleUrl: './complete-page.component.scss',
})
export class CompletePageComponent {
  prize: string = 'Car';

  constructor(private router: Router) {}

  goToSpinPage(): void {
    this.router.navigate(['/spin']);
  }

  goToWelcomePage(): void {
    this.router.navigate(['/welcome']);
  }
}
