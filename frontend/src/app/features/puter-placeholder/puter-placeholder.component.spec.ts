import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PuterPlaceholderComponent } from './puter-placeholder.component';

describe('PuterPlaceholderComponent', () => {
  let component: PuterPlaceholderComponent;
  let fixture: ComponentFixture<PuterPlaceholderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [PuterPlaceholderComponent]
})
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PuterPlaceholderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
