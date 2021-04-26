export interface ActionGroupTab {
  label: string;
  actionGroups: ActionItem[][];
  hidden?: boolean;
}

export interface ActionItem {
  label: string;
  type: ActionType; // add/edit/delete
  iconClass?: string; // fa fa-home or custom-class
  colorClass?: string; // btn-primary or custom-class
  active?: boolean;
  hidden?: boolean;
  disabled?: boolean;
  menu?: ActionItem[];
}

export type ActionType =
  'add' |
  'edit' |
  'delete' |
  'issue' |
  'profile' |
  'export' |
  'active' |
  'accept' |
  'unlock' |
  'inactive' |
  'resetPassword' |
  'approve' |
  'userName' |
  'changePassword' |
  'logout' |
  'declined' |
  'notification' |
  'alerts' |
  'setupWizard' |
  'language' |
  'english' |
  'hindi' |
  'showDetails' |
  'invoice' |
  'refresh' | 'edittype' |
  'filter' |
  'updateContract' |
  'chargeType' |
  'ChargeCategory' |
  'MapComputation' |
  'addnewtype' |
  'view' |
  'import' |
  'reasonCode' | 'importforecast' | 'addNew' | 'addRow' | 'dsf' | 'deleteSelectedForecast' | 'deleteSelectedRow' |
  'duplicateForecast' | 'import' | 'ManageMarketForecastImport' | 'importLocationmaterial' |
  'calculate' | 'flex' | 'AdjustFinalForecast' | 'publish' | 'lock' | 'mapping' |
  'graph'| 'tender' | 'ship' | 'approveAndMas' | 'cancel' |'tonu' | 'document' | 'viewBOL' | 'viewLoadingSheet' |
  'performaInvoice' | 'regularOrder' | 'bulkOrder' | 'copy' | 'orderCancel' |
  'resendToMas' | 'shipWith' | 'recurrence' | 'workBench' | 'homeCancel' | 'save' | 'compute' | 'feedback' | 'share' | 'viewForecastAs' | 'receive' |
  'associate' | 'void' | 'viewcci' | 'viewnafta' | 'back' | 'exportTransplaceTemplate' | 'importTransplaceTemplate' | 'updateForecast' | 'saveAndNotify'
  | 'addForecast' | 'createsNewForecast' | 'UploadForecast' | 'addNewRole'
  ;
