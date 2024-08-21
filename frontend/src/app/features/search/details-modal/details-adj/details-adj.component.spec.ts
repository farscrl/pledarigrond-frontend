import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailsAdjComponent } from './details-adj.component';

describe('DetailsAdjComponent', () => {
  let component: DetailsAdjComponent;
  let fixture: ComponentFixture<DetailsAdjComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DetailsAdjComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DetailsAdjComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
