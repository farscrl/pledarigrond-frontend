import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NameAdministrationComponent } from './name-administration.component';

describe('NameAdministrationComponent', () => {
  let component: NameAdministrationComponent;
  let fixture: ComponentFixture<NameAdministrationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [NameAdministrationComponent]
})
    .compileComponents();

    fixture = TestBed.createComponent(NameAdministrationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
