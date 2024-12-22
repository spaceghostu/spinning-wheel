import { Component, ViewChild } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {
  WheelComponent,
  WheelSegmentConfig,
} from '../components/wheel/wheel.component';
import { ButtonComponent } from '../components/button/button.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, WheelComponent, ButtonComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  @ViewChild(WheelComponent) wheelRef!: WheelComponent;

  public spinRandom(): void {
    this.wheelRef.spin();
  }

  public spinToSegment(segment: string): void {
    // Force-lapse spin to land on the given segment
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
    console.log(`Spinning wheel landed on ${segment}`);
  }
}
