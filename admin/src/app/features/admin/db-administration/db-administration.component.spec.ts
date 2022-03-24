import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DbAdministrationComponent } from './db-administration.component';

describe('DbAdministrationComponent', () => {
  let component: DbAdministrationComponent;
  let fixture: ComponentFixture<DbAdministrationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DbAdministrationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DbAdministrationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
