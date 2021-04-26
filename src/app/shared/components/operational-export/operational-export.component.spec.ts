import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OperationalExportComponent } from './operational-export.component';

describe('OperationalExportComponent', () => {
  let component: OperationalExportComponent;
  let fixture: ComponentFixture<OperationalExportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OperationalExportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OperationalExportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
