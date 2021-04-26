export class UserActivityLog {
  moduleName: string;
  componentName: string;
  pageUrl: string;
  actiononPage: ActionOnPage;
}

export enum ActionOnPage {
  View = 'View Report',
  Save = 'Save Information',
  Edit = 'Modify Information',
  Delete = 'Delete Information',

}
