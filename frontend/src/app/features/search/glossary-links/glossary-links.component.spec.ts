import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GlossaryLinksComponent } from './glossary-links.component';

describe('GlossaryLinksComponent', () => {
  let component: GlossaryLinksComponent;
  let fixture: ComponentFixture<GlossaryLinksComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GlossaryLinksComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GlossaryLinksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
