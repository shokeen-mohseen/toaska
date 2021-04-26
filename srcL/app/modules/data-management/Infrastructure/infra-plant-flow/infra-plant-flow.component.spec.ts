import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InfraPlantFlowComponent } from './infra-plant-flow.component';

describe('InfraPlantFlowComponent', () => {
  let component: InfraPlantFlowComponent;
  let fixture: ComponentFixture<InfraPlantFlowComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InfraPlantFlowComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InfraPlantFlowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
