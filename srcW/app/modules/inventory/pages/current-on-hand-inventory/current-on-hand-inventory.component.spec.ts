import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CurrentOnHandInventoryComponent } from './current-on-hand-inventory.component';

describe('CurrentOnHandInventoryComponent', () => {
  let component: CurrentOnHandInventoryComponent;
  let fixture: ComponentFixture<CurrentOnHandInventoryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CurrentOnHandInventoryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CurrentOnHandInventoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
