//TFSID 16498 Arc Partograph site - Create  components for Home,
//Product, Benefits, Pricing, About Us & Contact Us.
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ArcpartographComponent } from './arcpartograph/arcpartograph.component';
import { HomeComponent } from './home/home.component';
import { BenefitsComponent } from './benefits/benefits.component';
import { ProductsComponent } from './products/products.component';
import { PricingComponent } from './pricing/pricing.component';
import { AboutusComponent } from './aboutus/aboutus.component';
import { DasboardLayoutComponent } from '@app/layouts/dasboard-layout/dasboard-layout.component';

const routes: Routes = [

  
  {
    path: '',
    redirectTo: '/arcpartograph',
    pathMatch: 'full'
  },
    
  {
    path: '',
    children: [
      {
        path: '',
        component: ArcpartographComponent
      },
      {
        path: 'benefits',
        component: BenefitsComponent
      },
      {
        path: 'products',
        component: ProductsComponent
      },
      {
        path: 'aboutus',
        component: AboutusComponent
      },
      {
        path: 'prices',
        component: PricingComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DashboardRoutingModule { }
