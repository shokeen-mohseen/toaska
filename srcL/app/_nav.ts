import { INavData } from '@coreui/angular';
// TFSID 16469 Dynamic menu set text according to language selection
export const navItems: INavData[] = [
  // {
  //  name: 'Dashboard',
  //  url: '/dashboard/home',
  //  icon: 'icon-speedometer',
  //  badge: {
  //    variant: 'info',
  //    text: 'NEW'
  //  }
  // },
  

  // Developer : Rajesh , TFSID 17127 Dynamic menu set text and create a new component according to approval navigation.
  // date 18-8-2020
  {
    key: 'key_managePartograph ',
    name: 'Manage Partograph',
    url: '/pagenotfound',
    icon: '',
    attributes: { ['disabled']: '' },
    children: [
      {

        key: 'key_workbench',
        name: 'Partograph workbench ',
        url: '/manage-partograph',
        icon: '',
        attributes: { ['disabled']: '' }
      },
    ]

  },
  {
    key: 'key_datamanagement',
    name: 'Data Management',
    url: '/pagenotfound',
    icon: '',
    attributes: { ['disabled']: '' },
    children: [
      {
        key: 'key_PatientSetup  ',
        name: 'Patient Setup',
        url: '/manage-partograph/patientsetup',
        icon: '',
        attributes: { ['disabled']: '' }
      },
      {

        key: 'key_HospitalSetup  ',
        name: 'Hospital Setup',
        url: '/manage-partograph/hospitalsetup',
        icon: '',
        attributes: { ['disabled']: '' }
      },
      {

        key: 'key_StaffSetup  ',
        name: 'Staff Setup',
        url: '/manage-partograph/hospitalstaff',
        icon: '',
        attributes: { ['disabled']: '' }
      },

      {
        key: 'key_facilityOrganizationSetup',
        name: 'Facility Organization Setup',
        url: '/pagenotfound',
        icon: '',
        attributes: { ['disabled']: '' },
        children: [
          {
            key: 'key_Organization',
            name: 'Organization',
            url: '/data-management/organization',
            icon: '',
            attributes: { ['disabled']: '' }
          },
         
        ]
      },
    ]

  },

  {
    key: 'key_AlertManagement',
    name: 'User Alert Management ',
    url: '/pagenotfound',
    icon: '',
    attributes: { ['disabled']: '' },
    children: [
      {
        key: 'key_AlertHistory',
        name: 'Alert History',
        url: '/alert-management/alert-history',
        icon: '',
        attributes: { ['disabled']: '' }
      }
    ]
  },

  {
    key: 'key_user_managements',
    name: 'User Management',
    url: '/pagenotfound',
    icon: '',
    attributes: { ['disabled']: '' },
    children: [
      {
        key: 'key_user_setup',
        name: 'User Setup',
        url: '/user-management/user-list',
        icon: '',
        attributes: { ['disabled']: '' }
      },

    ]
  },


  {
    key: 'key_Subscription_and_Billing_Management ',
    name: 'Subscription and Billing Management ',
    url: '/plan/plan',
    icon: '',
    attributes: { ['disabled']: '' },
    children: [
      {
        key: 'key_Subscription ',
        name: 'Subscription ',
        url: '/plan/plan',
        icon: '',
        attributes: { ['disabled']: '' }
      },
      {
        key: 'key_BillingPayment ',
        name: 'Billing and Payment',
        url: '/plan/billing-payment',
        icon: '',
        attributes: { ['disabled']: '' }
      }
    ]
  },

  {
    key: 'key_SystemSettings',
    name: 'System Settings',
    url: '/pagenotfound',
    icon: '',
    attributes: { ['disabled']: '' },
    children: [
      {
        key: 'key_ModelRollPermission',
        name: 'Module Role Permissions',
        url: '/system-settings/module-role-permissions',
        icon: '',
        attributes: { ['disabled']: '' },
      }
    ]
  }
];


