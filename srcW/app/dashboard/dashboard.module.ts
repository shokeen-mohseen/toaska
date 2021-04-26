//TFSID 16498 Arc Partograph site - Create  components for Home,
//Product, Benefits, Pricing, About Us & Contact Us.
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardRoutingModule } from './dashboard-routing.module';
import { ArcpartographComponent } from './arcpartograph/arcpartograph.component';
import { HomeComponent } from './home/home.component';
import { BenefitsComponent } from './benefits/benefits.component';
import { ProductsComponent } from './products/products.component';
import { PricingComponent } from './pricing/pricing.component';
import { AboutusComponent } from './aboutus/aboutus.component';
import { SharedModule } from '@app/shared';
@NgModule({
  declarations: [
    ArcpartographComponent,
    HomeComponent,
    BenefitsComponent,
    ProductsComponent,
    PricingComponent,
    AboutusComponent
    ],
  imports: [
    CommonModule,
    DashboardRoutingModule,
    SharedModule
  ]
})
export class DashboardModule { }
