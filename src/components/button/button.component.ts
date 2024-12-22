import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

type ButtonVariant = 'flat' | 'outlined' | 'solid';
type ButtonColor = 'primary' | 'secondary';
type ButtonSize = 'small' | 'medium' | 'large';
type ButtonType = 'button' | 'submit';

@Component({
  selector: 'app-button',
  templateUrl: './button.component.html',
  styleUrl: './button.component.scss',
  imports: [CommonModule],
  standalone: true,
})
export class ButtonComponent {
  @Input() text: string = '';
  @Input() variant: ButtonVariant = 'flat';
  @Input() disabled: boolean = false;
  @Input() color: ButtonColor = 'primary';
  @Input() size: ButtonSize = 'medium';
  @Input() type: ButtonType = 'button';

  @Output() click = new EventEmitter<void>();

  onClick() {
    this.click.emit();
  }
}
