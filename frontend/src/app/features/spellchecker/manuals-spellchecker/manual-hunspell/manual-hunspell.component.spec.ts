import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManualHunspellComponent } from './manual-hunspell.component';

describe('ManualHunspellComponent', () => {
  let component: ManualHunspellComponent;
  let fixture: ComponentFixture<ManualHunspellComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ManualHunspellComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ManualHunspellComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
