import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LemmaListComponent } from './lemma-list.component';

describe('LemmaListComponent', () => {
  let component: LemmaListComponent;
  let fixture: ComponentFixture<LemmaListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LemmaListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LemmaListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
