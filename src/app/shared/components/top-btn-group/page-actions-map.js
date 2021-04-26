"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAddActions = exports.getEditActions = exports.getNewUsersActions = exports.getExistingUsersActions = void 0;
var actionItemsTypeMap = {
    add: { label: 'key_Addnew', colorClass: 'btn-outline-primary', iconClass: 'fa fa-plus', type: 'add' },
    edit: { label: 'key_Edit', colorClass: 'btn-outline-primary', iconClass: 'fa fa-pencil', type: 'edit' },
    delete: { label: 'key_Delete', colorClass: 'btn-outline-danger', iconClass: 'fa fa-trash-o', type: 'delete' },
    issue: { label: 'key_Issue', colorClass: 'btn-outline-danger', iconClass: 'fa fa-info', type: 'issue' },
    profile: {
        label: 'key_Profile', colorClass: 'btn-outline-primary', iconClass: 'fa fa-user-o', type: 'profile', menu: [
            { label: 'key_UserName', iconClass: 'fa fa-user-o', type: 'name' },
            { label: 'key_ChangePassword', iconClass: 'fa fa-key', type: 'changePassword' },
            { label: 'key_Logout', iconClass: 'fa fa-power-off', type: 'logout' }
        ]
    },
    export: { label: 'key_Export', colorClass: 'btn-outline-success', iconClass: 'fa fa-file-excel-o', type: 'export' },
    active: { label: 'key_Active', colorClass: 'btn-outline-success', iconClass: 'fa fa-check', type: 'active' },
    inactive: { label: 'key_Inactive', colorClass: 'btn-outline-warning', iconClass: 'fa fa-exclamation', type: 'inactive' },
    resetPassword: { label: 'key_ResetPassword', colorClass: 'btn-outline-primary', iconClass: 'fa fa-key', type: 'resetPassword' },
    approve: { label: 'key_Approve', colorClass: 'btn-outline-success', iconClass: 'fa fa-check-square', type: 'approve' },
    declined: { label: 'key_Declined', colorClass: 'btn-outline-danger', iconClass: 'fa fa-ban', type: 'declined' },
};
/**
 *
 * @param actionGroupsKeys ex. - "add,edit,delete|issue,profile"
 */
function getActionGroups(actionGroupsKeys) {
    if (!actionGroupsKeys) {
        return [];
    }
    var groups = actionGroupsKeys.split('|');
    return groups.map(function (group) {
        var actions = group.split(',');
        if (actions.length) {
            return actions.map(function (type) { return actionItemsTypeMap[type.trim()]; });
        }
        return [];
    });
}
function getExistingUsersActions(isTosca) {
    return [
        {
            label: 'Home',
            actionGroups: getActionGroups(isTosca ? 'add,edit,delete|issue,profile' : 'add,edit,delete')
        },
        {
            label: 'Data',
            actionGroups: getActionGroups('export')
        },
        {
            label: 'Action',
            actionGroups: getActionGroups('active,inactive,resetPassword')
        }
    ];
}
exports.getExistingUsersActions = getExistingUsersActions;
function getNewUsersActions(isTosca) {
    return [
        {
            label: 'Home',
            actionGroups: getActionGroups(isTosca ? 'add,edit,delete|issue,profile' : 'add,edit,delete')
        },
        {
            label: 'Action',
            actionGroups: [
                [
                    { label: 'key_Approve', colorClass: 'btn-outline-success', iconClass: 'fa fa-check-square', type: 'approve' },
                    { label: 'key_Declined', colorClass: 'btn-outline-danger', iconClass: 'fa fa-ban', type: 'declined' }
                ]
            ]
        }
    ];
}
exports.getNewUsersActions = getNewUsersActions;
function getEditActions(isTosca) {
    return [
        {
            label: 'Home',
            actionGroups: getActionGroups(isTosca ? 'issue,profile' : '')
        }
    ];
}
exports.getEditActions = getEditActions;
function getAddActions(isTosca) {
    return getEditActions(isTosca);
}
exports.getAddActions = getAddActions;
//# sourceMappingURL=page-actions-map.js.map