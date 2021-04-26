import { Routes } from '@angular/router';
import { projectkey } from '@env/projectkey';

export const CONTENT_ROUTES: Routes = [
  {
    path: 'dashboard',
    //loadChildren: './modules/home/home.module#HomeModule'
    loadChildren: () => projectkey.projectname == 'tosca' ? import(`app/modules/tosca-home/home.module`).then(m => m.HomeModule) : import(`app/modules/home/home.module`).then(m => m.HomeModule)
    // for tosca redirect home
    //loadChildren: () => import(`app/modules/tosca-home/home.module`).then(m => m.HomeModule)

  },
  {
    path: 'manage-partograph',
    loadChildren: () => import(`app/modules/manage-partograph/manage-partograph.module`).then(m => m.ManagePartographModule)
    //  loadChildren: './modules/manage-partograph/manage-partograph.module#ManagePartographModule'
  },
  {
    path: '',
    loadChildren: () => import(`app/modules/unauthorized/Unauthorized.module`).then(m => m.UnauthorizedModule)
  },
  {
    path: 'inventory-target',
    loadChildren: () => import(`app/modules/inventory-target/inventory-target.module`).then(m => m.InventoryTargetModule)
   },
  {
    path: 'contact',
    //loadChildren: './modules/contact/contact.module#ContactModule'
    loadChildren: () => import(`app/modules/contact/contact.module`).then(m => m.ContactModule)
  },
  {
    path: 'user-management',
   loadChildren: () => import(`app/modules/user-management/user-management.module`).then(m => m.UserManagementModule)
  },
  {
    path: 'order-management',
    loadChildren: () => import(`app/modules/order-management/order-management.module`).then(m => m.OrderManagementModule)
  },
  {
    path: 'shipment-management',
    loadChildren: () => import(`app/modules/shipment-management/shipment-management.module`).then(m => m.ShipmentManagementModule)
  },
  {
    path: 'alert-management',
     loadChildren: () => import(`app/modules/alert-management/alert-management.module`).then(m => m.AlertManagementModule)
  },
  
  {
    path: 'plan',
    //loadChildren: './modules/contact/contact.module#ContactModule'
    loadChildren: () => import(`app/modules/plan/plan.module`).then(m => m.PlanModule)
  },

  {
    path: 'data-management',
    //loadChildren: './modules/contact/contact.module#ContactModule'
    loadChildren: () => import(`app/modules/data-management/data-management.module`).then(m => m.DataManagementModule)
  },

  {
    path: 'credit-management',
    //loadChildren: './modules/contact/contact.module#ContactModule'
    loadChildren: () => import(`app/modules/credit-management/credit-management.module`).then(m => m.CreditManagementModule)
  },

  {
    path: 'system-settings',
    //loadChildren: './modules/contact/contact.module#ContactModule'
    loadChildren: () => import(`app/modules/system-settings/system-settings.module`).then(m => m.SystemSettingsModule)
  },

  {
    path: 'inventory',
    loadChildren: () => import(`app/modules/inventory/inventory.module`).then(m => m.InventoryModule)
  },

  {
    path: 'forecasting',
    loadChildren: () => import(`app/modules/forecasting/forecasting.module`).then(m => m.ForecastingModule)
  },

  {
    path: 'reports',
    loadChildren: () => import(`app/modules/reports/reports.module`).then(m => m.ReportsModule)
  },

  {
    path: 'assets',
    loadChildren: () => import(`app/assets/assets.module`).then(m => m.AssetsModule)
  },
  {
    path: 'fps-management',
    loadChildren: () => import(`app/modules/fps-management/fps-management.module`).then(m => m.FPSManagementModule)
  },
  {
    path: 'mps',
    loadChildren: () => import(`app/modules/mps/mps.module`).then(m => m.MpsModule)
  },
  {
    path: 'warehouse-management',
    loadChildren: () => import(`app/modules/warehouse-management/warehouse-management.module`).then(m => m.WarehouseManagementModule)
  },
  {
    path: 'purchase-order',
    loadChildren: () => import(`app/modules/purchase-order/purchase-order.module`).then(m => m.PurchaseOrderModule)
  },
 
];
