import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ValladerPlaceholderComponent } from './vallader-placeholder.component';

describe('ValladerPlaceholderComponent', () => {
  let component: ValladerPlaceholderComponent;
  let fixture: ComponentFixture<ValladerPlaceholderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [ValladerPlaceholderComponent]
})
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ValladerPlaceholderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
