import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ReceiptOrderComponent } from './pages/receipt-order/receipt-order.component';
import { IssueOrderComponent } from './pages/issue-order/issue-order.component';
import { InventoryDailyViewComponent } from './pages/inventory-daily-view/inventory-daily-view.component';
import { MaterialInBoxComponent } from './pages/material-in-box/material-in-box.component';
import { PackagingMaterialComponent } from './pages/packaging-material/packaging-material.component';
import { GenerateTagsComponent } from './pages/generate-tags/generate-tags.component';
import { AssociateRfidComponent } from './pages/associate-rfid/associate-rfid.component';
import { AssetInOutComponent } from './pages/asset-in-out/asset-in-out.component';
import { MaterialChainOfCustodyComponent } from './pages/material-chain-of-custody/material-chain-of-custody.component';

const routes: Routes = [
  //{
  //  path: 'receipt-order',
  //  component: ReceiptOrderComponent
  //}
  {
    path: 'receipt-order',
    component: ReceiptOrderComponent
  },
  {
    path: 'issue-order',
    component: IssueOrderComponent
  },
  {
    path: 'inventory-daily-view',
    component: InventoryDailyViewComponent
  },
  {
    path: 'material-in-box',
    component: MaterialInBoxComponent
  },
  {
    path: 'packaging-material',
    component: PackagingMaterialComponent
  },
  {
    path: 'generate-tags',
    component: GenerateTagsComponent
  },
  {
    path: 'associate-rfid',
    component: AssociateRfidComponent
  },
  {
    path: 'asset-in-out',
    component: AssetInOutComponent
  },
  {
    path: 'material-chain-of-custody',
    component: MaterialChainOfCustodyComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class WarehouseManagementRoutingModule { }
