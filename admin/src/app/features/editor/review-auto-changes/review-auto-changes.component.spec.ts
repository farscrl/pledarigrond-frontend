import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReviewAutoChangesComponent } from './review-auto-changes.component';

describe('ReviewAutoChangesComponent', () => {
  let component: ReviewAutoChangesComponent;
  let fixture: ComponentFixture<ReviewAutoChangesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [ReviewAutoChangesComponent]
})
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReviewAutoChangesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
