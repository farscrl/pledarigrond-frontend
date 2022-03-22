import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SursilvanPlaceholderComponent } from './sursilvan-placeholder.component';

describe('SursilvanPlaceholderComponent', () => {
  let component: SursilvanPlaceholderComponent;
  let fixture: ComponentFixture<SursilvanPlaceholderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SursilvanPlaceholderComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SursilvanPlaceholderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
