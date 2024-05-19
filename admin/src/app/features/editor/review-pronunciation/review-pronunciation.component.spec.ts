import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReviewPronunciationComponent } from './review-pronunciation.component';

describe('ReviewPronunciationComponent', () => {
  let component: ReviewPronunciationComponent;
  let fixture: ComponentFixture<ReviewPronunciationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReviewPronunciationComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ReviewPronunciationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
