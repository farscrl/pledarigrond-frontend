import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailsExampleComponent } from './details-example.component';

describe('DetailsExampleComponent', () => {
  let component: DetailsExampleComponent;
  let fixture: ComponentFixture<DetailsExampleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DetailsExampleComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DetailsExampleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
