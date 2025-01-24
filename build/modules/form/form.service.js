"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.findDE = exports.getAllFormAllDocuments = exports.getFormJsonById = exports.convertJSONtoXML = exports.getAccessToken = exports.addFormRecord = exports.addFormJson = void 0;
const firebase_admin_1 = __importDefault(require("firebase-admin"));
const form_constants_1 = require("./form.constants");
const { v4: uuidv4 } = require('uuid');
const xml_js_1 = require("xml-js");
const axios_1 = __importDefault(require("axios"));
const config_constants_1 = require("../../config/config.constants");
const utilities_1 = require("../../utils/utilities");
const ApiError_1 = __importDefault(require("../../utils/ApiError"));
const xml2js_1 = require("xml2js");
const addFormJson = async (params) => {
    var _a, _b;
    if (((_a = params.fields) === null || _a === void 0 ? void 0 : _a.length) !== ((_b = params.metaData.formInputs) === null || _b === void 0 ? void 0 : _b.length))
        throw new ApiError_1.default(400, " fields length and form input length must be same");
    const authResponse = await (0, exports.getAccessToken)(params.reqBody, params.subdomain);
    const accessToken = authResponse.access_token;
    const credentials = {
        refresh_token: authResponse.refresh_token,
        grant_type: "refresh_token",
        client_id: params.reqBody.client_id,
        subdomain: params.subdomain,
        client_secret: params.reqBody.client_secret
    };
    const CustomerKey = new Date().getTime();
    const customerName = `webForm_${CustomerKey}`;
    const primaryKeyField = params.fields.find(field => field.IsPrimaryKey);
    if (!primaryKeyField)
        throw new ApiError_1.default(400, "Please provide primary key");
    const body = JSON.parse(JSON.stringify(form_constants_1.CREATE_DATA_EXTENSION_BODY));
    body.CustomerKey = CustomerKey;
    body.Name = customerName;
    body.SendableDataExtensionField.CustomerKey = primaryKeyField.CustomerKey;
    body.SendableDataExtensionField.Name = primaryKeyField.Name;
    body.SendableDataExtensionField.FieldType = primaryKeyField.FieldType;
    body.Fields.Field = params.fields;
    const bodyXml = (0, exports.convertJSONtoXML)(body);
    let xml = form_constants_1.CREATE_DATA_EXTENSION_XML;
    xml = xml.replace(form_constants_1.bodyText, bodyXml);
    xml = xml.replace(form_constants_1.subdomainText, params.subdomain);
    xml = xml.replace(form_constants_1.accessTokenText, accessToken);
    const response = await createDataExtension(xml, params.subdomain).catch(err => {
        throw new ApiError_1.default(400, err.message);
    });
    const res = await new Promise((resolve, reject) => {
        (0, xml2js_1.parseString)(response.data, async function (err, responseFromAPI) {
            var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p;
            if (err) {
                reject({ message: "Error While parsing the DE API response", err });
            }
            else if (((_g = (_f = (_e = (_d = (_c = (_b = (_a = responseFromAPI['soap:Envelope']) === null || _a === void 0 ? void 0 : _a['soap:Body']) === null || _b === void 0 ? void 0 : _b[0]) === null || _c === void 0 ? void 0 : _c.CreateResponse) === null || _d === void 0 ? void 0 : _d[0]) === null || _e === void 0 ? void 0 : _e.Results) === null || _f === void 0 ? void 0 : _f[0]) === null || _g === void 0 ? void 0 : _g.StatusCode[0]) === "Error") {
                reject({ message: "Error in posting DE: " + ((_p = (_o = (_m = (_l = (_k = (_j = (_h = responseFromAPI['soap:Envelope']) === null || _h === void 0 ? void 0 : _h['soap:Body']) === null || _j === void 0 ? void 0 : _j[0]) === null || _k === void 0 ? void 0 : _k.CreateResponse) === null || _l === void 0 ? void 0 : _l[0]) === null || _m === void 0 ? void 0 : _m.Results) === null || _o === void 0 ? void 0 : _o[0]) === null || _p === void 0 ? void 0 : _p.StatusMessage[0]), responseFromAPI });
            }
            else {
                const id = uuidv4();
                const data = { fields: params.fields, id, dataExtensionRef: CustomerKey, metaData: params.metaData, customerName, credentials };
                await firebase_admin_1.default.firestore().collection(config_constants_1.COLLECTIONS.FORM_DATA_KEY).doc(id).create(data);
                resolve({ success: true, id, customerName, message: "My Form submitted successfully!" });
            }
        });
    }).catch(err => {
        throw new ApiError_1.default(400, err.message);
    });
    return res;
};
exports.addFormJson = addFormJson;
const addFormRecord = async (params, deId) => {
    const doc = await (await firebase_admin_1.default.firestore().collection(config_constants_1.COLLECTIONS.FORM_DATA_KEY).doc(deId).get()).data();
    if (!doc)
        throw new ApiError_1.default(404, "Document not found");
    const authResponse = await getAccessTokenForRecord(doc.credentials);
    const accessToken = authResponse.access_token;
    if (authResponse.refresh_token) {
        doc.credentials.refresh_token = authResponse.refresh_token;
        await firebase_admin_1.default.firestore().collection(config_constants_1.COLLECTIONS.FORM_DATA_KEY).doc(deId).update({ credentials: doc.credentials });
    }
    // const accessToken = "eyJhbGciOiJIUzI1NiIsImtpZCI6IjQiLCJ2ZXIiOiIxIiwidHlwIjoiSldUIn0.eyJhY2Nlc3NfdG9rZW4iOiJZTXk1cU1sbkNXYnAzUk5rNG00eUVKMmUiLCJjbGllbnRfaWQiOiJhZWtqZWQ1cXZuMGk4d2gxcXYzbWZqMW0iLCJlaWQiOjUxNDAwNjAyNywic3RhY2tfa2V5IjoiUzExIiwicGxhdGZvcm1fdmVyc2lvbiI6MiwiY2xpZW50X3R5cGUiOiJQdWJsaWMiLCJwaWQiOjMyNX0.XE4eGw3PkhZjBrbxTG3Xnlo6BmdktwvnYgbebeFletE.5LxfOlTX1WZ7xevWELfuEuhRf5PIW6uWQdLqMgF5xhSIqlNj_dGG7nE7obq9rfZHszhkmSdLiYkRyPiB7aNlAf_XTmZkixQXy5Ehjbnx2ZPco3_IFS3sPSHJUjTYBQHO1aC75V-Q4ygkTc6WKfzPIO5kpUkjnOzR6hBFmjjgP8WPUrcZ"
    const response = await createDataExtensionRecord({
        body: params.fields,
        token: accessToken,
        deRef: doc.dataExtensionRef,
        domain: doc.credentials.subdomain
    }).catch(err => {
        throw new ApiError_1.default(400, err.message);
    });
    return { success: true, message: "Form submitted successfully!" };
};
exports.addFormRecord = addFormRecord;
const createDataExtensionRecord = ({ body, domain, token, deRef }) => {
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
        const res = await (0, axios_1.default)(config).catch(err => {
            reject(err);
        });
        resolve(res);
    });
};
const getAccessToken = async (body, subdomain) => {
    var config = {
        method: 'post',
        url: `https://${subdomain}.auth.marketingcloudapis.com/v2/token`,
        headers: {
            'Content-Type': 'application/json'
        },
        data: body
    };
    const res = await (0, axios_1.default)(config);
    return res.data;
};
exports.getAccessToken = getAccessToken;
const getAccessTokenForRecord = (body) => {
    return new Promise(async (resolve, reject) => {
        console.log("fetching from getAccessTokenFromRefreshToken");
        getAccessTokenFromRefreshToken(body)
            .then(res => {
            resolve(res);
        })
            .catch(err => {
            console.log("fetching from getAccessTokenFromClientSecret");
            getAccessTokenFromClientSecret(body).then(res => {
                resolve(res);
            }).catch(err => {
                reject(err);
            });
        });
    });
};
const getAccessTokenFromRefreshToken = async (body) => {
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
        (0, axios_1.default)(config).then(res => {
            resolve(res.data);
        })
            .catch(err => {
            reject(err);
        });
    });
};
const getAccessTokenFromClientSecret = async (body) => {
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
        (0, axios_1.default)(config).then(res => {
            resolve(res.data);
        })
            .catch(err => {
            reject(err);
        });
    });
};
const createDataExtension = (body, domain) => {
    return new Promise(async (resolve, reject) => {
        var config = {
            method: 'post',
            url: `https://${domain}.soap.marketingcloudapis.com/Service.asmx`,
            headers: {
                'Content-Type': 'text/xml'
            },
            data: body
        };
        const res = await (0, axios_1.default)(config).catch(err => {
            reject(err);
        });
        resolve(res);
    });
};
const convertJSONtoXML = (json) => {
    const jsonStr = JSON.stringify(json);
    const xml = (0, xml_js_1.json2xml)(jsonStr, { compact: true, spaces: 4 });
    return xml;
};
exports.convertJSONtoXML = convertJSONtoXML;
const getFormJsonById = async (docId) => {
    const res = await firebase_admin_1.default.firestore().collection(config_constants_1.COLLECTIONS.FORM_DATA_KEY)
        .doc(docId)
        .get();
    if (!res.exists)
        throw new ApiError_1.default(400, "Record not found");
    return { success: true, data: res.data() };
};
exports.getFormJsonById = getFormJsonById;
const getAllFormAllDocuments = async ({ page, limit }) => {
    if (!page)
        page = 1;
    if (!limit || limit > form_constants_1.MAX_LIMIT)
        limit = form_constants_1.MAX_LIMIT;
    const res = await firebase_admin_1.default.firestore().collection(config_constants_1.COLLECTIONS.FORM_DATA_KEY).orderBy('id', "asc")
        .startAfter(((Number(page) - 1) * Number(limit))).limit(Number(limit)).get();
    return (0, utilities_1.getPaginated)(res.docs.map((data) => data.data()), page, limit);
};
exports.getAllFormAllDocuments = getAllFormAllDocuments;
const getObjectFromDEresponse = (result) => {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t;
    return {
        id: ((_a = result.CategoryID) === null || _a === void 0 ? void 0 : _a[0]) || "",
        name: ((_b = result.Name) === null || _b === void 0 ? void 0 : _b[0]) || "",
        client: ((_e = (_d = (_c = result.Client) === null || _c === void 0 ? void 0 : _c[0]) === null || _d === void 0 ? void 0 : _d.ID) === null || _e === void 0 ? void 0 : _e[0]) || "",
        CreatedDate: ((_f = result.CreatedDate) === null || _f === void 0 ? void 0 : _f[0]) || "",
        ModifiedDate: ((_g = result.ModifiedDate) === null || _g === void 0 ? void 0 : _g[0]) || "",
        ObjectID: (typeof ((_h = result.ObjectID) === null || _h === void 0 ? void 0 : _h[0]) === "string" && ((_j = result.ObjectID) === null || _j === void 0 ? void 0 : _j[0])) || "",
        CustomerKey: ((_k = result.CustomerKey) === null || _k === void 0 ? void 0 : _k[0]) || "",
        Description: ((_l = result.Description) === null || _l === void 0 ? void 0 : _l[0]) || "",
        IsSendable: ((_m = result.IsSendable) === null || _m === void 0 ? void 0 : _m[0]) || "",
        SendableSubscriberField: ((_q = (_p = (_o = result.SendableSubscriberField) === null || _o === void 0 ? void 0 : _o[0]) === null || _p === void 0 ? void 0 : _p.Name) === null || _q === void 0 ? void 0 : _q[0]) || "",
        SendableDataExtensionField: ((_t = (_s = (_r = result.SendableDataExtensionField) === null || _r === void 0 ? void 0 : _r[0]) === null || _s === void 0 ? void 0 : _s.Name) === null || _t === void 0 ? void 0 : _t[0]) || "",
        type: result.type
    };
};
const findDE = async ({ authType, subDomain, token, filter, password, username, name }) => {
    var _a, _b, _c, _d, _e, _f, _g, _h;
    try {
        const headers = getHeaders({ authType, subDomain, token, filter, password, username, name });
        // console.log({headers})
        if (!headers)
            throw new ApiError_1.default(400, "Please provide valid AuthType");
        let response;
        if (authType === form_constants_1.AUTH_TYPE.CLIENT) {
            response = await getDEClient({ subDomain, filter, token, headers, name });
        }
        else if (authType === form_constants_1.AUTH_TYPE.USERNAME) {
            response = await getDEUsername({ subDomain, filter, username, password, headers, name });
        }
        //return response.data
        const json = await parseXMLtoJSON((response.data));
        // return json["soap:Envelope"]?.["soap:Body"]?.[0]?.RetrieveResponseMsg?.[0]?.Results
        const category = ((_f = (_e = (_d = (_c = (_b = (_a = json["soap:Envelope"]) === null || _a === void 0 ? void 0 : _a["soap:Body"]) === null || _b === void 0 ? void 0 : _b[0]) === null || _c === void 0 ? void 0 : _c.RetrieveResponseMsg) === null || _d === void 0 ? void 0 : _d[0]) === null || _e === void 0 ? void 0 : _e.Results) === null || _f === void 0 ? void 0 : _f.map((result) => getObjectFromDEresponse(Object.assign(Object.assign({}, result), { type: name })))) || [];
        // return category
        const res = getObjectFolderPath(category.filter((cat) => !!cat.id), headers, subDomain, name);
        return res;
        // else throw new ApiError(400,"Please provide valid AuthType")
    }
    catch (error) {
        // console.log(error)
        throw new ApiError_1.default(((_g = error === null || error === void 0 ? void 0 : error.response) === null || _g === void 0 ? void 0 : _g.status) || 400, ((_h = error === null || error === void 0 ? void 0 : error.response) === null || _h === void 0 ? void 0 : _h.statusText) || error.message);
    }
};
exports.findDE = findDE;
const getHeaders = ({ authType, subDomain, token, filter, password, username, }) => {
    if (authType === form_constants_1.AUTH_TYPE.CLIENT) {
        let headers = form_constants_1.GET_DE_HEADER_CLIENT;
        headers = headers.replace(form_constants_1.subdomainText, subDomain);
        headers = headers.replace(form_constants_1.accessTokenText, token);
        return headers;
    }
    else if (authType === form_constants_1.AUTH_TYPE.USERNAME) {
        let headers = form_constants_1.GET_DE_HEADER_USERNAME;
        headers = headers.replace(form_constants_1.subdomainText, subDomain);
        headers = headers.replace(form_constants_1.USERNAME, username);
        headers = headers.replace(form_constants_1.PASSWORD, password);
        return headers;
    }
    return null;
};
const getObjectFolderPath = async (category, headers, subDomain, name) => {
    //console.log({category})
    const promises = category.map(category => getPath({ headers, categoryId: category.id, subDomain, path: [`${category.name}`], objectId: "", category }));
    const paths = await Promise.all(promises);
    //return paths
    const findType = form_constants_1.RETRIEVE_REQUEST_TYPE.find((type) => type.name === name);
    return paths.map(path => {
        return Object.assign(Object.assign({}, path), { link: getLink(findType, path), path: path.path.join('/') });
    });
};
const getLink = (findType, path) => {
    let link = findType === null || findType === void 0 ? void 0 : findType.link;
    link = link === null || link === void 0 ? void 0 : link.replace(form_constants_1.ReplaceObjectID, path.ObjectID).replace(form_constants_1.ReplaceCategoryID, path.id);
    return link;
};
const getPath = async ({ categoryId, headers, path, subDomain, objectId, category }) => {
    const replacedCategoryIdObjectFolder = form_constants_1.GET_OBJECT_FOLDER.replace(form_constants_1.CATEGORY_ID, categoryId);
    const replacedHeaderObjectFolder = replacedCategoryIdObjectFolder.replace(form_constants_1.HEADER, headers);
    const Api_Response = await getOBJECT_FOLDER_API(replacedHeaderObjectFolder, subDomain);
    const json = await parseXMLtoJSON(Api_Response.data);
    const nestedJson = json["soap:Envelope"]["soap:Body"][0].RetrieveResponseMsg[0].Results[0];
    const name = nestedJson.Name[0];
    if (!objectId)
        objectId = nestedJson.ObjectID[0];
    const ID = nestedJson.ParentFolder[0].ID[0];
    path.unshift(name);
    if (ID != 0)
        return getPath({ categoryId: ID, headers, path, subDomain, objectId, category });
    return Object.assign({ path, objectId }, category);
};
//getObjectFolderPath(['1234'],"abc")
const parseXMLtoJSON = (xml) => {
    return new Promise((resolve, reject) => {
        (0, xml2js_1.parseString)(xml, { trim: true, }, (err, responseFromAPI) => {
            if (err)
                return reject(err);
            return resolve(responseFromAPI);
        });
    });
};
const getDEClient = async ({ subDomain, filter, headers, name }) => {
    const filters = JSON.parse(JSON.stringify(form_constants_1.GET_DE_FILTERS));
    filters.Property = filter.key;
    filters.SimpleOperator = filter.filter;
    filters.Value = filter.value;
    const retrieveRequest = form_constants_1.RETRIEVE_REQUEST_TYPE.find((type) => name === type.name);
    if (!retrieveRequest)
        throw new ApiError_1.default(400, "Please provide valid name");
    let body = form_constants_1.GET_DE.replace(form_constants_1.HEADER, headers);
    body = body.replace(form_constants_1.DATA_TYPE_PROPERTIES, (retrieveRequest === null || retrieveRequest === void 0 ? void 0 : retrieveRequest.properties) || "");
    body = body.replace(form_constants_1.FILTER, (0, xml_js_1.json2xml)(filters, { compact: true, spaces: 4 }));
    return getDE_API(body, subDomain);
};
const getDEUsername = ({ filter, subDomain, headers, name }) => {
    const filters = JSON.parse(JSON.stringify(form_constants_1.GET_DE_FILTERS));
    filters.Property = filter.key;
    filters.SimpleOperator = filter.filter;
    filters.Value = filter.value;
    const retrieveRequest = form_constants_1.RETRIEVE_REQUEST_TYPE.find((type) => name === type.name);
    if (!retrieveRequest)
        throw new ApiError_1.default(400, "Please provide valid name");
    let body = form_constants_1.GET_DE.replace(form_constants_1.HEADER, headers);
    body = body.replace(form_constants_1.DATA_TYPE_PROPERTIES, (retrieveRequest === null || retrieveRequest === void 0 ? void 0 : retrieveRequest.properties) || "");
    body = body.replace(form_constants_1.FILTER, (0, xml_js_1.json2xml)(filters, { compact: true, spaces: 4 }));
    const res = getDE_API(body, subDomain);
    return res;
};
const getDE_API = (data, subdomain) => {
    return new Promise(async (resolve, reject) => {
        var config = {
            method: 'post',
            url: `https://${subdomain}.soap.marketingcloudapis.com/Service.asmx`,
            headers: {
                'Content-Type': 'text/xml'
            },
            data
        };
        const res = await (0, axios_1.default)(config).catch(err => {
            reject(err);
        });
        resolve(res);
    });
};
const getOBJECT_FOLDER_API = (data, subdomain) => {
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
        const res = await (0, axios_1.default)(config).catch(err => {
            reject(err);
        });
        resolve(res);
    });
};
exports.default = {
    addFormJson: exports.addFormJson,
    convertJSONtoXML: exports.convertJSONtoXML,
    getAllFormAllDocuments: exports.getAllFormAllDocuments,
    getFormJsonById: exports.getFormJsonById,
    addFormRecord: exports.addFormRecord,
    findDE: exports.findDE,
    getAccessToken: exports.getAccessToken
};
//# sourceMappingURL=form.service.js.map