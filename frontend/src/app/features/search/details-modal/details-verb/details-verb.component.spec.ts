import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailsVerbComponent } from './details-verb.component';

describe('DetailsVerbComponent', () => {
  let component: DetailsVerbComponent;
  let fixture: ComponentFixture<DetailsVerbComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DetailsVerbComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DetailsVerbComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
