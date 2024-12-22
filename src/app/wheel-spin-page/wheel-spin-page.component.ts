import { Component, ViewChild } from '@angular/core';
import {
  WheelComponent,
  WheelSegmentConfig,
} from '../../components/wheel/wheel.component';
import { CommonModule } from '@angular/common';
import { ButtonComponent } from '../../components/button/button.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-wheel-spin-page',
  imports: [CommonModule, WheelComponent, ButtonComponent],
  templateUrl: './wheel-spin-page.component.html',
  styleUrl: './wheel-spin-page.component.scss',
})
export class WheelSpinPageComponent {
  @ViewChild(WheelComponent) wheelRef!: WheelComponent;

  constructor(private router: Router) {}

  public spinRandom(): void {
    this.wheelRef.spin();
  }

  public spinToSegment(segment: string): void {
    this.wheelRef.spin(segment);
  }
  title = 'spinning-wheel';

  wheelConfig: WheelSegmentConfig = {
    segments: [
      ['Car', 1],
      ['Cellphone', 3],
      ['Smarties', 3],
      ['Toaster', 4],
      ['Car', 1],
      ['Cellphone', 3],
      ['Smarties', 3],
      ['Toaster', 4],
    ],
    spinDuration: 5000,
  };

  handleSpinEnd(segment: string): void {
    setTimeout(() => {
      this.router.navigate(['/complete']);
    }, 1000);

    console.log(`Spinning wheel landed on ${segment}`);
  }
}
