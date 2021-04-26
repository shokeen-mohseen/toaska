import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CurrentOnHandInventoryComponent } from './pages/current-on-hand-inventory/current-on-hand-inventory.component';
import { InventoryReservationComponent } from './pages/inventory-reservation/inventory-reservation.component';
import { BucketComponent } from './pages/bucket/bucket.component';
import { InventoryAvailabilityForecastComponent } from './pages/inventory-availability-forecast/inventory-availability-forecast.component';

const routes: Routes = [
  // {
  //   path: '',
  //   component: FindPartographComponent
  // },
  // {
  //   path: 'new-partograph',
  //   component: NewPartographComponent
  // }

  {
    path: 'current-on-hand-inventory',
    component: CurrentOnHandInventoryComponent
  },
  {
    path: 'inventory-reservation',
    component: InventoryReservationComponent
  },
  {
    path: 'bucket',
    component: BucketComponent
  },
  {
    path: 'inventory-availability-forecast',
    component: InventoryAvailabilityForecastComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class InventoryRoutingModule { }
