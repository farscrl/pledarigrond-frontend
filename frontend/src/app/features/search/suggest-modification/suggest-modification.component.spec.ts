import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SuggestModificationComponent } from './suggest-modification.component';

describe('SuggestModificationComponent', () => {
  let component: SuggestModificationComponent;
  let fixture: ComponentFixture<SuggestModificationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [SuggestModificationComponent]
})
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SuggestModificationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
