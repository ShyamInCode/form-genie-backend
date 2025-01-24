import Joi from 'joi';
import { AUTH_TYPE, RETRIEVE_REQUEST_TYPE } from './form.constants';

const  reqBody=Joi.object().keys({
  client_id:Joi.string().required(),
  grant_type:Joi.string().required(),
  redirect_uri:Joi.string().required(),
  code:Joi.string().required(),
  client_secret: Joi.string().required(),
})
export const postJSONForm = {
  body: Joi.object().keys({
    clientId: Joi.string().required(),
    subdomain: Joi.string().required(),
    fields: Joi.array().required(),
    metaData: Joi.object().required(),
    reqBody,
    clientSecret: Joi.string().required(),
  }),
};

export const postFormRecord = {
  params:Joi.object().keys({
    deId:Joi.string().uuid().required()
  }),
  body: Joi.object().keys({
    fields: Joi.array().required(),
  }),
};
const customFilterValidation=(value:any,helper:any)=>{
  if(value.name==='Automation' && value.filter.filter!=='equals'){
    return helper.error('any.invalid','Automation filter should be "equal" ')
  }
  return value
}
const filter=Joi.object().keys({
  key: Joi.string().required(),
  value: Joi.string().required(),
  filter: Joi.string().valid('like','equals').required(),
})

export const findDE = {
  body: Joi.object().keys({
    authType:Joi.string().valid(...Object.values(AUTH_TYPE)),
    token:Joi.alternatives().conditional('authType', { is: AUTH_TYPE.CLIENT, then: Joi.string().required() }),
    username:Joi.alternatives().conditional('authType', { is: AUTH_TYPE.USERNAME, then: Joi.string().required() }),
    password:Joi.alternatives().conditional('authType', { is: AUTH_TYPE.USERNAME, then: Joi.string().required() }),
    filter,
    subDomain: Joi.string().required(),
    name: Joi.string().valid(...RETRIEVE_REQUEST_TYPE.map(type=>type.name),"all").required(),

}).custom(customFilterValidation),
};



export const getAccessToken = {
  body: Joi.object().keys({
  client_id: Joi.string().required(),
  client_secret: Joi.string().required(),
  // account_id: Joi.string().required(),
  subdomain: Joi.string().required(),
  grant_type:Joi.string().optional(),
  }),
};


export default {
  postJSONForm,
  postFormRecord,
  getAccessToken,
  findDE
}