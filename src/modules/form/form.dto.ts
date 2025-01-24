
export interface iFormData{
  id:string
  customerName:string
  dataExtensionRef:string
  metaData:any
  fields:any[]
  credentials:iCredentials
}
export interface iGetObjectFolder {
headers:string
categoryId:string
subDomain:string
path:string[]
objectId:string
category:iCategory
}
export interface iAuthResponse {
  access_token:string
  refresh_token?:string
}
export interface iCredentials {
  refresh_token:string
  grant_type: string
  client_id:string
  client_secret:string
  subdomain:string
}
export interface iGetPathResponse extends iCategory {
  path: string[]
   objectId: string

}

export interface GetBedsDTO {
  skipAssigned?: boolean;
  facilityId: string;
}

export interface iAccessToken{
  client_id:string
  redirect_uri:string
  code:string
  grant_type:string
  client_secret:string
}

export interface iCategory{
  id: string
  name:string
  type:string
  client:string
  CreatedDate:string
  ModifiedDate:string
  ObjectID:string
  CustomerKey:string
  Description:string
  IsSendable:string
  SendableSubscriberField:string
  SendableDataExtensionField:string
}

export interface iAddFormJson{
  reqBody:iAccessToken
  clientId:string
  subdomain:string
  metaData:any
  fields:iField[]
}

export interface iFindDE{
  filter:iFilter
  subDomain:string
  authType:string
  token:string
  username:string
  password:string
  name:string
}


export interface iGetDEUsername{
  filter:iFilter
  subDomain:string
  username:string
  password:string
  headers:string
  name:string
}

export interface iGetDEClient{
  filter:iFilter
  subDomain:string
  token:string
  headers:string
  name:string
}
interface iFilter{
  key:string
  filter:string
  value:string
}
interface iField{
  
    "CustomerKey": string
    "Name": string
    "FieldType": string
    "MaxLength": number,
    "IsRequired": boolean
    "IsPrimaryKey": boolean

}

export interface iAddFormRecord{
  fields:any[]
}

export interface iCreateDataExtensionRecord{
  body:any[]
  token:string
  deRef:string
  domain:string

}
export interface iPagination {
  page: number;
  limit: number;
}

export interface iGetAccessToken{
  client_id: string;
  client_secret: string;
  account_id: string;
  grant_type:string;
}