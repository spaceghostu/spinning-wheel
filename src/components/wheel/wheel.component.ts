import {
  Component,
  EventEmitter,
  Input,
  Output,
  SimpleChanges,
  OnChanges,
} from '@angular/core';
import { polarToCartesian } from '../../util/polarToCartesian';
import { cubicBezierY } from '../../util/cubicBezier';

/**
 * A configuration interface for the WheelComponent.
 */
export interface WheelSegmentConfig {
  /**
   * An array of [segmentLabel, segmentSize] tuples.
   *
   * @example
   * ```ts
   * segments: [
   *   ['A', 2],
   *   ['B', 6],
   *   ['C', 3],
   *   ['D', 5]
   * ]
   * ```
   */
  segments: [string, number][];

  /**
   * Total spin time in milliseconds.
   *
   * @defaultValue 7000
   */
  spinDuration?: number;
}

/**
 * Represents a spinning wheel component that can have segments of varying sizes,
 * and supports a time-based spin with cubic-bezier easing.
 *
 * @remarks
 * - The `config` property controls segments and spin settings.
 * - Call `spin(...)` to begin spinning. You can optionally specify a segment to land on.
 * - The component fires `(spinEnd)` when the spin completes, emitting the landed segment's label.
 */
@Component({
  selector: 'app-wheel',
  templateUrl: './wheel.component.html',
  styleUrls: ['./wheel.component.scss'],
})
export class WheelComponent implements OnChanges {
  /**
   * Combined configuration, including segments and spin properties.
   */
  @Input() public config: WheelSegmentConfig = {
    segments: [],
    spinDuration: 7000,
  };

  /**
   * An output event that emits the winning segment label when the spin completes.
   */
  @Output() public spinEnd: EventEmitter<string> = new EventEmitter<string>();

  /**
   * The total width of the wheel SVG.
   *
   * @defaultValue 300
   */
  public width = 300;

  /**
   * The total height of the wheel SVG.
   *
   * @defaultValue 300
   */
  public height = 300;

  /**
   * The radius for drawing segments and positioning text.
   *
   * @defaultValue 140
   */
  public radius = 140;

  /**
   * The current wheel rotation, in degrees.
   */
  public currentRotation = 0;

  /* ----------------------------------------------------
   * Internal Fields
   * -------------------------------------------------- */

  segments: string[] = []; // Extracted segment labels
  private segmentSizes: number[] = []; // Extracted segment sizes
  private _segmentAngles: number[] = []; // Computed angles for each segment

  private _spinDuration = 7000;
  private _x1 = 0;
  private _y1 = 0;
  private _x2 = 0.58;
  private _y2 = 1.0;

  private startRotation = 0;
  private targetRotation = 0;
  private animationId: number | null = null;
  private baseRotations = 360 * 3; // 3 full rotations
  private spinStartTime = 0;

  /**
   * Reflects changes to the `config` input. Recomputes segments and angles.
   *
   * @param changes - The set of changed input properties.
   */
  public ngOnChanges(changes: SimpleChanges): void {
    this._initializeFromConfig();
    this._calculateSegmentAngles();
  }

  /**
   * Initiates spinning the wheel.
   *
   * @param targetSegment - If provided and valid, the wheel will land on that segment.
   * Otherwise, it will land randomly.
   *
   * @remarks
   * This cancels any ongoing animation, calculates a new target rotation,
   * and starts the time-based animation loop.
   */
  public spin(targetSegment?: string): void {
    // Cancel any ongoing animation
    if (this.animationId !== null) {
      cancelAnimationFrame(this.animationId);
    }

    this.startRotation = this.currentRotation;

    if (targetSegment && this.segments.includes(targetSegment)) {
      const index = this.segments.indexOf(targetSegment);
      const midAngle = this._getSegmentMidAngle(index);
      const finalAngle = (360 - midAngle + 360) % 360;
      const base = this.startRotation - (this.startRotation % 360);

      this.targetRotation = base + this.baseRotations + finalAngle;
    } else {
      // Random spin
      const extraRandomRotation = Math.floor(Math.random() * 360);
      this.targetRotation =
        this.startRotation + this.baseRotations + extraRandomRotation;
    }

    this.spinStartTime = performance.now();
    this._animateSpin();
  }

  /**
   * Generates the SVG path data for the specified segment index.
   *
   * @param index - The zero-based segment index.
   * @returns A string of SVG path commands representing one pie-slice segment.
   */
  public getSegmentPath(index: number): string {
    const startAngle = this._getSegmentStartAngle(index);
    const endAngle = startAngle + this._segmentAngles[index];
    const start = polarToCartesian(startAngle, this.radius);
    const end = polarToCartesian(endAngle, this.radius);
    const anglePerSegment = this._segmentAngles[index];
    const largeArcFlag = anglePerSegment > 180 ? 1 : 0;

    return [
      `M 0 0`,
      `L ${start.x} ${start.y}`,
      `A ${this.radius} ${this.radius} 0 ${largeArcFlag} 1 ${end.x} ${end.y}`,
      `Z`,
    ].join(' ');
  }

  /**
   * Determines the color for the segment at a given index.
   *
   * @param index - The segment index.
   * @returns A string representing a CSS color value.
   */
  public getSegmentColor(index: number): string {
    // Simple alternating color example
    return index % 2 === 0 ? '#fdd835' : '#ffa726';
  }

  /**
   * Computes the transform string to position text at the midpoint of a segment.
   *
   * @param index - The segment index.
   * @returns An SVG transform string that translates and rotates the text.
   */
  public getTextTransform(index: number): string {
    const midAngle = this._getSegmentMidAngle(index);
    const textRadius = this.radius * 0.6;
    const angleRadians = (midAngle - 90) * (Math.PI / 180);
    const x = textRadius * Math.cos(angleRadians);
    const y = textRadius * Math.sin(angleRadians);
    return `translate(${x}, ${y}) rotate(${midAngle})`;
  }

  /* ----------------------------------------------------
   * Private Helpers
   * -------------------------------------------------- */

  /**
   * Initializes component state from the `config` input.
   *
   * Extracts segment labels, sizes, spin duration, and cubic-bezier points.
   */
  private _initializeFromConfig(): void {
    const { segments, spinDuration } = this.config;

    if (segments && segments.length > 0) {
      this.segments = segments.map((tuple) => tuple[0]);
      this.segmentSizes = segments.map((tuple) => tuple[1]);
    } else {
      this.segments = [];
      this.segmentSizes = [];
    }

    this._spinDuration = spinDuration ?? 7000;
  }

  /**
   * Converts the segment sizes to angles that sum to 360°.
   * If no valid sizes are found, distributes angles equally.
   */
  private _calculateSegmentAngles(): void {
    const count = this.segments.length;
    if (count === 0) {
      this._segmentAngles = [];
      return;
    }

    const totalSize = this.segmentSizes.reduce((a, b) => a + b, 0);
    if (totalSize === 0) {
      // fallback: equal angles
      const equalAngle = 360 / count;
      this._segmentAngles = new Array(count).fill(equalAngle);
    } else {
      this._segmentAngles = this.segmentSizes.map(
        (sz) => (sz / totalSize) * 360,
      );
    }
  }

  /**
   * Continuously animates the wheel rotation based on a time-based approach
   * and a custom cubic-bezier easing until the spin duration elapses.
   */
  private _animateSpin(): void {
    this.animationId = requestAnimationFrame((timestamp) => {
      const elapsed = timestamp - this.spinStartTime;
      const progress = Math.min(elapsed / this._spinDuration, 1);

      // Evaluate cubic-bezier on Y dimension (a simplification).
      const easedValue = cubicBezierY(progress, [this._y1, this._y2]);

      // Interpolate rotation
      this.currentRotation =
        this.startRotation +
        (this.targetRotation - this.startRotation) * easedValue;

      if (progress < 1) {
        this._animateSpin();
      } else {
        // Complete
        this.currentRotation = this.targetRotation;
        this.animationId = null;
        this._emitWinningSegment();
      }
    });
  }

  /**
   * Determines which segment the pointer lands on and emits that segment name via `spinEnd`.
   */
  private _emitWinningSegment(): void {
    const wheelAngle = ((this.currentRotation % 360) + 360) % 360;
    const pointerAngle = (360 - wheelAngle) % 360;

    let accumulatedAngle = 0;
    for (let i = 0; i < this.segments.length; i++) {
      const startAngle = accumulatedAngle;
      const segAngle = this._segmentAngles[i];
      const endAngle = startAngle + segAngle;
      if (pointerAngle >= startAngle && pointerAngle < endAngle) {
        this.spinEnd.emit(this.segments[i]);
        return;
      }
      accumulatedAngle += segAngle;
    }

    // Fallback in case of floating-point mismatch
    if (this.segments.length > 0) {
      this.spinEnd.emit(this.segments[this.segments.length - 1]);
    }
  }

  /**
   * @param index - The segment index.
   * @returns The starting angle of the given segment.
   */
  private _getSegmentStartAngle(index: number): number {
    let angleSum = 0;
    for (let i = 0; i < index; i++) {
      angleSum += this._segmentAngles[i];
    }
    return angleSum;
  }

  /**
   * @param index - The segment index.
   * @returns The midpoint angle of the given segment.
   */
  private _getSegmentMidAngle(index: number): number {
    const startAngle = this._getSegmentStartAngle(index);
    return startAngle + this._segmentAngles[index] / 2;
  }
}
