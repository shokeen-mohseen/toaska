import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteCommoditytypePopupComponent } from './delete-commoditytype-popup.component';

describe('DeleteCommoditytypePopupComponent', () => {
  let component: DeleteCommoditytypePopupComponent;
  let fixture: ComponentFixture<DeleteCommoditytypePopupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeleteCommoditytypePopupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeleteCommoditytypePopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
