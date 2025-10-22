import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImportDumpComponent } from './import-dump.component';

describe('ImportDumpComponent', () => {
  let component: ImportDumpComponent;
  let fixture: ComponentFixture<ImportDumpComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [ImportDumpComponent]
})
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ImportDumpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
