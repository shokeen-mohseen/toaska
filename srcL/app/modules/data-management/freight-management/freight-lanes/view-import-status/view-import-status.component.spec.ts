import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewImportStatusComponent } from './view-import-status.component';

describe('ViewImportStatusComponent', () => {
  let component: ViewImportStatusComponent;
  let fixture: ComponentFixture<ViewImportStatusComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewImportStatusComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewImportStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
