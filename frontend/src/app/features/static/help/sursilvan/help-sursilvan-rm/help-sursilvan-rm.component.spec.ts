import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HelpSursilvanRmComponent } from './help-sursilvan-rm.component';

describe('HelpSursilvanRmComponent', () => {
  let component: HelpSursilvanRmComponent;
  let fixture: ComponentFixture<HelpSursilvanRmComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [HelpSursilvanRmComponent]
})
    .compileComponents();

    fixture = TestBed.createComponent(HelpSursilvanRmComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
