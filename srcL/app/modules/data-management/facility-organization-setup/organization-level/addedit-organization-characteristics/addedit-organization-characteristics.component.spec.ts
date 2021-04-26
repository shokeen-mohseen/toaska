import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddeditOrganizationCharacteristicsComponent } from './addedit-organization-characteristics.component';

describe('AddeditOrganizationCharacteristicsComponent', () => {
  let component: AddeditOrganizationCharacteristicsComponent;
  let fixture: ComponentFixture<AddeditOrganizationCharacteristicsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddeditOrganizationCharacteristicsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddeditOrganizationCharacteristicsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
