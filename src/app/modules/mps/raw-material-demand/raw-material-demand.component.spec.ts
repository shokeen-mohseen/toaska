import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RawMaterialDemandComponent } from './raw-material-demand.component';

describe('RawMaterialDemandComponent', () => {
  let component: RawMaterialDemandComponent;
  let fixture: ComponentFixture<RawMaterialDemandComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RawMaterialDemandComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RawMaterialDemandComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
