import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HelpSursilvanDeComponent } from './help-sursilvan-de.component';

describe('HelpSursilvanDeComponent', () => {
  let component: HelpSursilvanDeComponent;
  let fixture: ComponentFixture<HelpSursilvanDeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [HelpSursilvanDeComponent]
})
    .compileComponents();

    fixture = TestBed.createComponent(HelpSursilvanDeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
