import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MaterialChainOfCustodyListComponent } from './material-chain-of-custody-list.component';

describe('MaterialChainOfCustodyListComponent', () => {
  let component: MaterialChainOfCustodyListComponent;
  let fixture: ComponentFixture<MaterialChainOfCustodyListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MaterialChainOfCustodyListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MaterialChainOfCustodyListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
