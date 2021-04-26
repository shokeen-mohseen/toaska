import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModulerolepermissionsComponent } from './modulerolepermissions.component';

describe('ModulerolepermissionsComponent', () => {
  let component: ModulerolepermissionsComponent;
  let fixture: ComponentFixture<ModulerolepermissionsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModulerolepermissionsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModulerolepermissionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
