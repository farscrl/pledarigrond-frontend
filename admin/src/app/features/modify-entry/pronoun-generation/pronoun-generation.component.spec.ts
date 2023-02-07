import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OtherGenerationComponent } from './other-generation.component';

describe('AdjectiveGenerationComponent', () => {
  let component: OtherGenerationComponent;
  let fixture: ComponentFixture<OtherGenerationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OtherGenerationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OtherGenerationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
