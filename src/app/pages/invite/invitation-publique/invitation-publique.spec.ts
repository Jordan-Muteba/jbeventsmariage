import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InvitationPublique } from './invitation-publique';

describe('InvitationPublique', () => {
  let component: InvitationPublique;
  let fixture: ComponentFixture<InvitationPublique>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InvitationPublique],
    }).compileComponents();

    fixture = TestBed.createComponent(InvitationPublique);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
