import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NavigationHorizontalComponent } from './navigation-horizontal.component';

describe('NavigationHorizontalComponent', () => {
  let component: NavigationHorizontalComponent;
  let fixture: ComponentFixture<NavigationHorizontalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [NavigationHorizontalComponent]
})
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NavigationHorizontalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
