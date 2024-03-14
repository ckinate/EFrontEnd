import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QueryreplymodalComponent } from './queryreplymodal.component';

describe('QueryreplymodalComponent', () => {
  let component: QueryreplymodalComponent;
  let fixture: ComponentFixture<QueryreplymodalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ QueryreplymodalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(QueryreplymodalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
