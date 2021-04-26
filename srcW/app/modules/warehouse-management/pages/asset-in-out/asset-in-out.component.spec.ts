import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AssetInOutComponent } from './asset-in-out.component';

describe('AssetInOutComponent', () => {
  let component: AssetInOutComponent;
  let fixture: ComponentFixture<AssetInOutComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AssetInOutComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AssetInOutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
