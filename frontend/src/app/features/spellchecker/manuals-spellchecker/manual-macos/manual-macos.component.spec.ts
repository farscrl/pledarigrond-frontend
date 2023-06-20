import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManualMacosComponent } from './manual-macos.component';

describe('ManualMacosComponent', () => {
  let component: ManualMacosComponent;
  let fixture: ComponentFixture<ManualMacosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ManualMacosComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ManualMacosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
