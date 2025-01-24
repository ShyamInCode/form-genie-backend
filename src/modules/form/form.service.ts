
import admin from 'firebase-admin'
import { accessTokenText, AUTH_TYPE, bodyText, CATEGORY_ID, CREATE_DATA_EXTENSION_BODY, CREATE_DATA_EXTENSION_XML, DATA_TYPE_PROPERTIES, FILTER, FORM_DATA_KEY, GET_DE, GET_DE_FILTERS, GET_DE_HEADER_CLIENT, GET_DE_HEADER_USERNAME, GET_OBJECT_FOLDER, HEADER, MAX_LIMIT, PASSWORD, ReplaceCategoryID, ReplaceObjectID, RETRIEVE_REQUEST_TYPE, subdomainText, USERNAME } from './form.constants';
const { v4: uuidv4 } = require('uuid');
import { json2xml, xml2js, xml2json } from 'xml-js';
import axios, { AxiosPromise, AxiosResponse } from 'axios';
import { iAccessToken, iAddFormJson, iAddFormRecord, iAuthResponse, iCategory, iCreateDataExtensionRecord, iCredentials, iFindDE, iFormData, iGetAccessToken, iGetDEClient, iGetDEUsername, iGetObjectFolder, iGetPathResponse, iPagination } from './form.dto';
import { COLLECTIONS } from '../../config/config.constants';
import { getPaginated } from '../../utils/utilities';
import ApiError from '../../utils/ApiError';
import { parseString } from 'xml2js'


export const addFormJson = async (params: iAddFormJson) => {
  if (params.fields?.length !== params.metaData.formInputs?.length) throw new ApiError(400, " fields length and form input length must be same")
  const authResponse = await getAccessToken(params.reqBody, params.subdomain)
  const accessToken = authResponse.access_token
  const credentials: iCredentials = {
    refresh_token: authResponse.refresh_token,
    grant_type: "refresh_token",
    client_id: params.reqBody.client_id,
    subdomain: params.subdomain,
    client_secret: params.reqBody.client_secret
  }
  const CustomerKey = new Date().getTime()
  const customerName = `webForm_${CustomerKey}`
  const primaryKeyField = params.fields.find(field => field.IsPrimaryKey)
  if (!primaryKeyField) throw new ApiError(400, "Please provide primary key")
  const body = JSON.parse(JSON.stringify(CREATE_DATA_EXTENSION_BODY))
  body.CustomerKey = CustomerKey
  body.Name = customerName
  body.SendableDataExtensionField.CustomerKey = primaryKeyField.CustomerKey
  body.SendableDataExtensionField.Name = primaryKeyField.Name
  body.SendableDataExtensionField.FieldType = primaryKeyField.FieldType
  body.Fields.Field = params.fields
  const bodyXml = convertJSONtoXML(body)

  let xml = CREATE_DATA_EXTENSION_XML
  xml = xml.replace(bodyText, bodyXml)
  xml = xml.replace(subdomainText, params.subdomain)
  xml = xml.replace(accessTokenText, accessToken)

  const response = await createDataExtension(xml, params.subdomain).catch(err => {
  throw new ApiError(400, err.message)
});

const res = await new Promise((resolve, reject) => {
  parseString(response.data, async function (err, responseFromAPI) {
    if (err) {
      reject({ message: "Error While parsing the DE API response", err });
    } else if (responseFromAPI['soap:Envelope']?.['soap:Body']?.[0]?.CreateResponse?.[0]?.Results?.[0]?.StatusCode[0] === "Error") {
      reject({ message: "Error in posting DE: " + responseFromAPI['soap:Envelope']?.['soap:Body']?.[0]?.CreateResponse?.[0]?.Results?.[0]?.StatusMessage[0], responseFromAPI });
    } else {
      const id = uuidv4();
      const data = { fields: params.fields, id, dataExtensionRef: CustomerKey, metaData: params.metaData, customerName, credentials };
      await admin.firestore().collection(COLLECTIONS.FORM_DATA_KEY).doc(id).create(data);
      resolve({ success: true, id, customerName, message: "My Form submitted successfully!" });
    }
  });
}).catch(err => {
  throw new ApiError(400, err.message);
});

return res;

};

export const addFormRecord = async (params: iAddFormRecord, deId: string) => {
  const doc = await (await admin.firestore().collection(COLLECTIONS.FORM_DATA_KEY).doc(deId).get()).data() as iFormData
  if (!doc) throw new ApiError(404, "Document not found")

  const authResponse = await getAccessTokenForRecord(doc.credentials) as iAuthResponse
  const accessToken = authResponse.access_token
  if (authResponse.refresh_token) {
    doc.credentials.refresh_token = authResponse.refresh_token
    await admin.firestore().collection(COLLECTIONS.FORM_DATA_KEY).doc(deId).update({ credentials: doc.credentials })
  }
  // const accessToken = "eyJhbGciOiJIUzI1NiIsImtpZCI6IjQiLCJ2ZXIiOiIxIiwidHlwIjoiSldUIn0.eyJhY2Nlc3NfdG9rZW4iOiJZTXk1cU1sbkNXYnAzUk5rNG00eUVKMmUiLCJjbGllbnRfaWQiOiJhZWtqZWQ1cXZuMGk4d2gxcXYzbWZqMW0iLCJlaWQiOjUxNDAwNjAyNywic3RhY2tfa2V5IjoiUzExIiwicGxhdGZvcm1fdmVyc2lvbiI6MiwiY2xpZW50X3R5cGUiOiJQdWJsaWMiLCJwaWQiOjMyNX0.XE4eGw3PkhZjBrbxTG3Xnlo6BmdktwvnYgbebeFletE.5LxfOlTX1WZ7xevWELfuEuhRf5PIW6uWQdLqMgF5xhSIqlNj_dGG7nE7obq9rfZHszhkmSdLiYkRyPiB7aNlAf_XTmZkixQXy5Ehjbnx2ZPco3_IFS3sPSHJUjTYBQHO1aC75V-Q4ygkTc6WKfzPIO5kpUkjnOzR6hBFmjjgP8WPUrcZ"
  const response = await createDataExtensionRecord({
    body: params.fields,
    token: accessToken,
    deRef: doc.dataExtensionRef as string,
    domain: doc.credentials.subdomain
  }).catch(err => {
    throw new ApiError(400, err.message)
  })
  return { success: true, message: "Form submitted successfully!" };
};

const createDataExtensionRecord = ({ body, domain, token, deRef }: iCreateDataExtensionRecord): Promise<AxiosResponse<any, any>> => {
  return new Promise(async (resolve, reject) => {
    var config = {
      method: 'post',
      url: `https://${domain}.rest.marketingcloudapis.com/hub/v1/dataevents/key:${deRef}/rowset`,
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      data: body
    };
    const res = await axios(config).catch(err => {
      reject(err)
    })
    resolve(res as AxiosResponse<any, any>)
  })
}
export const getAccessToken = async (body: iAccessToken, subdomain: string) => {
  var config = {
    method: 'post',
    url: `https://${subdomain}.auth.marketingcloudapis.com/v2/token`,
    headers: {
      'Content-Type': 'application/json'
    },
    data: body
  };
  const res = await axios(config)
  return res.data
}
const getAccessTokenForRecord = (body: iCredentials) => {
  return new Promise(async (resolve, reject) => {
    console.log("fetching from getAccessTokenFromRefreshToken")
    getAccessTokenFromRefreshToken(body)
      .then(res => {
        resolve(res)
      })
      .catch(err => {
        console.log("fetching from getAccessTokenFromClientSecret")
        getAccessTokenFromClientSecret(body).then(res => {
          resolve(res)
        }).catch(err => {
          reject(err)
        })
      })
  })
}
const getAccessTokenFromRefreshToken = async (body: iCredentials) => {
  return new Promise(async (resolve, reject) => {
    var config = {
      method: 'post',
      url: `https://${body.subdomain}.auth.marketingcloudapis.com/v2/token`,
      headers: {
        'Content-Type': 'application/json'
      },
      data: {
        grant_type: "refresh_token",
        refresh_token: body.refresh_token,
        client_id: body.client_id,
        client_secret: body.client_secret
      }
    };
    axios(config).then(res => {
      resolve(res.data)
    })
      .catch(err => {
        reject(err)
      })
  })
}
const getAccessTokenFromClientSecret = async (body: iCredentials) => {
  return new Promise(async (resolve, reject) => {
    var config = {
      method: 'post',
      url: `https://${body.subdomain}.auth.marketingcloudapis.com/v2/token`,
      headers: {
        'Content-Type': 'application/json'
      },
      data: {
        grant_type: "client_credentials",
        client_secret: body.client_secret,
        client_id: body.client_id
      }
    };
    axios(config).then(res => {
      resolve(res.data)
    })
      .catch(err => {
        reject(err)
      })
  })
}
const createDataExtension = (body: string, domain: string): Promise<AxiosResponse<any, any>> => {
  return new Promise(async (resolve, reject) => {
    var config = {
      method: 'post',
      url: `https://${domain}.soap.marketingcloudapis.com/Service.asmx`,
      headers: {
        'Content-Type': 'text/xml'
      },
      data: body
    };

    const res = await axios(config).catch(err => {
      reject(err)
    })
    resolve(res as AxiosResponse<any, any>)
  })
}

export const convertJSONtoXML = (json: any) => {
  const jsonStr = JSON.stringify(json);
  const xml = json2xml(jsonStr, { compact: true, spaces: 4 });
  return xml
}
export const getFormJsonById = async (docId: string) => {

  const res = await admin.firestore().collection(COLLECTIONS.FORM_DATA_KEY)
    .doc(docId)
    .get();
  if (!res.exists) throw new ApiError(400, "Record not found")

  return { success: true, data: res.data() };
};

export const getAllFormAllDocuments = async ({ page, limit }: iPagination) => {
  if (!page) page = 1;
  if (!limit || limit > MAX_LIMIT) limit = MAX_LIMIT;

  const res = await admin.firestore().collection(COLLECTIONS.FORM_DATA_KEY).orderBy('id', "asc")
    .startAfter(((Number(page) - 1) * Number(limit))).limit(Number(limit)).get()
  return getPaginated(res.docs.map((data) => data.data()), page, limit)
};

const getObjectFromDEresponse=(result:any):iCategory=>{
return {
  id: result.CategoryID?.[0] || "",
  name:result.Name?.[0] || "",
  client:result.Client?.[0]?.ID?.[0] || "",
  CreatedDate:result.CreatedDate?.[0] || "",
  ModifiedDate:result.ModifiedDate?.[0] || "",
  ObjectID:(typeof result.ObjectID?.[0]==="string" && result.ObjectID?.[0]) || "",
  CustomerKey:result.CustomerKey?.[0] || "",
  Description:result.Description?.[0] || "",
  IsSendable:result.IsSendable?.[0] || "",
  SendableSubscriberField:result.SendableSubscriberField?.[0]?.Name?.[0] || "",
  SendableDataExtensionField:result.SendableDataExtensionField?.[0]?.Name?.[0] || "",
  type:result.type
}
}

export const findDE = async ({ authType, subDomain, token, filter, password, username, name}: iFindDE) => {

  try {
    const headers = getHeaders({ authType, subDomain, token, filter, password, username,name })
    // console.log({headers})
    if (!headers) throw new ApiError(400, "Please provide valid AuthType")
    let response: any
 

    if (authType === AUTH_TYPE.CLIENT) {
      response = await getDEClient({ subDomain, filter, token, headers ,name})
      

    } else if (authType === AUTH_TYPE.USERNAME) {
      response = await getDEUsername({ subDomain, filter, username, password, headers,name })
    }
    //return response.data
    const json: any = await parseXMLtoJSON((response.data))
    // return json["soap:Envelope"]?.["soap:Body"]?.[0]?.RetrieveResponseMsg?.[0]?.Results
    const category = json["soap:Envelope"]?.["soap:Body"]?.[0]?.RetrieveResponseMsg?.[0]?.Results?.map((result:any)=>getObjectFromDEresponse({...result,type:name})) || []
    // return category
    const res = getObjectFolderPath(category.filter((cat:any)=>!!cat.id), headers, subDomain,name)
    return res


    // else throw new ApiError(400,"Please provide valid AuthType")
  } catch (error: any) {
    // console.log(error)
    throw new ApiError(error?.response?.status || 400, error?.response?.statusText || error.message)
  }
};
const getHeaders = ({ authType, subDomain, token, filter, password, username, }: iFindDE) => {
  if (authType === AUTH_TYPE.CLIENT) {
    let headers = GET_DE_HEADER_CLIENT
    headers = headers.replace(subdomainText, subDomain)
    headers = headers.replace(accessTokenText, token)
    return headers
  } else if (authType === AUTH_TYPE.USERNAME) {
    let headers = GET_DE_HEADER_USERNAME
    headers = headers.replace(subdomainText, subDomain)
    headers = headers.replace(USERNAME, username)
    headers = headers.replace(PASSWORD, password)
    return headers
  }
  return null
}
const getObjectFolderPath = async (category: iCategory[], headers: string, subDomain: string,name:string) => {

  //console.log({category})

  const promises = category.map(category => getPath({ headers, categoryId:category.id, subDomain, path: [`${category.name}`], objectId: "", category }))
  const paths = await Promise.all(promises)
   //return paths
   const findType=RETRIEVE_REQUEST_TYPE.find((type)=>type.name===name)
  return paths.map(path=>{
    return {
      // ...category,
      ...path,
      link: getLink(findType,path),
      path: path.path.join('/'),
    }
  })
}
const getLink=(findType:{link:string,name:string,properties:string}|undefined,path:any)=>{
  let link=findType?.link;
  link= link?.replace(ReplaceObjectID,path.ObjectID).replace(ReplaceCategoryID,path.id)
  return link
}
const getPath = async ({ categoryId, headers, path, subDomain, objectId, category }: iGetObjectFolder): Promise<iGetPathResponse> => {

  const replacedCategoryIdObjectFolder = GET_OBJECT_FOLDER.replace(CATEGORY_ID, categoryId)
  const replacedHeaderObjectFolder = replacedCategoryIdObjectFolder.replace(HEADER, headers)

  const Api_Response = await getOBJECT_FOLDER_API(replacedHeaderObjectFolder, subDomain) as AxiosResponse<any, any>

  const json: any = await parseXMLtoJSON(Api_Response.data)

  const nestedJson = json["soap:Envelope"]["soap:Body"][0].RetrieveResponseMsg[0].Results[0]
  const name = nestedJson.Name[0]
  if (!objectId) objectId = nestedJson.ObjectID[0]
  const ID = nestedJson.ParentFolder[0].ID[0]
  path.unshift(name)
  if (ID != 0) return getPath({ categoryId: ID, headers, path, subDomain, objectId, category })
  return { path, objectId, ...category}
}
//getObjectFolderPath(['1234'],"abc")
const parseXMLtoJSON = (xml: string) => {
  return new Promise((resolve, reject) => {
    parseString(xml, { trim: true, }, (err, responseFromAPI) => {
      if (err) return reject(err)
      return resolve(responseFromAPI)
    })
  })
}
const getDEClient = async ({ subDomain, filter, headers,name }: iGetDEClient) => {
  const filters = JSON.parse(JSON.stringify(GET_DE_FILTERS))
  filters.Property = filter.key
  filters.SimpleOperator = filter.filter
  filters.Value = filter.value


  const retrieveRequest=RETRIEVE_REQUEST_TYPE.find((type:{name:string,properties:string})=>name===type.name)
  if(!retrieveRequest)throw new ApiError(400,"Please provide valid name")
  let body = GET_DE.replace(HEADER, headers)
  body=body.replace(DATA_TYPE_PROPERTIES,retrieveRequest?.properties||"")
  body = body.replace(FILTER, json2xml(filters, { compact: true, spaces: 4 }))
  return getDE_API(body, subDomain)
}

const getDEUsername = ({ filter, subDomain, headers,name }: iGetDEUsername) => {
  const filters = JSON.parse(JSON.stringify(GET_DE_FILTERS))
  filters.Property = filter.key
  filters.SimpleOperator = filter.filter
  filters.Value = filter.value

  const retrieveRequest=RETRIEVE_REQUEST_TYPE.find((type:{name:string,properties:string})=>name===type.name)
  if(!retrieveRequest)throw new ApiError(400,"Please provide valid name")
  let body = GET_DE.replace(HEADER, headers)
  body=body.replace(DATA_TYPE_PROPERTIES,retrieveRequest?.properties||"")
  body = body.replace(FILTER, json2xml(filters, { compact: true, spaces: 4 }))
  const res = getDE_API(body, subDomain) as Promise<AxiosResponse<any, any>>
  return res
}
const getDE_API = (data: any, subdomain: string) => {
  return new Promise(async (resolve, reject) => {

    var config = {
      method: 'post',
      url: `https://${subdomain}.soap.marketingcloudapis.com/Service.asmx`,
      headers: {
        'Content-Type': 'text/xml'
      },
      data
    };
    const res = await axios(config).catch(err => {
      reject(err)
    })
    resolve(res as AxiosResponse<any, any>)
  })
}

const getOBJECT_FOLDER_API = (data: any, subdomain: string) => {
  return new Promise(async (resolve, reject) => {
    // console.log(data)
    var config = {
      method: 'post',
      url: `https://${subdomain}.soap.marketingcloudapis.com/Service.asmx`,
      headers: {
        'Content-Type': 'text/xml'
      },
      data
    };
    const res = await axios(config).catch(err => {
      reject(err)
    })
    resolve(res as AxiosResponse<any, any>)
  })
}


export default {
  addFormJson,
  convertJSONtoXML,
  getAllFormAllDocuments,
  getFormJsonById,
  addFormRecord,
  findDE,
  getAccessToken
};
