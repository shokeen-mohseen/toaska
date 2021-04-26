import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditShipRoutingComponent } from './edit-ship-routing.component';

describe('EditShipRoutingComponent', () => {
  let component: EditShipRoutingComponent;
  let fixture: ComponentFixture<EditShipRoutingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditShipRoutingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditShipRoutingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
