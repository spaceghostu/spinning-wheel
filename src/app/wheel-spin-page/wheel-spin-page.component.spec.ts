import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WheelSpinPageComponent } from './wheel-spin-page.component';

describe('WheelSpinPageComponent', () => {
  let component: WheelSpinPageComponent;
  let fixture: ComponentFixture<WheelSpinPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WheelSpinPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WheelSpinPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
