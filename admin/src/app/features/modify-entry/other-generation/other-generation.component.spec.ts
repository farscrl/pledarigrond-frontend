import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OtherGenerationComponent } from './other-generation.component';

describe('OtherGenerationComponent', () => {
  let component: OtherGenerationComponent;
  let fixture: ComponentFixture<OtherGenerationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [OtherGenerationComponent]
})
    .compileComponents();

    fixture = TestBed.createComponent(OtherGenerationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
