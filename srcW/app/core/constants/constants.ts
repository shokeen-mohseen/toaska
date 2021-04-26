export const ContactTypeActions = Object.freeze({
  User: 'User',
  Patient: 'Patient',
  Customer: 'Customer',
  BusinessPartner: 'BusinessPartner',
  OperatingLocation: 'OperatingLocation',
  Organization: 'Organization',
  Resource: 'Resource',
  Location: 'Location',
  Carrier: 'Carrier'
});

export const AddressActionType = Object.freeze({
  Location: 'Location',
  Organization: 'Organization',
  Patient: 'Patient',
  Resource: 'Resource',
  User: 'User',
  Carrier: 'Carrier'
});

export const ButtonActionType = Object.freeze({
  AddContact: 'addContactButton',
  EditContact: 'editContactButton',
  AddPreferredMaterial: 'addPreferredMaterialButton',  
  EditPreferredMaterial: 'editPreferredMaterialButton',
  deletePreferredMaterial: 'deletePreferredMaterialButton',
  AddDefaultPallet: 'addDefaultPalletButton',
  DeleteDefaultPallet: 'deleteDefaultPalletButton',
  AddDefaultEquipment: 'addDefaultEquipemntButton',
  DeleteDefaultEquipment: 'deleteDefaultEquipemntButton',

  AddLocationMiles: 'addLocationMilesButton',
  EditLocationMiles: 'editLocationMilesButton',
  deleteLocationMiles: 'deleteLocationMilesButton',
  Location: 'Location',
  Organization: 'Organization',
  Patient: 'Patient',
  Resource: 'Resource',
  User: 'User'
});
