import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExportDumpComponent } from './export-dump.component';

describe('ExportDumpComponent', () => {
  let component: ExportDumpComponent;
  let fixture: ComponentFixture<ExportDumpComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ExportDumpComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ExportDumpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
