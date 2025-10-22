import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DiffModalComponent } from './diff-modal.component';

describe('DiffModalComponent', () => {
  let component: DiffModalComponent;
  let fixture: ComponentFixture<DiffModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [DiffModalComponent]
})
    .compileComponents();

    fixture = TestBed.createComponent(DiffModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
