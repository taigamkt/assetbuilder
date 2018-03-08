import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {MarketplaceListingComponent} from './marketplace-listing.component';

describe('MarketplaceListingComponent', () => {
  let component: MarketplaceListingComponent;
  let fixture: ComponentFixture<MarketplaceListingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [MarketplaceListingComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MarketplaceListingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
