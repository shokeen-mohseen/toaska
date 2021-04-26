import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PlantInventoryLevelsComponent } from './plant-inventory-levels.component';

describe('PlantInventoryLevelsComponent', () => {
  let component: PlantInventoryLevelsComponent;
  let fixture: ComponentFixture<PlantInventoryLevelsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PlantInventoryLevelsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PlantInventoryLevelsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
