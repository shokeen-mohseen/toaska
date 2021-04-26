import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PlantInventoryLavelListComponent } from './plant-inventory-lavel-list.component';

describe('PlantInventoryLavelListComponent', () => {
  let component: PlantInventoryLavelListComponent;
  let fixture: ComponentFixture<PlantInventoryLavelListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PlantInventoryLavelListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PlantInventoryLavelListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
