import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DocumentloadComponent } from './documentload.component';

describe('DocumentloadComponent', () => {
  let component: DocumentloadComponent;
  let fixture: ComponentFixture<DocumentloadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DocumentloadComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DocumentloadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
