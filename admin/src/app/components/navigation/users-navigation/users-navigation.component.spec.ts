import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UsersNavigationComponent } from './users-navigation.component';

describe('UsersNavigationComponent', () => {
  let component: UsersNavigationComponent;
  let fixture: ComponentFixture<UsersNavigationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UsersNavigationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UsersNavigationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
