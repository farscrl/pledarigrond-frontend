import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManualWordComponent } from './manual-word.component';

describe('ManualWordComponent', () => {
  let component: ManualWordComponent;
  let fixture: ComponentFixture<ManualWordComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [ManualWordComponent]
})
    .compileComponents();

    fixture = TestBed.createComponent(ManualWordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
