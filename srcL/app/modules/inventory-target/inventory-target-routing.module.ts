import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DCInventoryLevelsComponent } from './pages/dcinventory-levels/dcinventory-levels.component';
import { PlantInventoryLevelsComponent } from './pages/plant-inventory-levels/plant-inventory-levels.component';

const routes: Routes = [
  // {
  //   path: '',
  //   component: FindPartographComponent
  // },
   {
    path: 'dcinventory-levels',
    component: DCInventoryLevelsComponent
  },
  {
    path: 'plant-inventory-levels',
    component: PlantInventoryLevelsComponent
  }
 
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class InventorytargetRoutingModule { }
