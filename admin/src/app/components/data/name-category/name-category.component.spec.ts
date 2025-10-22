import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NameCategoryComponent } from './name-category.component';

describe('NameCategoryComponent', () => {
  let component: NameCategoryComponent;
  let fixture: ComponentFixture<NameCategoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [NameCategoryComponent]
})
    .compileComponents();

    fixture = TestBed.createComponent(NameCategoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
