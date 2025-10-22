import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IndexAdministrationComponent } from './index-administration.component';

describe('IndexAdministrationComponent', () => {
  let component: IndexAdministrationComponent;
  let fixture: ComponentFixture<IndexAdministrationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [IndexAdministrationComponent]
})
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(IndexAdministrationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
