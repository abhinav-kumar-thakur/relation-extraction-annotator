const BackendUrl = "api";


const BackendAdminURL = `${BackendUrl}/admin`;
export const TypeFileUploadURL = `${BackendAdminURL}/labels/upload`;
export const RulesFileUploadURL = `${BackendAdminURL}/rules/upload`;
export const GetTypesURL = `${BackendAdminURL}/labels`;
export const RulesURL = `${BackendAdminURL}/rules`;

const BackendDataURL = `${BackendUrl}/data`;
export const GetDataURL = `${BackendDataURL}/data`
export const DataFileUploadURL = `${BackendDataURL}/upload`;
export const DataDownloadURL = `${BackendDataURL}/download`;
export const ApprovedDownloadURL = `${BackendDataURL}/approved/download`;
export const LabelingProgressURL = `${BackendDataURL}/progress`;
export const DataUpdateURL = `${BackendDataURL}/update/state`;

export const BackendMultiModalURL = `${BackendUrl}/multi-modal`;