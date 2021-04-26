import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PackagingMaterialComponent } from './packaging-material.component';

describe('PackagingMaterialComponent', () => {
  let component: PackagingMaterialComponent;
  let fixture: ComponentFixture<PackagingMaterialComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PackagingMaterialComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PackagingMaterialComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
