import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageMarketForecastImportComponent } from './manage-market-forecast-import.component';

describe('ManageMarketForecastImportComponent', () => {
  let component: ManageMarketForecastImportComponent;
  let fixture: ComponentFixture<ManageMarketForecastImportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ManageMarketForecastImportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageMarketForecastImportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
