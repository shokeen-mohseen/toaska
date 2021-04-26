import { INavData } from '@coreui/angular';
// TFSID 16469 Dynamic menu set text according to language selection
export const navItemsTosca: any = [
  // Developer : Rajesh , TFSID 17127 Dynamic menu set text and create a new component according to approval navigation.
  // date 18-8-2020
  
  {
    key: 'key_Data_management',
    name: 'Data Management',
    url: '/pagenotfound',
    icon: '',
    attributes: { ['disabled']: '' },
    children: [
      {
        key: 'key_om',
        name: 'Organization Management',
        url: '/pagenotfound',
        icon: '',
        attributes: { ['disabled']: '' },
        children: [
          //{
          //  key: 'key_OrganizationType',
          //  name: 'Organization Type Group ',
          //  url: '/data-management/organization-type-group',
          //  icon: ''
          //},
          //{
          //  key: 'key_OrganizationLevel',
          //  name: 'Organization Level',
          //  url: '/data-management/organization-level',
          //  icon: '',
          //  attributes: { ['disabled']: '' }
          //},
          {
            key: 'key_Organization',
            name: 'Organization',
            url: '/data-management/manage-organization',
            icon: '',
            attributes: { ['disabled']: '' }
          },

        ]
      },


      {
        key: 'key_business_partner',
        name: 'Business Partner By location',
        url: '/data-management/business-partner-by-location',
        attributes: { ['disabled']: '' }
      },
      {
        key: 'key_customer_partner',
        name: 'Customer By Location',
        url: '/data-management/customer-partner-by-location',
        attributes: { ['disabled']: '' }
      },
      {
        key: 'key_operating_location',
        name: 'Operating Locations',
        url: '/data-management/operating-location',
        attributes: { ['disabled']: '' }
      },
      {
        key: 'key_contract',
        name: 'Contract',
        url: '/data-management/contract-list',
        attributes: { ['disabled']: '' }
      },
      {
        key: 'key_material_management',
        name: 'Material Management',
        url: '/pagenotfound',
        // url: '/data-management/material-management',
        icon: '',
        attributes: { ['disabled']: '' },
        children: [
          {
            key: 'key_material',
            name: 'Material',
            url: '/data-management/material',
            icon: '',
            attributes: { ['disabled']: '' }
          },
          {
            key: 'key_materialGroup',
            name: 'Material Group',
            url: '/data-management/material-group',
            icon: '',
            attributes: { ['disabled']: '' }
          },
          {
            key: 'key_materialHistory',
            name: 'Material Hierarchy',
            url: '/data-management/material-hierarchy',
            icon: '',
            attributes: { ['disabled']: '' }
          }
        ]
      },


      {
        key: 'key_freight_management',
        name: 'Freight Management',
        url: '/pagenotfound',
        icon: '',
        attributes: { ['disabled']: '' },
        children: [
          {
            key: 'key_Freight_lanes',
            name: 'Freight Lanes City, State',
            url: '/data-management/freight-lanes',
            icon: '',
            attributes: { ['disabled']: '' }
          },
          {
            key: 'key_Fuel',
            name: 'Fuel Price',
            url: '/data-management/fuel-price',
            icon: '',
            attributes: { ['disabled']: '' }
          },
        ]
      },

      //{
      //  key: 'key_Appointment',
      //  name: 'Appointment',
      //  url: '/data-management/appointment',
      //  icon: 'beta',
      //  attributes: { ['disabled']: '' }
      //},

      //{
      //  key: 'key_TeamCalendar',
      //  name: 'Team Calendar',
      //  url: '/data-management/team-calendar',
      //  icon: 'beta',
      //  attributes: { ['disabled']: '' }
      //},

      {
        key: 'key_Credit_management',
        name: 'Credit Management',
        url: '/credit-management',
        icon: '',
        attributes: { ['disabled']: '' }
      },

      {
        key: 'key_Clame',
        name: 'Claim',
        url: '/data-management/claim',
        icon: '',
        attributes: { ['disabled']: '' }
      },

      {
        key: 'key_Commodity',
        name: 'Commodity',
        url: '/data-management/commodity',
        icon: '',
        attributes: { ['disabled']: '' }
      },

      //{
      //  key: 'key_Contact',
      //  name: 'Contact',
      //  url: '/pagenotfound',
      //  icon: '',
      //},


      {
        key: 'key_Alert_management',
        name: 'Alert Management',
        url: '/alert-management/alert-list',
        icon: '',
        attributes: { ['disabled']: '' },
        children: [
          {
            key: 'key_Alert-histpry',
            name: 'Alert History',
            url: '/alert-management/alert-history',
            icon: '',
            attributes: { ['disabled']: '' }
          },
        ]
      },
    ]
  },


  {
    key: 'key_Forecasting',
    name: 'Forecasting',
    url: '/pagenotfound',
    icon: '',
    attributes: { ['disabled']: '' },
    children: [
      {
        key: 'key_sales_forecasting',
        name: 'Create & Compute Sales Forecast',
        url: '/forecasting/forecasting',
        icon: '',
        attributes: { ['disabled']: '' }
      },
      //{
      //  key: 'key_sales_forecasting',
      //  name: 'Define Macro indicator',
      //  url: '/forecasting/macro-indicator',
      //  icon: 'beta',
      //  attributes: { ['disabled']: '' }
      //},
      //{
      //  key: 'key_sales_forecasting',
      //  name: 'Define Micro indicator',
      //  url: '/forecasting/micro-indicator',
      //  icon: 'beta',
      //  attributes: { ['disabled']: '' }
      //},
    ]
  },

  {
    key: 'key_Inventory',
    name: 'Inventory',
    url: '/pagenotfound',
    icon: '',
    attributes: { ['disabled']: '' },
    children: [
      {
        key: 'key_correntOnHandInventory',
        name: 'Current On Hand Inventory',
        url: '/inventory/current-on-hand-inventory',
        icon: 'Beta',
        attributes: { ['disabled']: '' }
      },
    ]
  },

  {
    key: 'key_OrderManagement',
    name: 'Order Management',
    url: '/pagenotfound',
    icon: '',
    attributes: { ['disabled']: '' },
    children: [
      {
        key: 'key_order_workBench',
        name: 'Order Workbench',
        url: '/order-management/order-workbench',
        icon: '',
        attributes: { ['disabled']: '' }
      },
      {
        key: 'key_order_History',
        name: 'Order History',
        url: '/order-management/order-history',
        icon: '',
        attributes: { ['disabled']: '' }
      },
      //{
      //  key: 'key_OrderReports',
      //  name: 'Order Reports',
      //  url: '/pagenotfound',
      //  icon: '',
      //  attributes: { ['disabled']: '' },
      //  children: [
      //    {
      //      key: 'key_PlannedOrder',
      //      name: 'Planned Order Report',
      //      url: '/order-management/planned-report',
      //      icon: '',
      //      attributes: { ['disabled']: '' }
      //    },
      //  ]
      //},
      {
        key: 'key_OrderReports',
        name: 'Order Reports',
        url: '/pagenotfound',
        icon: '',
        //attributes: { ['disabled']: '' },
        children: [
          {
            key: 'key_MaterialPlanningReport',
            name: 'Material Planned Order Report',
            url: '/order-management/material-planning-report',
            icon: '',
            //attributes: { ['disabled']: '' }
          },
        ]
      },
      
      //end here
    ]
  },


  {
    key: 'key_ShipmentManagement',
    name: 'Shipment Management',
    url: '/pagenotfound',
    icon: '',
    attributes: { ['disabled']: '' },
    children: [
      {
        key: 'key_ShipmentWorkbench',
        name: 'Shipment Workbench',
        url: '/shipment-management/shipment-workbench',
        icon: '',
        attributes: { ['disabled']: '' }
      },
      {
        key: 'key_CustomerReport',
        name: 'Customs Report Data',
        url: '/pagenotfound',
        icon: '',
        attributes: { ['disabled']: '' },
        children: [
          {
            key: 'key_originOfGoods',
            name: 'Origin Of Goods',
            url: '/shipment-management/origin-of-goods',
            icon: '',
            attributes: { ['disabled']: '' }
          },
          {
            key: 'key_NAFTA',
            name: 'NAFTA Report Setting',
            url: '/shipment-management/shipment-nafta-report',
            icon: '',
            attributes: { ['disabled']: '' }
          },
        ]
      },
      {
        key: 'key_ShipmentHistory',
        name: 'Shipment History',
        url: '/shipment-management/shipment-history',
        icon: '',
        attributes: { ['disabled']: '' }
      },

    ]
  },


  {
    key: 'key_Reports',
    name: 'Reports',
    url: '/pagenotfound',
    icon: '',
    attributes: { ['disabled']: '' },
    children: [
      //{
      //  key: 'key_forcastCom',
      //  name: 'Forecast Compare',
      //  url: '/reports/forecast-compare',
      //  icon: '',
      //  attributes: { ['disabled']: '' }
      //},
      //{
      //  key: 'key_forcastrevie',
      //  name: 'Forecast Review',
      //  url: '/reports/forecast-review',
      //  icon: '',
      //  attributes: { ['disabled']: '' }
      //},
      {
        key: 'key_DownloadReports',
        name: 'Download Reports',
        url: '/reports/download-reports',
        icon: '',
        attributes: { ['disabled']: '' },
      },
    ]
  },

  {
    key: 'key_SystemSettings',
    name: 'System Settings',
    url: '/pagenotfound',
    icon: '',
    attributes: { ['disabled']: '' },
    children: [
      //{
      //  key: 'key_Application',
      //  name: 'Application Settings',
      //  url: '/system-settings/application-settings',
      //  icon: '',
      //  attributes: { ['disabled']: '' },
      //},
      {
        key: 'key_manageUser',
        name: 'Manage User Alert',
        url: '/alert-management/alert-list',
        icon: '',
        attributes: { ['disabled']: '' },
      },
      {
        key: 'key_Charge',
        name: 'Charge',
        url: '/system-settings/charge',
        icon: '',
        attributes: { ['disabled']: '' },
      },
      //{
      //  key: 'key_AppCharge',
      //  name: 'Application Charges',
      //  url: '/system-settings/application-chagers',
      //  icon: '',
      //  attributes: { ['disabled']: '' },
      //},
      {
        key: 'key_FuelCharge',
        name: 'Fuel Surcharge Index',
        url: '/system-settings/fuel-surcharge',
        icon: '',
        attributes: { ['disabled']: '' },
      },
      {
        key: 'key_FreightMode',
        name: 'Freight Mode',
        url: '/system-settings/freight-mode',
        icon: '',
        attributes: { ['disabled']: '' },
      },
      {
        key: 'key_EquipmentType',
        name: 'Equipment Type',
        url: '/system-settings/equipment-type',
        icon: '',
        attributes: { ['disabled']: '' },
      },
      {
        key: 'key_ModelRollPermission',
        name: 'Module Role Permissions',
        url: '/system-settings/module-role-permissions',
        icon: '',
        attributes: { ['disabled']: '' },
      },
      {
        key: 'key_preferance',
        name: 'Special Preference',
        url: '/system-settings/special-preference',
        icon: '',
        attributes: { ['disabled']: '' },
      },
      {
        key: 'key_UserM',
        name: 'User Management',
        url: '/user-management/user-list',
        icon: '',
        attributes: { ['disabled']: '' },
      },
      {
        key: 'key_geolocation',
        name: 'Geo Location Management',
        url: '/system-settings/geo-location',
        icon: '',
        attributes: { ['disabled']: '' },
      },
    ]
  },

];
