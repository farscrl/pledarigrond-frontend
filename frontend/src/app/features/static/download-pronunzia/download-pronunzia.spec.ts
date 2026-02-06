import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DownloadPronunzia } from './download-pronunzia';

describe('DownloadPronunzia', () => {
  let component: DownloadPronunzia;
  let fixture: ComponentFixture<DownloadPronunzia>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DownloadPronunzia]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DownloadPronunzia);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
