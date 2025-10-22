import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NounGenerationComponent } from './noun-generation.component';

describe('NounGenerationComponent', () => {
  let component: NounGenerationComponent;
  let fixture: ComponentFixture<NounGenerationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [NounGenerationComponent]
})
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NounGenerationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
