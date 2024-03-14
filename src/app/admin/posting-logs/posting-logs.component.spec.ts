import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PostingLogsComponent } from './posting-logs.component';

describe('PostingLogsComponent', () => {
  let component: PostingLogsComponent;
  let fixture: ComponentFixture<PostingLogsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PostingLogsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PostingLogsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
