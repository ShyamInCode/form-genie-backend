export const FORM_DATA_KEY = "FormData";

export const MAX_LIMIT = 20;

export const CREATE_DATA_EXTENSION_BODY = {
  CustomerKey: "postman_test_12345",
  Name: "Bilal",
  IsSendable: true,
  SendableDataExtensionField: {
    CustomerKey: "SubscriberKey",
    Name: "SubscriberKey",
    FieldType: "Text",
  },
  SendableSubscriberField: {
    Name: "Subscriber Key",
    Value: "",
  },
  Fields: {
    Field: [],
  },
};
export const bodyText = "BODY_REPLACE_HERE";
export const subdomainText = "SUBDOMAIN_REPLACE_HERE";
export const accessTokenText = "ACCESS_TOKEN_REPLACE_HERE";
export const HEADER = "HEADER_REPLACE_HERE";
export const FILTER = "FILTER_REPLACE_HERE";
export const USERNAME = "USERNAME_REPLACE_HERE";
export const PASSWORD = "PASSWORD_REPLACE_HERE";
export const CATEGORY_ID = "CATEGORY_ID_REPLACE_HERE";
export const DATA_TYPE_PROPERTIES = "DATA_TYPE_PROPERTIES_REPLACE_HERE";
export const CREATE_DATA_EXTENSION_XML = `<?xml version="1.0" encoding="UTF-8"?>
  <s:Envelope xmlns:s="http://www.w3.org/2003/05/soap-envelope" xmlns:a="http://schemas.xmlsoap.org/ws/2004/08/addressing" xmlns:u="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-utility-1.0.xsd">
      <s:Header>
          <a:Action s:mustUnderstand="1">Retrieve</a:Action>
          <a:To s:mustUnderstand="1">https://${subdomainText}.soap.marketingcloudapis.com/Service.asmx</a:To>
          <fueloauth xmlns="http://exacttarget.com">${accessTokenText}</fueloauth>
      </s:Header>
      <s:Body xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema">
      <CreateRequest xmlns="http://exacttarget.com/wsdl/partnerAPI">
      <Objects xsi:type="DataExtension">
      ${bodyText}
      </Objects>
      </CreateRequest>
      </s:Body>
      </s:Envelope>`;

export const AUTH_TYPE = {
  CLIENT: "CLIENT",
  USERNAME: "USERNAME",
};

export const GET_DE_HEADER_CLIENT = `
  <s:Header>
      <a:Action s:mustUnderstand="1">Retrieve</a:Action>
      <a:To s:mustUnderstand="1">https://${subdomainText}.soap.marketingcloudapis.com/Service.asmx</a:To>
      <fueloauth xmlns="http://exacttarget.com">${accessTokenText}</fueloauth>
  </s:Header>
      `;
export const GET_DE_HEADER_USERNAME = `
      <s:Header>
        <a:Action s:mustUnderstand="1">Retrieve</a:Action>
        <a:To s:mustUnderstand="1">https://${subdomainText}.soap.marketingcloudapis.com/Service.asmx</a:To>
        <Security
        xmlns="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-secext-1.0.xsd"
        >
        <UsernameToken>
          <Username>${USERNAME}</Username>
          <Password>${PASSWORD}</Password>
        </UsernameToken>
        </Security>
      </s:Header>
          `;

export const GET_DE_FILTERS = {
  Property: "CustomerKey",
  SimpleOperator: "equals",
  Value: "postman_demographics",
};


export const GET_DE = `<?xml version="1.0" encoding="UTF-8"?>
      <s:Envelope xmlns:s="http://www.w3.org/2003/05/soap-envelope" xmlns:a="http://schemas.xmlsoap.org/ws/2004/08/addressing" xmlns:u="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-utility-1.0.xsd">
          ${HEADER}
          <s:Body xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema">
              <RetrieveRequestMsg xmlns="http://exacttarget.com/wsdl/partnerAPI">
             ${DATA_TYPE_PROPERTIES}
              </RetrieveRequestMsg>
          </s:Body>
      </s:Envelope>`;

export const GET_OBJECT_FOLDER = `<?xml version="1.0" encoding="UTF-8"?>
      <s:Envelope xmlns:s="http://www.w3.org/2003/05/soap-envelope" xmlns:a="http://schemas.xmlsoap.org/ws/2004/08/addressing" xmlns:u="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-utility-1.0.xsd">
        ${HEADER}
          <s:Body xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema">
              <RetrieveRequestMsg xmlns="http://exacttarget.com/wsdl/partnerAPI">
                  <RetrieveRequest>
                      <ObjectType>DataFolder</ObjectType>
                      <Properties>ParentFolder.ID</Properties>
                      <Properties>ParentFolder.Name</Properties>
                      <Properties>Name</Properties>
                      <Properties>ObjectID</Properties>
                      <Filter xsi:type="SimpleFilterPart">
                          <Property>ID</Property>
                          <SimpleOperator>equals</SimpleOperator>
                          <Value>${CATEGORY_ID}</Value>
                      </Filter>
                      <Filter xsi:type="SimpleFilterPart">
                          <Property>ContentType</Property>
                          <SimpleOperator>equals</SimpleOperator>
                          <Value>dataextension</Value>
                      </Filter>
                  </RetrieveRequest>
              </RetrieveRequestMsg>
          </s:Body>
      </s:Envelope>`;


    export  const ReplaceObjectID='ReplaceObjectID';
    export  const ReplaceCategoryID="ReplaceCategoryID"
export const RETRIEVE_REQUEST_TYPE = [
  {
    name: "Data Extension",
    link:`https://mc.s10.exacttarget.com/cloud/#app/Email/C12/Default.aspx?entityType=none&entityID=0&ks=ks%23Subscribers/CustomObjects/${ReplaceCategoryID}`,
    properties: `     <RetrieveRequest>
    <ObjectType>DataExtension</ObjectType>
    <Properties>ObjectID</Properties>
    <Properties>CustomerKey</Properties>
    <Properties>Name</Properties>
    <Properties>CategoryID</Properties>
    <Properties>Client.ID</Properties>
    <Properties>ModifiedDate</Properties>
    <Properties>CreatedDate</Properties>
    <Properties>Description</Properties>
    <Properties>IsSendable</Properties>
    <Properties>IsTestable</Properties>
    <Properties>SendableDataExtensionField.Name</Properties>
    <Properties>SendableSubscriberField.Name</Properties>
    <Filter xsi:type="SimpleFilterPart">
        ${FILTER}
    </Filter>
</RetrieveRequest>`,
  },
  {
    name: "Data Filter Object",
    link:`https://mc.s10.exacttarget.com/cloud/#app/Email/C12/Default.aspx?entityType=none&entityID=0&ks=ks%23Subscribers/CustomObjects/${ReplaceCategoryID}`,
    properties: `   <RetrieveRequest>
    <ObjectType>FilterDefinition</ObjectType>
    <Properties>CategoryID</Properties>
    <Properties>ObjectID</Properties>
    <Properties>CreatedDate</Properties>
    <Properties>Name</Properties>
    <Properties>CustomerKey</Properties>
    <Properties>DataSource.Name</Properties>
    <Properties>ModifiedDate</Properties>
    <Properties>DataFilter</Properties>
    <Filter xsi:type="SimpleFilterPart">
      ${FILTER}
    </Filter>
</RetrieveRequest>`,
  },
  {
    name: "Query Definition",
    link:`https://mc.s11.exacttarget.com/cloud/#app/Automation Studio/AutomationStudioFuel3/%23ActivityDetails/300/${ReplaceObjectID}`,
    properties: ` 

<RetrieveRequest>
                <ObjectType>QueryDefinition</ObjectType>
                <Properties>CategoryID</Properties>
                <Properties>ObjectID</Properties>
                <Properties>Client.ID</Properties>
                <Properties>CustomerKey</Properties>
                <Properties>CreatedDate</Properties>
                <Properties>Name</Properties>
                <Properties>DataExtensionTarget.Name</Properties>
                <Properties>ModifiedDate</Properties>
                <Properties>Description</Properties>
                <Properties>FileType</Properties>
                <Properties>QueryText</Properties>
                <Properties>Status</Properties>
                <Properties>TargetType</Properties>
                <Properties>TargetUpdateType</Properties>
                <Filter xsi:type="SimpleFilterPart">
                ${FILTER}
                </Filter>
            </RetrieveRequest>
`,
  },
  {
    name: "Automation",
    link:'https://mc.s11.exacttarget.com/cloud/#app/Automation%20Studio/AutomationStudioFuel3/',
    properties: `<RetrieveRequest>
    <ObjectType>Automation</ObjectType>
    <Properties>ObjectID</Properties>
    <Properties>Name</Properties>
    <Properties>CategoryID</Properties>
    <Properties>Description</Properties>
    <Properties>CustomerKey</Properties>
    <Properties>IsActive</Properties>
    <Properties>ScheduledTime</Properties>
    <Properties>Client.ID</Properties>
    <Properties>CreatedDate</Properties>
    <Properties>ModifiedDate</Properties>
    <Properties>AutomationType</Properties>
    <Properties>Status</Properties>
    <Filter xsi:type="SimpleFilterPart">
    ${FILTER}
    </Filter>
</RetrieveRequest>`,
  },
  {
    name: "User Initiated Email",
    link:`https://members.s11.exacttarget.com/Content/Administration/SendManagement/SendDefinitionDetails.aspx?id=${ReplaceObjectID}&CategoryID=${ReplaceCategoryID}`,
    properties: `<RetrieveRequest>
    <ObjectType>EmailSendDefinition</ObjectType>
    <Properties>Client.ID</Properties>
    <Properties>ObjectID</Properties>
    <Properties>CreatedDate</Properties>
    <Properties>ModifiedDate</Properties>
    <Properties>CustomerKey</Properties>
    <Properties>Name</Properties>
    <Properties>CategoryID</Properties>
    <Properties>SenderProfile.FromName</Properties>
    <Properties>SenderProfile.FromAddress</Properties>
    <Properties>EmailSubject</Properties>
    <Filter xsi:type="SimpleFilterPart">
        ${FILTER}
    </Filter>
</RetrieveRequest>`,
  },

  {
    name: "Triggered Send Definition",
    link:`https://members.s11.exacttarget.com/Content/Interactions/TriggeredSendConfiguration.aspx?CategoryID=${ReplaceCategoryID}&ts=${ReplaceObjectID}`,
    properties: ` <RetrieveRequest>
    <ObjectType>TriggeredSendDefinition</ObjectType>
    <Properties>Client.ID</Properties>
    <Properties>ObjectID</Properties>

    <Properties>CreatedDate</Properties>
    <Properties>ModifiedDate</Properties>
    <Properties>CustomerKey</Properties>
    <Properties>Name</Properties>
    <Properties>CategoryID</Properties>
    <Properties>FromName</Properties>
    <Properties>FromAddress</Properties>
    <Properties>EmailSubject</Properties>
    <Properties>TriggeredSendType</Properties>
    <Properties>TriggeredSendStatus</Properties>
    <Filter xsi:type="SimpleFilterPart">
        ${FILTER}
    </Filter>
</RetrieveRequest>`,
  },
];


