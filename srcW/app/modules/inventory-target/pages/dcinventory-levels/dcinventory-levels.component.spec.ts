import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DCInventoryLevelsComponent } from './dcinventory-levels.component';

describe('DCInventoryLevelsComponent', () => {
  let component: DCInventoryLevelsComponent;
  let fixture: ComponentFixture<DCInventoryLevelsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DCInventoryLevelsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DCInventoryLevelsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
