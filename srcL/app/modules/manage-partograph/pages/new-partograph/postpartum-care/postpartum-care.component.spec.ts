import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PostpartumCareComponent } from './postpartum-care.component';

describe('PostpartumCareComponent', () => {
  let component: PostpartumCareComponent;
  let fixture: ComponentFixture<PostpartumCareComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PostpartumCareComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PostpartumCareComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
