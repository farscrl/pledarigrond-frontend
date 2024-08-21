import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailsSubstComponent } from './details-subst.component';

describe('DetailsSubstComponent', () => {
  let component: DetailsSubstComponent;
  let fixture: ComponentFixture<DetailsSubstComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DetailsSubstComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DetailsSubstComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
