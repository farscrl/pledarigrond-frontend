import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SpellcheckerContextMenuComponent } from './spellchecker-context-menu.component';

describe('SpellcheckerContextMenuComponent', () => {
  let component: SpellcheckerContextMenuComponent;
  let fixture: ComponentFixture<SpellcheckerContextMenuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SpellcheckerContextMenuComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SpellcheckerContextMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
