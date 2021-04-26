import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AssetInOutListComponent } from './asset-in-out-list.component';

describe('AssetInOutListComponent', () => {
  let component: AssetInOutListComponent;
  let fixture: ComponentFixture<AssetInOutListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AssetInOutListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AssetInOutListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
