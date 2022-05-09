import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdjectiveGenerationComponent } from './adjective-generation.component';

describe('AdjectiveGenerationComponent', () => {
  let component: AdjectiveGenerationComponent;
  let fixture: ComponentFixture<AdjectiveGenerationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdjectiveGenerationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdjectiveGenerationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
