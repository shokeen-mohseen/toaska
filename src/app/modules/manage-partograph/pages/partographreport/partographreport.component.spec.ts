import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PartographreportComponent } from './partographreport.component';

describe('PartographreportComponent', () => {
  let component: PartographreportComponent;
  let fixture: ComponentFixture<PartographreportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PartographreportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PartographreportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
