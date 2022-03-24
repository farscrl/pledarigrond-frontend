import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IdiomNavigationComponent } from './idiom-navigation.component';

describe('IdiomNavigationComponent', () => {
  let component: IdiomNavigationComponent;
  let fixture: ComponentFixture<IdiomNavigationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IdiomNavigationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(IdiomNavigationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
