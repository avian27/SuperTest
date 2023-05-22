import supertest from "supertest";
import chai, { expect } from 'chai';
import dotenv from "dotenv";
import jsonSchema from 'chai-json-schema';
import { faker } from '@faker-js/faker';
import { getSignedRequestHeaders } from '../../helpers/cdm/signature.mjs';
import { getCookie } from "../../helpers/cdm/cookie.mjs";
import { createOrgEndPoint, getAllOrgForLoggedInUserEndPoint, getOrgbyIdEndpoint, updateOrgEndpoint } from "../../configs/constants/cdm/constants.mjs";
import { EnvironmentConfiguration } from "../../envs.config.mjs";
import { createOrgSuccess, getAllOrgSchema, successUpdateOrgSchema } from "../../configs/jsonschema/cdm/organisation_json_schema.mjs";
import { createOrgPayload } from "../../helpers/cdm/organisation_payload.mjs";

chai.use(jsonSchema);
dotenv.config();
let cookie = await getCookie(process.env.TEST_UNAME, process.env.TEST_PASS);
let persistPayload, persistPayloadVendor, payload, payloadJSON, signed_headers, endpoint, headers, res, orgName, duplicateOrgName, vendorOrgId, payloadData, orgId;
let brandOrgId = "";
const baseUrl = EnvironmentConfiguration.getURL(process.env.DOMAIN);
const request = supertest(`https://${baseUrl}`);

function categoryArrayData(arraySize){
    let tempCategories = [];
    for(let i=0; i<arraySize; i++){
        tempCategories.push(faker.random.alpha(5));
    }
    return tempCategories;
}

describe('Create Organisation @cdm @org', async function(){

    it('Create Org - User is not logged in', async function(){
        let categories = [];
        payloadData = createOrgPayload(faker.company.name());
        categories = categoryArrayData(payloadData.categoriesCount);
        payload = JSON.stringify({
            "name": payloadData.orgName,
            "display_name": payloadData.orgName,
            "email": payloadData.email,
            "type": "seller",
            "company_size": payloadData.companySize,
            "categories": categories,
            "address": payloadData.address
        });
        signed_headers = getSignedRequestHeaders("POST", baseUrl, createOrgEndPoint, payload, {});
        headers = {
            'Content-type': 'application/json;charset=UTF-8',
            'x-ccl-param': signed_headers["headers"]["x-ccl-param"],
            'x-ccl-signature': signed_headers["headers"]["x-ccl-signature"]
        };
        res = await request
            .post(createOrgEndPoint)
            .set(headers)
            .send(payload);
        expect(res.statusCode).to.be.eq(401);
        expect(res.body.message).to.be.eq('User not in request');

    });

    it('Create Org - User is logged in and invalid value is sent for type', async function(){
        let categories = [];
        const invalidType = faker.random.alpha(5);
        orgName = faker.company.name();
        payloadData = createOrgPayload(orgName);
        categories = categoryArrayData(payloadData.categoriesCount);
        payload = JSON.stringify({
            "name": payloadData.orgName,
            "display_name": payloadData.orgName,
            "email": payloadData.email,
            "type": invalidType,
            "company_size": payloadData.companySize,
            "categories": categories,
            "address": payloadData.address
        });
        signed_headers = getSignedRequestHeaders("POST", baseUrl, createOrgEndPoint, payload, {});
        headers = {
            'Content-type': 'application/json;charset=UTF-8',
            'x-ccl-param': signed_headers["headers"]["x-ccl-param"],
            'x-ccl-signature': signed_headers["headers"]["x-ccl-signature"],
            'Cookie': cookie
        };
        res = await request
            .post(createOrgEndPoint)
            .set(headers)
            .send(payload);
        expect(res.statusCode).to.be.eq(400);
        expect(res.body.message).to.be.eq('type: must be equal to one of the allowed values');     
    });

    it('Create Org - User is logged in and OrgName is sent as empty String', async function(){
        let categories = [];
        orgName = faker.company.name();
        payloadData = createOrgPayload(orgName);
        categories = categoryArrayData(payloadData.categoriesCount);
        payload = JSON.stringify({
            "name": "",
            "display_name": payloadData.orgName,
            "email": payloadData.email,
            "type": "seller",
            "company_size": payloadData.companySize,
            "categories": categories,
            "address": payloadData.address
        });
        signed_headers = getSignedRequestHeaders("POST", baseUrl, createOrgEndPoint, payload, {});
        headers = {
            'Content-type': 'application/json;charset=UTF-8',
            'x-ccl-param': signed_headers["headers"]["x-ccl-param"],
            'x-ccl-signature': signed_headers["headers"]["x-ccl-signature"],
            'Cookie': cookie
        };
        res = await request
            .post(createOrgEndPoint)
            .set(headers)
            .send(payload);
        expect(res.statusCode).to.be.eq(400);
        expect(res.body.message).to.be.eq('name: should not be empty');     
    });

    it('Create Org - User is logged in, successfull brand creation', async function(){
        let categories = [];
        orgName = faker.company.name();
        duplicateOrgName = orgName;
        payloadData = createOrgPayload(orgName);
        persistPayload = payloadData;
        categories = categoryArrayData(payloadData.categoriesCount);
        payload = JSON.stringify({
            "name": payloadData.orgName,
            "display_name": payloadData.orgName,
            "email": payloadData.email,
            "type": "seller",
            "company_size": payloadData.companySize,
            "categories": categories,
            "address": payloadData.address
        });
        signed_headers = getSignedRequestHeaders("POST", baseUrl, createOrgEndPoint, payload, {});
        headers = {
            'Content-type': 'application/json;charset=UTF-8',
            'x-ccl-param': signed_headers["headers"]["x-ccl-param"],
            'x-ccl-signature': signed_headers["headers"]["x-ccl-signature"],
            'Cookie': cookie
        };
        res = await request
            .post(createOrgEndPoint)
            .set(headers)
            .send(payload);
        brandOrgId = res.body.detail._id;
        expect(res.statusCode).to.be.eq(200);
        expect(res.body).to.be.jsonSchema(createOrgSuccess);
        expect(res.body.detail.name).to.be.eq(payloadData.orgName);
        expect(res.body.detail.display_name).to.be.eq(payloadData.orgName);
        expect(res.body.detail.email).to.be.eq(payloadData.email);
        expect(res.body.detail.type).to.be.eq('seller');
        expect(res.body.detail.categories.length).to.be.eq(payloadData.categoriesCount);
        expect(res.body.detail.company_size).to.be.eq(payloadData.companySize);
        expect(res.body.detail.address.street).to.be.eq(payloadData.address.street);
        expect(res.body.detail.address.landmark).to.be.eq(payloadData.address.landmark);
        expect(res.body.detail.address.city).to.be.eq(payloadData.address.city);
        expect(res.body.detail.address.state).to.be.eq(payloadData.address.state);
        expect(res.body.detail.address.country).to.be.eq(payloadData.address.country);
        expect(res.body.detail.address.pincode).to.be.eq(payloadData.address.pincode);     
    });

    it('Create Org - User is logged in, No Categories are sent', async function(){
        let categories = [];
        orgName = faker.company.name();
        payloadData = createOrgPayload(orgName);
        payload = JSON.stringify({
            "name": payloadData.orgName,
            "display_name": payloadData.orgName,
            "email": payloadData.email,
            "type": "seller",
            "company_size": payloadData.companySize,
            "categories": categories,
            "address": payloadData.address
        });
        signed_headers = getSignedRequestHeaders("POST", baseUrl, createOrgEndPoint, payload, {});
        headers = {
            'Content-type': 'application/json;charset=UTF-8',
            'x-ccl-param': signed_headers["headers"]["x-ccl-param"],
            'x-ccl-signature': signed_headers["headers"]["x-ccl-signature"],
            'Cookie': cookie
        };
        res = await request
            .post(createOrgEndPoint)
            .set(headers)
            .send(payload);
        expect(res.statusCode).to.be.eq(200);
        expect(res.body).to.be.jsonSchema(createOrgSuccess);
        expect(res.body.detail.name).to.be.eq(payloadData.orgName);
        expect(res.body.detail.display_name).to.be.eq(payloadData.orgName);
        expect(res.body.detail.email).to.be.eq(payloadData.email);
        expect(res.body.detail.type).to.be.eq('seller');
        expect(res.body.detail.categories.length).to.be.eq(0);
        expect(res.body.detail.company_size).to.be.eq(payloadData.companySize);
        expect(res.body.detail.address.street).to.be.eq(payloadData.address.street);
        expect(res.body.detail.address.landmark).to.be.eq(payloadData.address.landmark);
        expect(res.body.detail.address.city).to.be.eq(payloadData.address.city);
        expect(res.body.detail.address.state).to.be.eq(payloadData.address.state);
        expect(res.body.detail.address.country).to.be.eq(payloadData.address.country);
        expect(res.body.detail.address.pincode).to.be.eq(payloadData.address.pincode);     
    });

    it('Create Org - User is logged in, already existing org name is used', async function(){
        let categories = [];
        payloadData = createOrgPayload(duplicateOrgName);
        categories = categoryArrayData(payloadData.categoriesCount);
        payload = JSON.stringify({
            "name": payloadData.orgName,
            "display_name": payloadData.orgName,
            "email": payloadData.email,
            "type": "seller",
            "company_size": payloadData.companySize,
            "categories": categories,
            "address": payloadData.address
        });
        signed_headers = getSignedRequestHeaders("POST", baseUrl, createOrgEndPoint, payload, {});
        headers = {
            'Content-type': 'application/json;charset=UTF-8',
            'x-ccl-param': signed_headers["headers"]["x-ccl-param"],
            'x-ccl-signature': signed_headers["headers"]["x-ccl-signature"],
            'Cookie': cookie
        };
        res = await request
            .post(createOrgEndPoint)
            .set(headers)
            .send(payload);
        expect(res.statusCode).to.be.eq(400);
        expect(res.body.message).to.be.eq(`Organization Already Exists`);
    });

    it('Create Org - User is logged in, Address data is not sent', async function(){
        let categories = [];
        orgName = faker.company.name();
        payloadData = createOrgPayload(orgName);
        categories = categoryArrayData(payloadData.categoriesCount);
        payload = JSON.stringify({
            "name": payloadData.orgName,
            "display_name": payloadData.orgName,
            "email": payloadData.email,
            "type": "seller",
            "company_size": payloadData.companySize,
            "categories": categories,
            "address": {}
        });
        signed_headers = getSignedRequestHeaders("POST", baseUrl, createOrgEndPoint, payload, {});
        headers = {
            'Content-type': 'application/json;charset=UTF-8',
            'x-ccl-param': signed_headers["headers"]["x-ccl-param"],
            'x-ccl-signature': signed_headers["headers"]["x-ccl-signature"],
            'Cookie': cookie
        };
        res = await request
            .post(createOrgEndPoint)
            .set(headers)
            .send(payload);
        expect(res.statusCode).to.be.eq(200);
        expect(res.body).to.be.jsonSchema(createOrgSuccess);
        expect(res.body.detail.name).to.be.eq(payloadData.orgName);
        expect(res.body.detail.display_name).to.be.eq(payloadData.orgName);
        expect(res.body.detail.email).to.be.eq(payloadData.email);
        expect(res.body.detail.type).to.be.eq('seller');
        expect(res.body.detail.categories.length).to.be.eq(payloadData.categoriesCount);
        expect(res.body.detail.company_size).to.be.eq(payloadData.companySize);  
        expect(res.body.detail.address).to.be.empty;
    });

    it('Create Org - User is logged in, successfull vendor creation', async function(){
        let categories = [];
        orgName = faker.company.name();
        payloadData = createOrgPayload(orgName);
        persistPayloadVendor = payloadData;
        categories = categoryArrayData(payloadData.categoriesCount);
        payload = JSON.stringify({
            "name": payloadData.orgName,
            "display_name": payloadData.orgName,
            "email": payloadData.email,
            "type": "vendor",
            "company_size": payloadData.companySize,
            "categories": categories,
            "address": payloadData.address
        });
        signed_headers = getSignedRequestHeaders("POST", baseUrl, createOrgEndPoint, payload, {});
        headers = {
            'Content-type': 'application/json;charset=UTF-8',
            'x-ccl-param': signed_headers["headers"]["x-ccl-param"],
            'x-ccl-signature': signed_headers["headers"]["x-ccl-signature"],
            'Cookie': cookie
        };
        res = await request
            .post(createOrgEndPoint)
            .set(headers)
            .send(payload);
        vendorOrgId = res.body.detail._id;
        expect(res.statusCode).to.be.eq(200);
        expect(res.body).to.be.jsonSchema(createOrgSuccess);
        expect(res.body.detail.name).to.be.eq(payloadData.orgName);
        expect(res.body.detail.display_name).to.be.eq(payloadData.orgName);
        expect(res.body.detail.email).to.be.eq(payloadData.email);
        expect(res.body.detail.company_size).to.be.eq(payloadData.companySize);
        expect(res.body.detail.type).to.be.eq('vendor');
        expect(res.body.detail.categories.length).to.be.eq(payloadData.categoriesCount);
        expect(res.body.detail.address.street).to.be.eq(payloadData.address.street);
        expect(res.body.detail.address.landmark).to.be.eq(payloadData.address.landmark);
        expect(res.body.detail.address.city).to.be.eq(payloadData.address.city);
        expect(res.body.detail.address.state).to.be.eq(payloadData.address.state);
        expect(res.body.detail.address.country).to.be.eq(payloadData.address.country);
        expect(res.body.detail.address.pincode).to.be.eq(payloadData.address.pincode);
    });

});

describe('Fetch Organisation Details @cdm @org', async function(){

    it('Get All Organisation Details - User not logged in', async function(){
        payload = null;
        signed_headers = getSignedRequestHeaders("GET", baseUrl, getAllOrgForLoggedInUserEndPoint, payload, {});
        headers = {
            'Content-type': 'application/json;charset=UTF-8',
            'x-ccl-param': signed_headers["headers"]["x-ccl-param"],
            'x-ccl-signature': signed_headers["headers"]["x-ccl-signature"]
        };
        res = await request
            .get(getAllOrgForLoggedInUserEndPoint)
            .set(headers);
        expect(res.statusCode).to.be.eq(401);
        expect(res.body.message).to.be.eq('User not in request');
    });

    it('Get All Organisation Details - User logged in', async function(){
        payload = null;
        signed_headers = getSignedRequestHeaders("GET", baseUrl, getAllOrgForLoggedInUserEndPoint, payload, {});
        headers = {
            'Content-type': 'application/json;charset=UTF-8',
            'x-ccl-param': signed_headers["headers"]["x-ccl-param"],
            'x-ccl-signature': signed_headers["headers"]["x-ccl-signature"],
            'Cookie': cookie
        };
        res = await request
            .get(getAllOrgForLoggedInUserEndPoint)
            .set(headers);
        expect(res.statusCode).to.be.eq(200);
        expect(res.body).to.be.jsonSchema(getAllOrgSchema);
    });

    it('Get Organisation Details by OrgId - User is not logged in', async function(){
        payload = null;
        orgId = brandOrgId;
        endpoint = getOrgbyIdEndpoint(orgId);
        signed_headers = getSignedRequestHeaders("GET", baseUrl, endpoint, payload, {});
        headers = {
            'x-ccl-param': signed_headers["headers"]["x-ccl-param"],
            'x-ccl-signature': signed_headers["headers"]["x-ccl-signature"]
        };
        res = await request
            .get(endpoint)
            .set(headers);
        expect(res.statusCode).to.be.eq(403);
        expect(res.body.error).to.be.eq('Unauthorized');
    });

    it('Get Organisation Details by OrgId - User is logged in but invalid orgId is provided', async function(){
        payload = null;
        orgId = brandOrgId.substring(0, brandOrgId.length-1);
        endpoint = getOrgbyIdEndpoint(orgId);
        signed_headers = getSignedRequestHeaders("GET", baseUrl, endpoint, payload, {});
        headers = {
            'x-ccl-param': signed_headers["headers"]["x-ccl-param"],
            'x-ccl-signature': signed_headers["headers"]["x-ccl-signature"],
            'Cookie': cookie
        };
        res = await request
            .get(endpoint)
            .set(headers);
        expect(res.statusCode).to.be.eq(401);
        expect(res.body.error).to.be.eq('Invalid organisation');
    });

    it('Get Organisation Details by OrgId - User logged in and Brand details are fetched', async function(){
        payload = null;
        orgId = brandOrgId;
        endpoint = getOrgbyIdEndpoint(orgId);
        signed_headers = getSignedRequestHeaders("GET", baseUrl, endpoint, payload, {});
        headers = {
            'x-ccl-param': signed_headers["headers"]["x-ccl-param"],
            'x-ccl-signature': signed_headers["headers"]["x-ccl-signature"],
            'Cookie': cookie
        };
        res = await request
            .get(endpoint)
            .set(headers);
        expect(res.statusCode).to.be.eq(200);
        expect(res.body).to.be.jsonSchema(createOrgSuccess);
        expect(res.body.detail._id).to.be.eq(orgId);
        expect(res.body.detail.name).to.be.eq(persistPayload.orgName);
        expect(res.body.detail.display_name).to.be.eq(persistPayload.orgName);
        expect(res.body.detail.email).to.be.eq(persistPayload.email);
        expect(res.body.detail.type).to.be.eq('seller');
        expect(res.body.detail.categories.length).to.be.eq(persistPayload.categoriesCount);
        expect(res.body.detail.company_size).to.be.eq(persistPayload.companySize);
        expect(res.body.detail.address.street).to.be.eq(persistPayload.address.street);
        expect(res.body.detail.address.landmark).to.be.eq(persistPayload.address.landmark);
        expect(res.body.detail.address.city).to.be.eq(persistPayload.address.city);
        expect(res.body.detail.address.state).to.be.eq(persistPayload.address.state);
        expect(res.body.detail.address.country).to.be.eq(persistPayload.address.country);
        expect(res.body.detail.address.pincode).to.be.eq(persistPayload.address.pincode);
    });

    it('Get Organisation Details by OrgId - User logged in and Vendor details are fetched', async function(){
        payload = null;
        orgId = vendorOrgId;
        endpoint = getOrgbyIdEndpoint(orgId);
        signed_headers = getSignedRequestHeaders("GET", baseUrl, endpoint, payload, {});
        headers = {
            'Content-type': 'application/json;charset=UTF-8',
            'x-ccl-param': signed_headers["headers"]["x-ccl-param"],
            'x-ccl-signature': signed_headers["headers"]["x-ccl-signature"],
            'Cookie': cookie
        };
        res = await request
            .get(endpoint)
            .set(headers);
        expect(res.statusCode).to.be.eq(200);
        expect(res.body).to.be.jsonSchema(createOrgSuccess);
        expect(res.body.detail._id).to.be.eq(orgId);
        expect(res.body.detail.name).to.be.eq(persistPayloadVendor.orgName);
        expect(res.body.detail.display_name).to.be.eq(persistPayloadVendor.orgName);
        expect(res.body.detail.email).to.be.eq(persistPayloadVendor.email);
        expect(res.body.detail.type).to.be.eq('vendor');
        expect(res.body.detail.categories.length).to.be.eq(persistPayloadVendor.categoriesCount);
        expect(res.body.detail.company_size).to.be.eq(persistPayloadVendor.companySize);
        expect(res.body.detail.address.street).to.be.eq(persistPayloadVendor.address.street);
        expect(res.body.detail.address.landmark).to.be.eq(persistPayloadVendor.address.landmark);
        expect(res.body.detail.address.city).to.be.eq(persistPayloadVendor.address.city);
        expect(res.body.detail.address.state).to.be.eq(persistPayloadVendor.address.state);
        expect(res.body.detail.address.country).to.be.eq(persistPayloadVendor.address.country);
        expect(res.body.detail.address.pincode).to.be.eq(persistPayloadVendor.address.pincode);
    });

});

describe('Update Organisation Details @cdm @org', async function(){

    it('Update Org Details - User is not logged in', async function(){
        const updateOrgName = faker.random.alpha(20);
        payloadData = createOrgPayload(updateOrgName);
        payload = {
            display_name: payloadData.orgName,
            name: payloadData.orgName,
            company_size: payloadData.companySize,
            address: payloadData.address           
        };
        payloadJSON = JSON.stringify(payload);
        orgId = brandOrgId;
        endpoint = updateOrgEndpoint(orgId);
        signed_headers = getSignedRequestHeaders("PATCH", baseUrl, endpoint, payloadJSON, {});
        headers = {
            'x-ccl-param': signed_headers["headers"]["x-ccl-param"],
            'x-ccl-signature': signed_headers["headers"]["x-ccl-signature"]
        };
        res = await request
            .patch(endpoint)
            .set(headers)
            .send(payload);
        expect(res.statusCode).to.be.eq(403);
        expect(res.body.error).to.be.eq('Unauthorized');
    });

    it('Update Org Details - Invalid Org Id is sent', async function(){
        const updateOrgName = faker.random.alpha(20);
        payloadData = createOrgPayload(updateOrgName);
        payload = {
            display_name: payloadData.orgName,
            name: payloadData.orgName,
            company_size: payloadData.companySize,
            address: payloadData.address           
        };
        payloadJSON = JSON.stringify(payload);
        orgId = brandOrgId.substring(0, brandOrgId.length-1);
        endpoint = updateOrgEndpoint(orgId);
        signed_headers = getSignedRequestHeaders("PATCH", baseUrl, endpoint, payloadJSON, {});
        headers = {
            'x-ccl-param': signed_headers["headers"]["x-ccl-param"],
            'x-ccl-signature': signed_headers["headers"]["x-ccl-signature"],
            'Cookie': cookie
        };
        res = await request
            .patch(endpoint)
            .set(headers)
            .send(payload);
        expect(res.statusCode).to.be.eq(401);
        expect(res.body.error).to.be.eq('Invalid organisation');
    });

    it('Update Org Details - Empty string is sent for name', async function(){
        const updateOrgName = faker.random.alpha(20);
        payloadData = createOrgPayload(updateOrgName);
        payload = {
            display_name: "",
            name: payloadData.orgName,
            company_size: payloadData.companySize,
            address: payloadData.address           
        };
        payloadJSON = JSON.stringify(payload);
        orgId = brandOrgId;
        endpoint = updateOrgEndpoint(orgId);
        signed_headers = getSignedRequestHeaders("PATCH", baseUrl, endpoint, payloadJSON, {});
        headers = {
            'x-ccl-param': signed_headers["headers"]["x-ccl-param"],
            'x-ccl-signature': signed_headers["headers"]["x-ccl-signature"],
            'Cookie': cookie
        };
        res = await request
            .patch(endpoint)
            .set(headers)
            .send(payload);
        expect(res.statusCode).to.be.eq(400);
        /*need to add more validations but since the test case is failing unable to add more validations
        error message is unknown for now.*/
    });

    it('Update Org Details - String is sent for Pincode', async function(){
        const updateOrgName = faker.random.alpha(20);
        payloadData = createOrgPayload(updateOrgName);
        payload = {
            display_name: payloadData.orgName,
            name: payloadData.orgName,
            company_size: payloadData.companySize,
            address: {
                street : payloadData.address.street,
                city : payloadData.address.city,
                state : payloadData.address.state,
                country : payloadData.address.country,
                landmark: payloadData.address.landmark,
                pincode : faker.random.alpha(6)
            }          
        };
        payloadJSON = JSON.stringify(payload);
        orgId = brandOrgId;
        endpoint = updateOrgEndpoint(orgId);
        signed_headers = getSignedRequestHeaders("PATCH", baseUrl, endpoint, payloadJSON, {});
        headers = {
            'x-ccl-param': signed_headers["headers"]["x-ccl-param"],
            'x-ccl-signature': signed_headers["headers"]["x-ccl-signature"],
            'Cookie': cookie
        };
        res = await request
            .patch(endpoint)
            .set(headers)
            .send(payload);
        expect(res.statusCode).to.be.eq(400);
        /*need to add more validations but since the test case is failing unable to add more validations
        error message is unknown for now.*/
    });

    it('Update Org Details - User is logged in and Org is Updated successfully', async function(){
        const updateOrgName = faker.random.alpha(20);
        payloadData = createOrgPayload(updateOrgName);
        payload = {
            display_name: payloadData.orgName,
            name: payloadData.orgName,
            company_size: payloadData.companySize,
            address: payloadData.address
        };
        payloadJSON = JSON.stringify(payload);
        orgId = brandOrgId;
        endpoint = updateOrgEndpoint(orgId);
        signed_headers = getSignedRequestHeaders("PATCH", baseUrl, endpoint, payloadJSON, {});
        headers = {
            'x-ccl-param': signed_headers["headers"]["x-ccl-param"],
            'x-ccl-signature': signed_headers["headers"]["x-ccl-signature"],
            'Cookie': cookie
        };
        res = await request
            .patch(endpoint)
            .set(headers)
            .send(payload);
        expect(res.statusCode).to.be.eq(200);
        expect(res.body).to.be.jsonSchema(successUpdateOrgSchema);
        expect(res.body.data._id).to.be.eq(orgId);
        expect(res.body.data.display_name).to.be.eq(payloadData.orgName);
        expect(res.body.data.name).to.be.eq(payloadData.orgName);
        expect(res.body.data.company_size).to.be.eq(payloadData.companySize);
        expect(res.body.data.address.pincode).to.be.eq(payloadData.address.pincode);
        expect(res.body.data.address.city).to.be.eq(payloadData.address.city);
        expect(res.body.data.address.state).to.be.eq(payloadData.address.state);
        expect(res.body.data.address.country).to.be.eq(payloadData.address.country);
    });

    it('Update Org Details - Only Name is updated', async function(){
        const updateOrgName = faker.random.alpha(20);
        payloadData = createOrgPayload(updateOrgName);
        payload = {
            display_name: payloadData.orgName,
        };
        payloadJSON = JSON.stringify(payload);
        orgId = brandOrgId;
        endpoint = updateOrgEndpoint(orgId);
        signed_headers = getSignedRequestHeaders("PATCH", baseUrl, endpoint, payloadJSON, {});
        headers = {
            'x-ccl-param': signed_headers["headers"]["x-ccl-param"],
            'x-ccl-signature': signed_headers["headers"]["x-ccl-signature"],
            'Cookie': cookie
        };
        res = await request
            .patch(endpoint)
            .set(headers)
            .send(payload);
        expect(res.statusCode).to.be.eq(200);
        expect(res.body).to.be.jsonSchema(successUpdateOrgSchema);
        expect(res.body.data._id).to.be.eq(orgId);
        expect(res.body.data.display_name).to.be.eq(payloadData.orgName);
    });

    it('Update Org Details - Only pincode is updated', async function(){
        const updateOrgName = faker.random.alpha(20);
        payloadData = createOrgPayload(updateOrgName);
        payload = {
            address: {
                pincode : payloadData.address.pincode
            }  
        };
        payloadJSON = JSON.stringify(payload);
        orgId = brandOrgId;
        endpoint = updateOrgEndpoint(orgId);
        signed_headers = getSignedRequestHeaders("PATCH", baseUrl, endpoint, payloadJSON, {});
        headers = {
            'x-ccl-param': signed_headers["headers"]["x-ccl-param"],
            'x-ccl-signature': signed_headers["headers"]["x-ccl-signature"],
            'Cookie': cookie
        };
        res = await request
            .patch(endpoint)
            .set(headers)
            .send(payload);
        expect(res.statusCode).to.be.eq(200);
        expect(res.body).to.be.jsonSchema(successUpdateOrgSchema);
        expect(res.body.data._id).to.be.eq(orgId);
        expect(res.body.data.address.pincode).to.be.eq(payloadData.address.pincode);
    });

    it('Update Org Details - Only city is updated', async function(){
        const updateOrgName = faker.random.alpha(20);
        payloadData = createOrgPayload(updateOrgName);
        payload = {
            address: {
                city : payloadData.address.city
            }  
        };
        payloadJSON = JSON.stringify(payload);
        orgId = brandOrgId;
        endpoint = updateOrgEndpoint(orgId);
        signed_headers = getSignedRequestHeaders("PATCH", baseUrl, endpoint, payloadJSON, {});
        headers = {
            'x-ccl-param': signed_headers["headers"]["x-ccl-param"],
            'x-ccl-signature': signed_headers["headers"]["x-ccl-signature"],
            'Cookie': cookie
        };
        res = await request
            .patch(endpoint)
            .set(headers)
            .send(payload);
        expect(res.statusCode).to.be.eq(200);
        expect(res.body).to.be.jsonSchema(successUpdateOrgSchema);
        expect(res.body.data._id).to.be.eq(orgId);
        expect(res.body.data.address.city).to.be.eq(payloadData.address.city);
    });

    it('Update Org Details - Only State is updated', async function(){
        const updateOrgName = faker.random.alpha(20);
        payloadData = createOrgPayload(updateOrgName);
        payload = {
            address: {
                state : payloadData.address.state
            }  
        };
        payloadJSON = JSON.stringify(payload);
        orgId = brandOrgId;
        endpoint = updateOrgEndpoint(orgId);
        signed_headers = getSignedRequestHeaders("PATCH", baseUrl, endpoint, payloadJSON, {});
        headers = {
            'x-ccl-param': signed_headers["headers"]["x-ccl-param"],
            'x-ccl-signature': signed_headers["headers"]["x-ccl-signature"],
            'Cookie': cookie
        };
        res = await request
            .patch(endpoint)
            .set(headers)
            .send(payload);
        expect(res.statusCode).to.be.eq(200);
        expect(res.body).to.be.jsonSchema(successUpdateOrgSchema);
        expect(res.body.data._id).to.be.eq(orgId);
        expect(res.body.data.address.state).to.be.eq(payloadData.address.state);
    });

    it('Update Org Details - Only Country is updated', async function(){
        const updateOrgName = faker.random.alpha(20);
        payloadData = createOrgPayload(updateOrgName);
        payload = {
            address: {
                country : payloadData.address.country
            }  
        };
        payloadJSON = JSON.stringify(payload);
        orgId = brandOrgId;
        endpoint = updateOrgEndpoint(orgId);
        signed_headers = getSignedRequestHeaders("PATCH", baseUrl, endpoint, payloadJSON, {});
        headers = {
            'x-ccl-param': signed_headers["headers"]["x-ccl-param"],
            'x-ccl-signature': signed_headers["headers"]["x-ccl-signature"],
            'Cookie': cookie
        };
        res = await request
            .patch(endpoint)
            .set(headers)
            .send(payload);
        expect(res.statusCode).to.be.eq(200);
        expect(res.body).to.be.jsonSchema(successUpdateOrgSchema);
        expect(res.body.data._id).to.be.eq(orgId);
        expect(res.body.data.address.country).to.be.eq(payloadData.address.country);
    });

    it('Update Org Details - Only Company Size is updated', async function(){
        const updateOrgName = faker.random.alpha(20);
        payloadData = createOrgPayload(updateOrgName);
        payload = {
            company_size: payloadData.companySize
        };
        payloadJSON = JSON.stringify(payload);
        orgId = brandOrgId;
        endpoint = updateOrgEndpoint(orgId);
        signed_headers = getSignedRequestHeaders("PATCH", baseUrl, endpoint, payloadJSON, {});
        headers = {
            'x-ccl-param': signed_headers["headers"]["x-ccl-param"],
            'x-ccl-signature': signed_headers["headers"]["x-ccl-signature"],
            'Cookie': cookie
        };
        res = await request
            .patch(endpoint)
            .set(headers)
            .send(payload);
        expect(res.statusCode).to.be.eq(200);
        expect(res.body).to.be.jsonSchema(successUpdateOrgSchema);
        expect(res.body.data._id).to.be.eq(orgId);
        expect(res.body.data.company_size).to.be.eq(payloadData.companySize);
    });

});