import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NameDisplayComponent } from './name-display.component';

describe('NameDisplayComponent', () => {
  let component: NameDisplayComponent;
  let fixture: ComponentFixture<NameDisplayComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [NameDisplayComponent]
})
    .compileComponents();

    fixture = TestBed.createComponent(NameDisplayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
