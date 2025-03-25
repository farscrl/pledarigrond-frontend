import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManualsSpellcheckerComponent } from './manuals-spellchecker.component';

describe('ManualsSpellcheckerComponent', () => {
  let component: ManualsSpellcheckerComponent;
  let fixture: ComponentFixture<ManualsSpellcheckerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [ManualsSpellcheckerComponent]
})
    .compileComponents();

    fixture = TestBed.createComponent(ManualsSpellcheckerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
