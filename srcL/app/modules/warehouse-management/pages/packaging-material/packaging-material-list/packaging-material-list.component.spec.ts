import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PackagingMaterialListComponent } from './packaging-material-list.component';

describe('PackagingMaterialListComponent', () => {
  let component: PackagingMaterialListComponent;
  let fixture: ComponentFixture<PackagingMaterialListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PackagingMaterialListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PackagingMaterialListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
