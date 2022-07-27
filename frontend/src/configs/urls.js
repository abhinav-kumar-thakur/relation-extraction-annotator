const BackendUrl = "api";
const BackendDataURL = `${BackendUrl}/data`;
const BackendAdminURL = BackendUrl + '/admin';

export const TypeFileUploadURL = `${BackendAdminURL}/labels/upload`;
export const RulesFileUploadURL = `${BackendAdminURL}/rules/upload`;
export const GetTypesURL = `${BackendAdminURL}/labels`;

export const GetDataURL = `${BackendDataURL}/data`
export const DataFileUploadURL = `${BackendDataURL}/upload`;
export const DataDownloadURL = `${BackendDataURL}/download`;
export const ApprovedDownloadURL = `${BackendDataURL}/approved/download`;
export const LabelingProgressURL = `${BackendDataURL}/progress`;
export const DataUpdateURL = `${BackendDataURL}/update/state`;
