import { ActionGroupTab, ActionItem } from "../../../core/models/action-group";

const actionItemsTypeMap = {
  add: { label: 'key_Addnew', colorClass: 'btn-outline-primary', iconClass: 'fa fa-plus', type: 'add' },
  edit: { label: 'key_Edit', colorClass: 'btn-outline-primary', iconClass: 'fa fa-pencil', type: 'edit' },
  delete: { label: 'key_Delete', colorClass: 'btn-outline-danger', iconClass: 'fa fa-trash-o', type: 'delete' },
  issue: { label: 'key_Issue', colorClass: 'btn-outline-danger', iconClass: 'fa fa-info', type: 'issue' },
  profile: {
    label: 'key_Profile', colorClass: 'btn-outline-primary', iconClass: 'fa fa-user-o', type: 'profile', menu: [
      //{ label: 'key_UserName', iconClass: 'fa fa-user-o', type: 'userName' },
      { label: 'key_ChangePassword', iconClass: 'fa fa-key', type: 'changePassword' },
      { label: 'key_Logout', iconClass: 'fa fa-power-off', type: 'logout' }
    ]
  },
  export: { label: 'key_Export', colorClass: 'btn-outline-success', iconClass: 'fa fa-file-excel-o', type: 'export' },
  active: { label: 'key_Active', colorClass: 'btn-outline-success', iconClass: 'fa fa-check', type: 'active' },
  inactive: { label: 'key_Inactive', colorClass: 'btn-outline-warning', iconClass: 'fa fa-exclamation', type: 'inactive' },
  resetPassword: { label: 'key_ResetPassword', colorClass: 'btn-outline-primary', iconClass: 'fa fa-key', type: 'resetPassword' },
  approve: { label: 'key_Approve', colorClass: 'btn-outline-success', iconClass: 'fa fa-check-square', type: 'approve' },
  accept: { label: 'key_Accecpt', colorClass: 'btn-outline-success', iconClass: 'fa fa-check-square-o', type: 'accept' },
  unlock: { label: 'key_Unlock', colorClass: 'btn-outline-success', iconClass: 'fa fa-unlock-alt', type: 'unlock' },
  declined: { label: 'key_Declined', colorClass: 'btn-outline-danger', iconClass: 'fa fa-ban', type: 'declined' },
  notification: { label: 'key_Notification', colorClass: 'btn-outline-primary', iconClass: 'fa fa-bell-o', type: 'notification' },
  alerts: { label: 'key_Alerts', colorClass: 'btn-outline-primary', iconClass: 'fa fa-bell-o', type: 'alerts' },
  setupWizard: { label: 'key_SetupWizard', colorClass: 'btn-outline-primary', iconClass: 'fa fa-cogs', type: 'setupWizard' },
  language: {
    label: 'key_Language', colorClass: 'btn-outline-primary', iconClass: 'fa fa-language', type: 'language', menu: [
      { label: 'key_English', iconClass: 'fa fa-flag-o', type: 'english' },
      { label: 'key_Hindi', iconClass: 'fa fa-flag-o', type: 'hindi' }
    ]
  },
  importforecast: {
    label: 'key_Import', colorClass: 'btn-outline-success', iconClass: 'fa fa-file-excel-o', type: 'importforecast', menu: [
      { label: 'key_ManageMarketForecastImport', iconClass: 'fa fa-file-excel-o', type: 'ManageMarketForecastImport' },
      { label: 'key_mlmmi', iconClass: 'fa fa-file-excel-o', type: 'importLocationmaterial' }
    ]
  },
  showDetails: { label: 'key_ShowDetails', colorClass: 'btn-outline-primary', iconClass: 'fa fa-eye', type: 'showDetails' },
  invoice: { label: 'key_Invoice', colorClass: 'btn-outline-success', iconClass: 'fa fa-file-text', type: 'invoice' },
  refresh: { label: 'key_Refresh', colorClass: 'btn-outline-success', iconClass: 'fa fa-refresh', type: 'refresh' },
  filter: { label: 'key_Filter', colorClass: 'btn-outline-primary', iconClass: 'fa fa-filter', type: 'filter' },
  updateContract: { label: 'key_Updatecon', colorClass: 'btn-outline-success', iconClass: 'fa fa-floppy-o', type: 'updateContract' },
  chargeType: { label: 'key_ChargeType', colorClass: 'btn-outline-success', iconClass: 'fa fa-folder-open', type: 'chargeType' },
  ChargeCategory: { label: 'key_ChargeCategory', colorClass: 'btn-outline-success', iconClass: 'fa fa-ellipsis-h', type: 'ChargeCategory' },
  MapComputation: { label: 'key_MapComputation', colorClass: 'btn-outline-success', iconClass: 'fa fa-plus-square', type: 'MapComputation' },
  reasonCode: { label: 'key_ReasonCode', colorClass: 'btn-outline-danger', iconClass: 'fa fa-exclamation', type: 'reasonCode' },
  edittype: { label: 'key_Edittype', colorClass: 'btn-outline-primary', iconClass: 'fa fa-pencil', type: 'edittype' },
  addnewtype: { label: 'key_Addnewtype', colorClass: 'btn-outline-primary', iconClass: 'fa fa-plus', type: 'addnewtype' },
  view: { label: 'key_Viewimportstatus', colorClass: 'btn-outline-success', iconClass: 'fa fa-file-excel-o', type: 'view' },
  import: { label: 'key_Import', colorClass: 'btn-outline-success', iconClass: 'fa fa-upload', type: 'import' },
  addNew: { label: 'key_Addnew', colorClass: 'btn-outline-primary', iconClass: 'fa fa-plus', type: 'addNew' },
  addRow: { label: 'key_AddRows', colorClass: 'btn-outline-primary', iconClass: 'fa fa-plus', type: 'addRow' },
  dsf: { label: 'key_dsf', colorClass: 'btn-outline-danger', iconClass: 'fa fa-trash', type: 'dsf' },
  deleteSelectedForecast: { label: 'key_dsf', colorClass: 'btn-outline-danger', iconClass: 'fa fa-trash', type: 'deleteSelectedForecast' },
  deleteSelectedRow: { label: 'key_DeleteSelectedRow', colorClass: 'btn-outline-danger', iconClass: 'fa fa-trash', type: 'deleteSelectedRow' },
  duplicateForecast: { label: 'key_DuplicateForecast', colorClass: 'btn-outline-warning', iconClass: 'fa fa-files-o', type: 'duplicateForecast' },
  calculate: { label: 'key_calculate', colorClass: 'btn-outline-success', iconClass: 'fa fa-calculator', type: 'calculate' },
  flex: { label: 'key_Flex', colorClass: 'btn-outline-warning', iconClass: 'fa fa-shower', type: 'flex' },
  AdjustFinalForecast: { label: 'key_AdjustFinalForecast', colorClass: 'btn-outline-warning', iconClass: 'fa fa-retweet', type: 'AdjustFinalForecast' },
  publish: { label: 'key_Publish', colorClass: 'btn-outline-success', iconClass: 'fa fa-newspaper-o', type: 'publish' },
  lock: { label: 'key_Lock', colorClass: 'btn-outline-danger', iconClass: 'fa fa-lock', type: 'lock' },
  compute: { label: 'key_Compute', colorClass: 'btn-outline-success', iconClass: 'fa fa-database', type: 'compute' },
  mapping: { label: 'key_Mapping', colorClass: 'btn-outline-success', iconClass: 'fa fa-circle-o-notch', type: 'mapping' },
  graph: { label: 'key_Graph', colorClass: 'btn-outline-success', iconClass: 'fa fa-pie-chart', type: 'graph' },
  viewForecastAs: { label: 'key_viewforecastas', colorClass: 'btn-outline-success', iconClass: 'fa fa-area-chart', type: 'viewForecastAs' },
  void: { label: 'key_void', colorClass: 'btn-outline-success', iconClass: 'fa fa-dot-circle-o', type: 'void' },

  tender: { label: 'key_Tender', colorClass: 'btn-outline-primary', iconClass: 'fa fa-truck', type: 'tender' },
  ship: { label: 'key_ship', colorClass: 'btn-outline-primary', iconClass: 'fa fa-truck', type: 'ship' },
  receive: { label: 'key_Receive', colorClass: 'btn-outline-primary', iconClass: 'fa fa-cloud-download', type: 'receive' },
  approveAndMas: { label: 'key_mas', colorClass: 'btn-outline-success', iconClass: 'fa fa-check', type: 'approveAndMas' },
  cancel: { label: 'key_cancel', colorClass: 'btn-outline-danger', iconClass: 'fa fa-times', type: 'cancel' },
  homeCancel: { label: 'key_cancel', colorClass: 'btn-outline-danger', iconClass: 'fa fa-times', type: 'homeCancel' },
  save: { label: 'key_Save', colorClass: 'btn-outline-success', iconClass: 'fa fa-floppy-o', type: 'save' },
  saveAndNotify: { label: 'key_SaveAndNotify', colorClass: 'btn-outline-success', iconClass: 'fa fa-floppy-o', type: 'saveAndNotify' },
  tonu: { label: 'key_TONU', colorClass: 'btn-outline-primary', iconClass: 'fa fa-ship', type: 'tonu' },
  document: {
    label: 'key_document', colorClass: 'btn-outline-primary', iconClass: 'fa fa-book', type: 'document', menu: [
      { label: 'key_viewBOL', iconClass: 'fa fa-list', type: 'viewBOL' },
      { label: 'key_ViewLoadingSheet', iconClass: 'fa fa-list', type: 'viewLoadingSheet' },
      { label: 'key_ProformaInvoice', iconClass: 'fa fa-list', type: 'performaInvoice' },
      { label: 'key_viewcci', iconClass: 'fa fa-list', type: 'viewcci'  },
      { label: 'key_viewnafta', iconClass: 'fa fa-list', type: 'viewnafta' }
    ]
  },
  regularOrder: { label: 'key_Regular_Order', colorClass: 'btn-outline-primary', iconClass: 'fa fa-plus', type: 'regularOrder' },
  bulkOrder: { label: 'key_bulk_Order', colorClass: 'btn-outline-primary', iconClass: 'fa fa-plus-square', type: 'bulkOrder' },
  copy: { label: 'key_copy', colorClass: 'btn-outline-primary', iconClass: 'fa fa-files-o', type: 'copy' },
  orderCancel: { label: 'key_orderCancel', colorClass: 'btn-outline-danger', iconClass: 'fa fa-truck', type: 'orderCancel' },
  resendToMas: { label: 'key_ResendtoMAS', colorClass: 'btn-outline-success', iconClass: 'fa fa-check', type: 'resendToMas' },
  shipWith: { label: 'key_shipWith', colorClass: 'btn-outline-primary', iconClass: 'fa fa-link', type: 'shipWith' },
  recurrence: { label: 'key_recurrence', colorClass: 'btn-outline-primary', iconClass: 'fa fa-repeat', type: 'recurrence' },
  workBench: { label: 'key_WorkBench', colorClass: 'btn-outline-primary', iconClass: 'fa fa-arrow-left', type: 'workBench' },
  feedback: { label: 'key_Feedback', colorClass: 'btn-outline-primary', iconClass: 'fa fa-comments', type: 'feedback' },
  share: { label: 'key_Share', colorClass: 'btn-outline-primary', iconClass: 'fa fa-share-alt', type: 'share' },
  associate: { label: 'key_Associate', colorClass: 'btn-outline-primary', iconClass: 'fa fa-plus', type: 'associate' },
  back: { label: 'key_Back', colorClass: 'btn-outline-primary', iconClass: 'fa fa-arrow-left', type: 'back' },
  exportTransplaceTemplate: { label: 'key_exportTransplaceTemplate', colorClass: 'btn-outline-success', iconClass: 'fa fa-file-excel-o', type: 'exportTransplaceTemplate' },
  importTransplaceTemplate: { label: 'key_importTransplaceTemplate', colorClass: 'btn-outline-success', iconClass: 'fa fa-upload', type: 'importTransplaceTemplate' },
  updateForecast: { label: 'key_UpdateForecast', colorClass: 'btn-outline-success', iconClass: 'fa fa-cloud', type: 'updateForecast' },
}

/**
 * 
 * @param actionGroupsKeys ex. - "add,edit,delete|issue,profile"
 */
function getActionGroups(actionGroupsKeys: string): ActionItem[][] {
  if (!actionGroupsKeys) {
    return [];
  }
  const groups = actionGroupsKeys.split('|');
  return groups.map(group => {
    const actions = group.split(',');
    if (actions.length) {
      return actions.map(type => actionItemsTypeMap[type.trim()]);
    }
    return [];
  });
}

export function getGlobalRibbonActions(): ActionGroupTab[] {
  return [
    {
      label: 'key_Home',
      actionGroups: getActionGroups('workBench,back,add,addRow,regularOrder,bulkOrder,edit,copy,showDetails,invoice,deleteSelectedRow,deleteSelectedForecast,updateContract,save,saveAndNotify,homeCancel,delete,refresh|issue,notification,setupWizard,language,alerts,profile,share,feedback'),      
    },
    {
      label: 'key_Data',
      actionGroups: getActionGroups('import,filter,void,duplicateForecast,importforecast,exportTransplaceTemplate,importTransplaceTemplate,export')
    },
    {
      label: 'key_Action',
      actionGroups: getActionGroups('approve,declined,accept,active,inactive,lock,unlock,resetPassword,edittype,addnewtype,orderCancel,flex,AdjustFinalForecast,updateForecast,publish,mapping,tender,ship,receive,approveAndMas,resendToMas,calculate,shipWith,recurrence,cancel,tonu,document,chargeType,ChargeCategory,MapComputation,compute,associate')
    },
    {
      label: 'key_View',
      actionGroups: getActionGroups('view,graph,viewForecastAs')
    }

  ]
}


//Hospital Staff (Partograph)
export function getHospitalstaff(): ActionGroupTab[] {
  return [
    {
      label: 'key_Home',
      actionGroups: getActionGroups( 'add,edit,delete|notification,setupWizard,language,profile')
    },
    {
      label: 'key_Data',
      actionGroups: getActionGroups('export')
    },
    {
      label: 'key_Action',
      actionGroups: getActionGroups('active,inactive')
    }
  ]
}

//Hospital Setup (Partograph)
export function getHospitalsetup(): ActionGroupTab[] {
  return [
    {
      label: 'Home',
      actionGroups: getActionGroups('add,edit,delete|notification,setupWizard,language,profile')
    },
    {
      label: 'Data',
      actionGroups: getActionGroups('export')
    },
    {
      label: 'Action',
      actionGroups: getActionGroups('active,inactive')
    }
  ]
}

//Patient Setup (Partograph)
export function getPatientSetup(): ActionGroupTab[] {
  return [
    {
      label: 'Home',
      actionGroups: getActionGroups('add,edit,delete|notification,setupWizard,language,profile')
    },
    {
      label: 'Data',
      actionGroups: getActionGroups('export')
    },
    {
      label: 'Action',
      actionGroups: getActionGroups('active,inactive')
    }
  ]
}
//Organization (Partograph)
export function getPartoOrganization(): ActionGroupTab[] {
  return [
    {
      label: 'Home',
      actionGroups: getActionGroups('add,edit,delete|notification,setupWizard,language,profile')
    },
    {
      label: 'Data',
      actionGroups: getActionGroups('export')
    },
    {
      label: 'Action',
      actionGroups: getActionGroups('active,inactive')
    }
  ]
}
