import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IdiomCardComponent } from './idiom-card.component';

describe('IdiomCardComponent', () => {
  let component: IdiomCardComponent;
  let fixture: ComponentFixture<IdiomCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [IdiomCardComponent]
})
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(IdiomCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
