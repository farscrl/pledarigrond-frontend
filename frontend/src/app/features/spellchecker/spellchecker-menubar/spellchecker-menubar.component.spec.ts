import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SpellcheckerMenubarComponent } from './spellchecker-menubar.component';

describe('SpellcheckerMenubarComponent', () => {
  let component: SpellcheckerMenubarComponent;
  let fixture: ComponentFixture<SpellcheckerMenubarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [SpellcheckerMenubarComponent]
})
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SpellcheckerMenubarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
