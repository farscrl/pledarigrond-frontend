import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NoPermissionsComponent } from './no-permissions.component';

describe('NoPermissionsComponent', () => {
  let component: NoPermissionsComponent;
  let fixture: ComponentFixture<NoPermissionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [NoPermissionsComponent]
})
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NoPermissionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
