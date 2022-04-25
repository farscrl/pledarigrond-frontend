import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChangeSortOrderComponent } from './change-sort-order.component';

describe('ChangeSortOrderComponent', () => {
  let component: ChangeSortOrderComponent;
  let fixture: ComponentFixture<ChangeSortOrderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChangeSortOrderComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChangeSortOrderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
