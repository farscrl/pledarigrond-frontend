import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SpellcheckerComponent } from './spellchecker.component';

describe('SpellcheckerComponent', () => {
  let component: SpellcheckerComponent;
  let fixture: ComponentFixture<SpellcheckerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [SpellcheckerComponent]
})
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SpellcheckerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
