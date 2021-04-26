import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PartographMonitoringComponent } from './partograph-monitoring.component';

describe('PartographMonitoringComponent', () => {
  let component: PartographMonitoringComponent;
  let fixture: ComponentFixture<PartographMonitoringComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PartographMonitoringComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PartographMonitoringComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
