import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MarieLayoutComponent } from './marie-layout-component';

describe('MarieLayoutComponent', () => {
  let component: MarieLayoutComponent;
  let fixture: ComponentFixture<MarieLayoutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MarieLayoutComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(MarieLayoutComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
