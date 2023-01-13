import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LemmaDiffComponent } from './lemma-diff.component';

describe('LemmaDiffComponent', () => {
  let component: LemmaDiffComponent;
  let fixture: ComponentFixture<LemmaDiffComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LemmaDiffComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LemmaDiffComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
