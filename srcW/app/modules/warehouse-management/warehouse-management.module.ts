import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WarehouseManagementRoutingModule } from './warehouse-management-routing.module';

import { SharedModule } from '@app/shared';
import { UiSwitchModule } from 'ngx-ui-switch';
import { MaterialModule } from 'app/material/material.module';
import { HttpClientModule } from '@angular/common/http';
import { AngularMultiSelectModule } from 'angular2-multiselect-dropdown';
import { ResizableModule } from 'angular-resizable-element';

import { ReceiptOrderComponent } from './pages/receipt-order/receipt-order.component';
import { ReceiptOrderListComponent } from './pages/receipt-order/receipt-order-list/receipt-order-list.component';
import { IssueOrderComponent } from './pages/issue-order/issue-order.component';
import { IssueOrderListComponent } from './pages/issue-order/issue-order-list/issue-order-list.component';
import { InventoryDailyViewComponent } from './pages/inventory-daily-view/inventory-daily-view.component';
import { InventoryDailyViewListComponent } from './pages/inventory-daily-view/inventory-daily-view-list/inventory-daily-view-list.component';
import { MaterialInBoxComponent } from './pages/material-in-box/material-in-box.component';
import { MaterialInBoxListComponent } from './pages/material-in-box/material-in-box-list/material-in-box-list.component';
import { PackagingMaterialComponent } from './pages/packaging-material/packaging-material.component';
import { PackagingMaterialListComponent } from './pages/packaging-material/packaging-material-list/packaging-material-list.component';
import { GenerateTagsComponent } from './pages/generate-tags/generate-tags.component';
import { GenerateTagsListComponent } from './pages/generate-tags/generate-tags-list/generate-tags-list.component';
import { AssociateRfidComponent } from './pages/associate-rfid/associate-rfid.component';
import { AssociateRfidListComponent } from './pages/associate-rfid/associate-rfid-list/associate-rfid-list.component';
import { AssetInOutComponent } from './pages/asset-in-out/asset-in-out.component';
import { AssetInOutListComponent } from './pages/asset-in-out/asset-in-out-list/asset-in-out-list.component';
import { MaterialChainOfCustodyComponent } from './pages/material-chain-of-custody/material-chain-of-custody.component';
import { MaterialChainOfCustodyListComponent } from './pages/material-chain-of-custody/material-chain-of-custody-list/material-chain-of-custody-list.component';



@NgModule({
  declarations: [ReceiptOrderComponent, ReceiptOrderListComponent, IssueOrderComponent, IssueOrderListComponent, InventoryDailyViewComponent, InventoryDailyViewListComponent, MaterialInBoxComponent, MaterialInBoxListComponent, PackagingMaterialComponent, PackagingMaterialListComponent, GenerateTagsComponent, GenerateTagsListComponent, AssociateRfidComponent, AssociateRfidListComponent, AssetInOutComponent, AssetInOutListComponent, MaterialChainOfCustodyComponent, MaterialChainOfCustodyListComponent],
  imports: [
    CommonModule,
    WarehouseManagementRoutingModule,
    SharedModule,
    UiSwitchModule,
    MaterialModule,
    HttpClientModule,
    AngularMultiSelectModule,
    ResizableModule
  ]
})
export class WarehouseManagementModule { }
