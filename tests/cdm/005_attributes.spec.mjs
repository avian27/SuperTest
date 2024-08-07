import supertest from "supertest";
import chai, { expect } from 'chai';
import dotenv from "dotenv";
import jsonSchema from 'chai-json-schema';
import { faker } from '@faker-js/faker';
import { getSignedRequestHeaders } from '../../helpers/cdm/signature.mjs';
import { getCookie } from "../../helpers/cdm/cookie.mjs";
import { EnvironmentConfiguration } from "../../envs.config.mjs";
import { creatAttribute, getAllAttributes, getSpecificAttributes, update_delete_SpecificAttributes } from "../../configs/constants/cdm/constants.mjs";
import { fetchBrandOrgId } from "../../helpers/cdm/organisation_payload.mjs";
import * as attributePayloads from "../../helpers/cdm/attributes_dataHelper.mjs";
import * as schemas from "../../configs/jsonschema/cdm/attributes_json_schema.mjs";
import * as FO from "../../helpers/cdm/readWrite_data_json.mjs";

chai.use(jsonSchema);
dotenv.config();
let cookie = await getCookie(process.env.TEST_UNAME, process.env.TEST_PASS);
const attributeDetailsFile = 'attributesDetails.json';
const baseUrl = EnvironmentConfiguration.getURL(process.env.DOMAIN);
const request = supertest(`https://${baseUrl}`);
let orgId, payload, payloadJSON, payloadData, signed_headers, headers, res, totalAttributesCount, totalActiveAttributesCount, totalInActiveAttributesCount;
let endpoint = "";
let attributeNameCode = "";
let tempVarId = "";
let attId = "";

function compareArrayData(tempArr1, tempArr2) {
    let result = true;
    for (let i = 0; i < tempArr1.length; i++) {
        if (tempArr1[i] != tempArr2[i]) {
            result = false;
            break;
        }
    }
    return result;
}

describe('Attributes Api test cases @cdm @attributes', async function () {
    before(async function () {
        orgId = await fetchBrandOrgId(baseUrl, cookie);
        FO.appendToFile(attributeDetailsFile, "OrgId", orgId);
    });

    describe('Create Attributes @cdm @attributes', async function () {

        it('Create Attribute - User is not logged in', async function () {
            endpoint = creatAttribute(orgId);
            attributeNameCode = 'demo';
            payloadData = attributePayloads.createShortTextAttributePayload(attributeNameCode);
            payload = JSON.stringify({
                "active": payloadData.active,
                "name": payloadData.name,
                "code": payloadData.code,
                "description": payloadData.description,
                "tags": payloadData.tags,
                "type": payloadData.type,
                "formatting": payloadData.formatting,
                "limit": payloadData.limit,
                "vms_visible": payloadData.vms_visible,
                "vms_editable": payloadData.vms_editable,
                "store_filter": payloadData.store_filter,
                "store_display_pdp": payloadData.store_display_pdp,
                "store_search": payloadData.store_search,
                "store_compare": payloadData.store_compare
            });
            signed_headers = getSignedRequestHeaders("POST", baseUrl, endpoint, payload, {});
            headers = {
                'Content-type': 'application/json;charset=UTF-8',
                'x-ccl-param': signed_headers["headers"]["x-ccl-param"],
                'x-ccl-signature': signed_headers["headers"]["x-ccl-signature"]
            };
            res = await request
                .post(endpoint)
                .set(headers)
                .send(payload);
            expect(res.statusCode).to.be.eq(403);
            expect(res.body.error).to.be.eq('Unauthorized');
        });

        it('Create Attribute - User is logged in, Invalid OrgId is provided', async function () {
            endpoint = creatAttribute(orgId.substring(0, orgId.length - 1));
            attributeNameCode = 'demo';
            payloadData = attributePayloads.createShortTextAttributePayload(attributeNameCode);
            payload = JSON.stringify({
                "active": payloadData.active,
                "name": payloadData.name,
                "code": payloadData.code,
                "description": payloadData.description,
                "tags": payloadData.tags,
                "type": payloadData.type,
                "formatting": payloadData.formatting,
                "limit": payloadData.limit,
                "vms_visible": payloadData.vms_visible,
                "vms_editable": payloadData.vms_editable,
                "store_filter": payloadData.store_filter,
                "store_display_pdp": payloadData.store_display_pdp,
                "store_search": payloadData.store_search,
                "store_compare": payloadData.store_compare
            });
            signed_headers = getSignedRequestHeaders("POST", baseUrl, endpoint, payload, {});
            headers = {
                'Content-type': 'application/json;charset=UTF-8',
                'x-ccl-param': signed_headers["headers"]["x-ccl-param"],
                'x-ccl-signature': signed_headers["headers"]["x-ccl-signature"],
                'Cookie': cookie
            };
            res = await request
                .post(endpoint)
                .set(headers)
                .send(payload);
            expect(res.statusCode).to.be.eq(401);
            expect(res.body.error).to.be.eq('Invalid organisation');
        });

        it.only('Create Attribute - User is logged in, Short Text Attribute is created sucessfully', async function () {
            endpoint = creatAttribute(orgId);
            attributeNameCode = 'ShortTextRandom';
            payloadData = attributePayloads.createShortTextAttributePayload(attributeNameCode);
            payload = JSON.stringify({
                "active": payloadData.active,
                "name": payloadData.name,
                "code": payloadData.code,
                "description": payloadData.description,
                "tags": payloadData.tags,
                "type": payloadData.type,
                "mandatory": payloadData.mandatory,
                "auto_sync_to_prod": payloadData.auto_sync_to_prod,
                "formatting": payloadData.formatting,
                "limit": payloadData.limit,
                "vms_visible": payloadData.vms_visible,
                "vms_editable": payloadData.vms_editable,
                "store_filter": payloadData.store_filter,
                "store_display_plp": payloadData.store_display_plp,
                "store_display_pdp": payloadData.store_display_pdp,
                "store_search": payloadData.store_search,
                "store_compare": payloadData.store_compare
            });
            signed_headers = getSignedRequestHeaders("POST", baseUrl, endpoint, payload, {});
            headers = {
                'Content-type': 'application/json;charset=UTF-8',
                'x-ccl-param': signed_headers["headers"]["x-ccl-param"],
                'x-ccl-signature': signed_headers["headers"]["x-ccl-signature"],
                'Cookie': cookie
            };
            res = await request
                .post(endpoint)
                .set(headers)
                .send(payload);
            tempVarId = await res.body.attribute._id;
            FO.appendToFile(attributeDetailsFile, attributeNameCode, tempVarId);
            expect(res.statusCode).to.be.eq(201);
            expect(res.body).to.be.jsonSchema(schemas.successShortTextAttributeSchema);
            expect(res.body.attribute.formatting).to.be.eq(payloadData.formatting);
            expect(res.body.attribute.x_org_id).to.be.eq(orgId);
            expect(res.body.attribute.name).to.be.eq(payloadData.name);
            expect(res.body.attribute.code).to.be.eq(payloadData.code);
            expect(res.body.attribute.description).to.be.eq(payloadData.description);
            expect(res.body.attribute.tags.length).to.be.eq(payloadData.tags.length);
            expect(res.body.attribute.limit).to.be.eq(payloadData.limit);
            expect(res.body.attribute.vms_visible).to.be.eq(payloadData.vms_visible);
            expect(res.body.attribute.vms_editable).to.be.eq(payloadData.vms_editable);
            expect(res.body.attribute.store_filter).to.be.eq(payloadData.store_filter);
            expect(res.body.attribute.store_display_plp).to.be.eq(payloadData.store_display_plp);
            expect(res.body.attribute.store_display_pdp).to.be.eq(payloadData.store_display_pdp);
            expect(res.body.attribute.store_search).to.be.eq(payloadData.store_search);
            expect(res.body.attribute.store_compare).to.be.eq(payloadData.store_compare);
            expect(res.body.attribute.active).to.be.eq(payloadData.active);
            expect(res.body.attribute.mandatory).to.be.eq(payloadData.mandatory);
            expect(res.body.attribute.auto_sync_to_prod).to.be.eq(payloadData.auto_sync_to_prod);
            expect(compareArrayData(res.body.attribute.tags, payloadData.tags)).to.be.true;
        });

        it('Create Attribute - Short Text Attribute is created sucessfully when only Name, Code and Type values are sent', async function () {
            endpoint = creatAttribute(orgId);
            attributeNameCode = 'ShortTextDef'
            payloadData = attributePayloads.createShortTextAttributePayload(attributeNameCode);
            payload = JSON.stringify({
                "name": payloadData.name,
                "code": payloadData.code,
                "type": payloadData.type
            });
            signed_headers = getSignedRequestHeaders("POST", baseUrl, endpoint, payload, {});
            headers = {
                'Content-type': 'application/json;charset=UTF-8',
                'x-ccl-param': signed_headers["headers"]["x-ccl-param"],
                'x-ccl-signature': signed_headers["headers"]["x-ccl-signature"],
                'Cookie': cookie
            };
            res = await request
                .post(endpoint)
                .set(headers)
                .send(payload);
            tempVarId = await res.body.attribute._id;
            FO.appendToFile(attributeDetailsFile, attributeNameCode, tempVarId);
            expect(res.statusCode).to.be.eq(201);
            expect(res.body).to.be.jsonSchema(schemas.successShortTextAttributeSchema);
            expect(res.body.attribute.formatting).to.be.eq("None");
            expect(res.body.attribute.x_org_id).to.be.eq(orgId);
            expect(res.body.attribute.name).to.be.eq(payloadData.name);
            expect(res.body.attribute.code).to.be.eq(payloadData.code);
            expect(res.body.attribute.tags.length).to.be.eq(0);
            expect(res.body.attribute.vms_visible).to.be.false;
            expect(res.body.attribute.vms_editable).to.be.false;
            expect(res.body.attribute.store_filter).to.be.false;
            expect(res.body.attribute.store_display_pdp).to.be.false;
            expect(res.body.attribute.store_display_plp).to.be.false;
            expect(res.body.attribute.store_search).to.be.false;
            expect(res.body.attribute.store_compare).to.be.false;
            expect(res.body.attribute.active).to.be.true;
            expect(res.body.attribute.mandatory).to.be.true;
            expect(res.body.attribute.auto_sync_to_prod).to.be.true;
        });

        it('Create Attribute - Short Text Attribute is created sucessfully, Limit is set', async function () {
            endpoint = creatAttribute(orgId);
            attributeNameCode = 'ShortTextLim';
            payloadData = attributePayloads.createShortTextAttributePayload(attributeNameCode);
            payload = JSON.stringify({
                "name": payloadData.name,
                "code": payloadData.code,
                "type": payloadData.type,
                "limit": payloadData.limit
            });
            signed_headers = getSignedRequestHeaders("POST", baseUrl, endpoint, payload, {});
            headers = {
                'Content-type': 'application/json;charset=UTF-8',
                'x-ccl-param': signed_headers["headers"]["x-ccl-param"],
                'x-ccl-signature': signed_headers["headers"]["x-ccl-signature"],
                'Cookie': cookie
            };
            res = await request
                .post(endpoint)
                .set(headers)
                .send(payload);
            tempVarId = await res.body.attribute._id;
            FO.appendToFile(attributeDetailsFile, attributeNameCode, tempVarId);
            expect(res.statusCode).to.be.eq(201);
            expect(res.body).to.be.jsonSchema(schemas.successShortTextAttributeSchema);
            expect(res.body.attribute.x_org_id).to.be.eq(orgId);
            expect(res.body.attribute.name).to.be.eq(payloadData.name);
            expect(res.body.attribute.code).to.be.eq(payloadData.code);
            expect(res.body.attribute.limit).to.be.eq(payloadData.limit);
        });

        it('Create Attribute - Short Text Attribute is created sucessfully, Formatting is set as Uppercase', async function () {
            endpoint = creatAttribute(orgId);
            attributeNameCode = 'ShortTextUpper';
            payloadData = attributePayloads.createShortTextAttributePayload(attributeNameCode);
            payload = JSON.stringify({
                "name": payloadData.name,
                "code": payloadData.code,
                "type": payloadData.type,
                "mandatory": payloadData.mandatory,
                "auto_sync_to_prod": payloadData.auto_sync_to_prod,
                "formatting": "Uppercase"
            });
            signed_headers = getSignedRequestHeaders("POST", baseUrl, endpoint, payload, {});
            headers = {
                'Content-type': 'application/json;charset=UTF-8',
                'x-ccl-param': signed_headers["headers"]["x-ccl-param"],
                'x-ccl-signature': signed_headers["headers"]["x-ccl-signature"],
                'Cookie': cookie
            };
            res = await request
                .post(endpoint)
                .set(headers)
                .send(payload);
            tempVarId = await res.body.attribute._id;
            FO.appendToFile(attributeDetailsFile, attributeNameCode, tempVarId);
            expect(res.statusCode).to.be.eq(201);
            expect(res.body).to.be.jsonSchema(schemas.successShortTextAttributeSchema);
            expect(res.body.attribute.x_org_id).to.be.eq(orgId);
            expect(res.body.attribute.name).to.be.eq(payloadData.name);
            expect(res.body.attribute.code).to.be.eq(payloadData.code);
            expect(res.body.attribute.formatting).to.be.eq("Uppercase");
        });

        it('Create Attribute - Short Text Attribute is created sucessfully, Formatting is set as Lowercase', async function () {
            endpoint = creatAttribute(orgId);
            attributeNameCode = 'ShortTextLower';
            payloadData = attributePayloads.createShortTextAttributePayload(attributeNameCode);
            payload = JSON.stringify({
                "name": payloadData.name,
                "code": payloadData.code,
                "type": payloadData.type,
                "mandatory": payloadData.mandatory,
                "auto_sync_to_prod": payloadData.auto_sync_to_prod,
                "formatting": "Lowercase"
            });
            signed_headers = getSignedRequestHeaders("POST", baseUrl, endpoint, payload, {});
            headers = {
                'Content-type': 'application/json;charset=UTF-8',
                'x-ccl-param': signed_headers["headers"]["x-ccl-param"],
                'x-ccl-signature': signed_headers["headers"]["x-ccl-signature"],
                'Cookie': cookie
            };
            res = await request
                .post(endpoint)
                .set(headers)
                .send(payload);
            tempVarId = await res.body.attribute._id;
            FO.appendToFile(attributeDetailsFile, attributeNameCode, tempVarId);
            expect(res.statusCode).to.be.eq(201);
            expect(res.body).to.be.jsonSchema(schemas.successShortTextAttributeSchema);
            expect(res.body.attribute.x_org_id).to.be.eq(orgId);
            expect(res.body.attribute.name).to.be.eq(payloadData.name);
            expect(res.body.attribute.code).to.be.eq(payloadData.code);
            expect(res.body.attribute.formatting).to.be.eq("Lowercase");
        });

        it('Create Attribute - Short Text Attribute is created sucessfully, Formatting is set as None', async function () {
            endpoint = creatAttribute(orgId);
            attributeNameCode = 'ShortTextNone';
            payloadData = attributePayloads.createShortTextAttributePayload(attributeNameCode);
            payload = JSON.stringify({
                "name": payloadData.name,
                "code": payloadData.code,
                "type": payloadData.type,
                "mandatory": payloadData.mandatory,
                "auto_sync_to_prod": payloadData.auto_sync_to_prod,
                "formatting": "None"
            });
            signed_headers = getSignedRequestHeaders("POST", baseUrl, endpoint, payload, {});
            headers = {
                'Content-type': 'application/json;charset=UTF-8',
                'x-ccl-param': signed_headers["headers"]["x-ccl-param"],
                'x-ccl-signature': signed_headers["headers"]["x-ccl-signature"],
                'Cookie': cookie
            };
            res = await request
                .post(endpoint)
                .set(headers)
                .send(payload);
            tempVarId = await res.body.attribute._id;
            FO.appendToFile(attributeDetailsFile, attributeNameCode, tempVarId);
            expect(res.statusCode).to.be.eq(201);
            expect(res.body).to.be.jsonSchema(schemas.successShortTextAttributeSchema);
            expect(res.body.attribute.x_org_id).to.be.eq(orgId);
            expect(res.body.attribute.name).to.be.eq(payloadData.name);
            expect(res.body.attribute.code).to.be.eq(payloadData.code);
            expect(res.body.attribute.formatting).to.be.eq("None");
        });

        it('Create Attribute - Short Text Attribute is created sucessfully, vms_visible is set to true', async function () {
            endpoint = creatAttribute(orgId);
            attributeNameCode = 'ShortTextVMS_VisibleTrue'
            payloadData = attributePayloads.createShortTextAttributePayload(attributeNameCode);
            payload = JSON.stringify({
                "name": payloadData.name,
                "code": payloadData.code,
                "type": payloadData.type,
                "mandatory": payloadData.mandatory,
                "auto_sync_to_prod": payloadData.auto_sync_to_prod,
                "vms_visible": true
            });
            signed_headers = getSignedRequestHeaders("POST", baseUrl, endpoint, payload, {});
            headers = {
                'Content-type': 'application/json;charset=UTF-8',
                'x-ccl-param': signed_headers["headers"]["x-ccl-param"],
                'x-ccl-signature': signed_headers["headers"]["x-ccl-signature"],
                'Cookie': cookie
            };
            res = await request
                .post(endpoint)
                .set(headers)
                .send(payload);
            tempVarId = await res.body.attribute._id;
            FO.appendToFile(attributeDetailsFile, attributeNameCode, tempVarId);
            expect(res.statusCode).to.be.eq(201);
            expect(res.body).to.be.jsonSchema(schemas.successShortTextAttributeSchema);
            expect(res.body.attribute.x_org_id).to.be.eq(orgId);
            expect(res.body.attribute.name).to.be.eq(payloadData.name);
            expect(res.body.attribute.code).to.be.eq(payloadData.code);
            expect(res.body.attribute.vms_visible).to.be.true;
        });

        it('Create Attribute - Short Text Attribute is created sucessfully, vms_visible is set to false', async function () {
            endpoint = creatAttribute(orgId);
            attributeNameCode = 'ShortTextVMS_VisibleFalse';
            payloadData = attributePayloads.createShortTextAttributePayload(attributeNameCode);
            payload = JSON.stringify({
                "name": payloadData.name,
                "code": payloadData.code,
                "type": payloadData.type,
                "mandatory": payloadData.mandatory,
                "auto_sync_to_prod": payloadData.auto_sync_to_prod,
                "vms_visible": false
            });
            signed_headers = getSignedRequestHeaders("POST", baseUrl, endpoint, payload, {});
            headers = {
                'Content-type': 'application/json;charset=UTF-8',
                'x-ccl-param': signed_headers["headers"]["x-ccl-param"],
                'x-ccl-signature': signed_headers["headers"]["x-ccl-signature"],
                'Cookie': cookie
            };
            res = await request
                .post(endpoint)
                .set(headers)
                .send(payload);
            tempVarId = await res.body.attribute._id;
            FO.appendToFile(attributeDetailsFile, attributeNameCode, tempVarId);
            expect(res.statusCode).to.be.eq(201);
            expect(res.body).to.be.jsonSchema(schemas.successShortTextAttributeSchema);
            expect(res.body.attribute.x_org_id).to.be.eq(orgId);
            expect(res.body.attribute.name).to.be.eq(payloadData.name);
            expect(res.body.attribute.code).to.be.eq(payloadData.code);
            expect(res.body.attribute.vms_visible).to.be.false;
        });

        it('Create Attribute - Short Text Attribute is created sucessfully, vms_editable is set to true', async function () {
            endpoint = creatAttribute(orgId);
            attributeNameCode = 'ShortTextVMS_EditableTrue';
            payloadData = attributePayloads.createShortTextAttributePayload(attributeNameCode);
            payload = JSON.stringify({
                "name": payloadData.name,
                "code": payloadData.code,
                "type": payloadData.type,
                "mandatory": payloadData.mandatory,
                "auto_sync_to_prod": payloadData.auto_sync_to_prod,
                "vms_editable": true
            });
            signed_headers = getSignedRequestHeaders("POST", baseUrl, endpoint, payload, {});
            headers = {
                'Content-type': 'application/json;charset=UTF-8',
                'x-ccl-param': signed_headers["headers"]["x-ccl-param"],
                'x-ccl-signature': signed_headers["headers"]["x-ccl-signature"],
                'Cookie': cookie
            };
            res = await request
                .post(endpoint)
                .set(headers)
                .send(payload);
            tempVarId = await res.body.attribute._id;
            FO.appendToFile(attributeDetailsFile, attributeNameCode, tempVarId);
            expect(res.statusCode).to.be.eq(201);
            expect(res.body).to.be.jsonSchema(schemas.successShortTextAttributeSchema);
            expect(res.body.attribute.x_org_id).to.be.eq(orgId);
            expect(res.body.attribute.name).to.be.eq(payloadData.name);
            expect(res.body.attribute.code).to.be.eq(payloadData.code);
            expect(res.body.attribute.vms_editable).to.be.true;
        });

        it('Create Attribute - Short Text Attribute is created sucessfully, vms_editable is set to false', async function () {
            endpoint = creatAttribute(orgId);
            attributeNameCode = 'ShortTextVMS_EditableFalse';
            payloadData = attributePayloads.createShortTextAttributePayload(attributeNameCode);
            payload = JSON.stringify({
                "name": payloadData.name,
                "code": payloadData.code,
                "type": payloadData.type,
                "mandatory": payloadData.mandatory,
                "auto_sync_to_prod": payloadData.auto_sync_to_prod,
                "vms_editable": false
            });
            signed_headers = getSignedRequestHeaders("POST", baseUrl, endpoint, payload, {});
            headers = {
                'Content-type': 'application/json;charset=UTF-8',
                'x-ccl-param': signed_headers["headers"]["x-ccl-param"],
                'x-ccl-signature': signed_headers["headers"]["x-ccl-signature"],
                'Cookie': cookie
            };
            res = await request
                .post(endpoint)
                .set(headers)
                .send(payload);
            tempVarId = await res.body.attribute._id;
            FO.appendToFile(attributeDetailsFile, attributeNameCode, tempVarId);
            expect(res.statusCode).to.be.eq(201);
            expect(res.body).to.be.jsonSchema(schemas.successShortTextAttributeSchema);
            expect(res.body.attribute.x_org_id).to.be.eq(orgId);
            expect(res.body.attribute.name).to.be.eq(payloadData.name);
            expect(res.body.attribute.code).to.be.eq(payloadData.code);
            expect(res.body.attribute.vms_editable).to.be.false;
        });

        it('Create Attribute - Short Text Attribute is created sucessfully, store_filter is set to true', async function () {
            endpoint = creatAttribute(orgId);
            attributeNameCode = 'ShortTextSFTrue';
            payloadData = attributePayloads.createShortTextAttributePayload(attributeNameCode);
            payload = JSON.stringify({
                "name": payloadData.name,
                "code": payloadData.code,
                "type": payloadData.type,
                "mandatory": payloadData.mandatory,
                "auto_sync_to_prod": payloadData.auto_sync_to_prod,
                "store_filter": true
            });
            signed_headers = getSignedRequestHeaders("POST", baseUrl, endpoint, payload, {});
            headers = {
                'Content-type': 'application/json;charset=UTF-8',
                'x-ccl-param': signed_headers["headers"]["x-ccl-param"],
                'x-ccl-signature': signed_headers["headers"]["x-ccl-signature"],
                'Cookie': cookie
            };
            res = await request
                .post(endpoint)
                .set(headers)
                .send(payload);
            tempVarId = await res.body.attribute._id;
            FO.appendToFile(attributeDetailsFile, attributeNameCode, tempVarId);
            expect(res.statusCode).to.be.eq(201);
            expect(res.body).to.be.jsonSchema(schemas.successShortTextAttributeSchema);
            expect(res.body.attribute.x_org_id).to.be.eq(orgId);
            expect(res.body.attribute.name).to.be.eq(payloadData.name);
            expect(res.body.attribute.code).to.be.eq(payloadData.code);
            expect(res.body.attribute.store_filter).to.be.true;
        });

        it('Create Attribute - Short Text Attribute is created sucessfully, store_filter is set to false', async function () {
            endpoint = creatAttribute(orgId);
            attributeNameCode = 'ShortTextSFFalse';
            payloadData = attributePayloads.createShortTextAttributePayload(attributeNameCode);
            payload = JSON.stringify({
                "name": payloadData.name,
                "code": payloadData.code,
                "type": payloadData.type,
                "mandatory": payloadData.mandatory,
                "auto_sync_to_prod": payloadData.auto_sync_to_prod,
                "store_filter": false
            });
            signed_headers = getSignedRequestHeaders("POST", baseUrl, endpoint, payload, {});
            headers = {
                'Content-type': 'application/json;charset=UTF-8',
                'x-ccl-param': signed_headers["headers"]["x-ccl-param"],
                'x-ccl-signature': signed_headers["headers"]["x-ccl-signature"],
                'Cookie': cookie
            };
            res = await request
                .post(endpoint)
                .set(headers)
                .send(payload);
            tempVarId = await res.body.attribute._id;
            FO.appendToFile(attributeDetailsFile, attributeNameCode, tempVarId);
            expect(res.statusCode).to.be.eq(201);
            expect(res.body).to.be.jsonSchema(schemas.successShortTextAttributeSchema);
            expect(res.body.attribute.x_org_id).to.be.eq(orgId);
            expect(res.body.attribute.name).to.be.eq(payloadData.name);
            expect(res.body.attribute.code).to.be.eq(payloadData.code);
            expect(res.body.attribute.store_filter).to.be.false;
        });

        it('Create Attribute - Short Text Attribute is created sucessfully, store_display_pdp is set to true', async function () {
            endpoint = creatAttribute(orgId);
            attributeNameCode = 'ShortTextPDPTrue';
            payloadData = attributePayloads.createShortTextAttributePayload(attributeNameCode);
            payload = JSON.stringify({
                "name": payloadData.name,
                "code": payloadData.code,
                "type": payloadData.type,
                "mandatory": payloadData.mandatory,
                "auto_sync_to_prod": payloadData.auto_sync_to_prod,
                "store_display_pdp": true
            });
            signed_headers = getSignedRequestHeaders("POST", baseUrl, endpoint, payload, {});
            headers = {
                'Content-type': 'application/json;charset=UTF-8',
                'x-ccl-param': signed_headers["headers"]["x-ccl-param"],
                'x-ccl-signature': signed_headers["headers"]["x-ccl-signature"],
                'Cookie': cookie
            };
            res = await request
                .post(endpoint)
                .set(headers)
                .send(payload);
            tempVarId = await res.body.attribute._id;
            FO.appendToFile(attributeDetailsFile, attributeNameCode, tempVarId);
            expect(res.statusCode).to.be.eq(201);
            expect(res.body).to.be.jsonSchema(schemas.successShortTextAttributeSchema);
            expect(res.body.attribute.x_org_id).to.be.eq(orgId);
            expect(res.body.attribute.name).to.be.eq(payloadData.name);
            expect(res.body.attribute.code).to.be.eq(payloadData.code);
            expect(res.body.attribute.store_display_pdp).to.be.true;
            expect(res.body.attribute.store_display_plp).to.be.false;
        });

        it('Create Attribute - Short Text Attribute is created sucessfully, store_display_plp is set to true', async function () {
            endpoint = creatAttribute(orgId);
            attributeNameCode = 'ShortTextPLPTrue';
            payloadData = attributePayloads.createShortTextAttributePayload(attributeNameCode);
            payload = JSON.stringify({
                "name": payloadData.name,
                "code": payloadData.code,
                "type": payloadData.type,
                "mandatory": payloadData.mandatory,
                "auto_sync_to_prod": payloadData.auto_sync_to_prod,
                "store_display_plp": true
            });
            signed_headers = getSignedRequestHeaders("POST", baseUrl, endpoint, payload, {});
            headers = {
                'Content-type': 'application/json;charset=UTF-8',
                'x-ccl-param': signed_headers["headers"]["x-ccl-param"],
                'x-ccl-signature': signed_headers["headers"]["x-ccl-signature"],
                'Cookie': cookie
            };
            res = await request
                .post(endpoint)
                .set(headers)
                .send(payload);
            tempVarId = await res.body.attribute._id;
            FO.appendToFile(attributeDetailsFile, attributeNameCode, tempVarId);
            expect(res.statusCode).to.be.eq(201);
            expect(res.body).to.be.jsonSchema(schemas.successShortTextAttributeSchema);
            expect(res.body.attribute.x_org_id).to.be.eq(orgId);
            expect(res.body.attribute.name).to.be.eq(payloadData.name);
            expect(res.body.attribute.code).to.be.eq(payloadData.code);
            expect(res.body.attribute.store_display_plp).to.be.true;
            expect(res.body.attribute.store_display_pdp).to.be.false;
        });

        it('Create Attribute - Short Text Attribute is created sucessfully, store_display_pdp is set to false', async function () {
            endpoint = creatAttribute(orgId);
            attributeNameCode = 'ShortTextPDPFalse';
            payloadData = attributePayloads.createShortTextAttributePayload(attributeNameCode);
            payload = JSON.stringify({
                "name": payloadData.name,
                "code": payloadData.code,
                "type": payloadData.type,
                "mandatory": payloadData.mandatory,
                "auto_sync_to_prod": payloadData.auto_sync_to_prod,
                "store_display_pdp": false
            });
            signed_headers = getSignedRequestHeaders("POST", baseUrl, endpoint, payload, {});
            headers = {
                'Content-type': 'application/json;charset=UTF-8',
                'x-ccl-param': signed_headers["headers"]["x-ccl-param"],
                'x-ccl-signature': signed_headers["headers"]["x-ccl-signature"],
                'Cookie': cookie
            };
            res = await request
                .post(endpoint)
                .set(headers)
                .send(payload);
            tempVarId = await res.body.attribute._id;
            FO.appendToFile(attributeDetailsFile, attributeNameCode, tempVarId);
            expect(res.statusCode).to.be.eq(201);
            expect(res.body).to.be.jsonSchema(schemas.successShortTextAttributeSchema);
            expect(res.body.attribute.x_org_id).to.be.eq(orgId);
            expect(res.body.attribute.name).to.be.eq(payloadData.name);
            expect(res.body.attribute.code).to.be.eq(payloadData.code);
            expect(res.body.attribute.store_display_plp).to.be.false;
            expect(res.body.attribute.store_display_pdp).to.be.false;
        });

        it('Create Attribute - Short Text Attribute is created sucessfully, store_display_plp is set to false', async function () {
            endpoint = creatAttribute(orgId);
            attributeNameCode = 'ShortTextPLPFalse';
            payloadData = attributePayloads.createShortTextAttributePayload(attributeNameCode);
            payload = JSON.stringify({
                "name": payloadData.name,
                "code": payloadData.code,
                "type": payloadData.type,
                "mandatory": payloadData.mandatory,
                "auto_sync_to_prod": payloadData.auto_sync_to_prod,
                "store_display_plp": false
            });
            signed_headers = getSignedRequestHeaders("POST", baseUrl, endpoint, payload, {});
            headers = {
                'Content-type': 'application/json;charset=UTF-8',
                'x-ccl-param': signed_headers["headers"]["x-ccl-param"],
                'x-ccl-signature': signed_headers["headers"]["x-ccl-signature"],
                'Cookie': cookie
            };
            res = await request
                .post(endpoint)
                .set(headers)
                .send(payload);
            tempVarId = await res.body.attribute._id;
            FO.appendToFile(attributeDetailsFile, attributeNameCode, tempVarId);
            expect(res.statusCode).to.be.eq(201);
            expect(res.body).to.be.jsonSchema(schemas.successShortTextAttributeSchema);
            expect(res.body.attribute.x_org_id).to.be.eq(orgId);
            expect(res.body.attribute.name).to.be.eq(payloadData.name);
            expect(res.body.attribute.code).to.be.eq(payloadData.code);
            expect(res.body.attribute.store_display_pdp).to.be.false;
            expect(res.body.attribute.store_display_plp).to.be.false;
        });

        it('Create Attribute - Short Text Attribute is created sucessfully, store_search is set to true', async function () {
            endpoint = creatAttribute(orgId);
            attributeNameCode = 'ShortTextSSTrue';
            payloadData = attributePayloads.createShortTextAttributePayload(attributeNameCode);
            payload = JSON.stringify({
                "name": payloadData.name,
                "code": payloadData.code,
                "type": payloadData.type,
                "mandatory": payloadData.mandatory,
                "auto_sync_to_prod": payloadData.auto_sync_to_prod,
                "store_search": true
            });
            signed_headers = getSignedRequestHeaders("POST", baseUrl, endpoint, payload, {});
            headers = {
                'Content-type': 'application/json;charset=UTF-8',
                'x-ccl-param': signed_headers["headers"]["x-ccl-param"],
                'x-ccl-signature': signed_headers["headers"]["x-ccl-signature"],
                'Cookie': cookie
            };
            res = await request
                .post(endpoint)
                .set(headers)
                .send(payload);
            tempVarId = await res.body.attribute._id;
            FO.appendToFile(attributeDetailsFile, attributeNameCode, tempVarId);
            expect(res.statusCode).to.be.eq(201);
            expect(res.body).to.be.jsonSchema(schemas.successShortTextAttributeSchema);
            expect(res.body.attribute.x_org_id).to.be.eq(orgId);
            expect(res.body.attribute.name).to.be.eq(payloadData.name);
            expect(res.body.attribute.code).to.be.eq(payloadData.code);
            expect(res.body.attribute.store_search).to.be.true;
        });

        it('Create Attribute - Short Text Attribute is created sucessfully, store_search is set to false', async function () {
            endpoint = creatAttribute(orgId);
            attributeNameCode = 'ShortTextSSFalse';
            payloadData = attributePayloads.createShortTextAttributePayload(attributeNameCode);
            payload = JSON.stringify({
                "name": payloadData.name,
                "code": payloadData.code,
                "type": payloadData.type,
                "mandatory": payloadData.mandatory,
                "auto_sync_to_prod": payloadData.auto_sync_to_prod,
                "store_search": false
            });
            signed_headers = getSignedRequestHeaders("POST", baseUrl, endpoint, payload, {});
            headers = {
                'Content-type': 'application/json;charset=UTF-8',
                'x-ccl-param': signed_headers["headers"]["x-ccl-param"],
                'x-ccl-signature': signed_headers["headers"]["x-ccl-signature"],
                'Cookie': cookie
            };
            res = await request
                .post(endpoint)
                .set(headers)
                .send(payload);
            tempVarId = await res.body.attribute._id;
            FO.appendToFile(attributeDetailsFile, attributeNameCode, tempVarId);
            expect(res.statusCode).to.be.eq(201);
            expect(res.body).to.be.jsonSchema(schemas.successShortTextAttributeSchema);
            expect(res.body.attribute.x_org_id).to.be.eq(orgId);
            expect(res.body.attribute.name).to.be.eq(payloadData.name);
            expect(res.body.attribute.code).to.be.eq(payloadData.code);
            expect(res.body.attribute.store_search).to.be.false;
        });

        it('Create Attribute - Short Text Attribute is created sucessfully, store_compare is set to true', async function () {
            endpoint = creatAttribute(orgId);
            attributeNameCode = 'ShortTextSCTrue'
            payloadData = attributePayloads.createShortTextAttributePayload(attributeNameCode);
            payload = JSON.stringify({
                "name": payloadData.name,
                "code": payloadData.code,
                "type": payloadData.type,
                "mandatory": payloadData.mandatory,
                "auto_sync_to_prod": payloadData.auto_sync_to_prod,
                "store_compare": true
            });
            signed_headers = getSignedRequestHeaders("POST", baseUrl, endpoint, payload, {});
            headers = {
                'Content-type': 'application/json;charset=UTF-8',
                'x-ccl-param': signed_headers["headers"]["x-ccl-param"],
                'x-ccl-signature': signed_headers["headers"]["x-ccl-signature"],
                'Cookie': cookie
            };
            res = await request
                .post(endpoint)
                .set(headers)
                .send(payload);
            tempVarId = await res.body.attribute._id;
            FO.appendToFile(attributeDetailsFile, attributeNameCode, tempVarId);
            expect(res.statusCode).to.be.eq(201);
            expect(res.body).to.be.jsonSchema(schemas.successShortTextAttributeSchema);
            expect(res.body.attribute.x_org_id).to.be.eq(orgId);
            expect(res.body.attribute.name).to.be.eq(payloadData.name);
            expect(res.body.attribute.code).to.be.eq(payloadData.code);
            expect(res.body.attribute.store_compare).to.be.true;
        });

        it('Create Attribute - Short Text Attribute is created sucessfully, store_compare is set to false', async function () {
            endpoint = creatAttribute(orgId);
            attributeNameCode = 'ShortTextSCFalse'
            payloadData = attributePayloads.createShortTextAttributePayload(attributeNameCode);
            payload = JSON.stringify({
                "name": payloadData.name,
                "code": payloadData.code,
                "type": payloadData.type,
                "mandatory": payloadData.mandatory,
                "auto_sync_to_prod": payloadData.auto_sync_to_prod,
                "store_compare": false
            });
            signed_headers = getSignedRequestHeaders("POST", baseUrl, endpoint, payload, {});
            headers = {
                'Content-type': 'application/json;charset=UTF-8',
                'x-ccl-param': signed_headers["headers"]["x-ccl-param"],
                'x-ccl-signature': signed_headers["headers"]["x-ccl-signature"],
                'Cookie': cookie
            };
            res = await request
                .post(endpoint)
                .set(headers)
                .send(payload);
            tempVarId = await res.body.attribute._id;
            FO.appendToFile(attributeDetailsFile, attributeNameCode, tempVarId);
            expect(res.statusCode).to.be.eq(201);
            expect(res.body).to.be.jsonSchema(schemas.successShortTextAttributeSchema);
            expect(res.body.attribute.x_org_id).to.be.eq(orgId);
            expect(res.body.attribute.name).to.be.eq(payloadData.name);
            expect(res.body.attribute.code).to.be.eq(payloadData.code);
            expect(res.body.attribute.store_compare).to.be.false;
        });

        it('Create Attribute - Short Text Attribute is created sucessfully, active is set to true', async function () {
            endpoint = creatAttribute(orgId);
            attributeNameCode = 'ShortTextActiveTrue';
            payloadData = attributePayloads.createShortTextAttributePayload(attributeNameCode);
            payload = JSON.stringify({
                "name": payloadData.name,
                "code": payloadData.code,
                "type": payloadData.type,
                "mandatory": payloadData.mandatory,
                "auto_sync_to_prod": payloadData.auto_sync_to_prod,
                "active": true
            });
            signed_headers = getSignedRequestHeaders("POST", baseUrl, endpoint, payload, {});
            headers = {
                'Content-type': 'application/json;charset=UTF-8',
                'x-ccl-param': signed_headers["headers"]["x-ccl-param"],
                'x-ccl-signature': signed_headers["headers"]["x-ccl-signature"],
                'Cookie': cookie
            };
            res = await request
                .post(endpoint)
                .set(headers)
                .send(payload);
            tempVarId = await res.body.attribute._id;
            FO.appendToFile(attributeDetailsFile, attributeNameCode, tempVarId);
            expect(res.statusCode).to.be.eq(201);
            expect(res.body).to.be.jsonSchema(schemas.successShortTextAttributeSchema);
            expect(res.body.attribute.x_org_id).to.be.eq(orgId);
            expect(res.body.attribute.name).to.be.eq(payloadData.name);
            expect(res.body.attribute.code).to.be.eq(payloadData.code);
            expect(res.body.attribute.active).to.be.true;
        });

        it('Create Attribute - Short Text Attribute is created sucessfully, active is set to false', async function () {
            endpoint = creatAttribute(orgId);
            attributeNameCode = 'ShortTextActiveFalse';
            payloadData = attributePayloads.createShortTextAttributePayload(attributeNameCode);
            payload = JSON.stringify({
                "name": payloadData.name,
                "code": payloadData.code,
                "type": payloadData.type,
                "mandatory": payloadData.mandatory,
                "auto_sync_to_prod": payloadData.auto_sync_to_prod,
                "active": false
            });
            signed_headers = getSignedRequestHeaders("POST", baseUrl, endpoint, payload, {});
            headers = {
                'Content-type': 'application/json;charset=UTF-8',
                'x-ccl-param': signed_headers["headers"]["x-ccl-param"],
                'x-ccl-signature': signed_headers["headers"]["x-ccl-signature"],
                'Cookie': cookie
            };
            res = await request
                .post(endpoint)
                .set(headers)
                .send(payload);
            tempVarId = await res.body.attribute._id;
            FO.appendToFile(attributeDetailsFile, attributeNameCode, tempVarId);
            expect(res.statusCode).to.be.eq(201);
            expect(res.body).to.be.jsonSchema(schemas.successShortTextAttributeSchema);
            expect(res.body.attribute.x_org_id).to.be.eq(orgId);
            expect(res.body.attribute.name).to.be.eq(payloadData.name);
            expect(res.body.attribute.code).to.be.eq(payloadData.code);
            expect(res.body.attribute.active).to.be.false;
        });

        it('Create Attribute - Short Text Attribute is created sucessfully, auto_sync_to_prod is set to true', async function () {
            endpoint = creatAttribute(orgId);
            attributeNameCode = 'ShortTextASPTrue';
            payloadData = attributePayloads.createShortTextAttributePayload(attributeNameCode);
            payload = JSON.stringify({
                "name": payloadData.name,
                "code": payloadData.code,
                "type": payloadData.type,
                "mandatory": payloadData.mandatory,
                "auto_sync_to_prod": true
            });
            signed_headers = getSignedRequestHeaders("POST", baseUrl, endpoint, payload, {});
            headers = {
                'Content-type': 'application/json;charset=UTF-8',
                'x-ccl-param': signed_headers["headers"]["x-ccl-param"],
                'x-ccl-signature': signed_headers["headers"]["x-ccl-signature"],
                'Cookie': cookie
            };
            res = await request
                .post(endpoint)
                .set(headers)
                .send(payload);
            tempVarId = await res.body.attribute._id;
            FO.appendToFile(attributeDetailsFile, attributeNameCode, tempVarId);
            expect(res.statusCode).to.be.eq(201);
            expect(res.body).to.be.jsonSchema(schemas.successShortTextAttributeSchema);
            expect(res.body.attribute.x_org_id).to.be.eq(orgId);
            expect(res.body.attribute.name).to.be.eq(payloadData.name);
            expect(res.body.attribute.code).to.be.eq(payloadData.code);
            expect(res.body.attribute.auto_sync_to_prod).to.be.true;
        });

        it('Create Attribute - Short Text Attribute is created sucessfully, auto_sync_to_prod is set to false', async function () {
            endpoint = creatAttribute(orgId);
            attributeNameCode = 'ShortTextASPFalse';
            payloadData = attributePayloads.createShortTextAttributePayload(attributeNameCode);
            payload = JSON.stringify({
                "name": payloadData.name,
                "code": payloadData.code,
                "type": payloadData.type,
                "mandatory": payloadData.mandatory,
                "auto_sync_to_prod": false
            });
            signed_headers = getSignedRequestHeaders("POST", baseUrl, endpoint, payload, {});
            headers = {
                'Content-type': 'application/json;charset=UTF-8',
                'x-ccl-param': signed_headers["headers"]["x-ccl-param"],
                'x-ccl-signature': signed_headers["headers"]["x-ccl-signature"],
                'Cookie': cookie
            };
            res = await request
                .post(endpoint)
                .set(headers)
                .send(payload);
            tempVarId = await res.body.attribute._id;
            FO.appendToFile(attributeDetailsFile, attributeNameCode, tempVarId);
            expect(res.statusCode).to.be.eq(201);
            expect(res.body).to.be.jsonSchema(schemas.successShortTextAttributeSchema);
            expect(res.body.attribute.x_org_id).to.be.eq(orgId);
            expect(res.body.attribute.name).to.be.eq(payloadData.name);
            expect(res.body.attribute.code).to.be.eq(payloadData.code);
            expect(res.body.attribute.auto_sync_to_prod).to.be.false;
        });

        it('Create Attribute - Short Text Attribute is created sucessfully, mandatory is set to true', async function () {
            endpoint = creatAttribute(orgId);
            attributeNameCode = 'ShortTextMandTrue';
            payloadData = attributePayloads.createShortTextAttributePayload(attributeNameCode);
            payload = JSON.stringify({
                "name": payloadData.name,
                "code": payloadData.code,
                "type": payloadData.type,
                "mandatory": true
            });
            signed_headers = getSignedRequestHeaders("POST", baseUrl, endpoint, payload, {});
            headers = {
                'Content-type': 'application/json;charset=UTF-8',
                'x-ccl-param': signed_headers["headers"]["x-ccl-param"],
                'x-ccl-signature': signed_headers["headers"]["x-ccl-signature"],
                'Cookie': cookie
            };
            res = await request
                .post(endpoint)
                .set(headers)
                .send(payload);
            tempVarId = await res.body.attribute._id;
            FO.appendToFile(attributeDetailsFile, attributeNameCode, tempVarId);
            expect(res.statusCode).to.be.eq(201);
            expect(res.body).to.be.jsonSchema(schemas.successShortTextAttributeSchema);
            expect(res.body.attribute.x_org_id).to.be.eq(orgId);
            expect(res.body.attribute.name).to.be.eq(payloadData.name);
            expect(res.body.attribute.code).to.be.eq(payloadData.code);
            expect(res.body.attribute.mandatory).to.be.true;
        });

        it('Create Attribute - Short Text Attribute is created sucessfully, mandatory is set to false', async function () {
            endpoint = creatAttribute(orgId);
            attributeNameCode = 'ShortTextMandFalse';
            payloadData = attributePayloads.createShortTextAttributePayload(attributeNameCode);
            payload = JSON.stringify({
                "name": payloadData.name,
                "code": payloadData.code,
                "type": payloadData.type,
                "mandatory": false
            });
            signed_headers = getSignedRequestHeaders("POST", baseUrl, endpoint, payload, {});
            headers = {
                'Content-type': 'application/json;charset=UTF-8',
                'x-ccl-param': signed_headers["headers"]["x-ccl-param"],
                'x-ccl-signature': signed_headers["headers"]["x-ccl-signature"],
                'Cookie': cookie
            };
            res = await request
                .post(endpoint)
                .set(headers)
                .send(payload);
            tempVarId = await res.body.attribute._id;
            FO.appendToFile(attributeDetailsFile, attributeNameCode, tempVarId);
            expect(res.statusCode).to.be.eq(201);
            expect(res.body).to.be.jsonSchema(schemas.successShortTextAttributeSchema);
            expect(res.body.attribute.x_org_id).to.be.eq(orgId);
            expect(res.body.attribute.name).to.be.eq(payloadData.name);
            expect(res.body.attribute.code).to.be.eq(payloadData.code);
            expect(res.body.attribute.mandatory).to.be.false;
        });

        it('Create Attribute - Create Attribute call fails, invalid value is sent in Formatting for ShortText type', async function () {
            endpoint = creatAttribute(orgId);
            attributeNameCode = 'ShortTextInvalid';
            payloadData = attributePayloads.createShortTextAttributePayload(attributeNameCode);
            payload = JSON.stringify({
                "name": payloadData.name,
                "code": payloadData.code,
                "type": payloadData.type,
                "mandatory": payloadData.mandatory,
                "auto_sync_to_prod": payloadData.auto_sync_to_prod,
                "formatting": faker.random.alphaNumeric(10)
            });
            signed_headers = getSignedRequestHeaders("POST", baseUrl, endpoint, payload, {});
            headers = {
                'Content-type': 'application/json;charset=UTF-8',
                'x-ccl-param': signed_headers["headers"]["x-ccl-param"],
                'x-ccl-signature': signed_headers["headers"]["x-ccl-signature"],
                'Cookie': cookie
            };
            res = await request
                .post(endpoint)
                .set(headers)
                .send(payload);
            expect(res.statusCode).to.be.eq(400);
            expect(res.body.error).to.contain('ValidationError: formatting:');
        });

        it('Create Attribute - Create Attribute call fails, invalid value is sent in type for ShortText type', async function () {
            endpoint = creatAttribute(orgId);
            attributeNameCode = 'invalid';
            payloadData = attributePayloads.createShortTextAttributePayload(attributeNameCode);
            payload = JSON.stringify({
                "name": payloadData.name,
                "code": payloadData.code,
                "type": faker.random.alphaNumeric(5),
                "mandatory": payloadData.mandatory,
                "auto_sync_to_prod": payloadData.auto_sync_to_prod
            });
            signed_headers = getSignedRequestHeaders("POST", baseUrl, endpoint, payload, {});
            headers = {
                'Content-type': 'application/json;charset=UTF-8',
                'x-ccl-param': signed_headers["headers"]["x-ccl-param"],
                'x-ccl-signature': signed_headers["headers"]["x-ccl-signature"],
                'Cookie': cookie
            };
            res = await request
                .post(endpoint)
                .set(headers)
                .send(payload);
            expect(res.statusCode).to.be.eq(400);
            expect(res.body.error).to.contain('ValidationError: type:');
        });

        it('Create Attribute - Create Attribute call fails, string is sent in limit for ShortText type', async function () {
            endpoint = creatAttribute(orgId);
            attributeNameCode = 'invalid';
            payloadData = attributePayloads.createShortTextAttributePayload(attributeNameCode);
            payload = JSON.stringify({
                "name": payloadData.name,
                "code": payloadData.code,
                "type": payloadData.type,
                "limit": faker.random.alpha(5),
                "mandatory": payloadData.mandatory,
                "auto_sync_to_prod": payloadData.auto_sync_to_prod
            });
            signed_headers = getSignedRequestHeaders("POST", baseUrl, endpoint, payload, {});
            headers = {
                'Content-type': 'application/json;charset=UTF-8',
                'x-ccl-param': signed_headers["headers"]["x-ccl-param"],
                'x-ccl-signature': signed_headers["headers"]["x-ccl-signature"],
                'Cookie': cookie
            };
            res = await request
                .post(endpoint)
                .set(headers)
                .send(payload);
            expect(res.statusCode).to.be.eq(400);
            expect(res.body.error).to.contain('ValidationError: limit:');
        });

        it('Create Attribute - Create Attribute call fails, decimal value is sent in limit for ShortText type', async function () {
            endpoint = creatAttribute(orgId);
            payloadData = attributePayloads.createShortTextAttributePayload(attributeNameCode);
            const temp = faker.datatype.number({ min: 0, max: 100, precision: 0.01 });
            payload = JSON.stringify({
                "name": payloadData.name,
                "code": payloadData.code,
                "type": payloadData.type,
                "limit": temp,
                "mandatory": payloadData.mandatory,
                "auto_sync_to_prod": payloadData.auto_sync_to_prod
            });
            signed_headers = getSignedRequestHeaders("POST", baseUrl, endpoint, payload, {});
            headers = {
                'Content-type': 'application/json;charset=UTF-8',
                'x-ccl-param': signed_headers["headers"]["x-ccl-param"],
                'x-ccl-signature': signed_headers["headers"]["x-ccl-signature"],
                'Cookie': cookie
            };
            res = await request
                .post(endpoint)
                .set(headers)
                .send(payload);
            expect(res.statusCode).to.be.eq(400);
            expect(res.body.error).to.contain('ValidationError: limit:');
        });

        it('Create Attribute - Create Attribute call fails, when negative value is sent in limit for ShortText type', async function () {
            endpoint = creatAttribute(orgId);
            payloadData = attributePayloads.createShortTextAttributePayload(attributeNameCode);
            const temp = faker.datatype.number({ min: -100, max: -1 });
            payload = JSON.stringify({
                "name": payloadData.name,
                "code": payloadData.code,
                "type": payloadData.type,
                "limit": temp,
                "mandatory": payloadData.mandatory,
                "auto_sync_to_prod": payloadData.auto_sync_to_prod
            });
            signed_headers = getSignedRequestHeaders("POST", baseUrl, endpoint, payload, {});
            headers = {
                'Content-type': 'application/json;charset=UTF-8',
                'x-ccl-param': signed_headers["headers"]["x-ccl-param"],
                'x-ccl-signature': signed_headers["headers"]["x-ccl-signature"],
                'Cookie': cookie
            };
            res = await request
                .post(endpoint)
                .set(headers)
                .send(payload);
            expect(res.statusCode).to.be.eq(400);
            expect(res.body.error).to.contain('ValidationError: limit:');
        });

        it('Create Attribute - Create Attribute call fails, string is sent in active', async function () {
            endpoint = creatAttribute(orgId);
            payloadData = attributePayloads.createShortTextAttributePayload(attributeNameCode);
            payload = JSON.stringify({
                "name": payloadData.name,
                "code": payloadData.code,
                "type": payloadData.type,
                "mandatory": payloadData.mandatory,
                "auto_sync_to_prod": payloadData.auto_sync_to_prod,
                "active": faker.random.alpha(5),
            });
            signed_headers = getSignedRequestHeaders("POST", baseUrl, endpoint, payload, {});
            headers = {
                'Content-type': 'application/json;charset=UTF-8',
                'x-ccl-param': signed_headers["headers"]["x-ccl-param"],
                'x-ccl-signature': signed_headers["headers"]["x-ccl-signature"],
                'Cookie': cookie
            };
            res = await request
                .post(endpoint)
                .set(headers)
                .send(payload);
            expect(res.statusCode).to.be.eq(400);
            expect(res.body.error).to.contain('ValidationError: active:');
        });

        it('Create Attribute - Create Attribute call fails, string is sent in auto_sync_to_prod', async function () {
            endpoint = creatAttribute(orgId);
            payloadData = attributePayloads.createShortTextAttributePayload(attributeNameCode);
            payload = JSON.stringify({
                "name": payloadData.name,
                "code": payloadData.code,
                "type": payloadData.type,
                "mandatory": payloadData.mandatory,
                "auto_sync_to_prod": faker.random.alpha(5),
            });
            signed_headers = getSignedRequestHeaders("POST", baseUrl, endpoint, payload, {});
            headers = {
                'Content-type': 'application/json;charset=UTF-8',
                'x-ccl-param': signed_headers["headers"]["x-ccl-param"],
                'x-ccl-signature': signed_headers["headers"]["x-ccl-signature"],
                'Cookie': cookie
            };
            res = await request
                .post(endpoint)
                .set(headers)
                .send(payload);
            expect(res.statusCode).to.be.eq(400);
            expect(res.body.error).to.contain('ValidationError: auto_sync_to_prod:');
        });

        it('Create Attribute - Create Attribute call fails, string is sent in mandatory', async function () {
            endpoint = creatAttribute(orgId);
            payloadData = attributePayloads.createShortTextAttributePayload(attributeNameCode);
            payload = JSON.stringify({
                "name": payloadData.name,
                "code": payloadData.code,
                "type": payloadData.type,
                "mandatory": faker.random.alpha(5),
            });
            signed_headers = getSignedRequestHeaders("POST", baseUrl, endpoint, payload, {});
            headers = {
                'Content-type': 'application/json;charset=UTF-8',
                'x-ccl-param': signed_headers["headers"]["x-ccl-param"],
                'x-ccl-signature': signed_headers["headers"]["x-ccl-signature"],
                'Cookie': cookie
            };
            res = await request
                .post(endpoint)
                .set(headers)
                .send(payload);
            expect(res.statusCode).to.be.eq(400);
            expect(res.body.error).to.contain('ValidationError: mandatory:');
        });

        it('Create Attribute - Create Attribute call fails, string is sent in vms_visible', async function () {
            endpoint = creatAttribute(orgId);
            payloadData = attributePayloads.createShortTextAttributePayload(attributeNameCode);
            payload = JSON.stringify({
                "name": payloadData.name,
                "code": payloadData.code,
                "type": payloadData.type,
                "vms_visible": faker.random.alpha(5),
            });
            signed_headers = getSignedRequestHeaders("POST", baseUrl, endpoint, payload, {});
            headers = {
                'Content-type': 'application/json;charset=UTF-8',
                'x-ccl-param': signed_headers["headers"]["x-ccl-param"],
                'x-ccl-signature': signed_headers["headers"]["x-ccl-signature"],
                'Cookie': cookie
            };
            res = await request
                .post(endpoint)
                .set(headers)
                .send(payload);
            expect(res.statusCode).to.be.eq(400);
            expect(res.body.error).to.contain('ValidationError: vms_visible:');
        });

        it('Create Attribute - Create Attribute call fails, string is sent in vms_editable', async function () {
            endpoint = creatAttribute(orgId);
            payloadData = attributePayloads.createShortTextAttributePayload(attributeNameCode);
            payload = JSON.stringify({
                "name": payloadData.name,
                "code": payloadData.code,
                "type": payloadData.type,
                "vms_editable": faker.random.alpha(5),
            });
            signed_headers = getSignedRequestHeaders("POST", baseUrl, endpoint, payload, {});
            headers = {
                'Content-type': 'application/json;charset=UTF-8',
                'x-ccl-param': signed_headers["headers"]["x-ccl-param"],
                'x-ccl-signature': signed_headers["headers"]["x-ccl-signature"],
                'Cookie': cookie
            };
            res = await request
                .post(endpoint)
                .set(headers)
                .send(payload);
            expect(res.statusCode).to.be.eq(400);
            expect(res.body.error).to.contain('ValidationError: vms_editable:');
        });

        it('Create Attribute - Create Attribute call fails, string is sent in store_filter', async function () {
            endpoint = creatAttribute(orgId);
            payloadData = attributePayloads.createShortTextAttributePayload(attributeNameCode);
            payload = JSON.stringify({
                "name": payloadData.name,
                "code": payloadData.code,
                "type": payloadData.type,
                "store_filter": faker.random.alpha(5),
            });
            signed_headers = getSignedRequestHeaders("POST", baseUrl, endpoint, payload, {});
            headers = {
                'Content-type': 'application/json;charset=UTF-8',
                'x-ccl-param': signed_headers["headers"]["x-ccl-param"],
                'x-ccl-signature': signed_headers["headers"]["x-ccl-signature"],
                'Cookie': cookie
            };
            res = await request
                .post(endpoint)
                .set(headers)
                .send(payload);
            expect(res.statusCode).to.be.eq(400);
            expect(res.body.error).to.contain('ValidationError: store_filter:');
        });

        it('Create Attribute - Create Attribute call fails, string is sent in store_display_pdp', async function () {
            endpoint = creatAttribute(orgId);
            payloadData = attributePayloads.createShortTextAttributePayload(attributeNameCode);
            payload = JSON.stringify({
                "name": payloadData.name,
                "code": payloadData.code,
                "type": payloadData.type,
                "store_display_pdp": faker.random.alpha(5),
            });
            signed_headers = getSignedRequestHeaders("POST", baseUrl, endpoint, payload, {});
            headers = {
                'Content-type': 'application/json;charset=UTF-8',
                'x-ccl-param': signed_headers["headers"]["x-ccl-param"],
                'x-ccl-signature': signed_headers["headers"]["x-ccl-signature"],
                'Cookie': cookie
            };
            res = await request
                .post(endpoint)
                .set(headers)
                .send(payload);
            expect(res.statusCode).to.be.eq(400);
            expect(res.body.error).to.contain('ValidationError: store_display_pdp:');
        });

        it('Create Attribute - Create Attribute call fails, string is sent in store_search', async function () {
            endpoint = creatAttribute(orgId);
            payloadData = attributePayloads.createShortTextAttributePayload(attributeNameCode);
            payload = JSON.stringify({
                "name": payloadData.name,
                "code": payloadData.code,
                "type": payloadData.type,
                "store_search": faker.random.alpha(5),
            });
            signed_headers = getSignedRequestHeaders("POST", baseUrl, endpoint, payload, {});
            headers = {
                'Content-type': 'application/json;charset=UTF-8',
                'x-ccl-param': signed_headers["headers"]["x-ccl-param"],
                'x-ccl-signature': signed_headers["headers"]["x-ccl-signature"],
                'Cookie': cookie
            };
            res = await request
                .post(endpoint)
                .set(headers)
                .send(payload);
            expect(res.statusCode).to.be.eq(400);
            expect(res.body.error).to.contain('ValidationError: store_search:');
        });

        it('Create Attribute - Create Attribute call fails, string is sent in store_compare', async function () {
            endpoint = creatAttribute(orgId);
            payloadData = attributePayloads.createShortTextAttributePayload(attributeNameCode);
            payload = JSON.stringify({
                "name": payloadData.name,
                "code": payloadData.code,
                "type": payloadData.type,
                "store_compare": faker.random.alpha(5),
            });
            signed_headers = getSignedRequestHeaders("POST", baseUrl, endpoint, payload, {});
            headers = {
                'Content-type': 'application/json;charset=UTF-8',
                'x-ccl-param': signed_headers["headers"]["x-ccl-param"],
                'x-ccl-signature': signed_headers["headers"]["x-ccl-signature"],
                'Cookie': cookie
            };
            res = await request
                .post(endpoint)
                .set(headers)
                .send(payload);
            expect(res.statusCode).to.be.eq(400);
            expect(res.body.error).to.contain('ValidationError: store_compare:');
        });

        it('Create Attribute - User is logged in, Paragraph Attribute is created sucessfully', async function () {
            endpoint = creatAttribute(orgId);
            attributeNameCode = 'ParagraphRandom';
            payloadData = attributePayloads.createParagraphAttributePayload(attributeNameCode);
            payload = JSON.stringify({
                "active": payloadData.active,
                "name": payloadData.name,
                "code": payloadData.code,
                "description": payloadData.description,
                "tags": payloadData.tags,
                "type": payloadData.type,
                "mandatory": payloadData.mandatory,
                "auto_sync_to_prod": payloadData.auto_sync_to_prod,
                "limit": payloadData.limit,
                "vms_visible": payloadData.vms_visible,
                "vms_editable": payloadData.vms_editable,
                "store_filter": payloadData.store_filter,
                "store_display_pdp": payloadData.store_display_pdp,
                "store_display_plp": payloadData.store_display_plp,
                "store_search": payloadData.store_search,
                "store_compare": payloadData.store_compare
            });
            signed_headers = getSignedRequestHeaders("POST", baseUrl, endpoint, payload, {});
            headers = {
                'Content-type': 'application/json;charset=UTF-8',
                'x-ccl-param': signed_headers["headers"]["x-ccl-param"],
                'x-ccl-signature': signed_headers["headers"]["x-ccl-signature"],
                'Cookie': cookie
            };
            res = await request
                .post(endpoint)
                .set(headers)
                .send(payload);
            tempVarId = await res.body.attribute._id;
            FO.appendToFile(attributeDetailsFile, attributeNameCode, tempVarId);
            expect(res.statusCode).to.be.eq(201);
            expect(res.body).to.be.jsonSchema(schemas.successParagraphAttributeSchema);
            expect(res.body.attribute.x_org_id).to.be.eq(orgId);
            expect(res.body.attribute.name).to.be.eq(payloadData.name);
            expect(res.body.attribute.code).to.be.eq(payloadData.code);
            expect(res.body.attribute.description).to.be.eq(payloadData.description);
            expect(res.body.attribute.tags.length).to.be.eq(payloadData.tags.length);
            expect(res.body.attribute.limit).to.be.eq(payloadData.limit);
            expect(res.body.attribute.vms_visible).to.be.eq(payloadData.vms_visible);
            expect(res.body.attribute.vms_editable).to.be.eq(payloadData.vms_editable);
            expect(res.body.attribute.store_filter).to.be.eq(payloadData.store_filter);
            expect(res.body.attribute.store_display_pdp).to.be.eq(payloadData.store_display_pdp);
            expect(res.body.attribute.store_display_plp).to.be.eq(payloadData.store_display_plp);
            expect(res.body.attribute.store_search).to.be.eq(payloadData.store_search);
            expect(res.body.attribute.store_compare).to.be.eq(payloadData.store_compare);
            expect(res.body.attribute.active).to.be.eq(payloadData.active);
            expect(res.body.attribute.mandatory).to.be.eq(payloadData.mandatory);
            expect(res.body.attribute.auto_sync_to_prod).to.be.eq(payloadData.auto_sync_to_prod);
            expect(compareArrayData(res.body.attribute.tags, payloadData.tags)).to.be.true;
        });

        it('Create Attribute - Paragraph Attribute is created sucessfully, only Name, Code and type is sent', async function () {
            endpoint = creatAttribute(orgId);
            attributeNameCode = 'ParagraphDef';
            payloadData = attributePayloads.createParagraphAttributePayload(attributeNameCode);
            payload = JSON.stringify({
                "name": payloadData.name,
                "code": payloadData.code,
                "type": payloadData.type
            });
            signed_headers = getSignedRequestHeaders("POST", baseUrl, endpoint, payload, {});
            headers = {
                'Content-type': 'application/json;charset=UTF-8',
                'x-ccl-param': signed_headers["headers"]["x-ccl-param"],
                'x-ccl-signature': signed_headers["headers"]["x-ccl-signature"],
                'Cookie': cookie
            };
            res = await request
                .post(endpoint)
                .set(headers)
                .send(payload);
            tempVarId = await res.body.attribute._id;
            FO.appendToFile(attributeDetailsFile, attributeNameCode, tempVarId);
            expect(res.statusCode).to.be.eq(201);
            expect(res.body).to.be.jsonSchema(schemas.successParagraphAttributeSchema);
            expect(res.body.attribute.x_org_id).to.be.eq(orgId);
            expect(res.body.attribute.name).to.be.eq(payloadData.name);
            expect(res.body.attribute.code).to.be.eq(payloadData.code);
            expect(res.body.attribute.vms_visible).to.be.false;
            expect(res.body.attribute.vms_editable).to.be.false;
            expect(res.body.attribute.store_filter).to.be.false;
            expect(res.body.attribute.store_display_pdp).to.be.false;
            expect(res.body.attribute.store_display_plp).to.be.false;
            expect(res.body.attribute.store_search).to.be.false;
            expect(res.body.attribute.store_compare).to.be.false;
            expect(res.body.attribute.active).to.be.true;
            expect(res.body.attribute.mandatory).to.be.true;
            expect(res.body.attribute.auto_sync_to_prod).to.be.true;
        });

        it('Create Attribute - Paragraph Attribute is created sucessfully, when limit is sent in the body', async function () {
            endpoint = creatAttribute(orgId);
            attributeNameCode = 'ParagraphLim'
            payloadData = attributePayloads.createParagraphAttributePayload(attributeNameCode);
            payload = JSON.stringify({
                "name": payloadData.name,
                "code": payloadData.code,
                "type": payloadData.type,
                "limit": payloadData.limit
            });
            signed_headers = getSignedRequestHeaders("POST", baseUrl, endpoint, payload, {});
            headers = {
                'Content-type': 'application/json;charset=UTF-8',
                'x-ccl-param': signed_headers["headers"]["x-ccl-param"],
                'x-ccl-signature': signed_headers["headers"]["x-ccl-signature"],
                'Cookie': cookie
            };
            res = await request
                .post(endpoint)
                .set(headers)
                .send(payload);
            tempVarId = await res.body.attribute._id;
            FO.appendToFile(attributeDetailsFile, attributeNameCode, tempVarId);
            expect(res.statusCode).to.be.eq(201);
            expect(res.body).to.be.jsonSchema(schemas.successParagraphAttributeSchema);
            expect(res.body.attribute.x_org_id).to.be.eq(orgId);
            expect(res.body.attribute.limit).to.be.eq(payloadData.limit);
            expect(res.body.attribute.name).to.be.eq(payloadData.name);
            expect(res.body.attribute.code).to.be.eq(payloadData.code);
            expect(res.body.attribute.vms_visible).to.be.false;
            expect(res.body.attribute.vms_editable).to.be.false;
            expect(res.body.attribute.store_filter).to.be.false;
            expect(res.body.attribute.store_display_pdp).to.be.false;
            expect(res.body.attribute.store_display_plp).to.be.false;
            expect(res.body.attribute.store_search).to.be.false;
            expect(res.body.attribute.store_compare).to.be.false;
            expect(res.body.attribute.active).to.be.true;
            expect(res.body.attribute.mandatory).to.be.true;
            expect(res.body.attribute.auto_sync_to_prod).to.be.true;
        });

        it('Create Attribute - Call fails for Paragraph Attribute type, when negative value is sent for limit, ', async function () {
            const temp = faker.datatype.number({ min: -100, max: -1 });
            endpoint = creatAttribute(orgId);
            attributeNameCode = 'invalid';
            payloadData = attributePayloads.createParagraphAttributePayload(attributeNameCode);
            payload = JSON.stringify({
                "name": payloadData.name,
                "code": payloadData.code,
                "type": payloadData.type,
                "limit": temp
            });
            signed_headers = getSignedRequestHeaders("POST", baseUrl, endpoint, payload, {});
            headers = {
                'Content-type': 'application/json;charset=UTF-8',
                'x-ccl-param': signed_headers["headers"]["x-ccl-param"],
                'x-ccl-signature': signed_headers["headers"]["x-ccl-signature"],
                'Cookie': cookie
            };
            res = await request
                .post(endpoint)
                .set(headers)
                .send(payload);
            expect(res.statusCode).to.be.eq(400);
            expect(res.body.error).to.contain('ValidationError: limit:');
        });

        it('Create Attribute - Call fails for Paragraph Attribute type, when decimal value is sent for limit, ', async function () {
            const temp = faker.datatype.number({ min: 0, max: 200, precision: 0.01 });
            endpoint = creatAttribute(orgId);
            payloadData = attributePayloads.createParagraphAttributePayload(attributeNameCode);
            payload = JSON.stringify({
                "name": payloadData.name,
                "code": payloadData.code,
                "type": payloadData.type,
                "limit": temp
            });
            signed_headers = getSignedRequestHeaders("POST", baseUrl, endpoint, payload, {});
            headers = {
                'Content-type': 'application/json;charset=UTF-8',
                'x-ccl-param': signed_headers["headers"]["x-ccl-param"],
                'x-ccl-signature': signed_headers["headers"]["x-ccl-signature"],
                'Cookie': cookie
            };
            res = await request
                .post(endpoint)
                .set(headers)
                .send(payload);
            expect(res.statusCode).to.be.eq(400);
            expect(res.body.error).to.contain('ValidationError: limit:');
        });

        it('Create Attribute - Call fails for Paragraph Attribute type, when string value is sent for limit, ', async function () {
            endpoint = creatAttribute(orgId);
            payloadData = attributePayloads.createParagraphAttributePayload(attributeNameCode);
            payload = JSON.stringify({
                "name": payloadData.name,
                "code": payloadData.code,
                "type": payloadData.type,
                "limit": faker.random.alpha(5)
            });
            signed_headers = getSignedRequestHeaders("POST", baseUrl, endpoint, payload, {});
            headers = {
                'Content-type': 'application/json;charset=UTF-8',
                'x-ccl-param': signed_headers["headers"]["x-ccl-param"],
                'x-ccl-signature': signed_headers["headers"]["x-ccl-signature"],
                'Cookie': cookie
            };
            res = await request
                .post(endpoint)
                .set(headers)
                .send(payload);
            expect(res.statusCode).to.be.eq(400);
            expect(res.body.error).to.contain('ValidationError: limit:');
        });

        it('Create Attribute - User is logged in, HTML Attribute is created sucessfully', async function () {
            endpoint = creatAttribute(orgId);
            attributeNameCode = 'HTMLRandom';
            payloadData = attributePayloads.attributePayloadBasicType(attributeNameCode);
            payload = JSON.stringify({
                "active": payloadData.active,
                "name": payloadData.name,
                "code": payloadData.code,
                "description": payloadData.description,
                "tags": payloadData.tags,
                "type": "HTML",
                "mandatory": payloadData.mandatory,
                "auto_sync_to_prod": payloadData.auto_sync_to_prod,
                "vms_visible": payloadData.vms_visible,
                "vms_editable": payloadData.vms_editable,
                "store_filter": payloadData.store_filter,
                "store_display_pdp": payloadData.store_display_pdp,
                "store_display_plp": payloadData.store_display_plp,
                "store_search": payloadData.store_search,
                "store_compare": payloadData.store_compare
            });
            signed_headers = getSignedRequestHeaders("POST", baseUrl, endpoint, payload, {});
            headers = {
                'Content-type': 'application/json;charset=UTF-8',
                'x-ccl-param': signed_headers["headers"]["x-ccl-param"],
                'x-ccl-signature': signed_headers["headers"]["x-ccl-signature"],
                'Cookie': cookie
            };
            res = await request
                .post(endpoint)
                .set(headers)
                .send(payload);
            tempVarId = await res.body.attribute._id;
            FO.appendToFile(attributeDetailsFile, attributeNameCode, tempVarId);
            expect(res.statusCode).to.be.eq(201);
            expect(res.body).to.be.jsonSchema(schemas.successBasicAttributeSchema);
            expect(res.body.attribute.x_org_id).to.be.eq(orgId);
            expect(res.body.attribute.type).to.be.eq("HTML");
            expect(res.body.attribute.name).to.be.eq(payloadData.name);
            expect(res.body.attribute.code).to.be.eq(payloadData.code);
            expect(res.body.attribute.description).to.be.eq(payloadData.description);
            expect(res.body.attribute.tags.length).to.be.eq(payloadData.tags.length);
            expect(res.body.attribute.vms_visible).to.be.eq(payloadData.vms_visible);
            expect(res.body.attribute.vms_editable).to.be.eq(payloadData.vms_editable);
            expect(res.body.attribute.store_filter).to.be.eq(payloadData.store_filter);
            expect(res.body.attribute.store_display_pdp).to.be.eq(payloadData.store_display_pdp);
            expect(res.body.attribute.store_display_plp).to.be.eq(payloadData.store_display_plp);
            expect(res.body.attribute.store_search).to.be.eq(payloadData.store_search);
            expect(res.body.attribute.store_compare).to.be.eq(payloadData.store_compare);
            expect(res.body.attribute.active).to.be.eq(payloadData.active);
            expect(res.body.attribute.mandatory).to.be.eq(payloadData.mandatory);
            expect(res.body.attribute.auto_sync_to_prod).to.be.eq(payloadData.auto_sync_to_prod);
            expect(compareArrayData(res.body.attribute.tags, payloadData.tags)).to.be.true;
        });

        it('Create Attribute - HTML Attribute is created sucessfully, only Name, Code and Type values are sent', async function () {
            endpoint = creatAttribute(orgId);
            attributeNameCode = 'HTMLDef';
            payloadData = attributePayloads.attributePayloadBasicType(attributeNameCode);
            payload = JSON.stringify({
                "name": payloadData.name,
                "code": payloadData.code,
                "type": "HTML"
            });
            signed_headers = getSignedRequestHeaders("POST", baseUrl, endpoint, payload, {});
            headers = {
                'Content-type': 'application/json;charset=UTF-8',
                'x-ccl-param': signed_headers["headers"]["x-ccl-param"],
                'x-ccl-signature': signed_headers["headers"]["x-ccl-signature"],
                'Cookie': cookie
            };
            res = await request
                .post(endpoint)
                .set(headers)
                .send(payload);
            tempVarId = await res.body.attribute._id;
            FO.appendToFile(attributeDetailsFile, attributeNameCode, tempVarId);
            expect(res.statusCode).to.be.eq(201);
            expect(res.body).to.be.jsonSchema(schemas.successBasicAttributeSchema);
            expect(res.body.attribute.x_org_id).to.be.eq(orgId);
            expect(res.body.attribute.type).to.be.eq("HTML");
            expect(res.body.attribute.name).to.be.eq(payloadData.name);
            expect(res.body.attribute.code).to.be.eq(payloadData.code);
            expect(res.body.attribute.vms_visible).to.be.false;
            expect(res.body.attribute.vms_editable).to.be.false;
            expect(res.body.attribute.store_filter).to.be.false;
            expect(res.body.attribute.store_display_pdp).to.be.false;
            expect(res.body.attribute.store_display_plp).to.be.false;
            expect(res.body.attribute.store_search).to.be.false;
            expect(res.body.attribute.store_compare).to.be.false;
            expect(res.body.attribute.active).to.be.true;
            expect(res.body.attribute.mandatory).to.be.true;
            expect(res.body.attribute.auto_sync_to_prod).to.be.true;
        });

        it('Create Attribute - User is logged in, URL Attribute is created sucessfully', async function () {
            endpoint = creatAttribute(orgId);
            attributeNameCode = 'URLRandom';
            payloadData = attributePayloads.attributePayloadBasicType(attributeNameCode);
            payload = JSON.stringify({
                "active": payloadData.active,
                "name": payloadData.name,
                "code": payloadData.code,
                "description": payloadData.description,
                "tags": payloadData.tags,
                "type": "URL",
                "mandatory": payloadData.mandatory,
                "auto_sync_to_prod": payloadData.auto_sync_to_prod,
                "vms_visible": payloadData.vms_visible,
                "vms_editable": payloadData.vms_editable,
                "store_filter": payloadData.store_filter,
                "store_display_pdp": payloadData.store_display_pdp,
                "store_display_plp": payloadData.store_display_plp,
                "store_search": payloadData.store_search,
                "store_compare": payloadData.store_compare
            });
            signed_headers = getSignedRequestHeaders("POST", baseUrl, endpoint, payload, {});
            headers = {
                'Content-type': 'application/json;charset=UTF-8',
                'x-ccl-param': signed_headers["headers"]["x-ccl-param"],
                'x-ccl-signature': signed_headers["headers"]["x-ccl-signature"],
                'Cookie': cookie
            };
            res = await request
                .post(endpoint)
                .set(headers)
                .send(payload);
            tempVarId = await res.body.attribute._id;
            FO.appendToFile(attributeDetailsFile, attributeNameCode, tempVarId);
            expect(res.statusCode).to.be.eq(201);
            expect(res.body).to.be.jsonSchema(schemas.successBasicAttributeSchema);
            expect(res.body.attribute.x_org_id).to.be.eq(orgId);
            expect(res.body.attribute.type).to.be.eq("URL");
            expect(res.body.attribute.name).to.be.eq(payloadData.name);
            expect(res.body.attribute.code).to.be.eq(payloadData.code);
            expect(res.body.attribute.description).to.be.eq(payloadData.description);
            expect(res.body.attribute.tags.length).to.be.eq(payloadData.tags.length);
            expect(res.body.attribute.vms_visible).to.be.eq(payloadData.vms_visible);
            expect(res.body.attribute.vms_editable).to.be.eq(payloadData.vms_editable);
            expect(res.body.attribute.store_filter).to.be.eq(payloadData.store_filter);
            expect(res.body.attribute.store_display_pdp).to.be.eq(payloadData.store_display_pdp);
            expect(res.body.attribute.store_display_plp).to.be.eq(payloadData.store_display_plp);
            expect(res.body.attribute.store_search).to.be.eq(payloadData.store_search);
            expect(res.body.attribute.store_compare).to.be.eq(payloadData.store_compare);
            expect(res.body.attribute.active).to.be.eq(payloadData.active);
            expect(res.body.attribute.mandatory).to.be.eq(payloadData.mandatory);
            expect(res.body.attribute.auto_sync_to_prod).to.be.eq(payloadData.auto_sync_to_prod);
            expect(compareArrayData(res.body.attribute.tags, payloadData.tags)).to.be.true;
        });

        it('Create Attribute - URL Attribute is created sucessfully, only Name, Code and Type values are sent', async function () {
            endpoint = creatAttribute(orgId);
            attributeNameCode = 'URLDef';
            payloadData = attributePayloads.attributePayloadBasicType(attributeNameCode);
            payload = JSON.stringify({
                "name": payloadData.name,
                "code": payloadData.code,
                "type": "URL"
            });
            signed_headers = getSignedRequestHeaders("POST", baseUrl, endpoint, payload, {});
            headers = {
                'Content-type': 'application/json;charset=UTF-8',
                'x-ccl-param': signed_headers["headers"]["x-ccl-param"],
                'x-ccl-signature': signed_headers["headers"]["x-ccl-signature"],
                'Cookie': cookie
            };
            res = await request
                .post(endpoint)
                .set(headers)
                .send(payload);
            tempVarId = await res.body.attribute._id;
            FO.appendToFile(attributeDetailsFile, attributeNameCode, tempVarId);
            expect(res.statusCode).to.be.eq(201);
            expect(res.body).to.be.jsonSchema(schemas.successBasicAttributeSchema);
            expect(res.body.attribute.x_org_id).to.be.eq(orgId);
            expect(res.body.attribute.type).to.be.eq("URL");
            expect(res.body.attribute.name).to.be.eq(payloadData.name);
            expect(res.body.attribute.code).to.be.eq(payloadData.code);
            expect(res.body.attribute.vms_visible).to.be.false;
            expect(res.body.attribute.vms_editable).to.be.false;
            expect(res.body.attribute.store_filter).to.be.false;
            expect(res.body.attribute.store_display_pdp).to.be.false;
            expect(res.body.attribute.store_display_plp).to.be.false;
            expect(res.body.attribute.store_search).to.be.false;
            expect(res.body.attribute.store_compare).to.be.false;
            expect(res.body.attribute.active).to.be.true;
            expect(res.body.attribute.mandatory).to.be.true;
            expect(res.body.attribute.auto_sync_to_prod).to.be.true;
        });

        it('Create Attribute - User is logged in, Date Attribute is created sucessfully', async function () {
            endpoint = creatAttribute(orgId);
            attributeNameCode = 'DateRandom';
            payloadData = attributePayloads.attributePayloadBasicType(attributeNameCode);
            payload = JSON.stringify({
                "active": payloadData.active,
                "name": payloadData.name,
                "code": payloadData.code,
                "description": payloadData.description,
                "tags": payloadData.tags,
                "type": "Date",
                "mandatory": payloadData.mandatory,
                "auto_sync_to_prod": payloadData.auto_sync_to_prod,
                "vms_visible": payloadData.vms_visible,
                "vms_editable": payloadData.vms_editable,
                "store_filter": payloadData.store_filter,
                "store_display_pdp": payloadData.store_display_pdp,
                "store_display_plp": payloadData.store_display_plp,
                "store_search": payloadData.store_search,
                "store_compare": payloadData.store_compare
            });
            signed_headers = getSignedRequestHeaders("POST", baseUrl, endpoint, payload, {});
            headers = {
                'Content-type': 'application/json;charset=UTF-8',
                'x-ccl-param': signed_headers["headers"]["x-ccl-param"],
                'x-ccl-signature': signed_headers["headers"]["x-ccl-signature"],
                'Cookie': cookie
            };
            res = await request
                .post(endpoint)
                .set(headers)
                .send(payload);
            tempVarId = await res.body.attribute._id;
            FO.appendToFile(attributeDetailsFile, attributeNameCode, tempVarId);
            expect(res.statusCode).to.be.eq(201);
            expect(res.body).to.be.jsonSchema(schemas.successBasicAttributeSchema);
            expect(res.body.attribute.x_org_id).to.be.eq(orgId);
            expect(res.body.attribute.type).to.be.eq("Date");
            expect(res.body.attribute.name).to.be.eq(payloadData.name);
            expect(res.body.attribute.code).to.be.eq(payloadData.code);
            expect(res.body.attribute.description).to.be.eq(payloadData.description);
            expect(res.body.attribute.tags.length).to.be.eq(payloadData.tags.length);
            expect(res.body.attribute.vms_visible).to.be.eq(payloadData.vms_visible);
            expect(res.body.attribute.vms_editable).to.be.eq(payloadData.vms_editable);
            expect(res.body.attribute.store_filter).to.be.eq(payloadData.store_filter);
            expect(res.body.attribute.store_display_pdp).to.be.eq(payloadData.store_display_pdp);
            expect(res.body.attribute.store_display_plp).to.be.eq(payloadData.store_display_plp);
            expect(res.body.attribute.store_search).to.be.eq(payloadData.store_search);
            expect(res.body.attribute.store_compare).to.be.eq(payloadData.store_compare);
            expect(res.body.attribute.active).to.be.eq(payloadData.active);
            expect(res.body.attribute.mandatory).to.be.eq(payloadData.mandatory);
            expect(res.body.attribute.auto_sync_to_prod).to.be.eq(payloadData.auto_sync_to_prod);
            expect(compareArrayData(res.body.attribute.tags, payloadData.tags)).to.be.true;
        });

        it('Create Attribute - Date Attribute is created sucessfully, only Name, Code and Type values are sent', async function () {
            endpoint = creatAttribute(orgId);
            attributeNameCode = 'DateDef';
            payloadData = attributePayloads.attributePayloadBasicType(attributeNameCode);
            payload = JSON.stringify({
                "name": payloadData.name,
                "code": payloadData.code,
                "type": "Date"
            });
            signed_headers = getSignedRequestHeaders("POST", baseUrl, endpoint, payload, {});
            headers = {
                'Content-type': 'application/json;charset=UTF-8',
                'x-ccl-param': signed_headers["headers"]["x-ccl-param"],
                'x-ccl-signature': signed_headers["headers"]["x-ccl-signature"],
                'Cookie': cookie
            };
            res = await request
                .post(endpoint)
                .set(headers)
                .send(payload);
            tempVarId = await res.body.attribute._id;
            FO.appendToFile(attributeDetailsFile, attributeNameCode, tempVarId);
            expect(res.statusCode).to.be.eq(201);
            expect(res.body).to.be.jsonSchema(schemas.successBasicAttributeSchema);
            expect(res.body.attribute.x_org_id).to.be.eq(orgId);
            expect(res.body.attribute.type).to.be.eq("Date");
            expect(res.body.attribute.name).to.be.eq(payloadData.name);
            expect(res.body.attribute.code).to.be.eq(payloadData.code);
            expect(res.body.attribute.vms_visible).to.be.false;
            expect(res.body.attribute.vms_editable).to.be.false;
            expect(res.body.attribute.store_filter).to.be.false;
            expect(res.body.attribute.store_display_pdp).to.be.false;
            expect(res.body.attribute.store_display_plp).to.be.false;
            expect(res.body.attribute.store_search).to.be.false;
            expect(res.body.attribute.store_compare).to.be.false;
            expect(res.body.attribute.active).to.be.true;
            expect(res.body.attribute.mandatory).to.be.true;
            expect(res.body.attribute.auto_sync_to_prod).to.be.true;
        });

        it('Create Attribute - User is logged in, Boolean Attribute is created sucessfully', async function () {
            endpoint = creatAttribute(orgId);
            attributeNameCode = 'BooleanRandom';
            payloadData = attributePayloads.attributePayloadBasicType(attributeNameCode);
            payload = JSON.stringify({
                "active": payloadData.active,
                "name": payloadData.name,
                "code": payloadData.code,
                "description": payloadData.description,
                "tags": payloadData.tags,
                "type": "Boolean",
                "mandatory": payloadData.mandatory,
                "auto_sync_to_prod": payloadData.auto_sync_to_prod,
                "vms_visible": payloadData.vms_visible,
                "vms_editable": payloadData.vms_editable,
                "store_filter": payloadData.store_filter,
                "store_display_pdp": payloadData.store_display_pdp,
                "store_display_plp": payloadData.store_display_plp,
                "store_search": payloadData.store_search,
                "store_compare": payloadData.store_compare
            });
            signed_headers = getSignedRequestHeaders("POST", baseUrl, endpoint, payload, {});
            headers = {
                'Content-type': 'application/json;charset=UTF-8',
                'x-ccl-param': signed_headers["headers"]["x-ccl-param"],
                'x-ccl-signature': signed_headers["headers"]["x-ccl-signature"],
                'Cookie': cookie
            };
            res = await request
                .post(endpoint)
                .set(headers)
                .send(payload);
            tempVarId = await res.body.attribute._id;
            FO.appendToFile(attributeDetailsFile, attributeNameCode, tempVarId);
            expect(res.statusCode).to.be.eq(201);
            expect(res.body).to.be.jsonSchema(schemas.successBasicAttributeSchema);
            expect(res.body.attribute.x_org_id).to.be.eq(orgId);
            expect(res.body.attribute.type).to.be.eq("Boolean");
            expect(res.body.attribute.name).to.be.eq(payloadData.name);
            expect(res.body.attribute.code).to.be.eq(payloadData.code);
            expect(res.body.attribute.description).to.be.eq(payloadData.description);
            expect(res.body.attribute.tags.length).to.be.eq(payloadData.tags.length);
            expect(res.body.attribute.vms_visible).to.be.eq(payloadData.vms_visible);
            expect(res.body.attribute.vms_editable).to.be.eq(payloadData.vms_editable);
            expect(res.body.attribute.store_filter).to.be.eq(payloadData.store_filter);
            expect(res.body.attribute.store_display_pdp).to.be.eq(payloadData.store_display_pdp);
            expect(res.body.attribute.store_display_plp).to.be.eq(payloadData.store_display_plp);
            expect(res.body.attribute.store_search).to.be.eq(payloadData.store_search);
            expect(res.body.attribute.store_compare).to.be.eq(payloadData.store_compare);
            expect(res.body.attribute.active).to.be.eq(payloadData.active);
            expect(res.body.attribute.mandatory).to.be.eq(payloadData.mandatory);
            expect(res.body.attribute.auto_sync_to_prod).to.be.eq(payloadData.auto_sync_to_prod);
            expect(compareArrayData(res.body.attribute.tags, payloadData.tags)).to.be.true;
        });

        it('Create Attribute - Boolean Attribute is created sucessfully, only Name, Code and Type values are sent', async function () {
            endpoint = creatAttribute(orgId);
            attributeNameCode = 'BooleanDef';
            payloadData = attributePayloads.attributePayloadBasicType(attributeNameCode);
            payload = JSON.stringify({
                "name": payloadData.name,
                "code": payloadData.code,
                "type": "Boolean"
            });
            signed_headers = getSignedRequestHeaders("POST", baseUrl, endpoint, payload, {});
            headers = {
                'Content-type': 'application/json;charset=UTF-8',
                'x-ccl-param': signed_headers["headers"]["x-ccl-param"],
                'x-ccl-signature': signed_headers["headers"]["x-ccl-signature"],
                'Cookie': cookie
            };
            res = await request
                .post(endpoint)
                .set(headers)
                .send(payload);
            tempVarId = await res.body.attribute._id;
            FO.appendToFile(attributeDetailsFile, attributeNameCode, tempVarId);
            expect(res.statusCode).to.be.eq(201);
            expect(res.body).to.be.jsonSchema(schemas.successBasicAttributeSchema);
            expect(res.body.attribute.x_org_id).to.be.eq(orgId);
            expect(res.body.attribute.type).to.be.eq("Boolean");
            expect(res.body.attribute.name).to.be.eq(payloadData.name);
            expect(res.body.attribute.code).to.be.eq(payloadData.code);
            expect(res.body.attribute.vms_visible).to.be.false;
            expect(res.body.attribute.vms_editable).to.be.false;
            expect(res.body.attribute.store_filter).to.be.false;
            expect(res.body.attribute.store_display_pdp).to.be.false;
            expect(res.body.attribute.store_display_plp).to.be.false;
            expect(res.body.attribute.store_search).to.be.false;
            expect(res.body.attribute.store_compare).to.be.false;
            expect(res.body.attribute.active).to.be.true;
            expect(res.body.attribute.mandatory).to.be.true;
            expect(res.body.attribute.auto_sync_to_prod).to.be.true;
        });

        it('Create Attribute - User is logged in, Number Attribute is created sucessfully', async function () {
            endpoint = creatAttribute(orgId);
            attributeNameCode = 'NumberRandom';
            payloadData = attributePayloads.createNumberAttributePayload(attributeNameCode);
            payload = JSON.stringify({
                "active": payloadData.active,
                "name": payloadData.name,
                "code": payloadData.code,
                "description": payloadData.description,
                "tags": payloadData.tags,
                "type": payloadData.type,
                "mandatory": payloadData.mandatory,
                "auto_sync_to_prod": payloadData.auto_sync_to_prod,
                "vms_visible": payloadData.vms_visible,
                "vms_editable": payloadData.vms_editable,
                "store_filter": payloadData.store_filter,
                "store_display_pdp": payloadData.store_display_pdp,
                "store_display_plp": payloadData.store_display_plp,
                "store_search": payloadData.store_search,
                "store_compare": payloadData.store_compare,
                "max": payloadData.max,
                "min": payloadData.min
            });
            signed_headers = getSignedRequestHeaders("POST", baseUrl, endpoint, payload, {});
            headers = {
                'Content-type': 'application/json;charset=UTF-8',
                'x-ccl-param': signed_headers["headers"]["x-ccl-param"],
                'x-ccl-signature': signed_headers["headers"]["x-ccl-signature"],
                'Cookie': cookie
            };
            res = await request
                .post(endpoint)
                .set(headers)
                .send(payload);
            tempVarId = await res.body.attribute._id;
            FO.appendToFile(attributeDetailsFile, attributeNameCode, tempVarId);
            FO.appendToFile(attributeDetailsFile, "NumberRandomMax", payloadData.max);
            FO.appendToFile(attributeDetailsFile, "NumberRandomMin", payloadData.min);
            expect(res.statusCode).to.be.eq(201);
            expect(res.body).to.be.jsonSchema(schemas.successNumDecAttributeSchema);
            expect(res.body.attribute.x_org_id).to.be.eq(orgId);
            expect(res.body.attribute.type).to.be.eq(payloadData.type);
            expect(res.body.attribute.name).to.be.eq(payloadData.name);
            expect(res.body.attribute.code).to.be.eq(payloadData.code);
            expect(res.body.attribute.description).to.be.eq(payloadData.description);
            expect(res.body.attribute.tags.length).to.be.eq(payloadData.tags.length);
            expect(res.body.attribute.vms_visible).to.be.eq(payloadData.vms_visible);
            expect(res.body.attribute.vms_editable).to.be.eq(payloadData.vms_editable);
            expect(res.body.attribute.store_filter).to.be.eq(payloadData.store_filter);
            expect(res.body.attribute.store_display_pdp).to.be.eq(payloadData.store_display_pdp);
            expect(res.body.attribute.store_display_plp).to.be.eq(payloadData.store_display_plp);
            expect(res.body.attribute.store_search).to.be.eq(payloadData.store_search);
            expect(res.body.attribute.store_compare).to.be.eq(payloadData.store_compare);
            expect(res.body.attribute.active).to.be.eq(payloadData.active);
            expect(res.body.attribute.mandatory).to.be.eq(payloadData.mandatory);
            expect(res.body.attribute.max).to.be.eq(payloadData.max);
            expect(res.body.attribute.min).to.be.eq(payloadData.min);
            expect(res.body.attribute.auto_sync_to_prod).to.be.eq(payloadData.auto_sync_to_prod);
            expect(compareArrayData(res.body.attribute.tags, payloadData.tags)).to.be.true;
        });

        it('Create Attribute - Number Attribute is created sucessfully, only Name, Code and Type values are sent', async function () {
            endpoint = creatAttribute(orgId);
            attributeNameCode = 'NumberDef';
            payloadData = attributePayloads.createNumberAttributePayload(attributeNameCode);
            payload = JSON.stringify({
                "name": payloadData.name,
                "code": payloadData.code,
                "type": payloadData.type
            });
            signed_headers = getSignedRequestHeaders("POST", baseUrl, endpoint, payload, {});
            headers = {
                'Content-type': 'application/json;charset=UTF-8',
                'x-ccl-param': signed_headers["headers"]["x-ccl-param"],
                'x-ccl-signature': signed_headers["headers"]["x-ccl-signature"],
                'Cookie': cookie
            };
            res = await request
                .post(endpoint)
                .set(headers)
                .send(payload);
            tempVarId = await res.body.attribute._id;
            FO.appendToFile(attributeDetailsFile, attributeNameCode, tempVarId);
            expect(res.statusCode).to.be.eq(201);
            expect(res.body).to.be.jsonSchema(schemas.successNumDecAttributeSchema);
            expect(res.body.attribute.x_org_id).to.be.eq(orgId);
            expect(res.body.attribute.type).to.be.eq(payloadData.type);
            expect(res.body.attribute.name).to.be.eq(payloadData.name);
            expect(res.body.attribute.code).to.be.eq(payloadData.code);
            expect(res.body.attribute.vms_visible).to.be.false;
            expect(res.body.attribute.vms_editable).to.be.false;
            expect(res.body.attribute.store_filter).to.be.false;
            expect(res.body.attribute.store_display_pdp).to.be.false;
            expect(res.body.attribute.store_display_plp).to.be.false;
            expect(res.body.attribute.store_search).to.be.false;
            expect(res.body.attribute.store_compare).to.be.false;
            expect(res.body.attribute.active).to.be.true;
            expect(res.body.attribute.mandatory).to.be.true;
            expect(res.body.attribute.max).to.be.null;
            expect(res.body.attribute.min).to.be.null;
            expect(res.body.attribute.auto_sync_to_prod).to.be.true;
        });

        it('Create Attribute - Number Attribute is created sucessfully, Value for only Max parameter is sent', async function () {
            endpoint = creatAttribute(orgId);
            attributeNameCode = 'NumberMax'
            payloadData = attributePayloads.createNumberAttributePayload(attributeNameCode);
            payload = JSON.stringify({
                "name": payloadData.name,
                "code": payloadData.code,
                "type": payloadData.type,
                "max": payloadData.max
            });
            signed_headers = getSignedRequestHeaders("POST", baseUrl, endpoint, payload, {});
            headers = {
                'Content-type': 'application/json;charset=UTF-8',
                'x-ccl-param': signed_headers["headers"]["x-ccl-param"],
                'x-ccl-signature': signed_headers["headers"]["x-ccl-signature"],
                'Cookie': cookie
            };
            res = await request
                .post(endpoint)
                .set(headers)
                .send(payload);
            tempVarId = await res.body.attribute._id;
            FO.appendToFile(attributeDetailsFile, attributeNameCode, tempVarId);
            FO.appendToFile(attributeDetailsFile, 'NumberMaxValue', payloadData.max);
            expect(res.statusCode).to.be.eq(201);
            expect(res.body).to.be.jsonSchema(schemas.successNumDecAttributeSchema);
            expect(res.body.attribute.x_org_id).to.be.eq(orgId);
            expect(res.body.attribute.type).to.be.eq(payloadData.type);
            expect(res.body.attribute.name).to.be.eq(payloadData.name);
            expect(res.body.attribute.code).to.be.eq(payloadData.code);
            expect(res.body.attribute.vms_visible).to.be.false;
            expect(res.body.attribute.vms_editable).to.be.false;
            expect(res.body.attribute.store_filter).to.be.false;
            expect(res.body.attribute.store_display_pdp).to.be.false;
            expect(res.body.attribute.store_display_plp).to.be.false;
            expect(res.body.attribute.store_search).to.be.false;
            expect(res.body.attribute.store_compare).to.be.false;
            expect(res.body.attribute.active).to.be.true;
            expect(res.body.attribute.mandatory).to.be.true;
            expect(res.body.attribute.max).to.be.eq(payloadData.max);
            expect(res.body.attribute.min).to.be.null;
            expect(res.body.attribute.auto_sync_to_prod).to.be.true;
        });

        it('Create Attribute - Number Attribute is created sucessfully, Value for only Min parameter is sent', async function () {
            endpoint = creatAttribute(orgId);
            attributeNameCode = 'NumberMin';
            payloadData = attributePayloads.createNumberAttributePayload(attributeNameCode);
            payload = JSON.stringify({
                "name": payloadData.name,
                "code": payloadData.code,
                "type": payloadData.type,
                "min": payloadData.min
            });
            signed_headers = getSignedRequestHeaders("POST", baseUrl, endpoint, payload, {});
            headers = {
                'Content-type': 'application/json;charset=UTF-8',
                'x-ccl-param': signed_headers["headers"]["x-ccl-param"],
                'x-ccl-signature': signed_headers["headers"]["x-ccl-signature"],
                'Cookie': cookie
            };
            res = await request
                .post(endpoint)
                .set(headers)
                .send(payload);
            tempVarId = await res.body.attribute._id;
            FO.appendToFile(attributeDetailsFile, attributeNameCode, tempVarId);
            FO.appendToFile(attributeDetailsFile, 'NumberMinValue', payloadData.min);
            expect(res.statusCode).to.be.eq(201);
            expect(res.body).to.be.jsonSchema(schemas.successNumDecAttributeSchema);
            expect(res.body.attribute.x_org_id).to.be.eq(orgId);
            expect(res.body.attribute.type).to.be.eq(payloadData.type);
            expect(res.body.attribute.name).to.be.eq(payloadData.name);
            expect(res.body.attribute.code).to.be.eq(payloadData.code);
            expect(res.body.attribute.vms_visible).to.be.false;
            expect(res.body.attribute.vms_editable).to.be.false;
            expect(res.body.attribute.store_filter).to.be.false;
            expect(res.body.attribute.store_display_pdp).to.be.false;
            expect(res.body.attribute.store_display_plp).to.be.false;
            expect(res.body.attribute.store_search).to.be.false;
            expect(res.body.attribute.store_compare).to.be.false;
            expect(res.body.attribute.active).to.be.true;
            expect(res.body.attribute.mandatory).to.be.true;
            expect(res.body.attribute.min).to.be.eq(payloadData.min);
            expect(res.body.attribute.max).to.be.null;
            expect(res.body.attribute.auto_sync_to_prod).to.be.true;
        });

        it('Create Attribute - Number Attribute is created sucessfully, Value for Min parameter is sent as negative integer', async function () {
            const minVal = faker.datatype.number({ min: -100000, max: -1 });
            endpoint = creatAttribute(orgId);
            attributeNameCode = 'NumberMinNeg';
            payloadData = attributePayloads.createNumberAttributePayload(attributeNameCode);
            payload = JSON.stringify({
                "name": payloadData.name,
                "code": payloadData.code,
                "type": payloadData.type,
                "min": minVal
            });
            signed_headers = getSignedRequestHeaders("POST", baseUrl, endpoint, payload, {});
            headers = {
                'Content-type': 'application/json;charset=UTF-8',
                'x-ccl-param': signed_headers["headers"]["x-ccl-param"],
                'x-ccl-signature': signed_headers["headers"]["x-ccl-signature"],
                'Cookie': cookie
            };
            res = await request
                .post(endpoint)
                .set(headers)
                .send(payload);
            tempVarId = await res.body.attribute._id;
            FO.appendToFile(attributeDetailsFile, attributeNameCode, tempVarId);
            expect(res.statusCode).to.be.eq(201);
            expect(res.body).to.be.jsonSchema(schemas.successNumDecAttributeSchema);
            expect(res.body.attribute.x_org_id).to.be.eq(orgId);
            expect(res.body.attribute.type).to.be.eq(payloadData.type);
            expect(res.body.attribute.name).to.be.eq(payloadData.name);
            expect(res.body.attribute.code).to.be.eq(payloadData.code);
            expect(res.body.attribute.vms_visible).to.be.false;
            expect(res.body.attribute.vms_editable).to.be.false;
            expect(res.body.attribute.store_filter).to.be.false;
            expect(res.body.attribute.store_display_pdp).to.be.false;
            expect(res.body.attribute.store_display_plp).to.be.false;
            expect(res.body.attribute.store_search).to.be.false;
            expect(res.body.attribute.store_compare).to.be.false;
            expect(res.body.attribute.active).to.be.true;
            expect(res.body.attribute.mandatory).to.be.true;
            expect(res.body.attribute.min).to.be.eq(minVal);
            expect(res.body.attribute.max).to.be.null;
            expect(res.body.attribute.auto_sync_to_prod).to.be.true;
        });

        it('Create Attribute - Number Attribute is created sucessfully, Value for Min parameter is sent as positive integer', async function () {
            const minVal = faker.datatype.number({ min: 1, max: 100000 });
            endpoint = creatAttribute(orgId);
            attributeNameCode = 'NumberMinPos';
            payloadData = attributePayloads.createNumberAttributePayload(attributeNameCode);
            payload = JSON.stringify({
                "name": payloadData.name,
                "code": payloadData.code,
                "type": payloadData.type,
                "min": minVal
            });
            signed_headers = getSignedRequestHeaders("POST", baseUrl, endpoint, payload, {});
            headers = {
                'Content-type': 'application/json;charset=UTF-8',
                'x-ccl-param': signed_headers["headers"]["x-ccl-param"],
                'x-ccl-signature': signed_headers["headers"]["x-ccl-signature"],
                'Cookie': cookie
            };
            res = await request
                .post(endpoint)
                .set(headers)
                .send(payload);
            tempVarId = await res.body.attribute._id;
            FO.appendToFile(attributeDetailsFile, attributeNameCode, tempVarId);
            expect(res.statusCode).to.be.eq(201);
            expect(res.body).to.be.jsonSchema(schemas.successNumDecAttributeSchema);
            expect(res.body.attribute.x_org_id).to.be.eq(orgId);
            expect(res.body.attribute.type).to.be.eq(payloadData.type);
            expect(res.body.attribute.name).to.be.eq(payloadData.name);
            expect(res.body.attribute.code).to.be.eq(payloadData.code);
            expect(res.body.attribute.vms_visible).to.be.false;
            expect(res.body.attribute.vms_editable).to.be.false;
            expect(res.body.attribute.store_filter).to.be.false;
            expect(res.body.attribute.store_display_pdp).to.be.false;
            expect(res.body.attribute.store_display_plp).to.be.false;
            expect(res.body.attribute.store_search).to.be.false;
            expect(res.body.attribute.store_compare).to.be.false;
            expect(res.body.attribute.active).to.be.true;
            expect(res.body.attribute.mandatory).to.be.true;
            expect(res.body.attribute.min).to.be.eq(minVal);
            expect(res.body.attribute.max).to.be.null;
            expect(res.body.attribute.auto_sync_to_prod).to.be.true;
        });

        it('Create Attribute - Number Attribute is created sucessfully, Value for Max parameter is sent as negative integer', async function () {
            const maxVal = faker.datatype.number({ min: -100000, max: -1 });
            endpoint = creatAttribute(orgId);
            attributeNameCode = 'NumberMaxNeg';
            payloadData = attributePayloads.createNumberAttributePayload(attributeNameCode);
            payload = JSON.stringify({
                "name": payloadData.name,
                "code": payloadData.code,
                "type": payloadData.type,
                "max": maxVal
            });
            signed_headers = getSignedRequestHeaders("POST", baseUrl, endpoint, payload, {});
            headers = {
                'Content-type': 'application/json;charset=UTF-8',
                'x-ccl-param': signed_headers["headers"]["x-ccl-param"],
                'x-ccl-signature': signed_headers["headers"]["x-ccl-signature"],
                'Cookie': cookie
            };
            res = await request
                .post(endpoint)
                .set(headers)
                .send(payload);
            tempVarId = await res.body.attribute._id;
            FO.appendToFile(attributeDetailsFile, attributeNameCode, tempVarId);
            expect(res.statusCode).to.be.eq(201);
            expect(res.body).to.be.jsonSchema(schemas.successNumDecAttributeSchema);
            expect(res.body.attribute.x_org_id).to.be.eq(orgId);
            expect(res.body.attribute.type).to.be.eq(payloadData.type);
            expect(res.body.attribute.name).to.be.eq(payloadData.name);
            expect(res.body.attribute.code).to.be.eq(payloadData.code);
            expect(res.body.attribute.vms_visible).to.be.false;
            expect(res.body.attribute.vms_editable).to.be.false;
            expect(res.body.attribute.store_filter).to.be.false;
            expect(res.body.attribute.store_display_pdp).to.be.false;
            expect(res.body.attribute.store_display_plp).to.be.false;
            expect(res.body.attribute.store_search).to.be.false;
            expect(res.body.attribute.store_compare).to.be.false;
            expect(res.body.attribute.active).to.be.true;
            expect(res.body.attribute.mandatory).to.be.true;
            expect(res.body.attribute.max).to.be.eq(maxVal);
            expect(res.body.attribute.min).to.be.null;
            expect(res.body.attribute.auto_sync_to_prod).to.be.true;
        });

        it('Create Attribute - Number Attribute is created sucessfully, Value for Max parameter is sent as positive integer', async function () {
            const maxVal = faker.datatype.number({ min: 1, max: 100000 });
            endpoint = creatAttribute(orgId);
            attributeNameCode = 'NumberMaxPos';
            payloadData = attributePayloads.createNumberAttributePayload(attributeNameCode);
            payload = JSON.stringify({
                "name": payloadData.name,
                "code": payloadData.code,
                "type": payloadData.type,
                "max": maxVal
            });
            signed_headers = getSignedRequestHeaders("POST", baseUrl, endpoint, payload, {});
            headers = {
                'Content-type': 'application/json;charset=UTF-8',
                'x-ccl-param': signed_headers["headers"]["x-ccl-param"],
                'x-ccl-signature': signed_headers["headers"]["x-ccl-signature"],
                'Cookie': cookie
            };
            res = await request
                .post(endpoint)
                .set(headers)
                .send(payload);
            tempVarId = await res.body.attribute._id;
            FO.appendToFile(attributeDetailsFile, attributeNameCode, tempVarId);
            expect(res.statusCode).to.be.eq(201);
            expect(res.body).to.be.jsonSchema(schemas.successNumDecAttributeSchema);
            expect(res.body.attribute.x_org_id).to.be.eq(orgId);
            expect(res.body.attribute.type).to.be.eq(payloadData.type);
            expect(res.body.attribute.name).to.be.eq(payloadData.name);
            expect(res.body.attribute.code).to.be.eq(payloadData.code);
            expect(res.body.attribute.vms_visible).to.be.false;
            expect(res.body.attribute.vms_editable).to.be.false;
            expect(res.body.attribute.store_filter).to.be.false;
            expect(res.body.attribute.store_display_pdp).to.be.false;
            expect(res.body.attribute.store_display_plp).to.be.false;
            expect(res.body.attribute.store_search).to.be.false;
            expect(res.body.attribute.store_compare).to.be.false;
            expect(res.body.attribute.active).to.be.true;
            expect(res.body.attribute.mandatory).to.be.true;
            expect(res.body.attribute.max).to.be.eq(maxVal);
            expect(res.body.attribute.min).to.be.null;
            expect(res.body.attribute.auto_sync_to_prod).to.be.true;
        });

        it('Create Attribute - call fails when Min value is sent higher than Max value', async function () {
            endpoint = creatAttribute(orgId);
            attributeNameCode = 'invalid'
            payloadData = attributePayloads.createNumberAttributePayload(attributeNameCode);
            payload = JSON.stringify({
                "name": payloadData.name,
                "code": payloadData.code,
                "type": payloadData.type,
                "max": payloadData.min,
                "min": payloadData.max
            });
            signed_headers = getSignedRequestHeaders("POST", baseUrl, endpoint, payload, {});
            headers = {
                'Content-type': 'application/json;charset=UTF-8',
                'x-ccl-param': signed_headers["headers"]["x-ccl-param"],
                'x-ccl-signature': signed_headers["headers"]["x-ccl-signature"],
                'Cookie': cookie
            };
            res = await request
                .post(endpoint)
                .set(headers)
                .send(payload);
            expect(res.statusCode).to.be.eq(400);
            expect(res.body.error).to.be.eq('Error: Max value cannot be less than min value');
        });

        it('Create Attribute - call fails when decimal value is sent for Min parameter for Number type', async function () {
            const minVal = faker.datatype.number({ min: 1, max: 100000, precision: 0.01 });
            endpoint = creatAttribute(orgId);
            payloadData = attributePayloads.createNumberAttributePayload(attributeNameCode);
            payload = JSON.stringify({
                "name": payloadData.name,
                "code": payloadData.code,
                "type": payloadData.type,
                "min": minVal
            });
            signed_headers = getSignedRequestHeaders("POST", baseUrl, endpoint, payload, {});
            headers = {
                'Content-type': 'application/json;charset=UTF-8',
                'x-ccl-param': signed_headers["headers"]["x-ccl-param"],
                'x-ccl-signature': signed_headers["headers"]["x-ccl-signature"],
                'Cookie': cookie
            };
            res = await request
                .post(endpoint)
                .set(headers)
                .send(payload);
            expect(res.statusCode).to.be.eq(400);
            expect(res.body.error).to.be.eq(`ValidationError: min: ${minVal} is not an integer value`);
        });

        it('Create Attribute - call fails when decimal value is sent for Max parameter for Number type', async function () {
            const maxVal = faker.datatype.number({ min: 1, max: 100000, precision: 0.01 });
            endpoint = creatAttribute(orgId);
            payloadData = attributePayloads.createNumberAttributePayload(attributeNameCode);
            payload = JSON.stringify({
                "name": payloadData.name,
                "code": payloadData.code,
                "type": payloadData.type,
                "max": maxVal
            });
            signed_headers = getSignedRequestHeaders("POST", baseUrl, endpoint, payload, {});
            headers = {
                'Content-type': 'application/json;charset=UTF-8',
                'x-ccl-param': signed_headers["headers"]["x-ccl-param"],
                'x-ccl-signature': signed_headers["headers"]["x-ccl-signature"],
                'Cookie': cookie
            };
            res = await request
                .post(endpoint)
                .set(headers)
                .send(payload);
            expect(res.statusCode).to.be.eq(400);
            expect(res.body.error).to.be.eq(`ValidationError: max: ${maxVal} is not an integer value`);
        });

        it('Create Attribute - call fails when string value is sent for Min parameter for Number type', async function () {
            endpoint = creatAttribute(orgId);
            payloadData = attributePayloads.createNumberAttributePayload(attributeNameCode);
            payload = JSON.stringify({
                "name": payloadData.name,
                "code": payloadData.code,
                "type": payloadData.type,
                "min": faker.random.alpha(5)
            });
            signed_headers = getSignedRequestHeaders("POST", baseUrl, endpoint, payload, {});
            headers = {
                'Content-type': 'application/json;charset=UTF-8',
                'x-ccl-param': signed_headers["headers"]["x-ccl-param"],
                'x-ccl-signature': signed_headers["headers"]["x-ccl-signature"],
                'Cookie': cookie
            };
            res = await request
                .post(endpoint)
                .set(headers)
                .send(payload);
            expect(res.statusCode).to.be.eq(400);
            expect(res.body.error).to.contain('ValidationError: min: Cast to Number');
        });

        it('Create Attribute - call fails when string value is sent for Max parameter for Number type', async function () {
            endpoint = creatAttribute(orgId);
            payloadData = attributePayloads.createNumberAttributePayload(attributeNameCode);
            payload = JSON.stringify({
                "name": payloadData.name,
                "code": payloadData.code,
                "type": payloadData.type,
                "max": faker.random.alpha(5)
            });
            signed_headers = getSignedRequestHeaders("POST", baseUrl, endpoint, payload, {});
            headers = {
                'Content-type': 'application/json;charset=UTF-8',
                'x-ccl-param': signed_headers["headers"]["x-ccl-param"],
                'x-ccl-signature': signed_headers["headers"]["x-ccl-signature"],
                'Cookie': cookie
            };
            res = await request
                .post(endpoint)
                .set(headers)
                .send(payload);
            expect(res.statusCode).to.be.eq(400);
            expect(res.body.error).to.contain('ValidationError: max: Cast to Number');
        });

        it('Create Attribute - User is logged in, Decimal Attribute is created sucessfully for Decimal type', async function () {
            endpoint = creatAttribute(orgId);
            attributeNameCode = 'DecimalRandom';
            payloadData = attributePayloads.createDecimalAttributePayload(attributeNameCode);
            payload = JSON.stringify({
                "active": payloadData.active,
                "name": payloadData.name,
                "code": payloadData.code,
                "description": payloadData.description,
                "tags": payloadData.tags,
                "type": payloadData.type,
                "mandatory": payloadData.mandatory,
                "auto_sync_to_prod": payloadData.auto_sync_to_prod,
                "vms_visible": payloadData.vms_visible,
                "vms_editable": payloadData.vms_editable,
                "store_filter": payloadData.store_filter,
                "store_display_pdp": payloadData.store_display_pdp,
                "store_display_plp": payloadData.store_display_plp,
                "store_search": payloadData.store_search,
                "store_compare": payloadData.store_compare,
                "max": payloadData.max,
                "min": payloadData.min
            });
            signed_headers = getSignedRequestHeaders("POST", baseUrl, endpoint, payload, {});
            headers = {
                'Content-type': 'application/json;charset=UTF-8',
                'x-ccl-param': signed_headers["headers"]["x-ccl-param"],
                'x-ccl-signature': signed_headers["headers"]["x-ccl-signature"],
                'Cookie': cookie
            };
            res = await request
                .post(endpoint)
                .set(headers)
                .send(payload);
            tempVarId = await res.body.attribute._id;
            FO.appendToFile(attributeDetailsFile, attributeNameCode, tempVarId);
            FO.appendToFile(attributeDetailsFile, "DecimalRandomMax", payloadData.max);
            FO.appendToFile(attributeDetailsFile, "DecimalRandomMin", payloadData.min);
            expect(res.statusCode).to.be.eq(201);
            expect(res.body).to.be.jsonSchema(schemas.successNumDecAttributeSchema);
            expect(res.body.attribute.x_org_id).to.be.eq(orgId);
            expect(res.body.attribute.type).to.be.eq(payloadData.type);
            expect(res.body.attribute.name).to.be.eq(payloadData.name);
            expect(res.body.attribute.code).to.be.eq(payloadData.code);
            expect(res.body.attribute.description).to.be.eq(payloadData.description);
            expect(res.body.attribute.tags.length).to.be.eq(payloadData.tags.length);
            expect(res.body.attribute.vms_visible).to.be.eq(payloadData.vms_visible);
            expect(res.body.attribute.vms_editable).to.be.eq(payloadData.vms_editable);
            expect(res.body.attribute.store_filter).to.be.eq(payloadData.store_filter);
            expect(res.body.attribute.store_display_pdp).to.be.eq(payloadData.store_display_pdp);
            expect(res.body.attribute.store_display_plp).to.be.eq(payloadData.store_display_plp);
            expect(res.body.attribute.store_search).to.be.eq(payloadData.store_search);
            expect(res.body.attribute.store_compare).to.be.eq(payloadData.store_compare);
            expect(res.body.attribute.active).to.be.eq(payloadData.active);
            expect(res.body.attribute.mandatory).to.be.eq(payloadData.mandatory);
            expect(res.body.attribute.max).to.be.eq(payloadData.max);
            expect(res.body.attribute.min).to.be.eq(payloadData.min);
            expect(res.body.attribute.auto_sync_to_prod).to.be.eq(payloadData.auto_sync_to_prod);
            expect(compareArrayData(res.body.attribute.tags, payloadData.tags)).to.be.true;
        });

        it('Create Attribute - Decimal Attribute is created sucessfully, only Name, Code and Type values are sent', async function () {
            endpoint = creatAttribute(orgId);
            attributeNameCode = 'DecimalDef';
            payloadData = attributePayloads.createDecimalAttributePayload(attributeNameCode);
            payload = JSON.stringify({
                "name": payloadData.name,
                "code": payloadData.code,
                "type": payloadData.type
            });
            signed_headers = getSignedRequestHeaders("POST", baseUrl, endpoint, payload, {});
            headers = {
                'Content-type': 'application/json;charset=UTF-8',
                'x-ccl-param': signed_headers["headers"]["x-ccl-param"],
                'x-ccl-signature': signed_headers["headers"]["x-ccl-signature"],
                'Cookie': cookie
            };
            res = await request
                .post(endpoint)
                .set(headers)
                .send(payload);
            tempVarId = await res.body.attribute._id;
            FO.appendToFile(attributeDetailsFile, attributeNameCode, tempVarId);
            expect(res.statusCode).to.be.eq(201);
            expect(res.body).to.be.jsonSchema(schemas.successNumDecAttributeSchema);
            expect(res.body.attribute.x_org_id).to.be.eq(orgId);
            expect(res.body.attribute.type).to.be.eq(payloadData.type);
            expect(res.body.attribute.name).to.be.eq(payloadData.name);
            expect(res.body.attribute.code).to.be.eq(payloadData.code);
            expect(res.body.attribute.vms_visible).to.be.false;
            expect(res.body.attribute.vms_editable).to.be.false;
            expect(res.body.attribute.store_filter).to.be.false;
            expect(res.body.attribute.store_display_pdp).to.be.false;
            expect(res.body.attribute.store_display_plp).to.be.false;
            expect(res.body.attribute.store_search).to.be.false;
            expect(res.body.attribute.store_compare).to.be.false;
            expect(res.body.attribute.active).to.be.true;
            expect(res.body.attribute.mandatory).to.be.true;
            expect(res.body.attribute.max).to.be.null;
            expect(res.body.attribute.min).to.be.null;
            expect(res.body.attribute.auto_sync_to_prod).to.be.true;
        });

        it('Create Attribute - Decimal Attribute is created sucessfully, Value for only Max parameter is sent', async function () {
            endpoint = creatAttribute(orgId);
            attributeNameCode = 'DecimalMax';
            payloadData = attributePayloads.createDecimalAttributePayload(attributeNameCode);
            payload = JSON.stringify({
                "name": payloadData.name,
                "code": payloadData.code,
                "type": payloadData.type,
                "max": payloadData.max
            });
            signed_headers = getSignedRequestHeaders("POST", baseUrl, endpoint, payload, {});
            headers = {
                'Content-type': 'application/json;charset=UTF-8',
                'x-ccl-param': signed_headers["headers"]["x-ccl-param"],
                'x-ccl-signature': signed_headers["headers"]["x-ccl-signature"],
                'Cookie': cookie
            };
            res = await request
                .post(endpoint)
                .set(headers)
                .send(payload);
            tempVarId = await res.body.attribute._id;
            FO.appendToFile(attributeDetailsFile, attributeNameCode, tempVarId);
            FO.appendToFile(attributeDetailsFile, 'DecimalMaxValue', payloadData.max);
            expect(res.statusCode).to.be.eq(201);
            expect(res.body).to.be.jsonSchema(schemas.successNumDecAttributeSchema);
            expect(res.body.attribute.x_org_id).to.be.eq(orgId);
            expect(res.body.attribute.type).to.be.eq(payloadData.type);
            expect(res.body.attribute.name).to.be.eq(payloadData.name);
            expect(res.body.attribute.code).to.be.eq(payloadData.code);
            expect(res.body.attribute.vms_visible).to.be.false;
            expect(res.body.attribute.vms_editable).to.be.false;
            expect(res.body.attribute.store_filter).to.be.false;
            expect(res.body.attribute.store_display_pdp).to.be.false;
            expect(res.body.attribute.store_display_plp).to.be.false;
            expect(res.body.attribute.store_search).to.be.false;
            expect(res.body.attribute.store_compare).to.be.false;
            expect(res.body.attribute.active).to.be.true;
            expect(res.body.attribute.mandatory).to.be.true;
            expect(res.body.attribute.max).to.be.eq(payloadData.max);
            expect(res.body.attribute.min).to.be.null;
            expect(res.body.attribute.auto_sync_to_prod).to.be.true;
        });

        it('Create Attribute - Decimal Attribute is created sucessfully, Value for only Min parameter is sent', async function () {
            endpoint = creatAttribute(orgId);
            attributeNameCode = 'DecimalMin';
            payloadData = attributePayloads.createDecimalAttributePayload(attributeNameCode);
            payload = JSON.stringify({
                "name": payloadData.name,
                "code": payloadData.code,
                "type": payloadData.type,
                "min": payloadData.min
            });
            signed_headers = getSignedRequestHeaders("POST", baseUrl, endpoint, payload, {});
            headers = {
                'Content-type': 'application/json;charset=UTF-8',
                'x-ccl-param': signed_headers["headers"]["x-ccl-param"],
                'x-ccl-signature': signed_headers["headers"]["x-ccl-signature"],
                'Cookie': cookie
            };
            res = await request
                .post(endpoint)
                .set(headers)
                .send(payload);
            tempVarId = await res.body.attribute._id;
            FO.appendToFile(attributeDetailsFile, attributeNameCode, tempVarId);
            FO.appendToFile(attributeDetailsFile, 'DecimalMinValue', payloadData.min);
            expect(res.statusCode).to.be.eq(201);
            expect(res.body).to.be.jsonSchema(schemas.successNumDecAttributeSchema);
            expect(res.body.attribute.x_org_id).to.be.eq(orgId);
            expect(res.body.attribute.type).to.be.eq(payloadData.type);
            expect(res.body.attribute.name).to.be.eq(payloadData.name);
            expect(res.body.attribute.code).to.be.eq(payloadData.code);
            expect(res.body.attribute.vms_visible).to.be.false;
            expect(res.body.attribute.vms_editable).to.be.false;
            expect(res.body.attribute.store_filter).to.be.false;
            expect(res.body.attribute.store_display_pdp).to.be.false;
            expect(res.body.attribute.store_display_plp).to.be.false;
            expect(res.body.attribute.store_search).to.be.false;
            expect(res.body.attribute.store_compare).to.be.false;
            expect(res.body.attribute.active).to.be.true;
            expect(res.body.attribute.mandatory).to.be.true;
            expect(res.body.attribute.min).to.be.eq(payloadData.min);
            expect(res.body.attribute.max).to.be.null;
            expect(res.body.attribute.auto_sync_to_prod).to.be.true;
        });

        it('Create Attribute - Decimal Attribute is created sucessfully, Value for Min parameter is sent as negative decimal value', async function () {
            const minVal = faker.datatype.number({ min: -100000, max: -1, precision: 0.01 });
            endpoint = creatAttribute(orgId);
            attributeNameCode = 'DecimalMinNeg';
            payloadData = attributePayloads.createDecimalAttributePayload(attributeNameCode);
            payload = JSON.stringify({
                "name": payloadData.name,
                "code": payloadData.code,
                "type": payloadData.type,
                "min": minVal
            });
            signed_headers = getSignedRequestHeaders("POST", baseUrl, endpoint, payload, {});
            headers = {
                'Content-type': 'application/json;charset=UTF-8',
                'x-ccl-param': signed_headers["headers"]["x-ccl-param"],
                'x-ccl-signature': signed_headers["headers"]["x-ccl-signature"],
                'Cookie': cookie
            };
            res = await request
                .post(endpoint)
                .set(headers)
                .send(payload);
            tempVarId = await res.body.attribute._id;
            FO.appendToFile(attributeDetailsFile, attributeNameCode, tempVarId);
            FO.appendToFile(attributeDetailsFile, "DecimalMinNegValue", minVal);
            expect(res.statusCode).to.be.eq(201);
            expect(res.body).to.be.jsonSchema(schemas.successNumDecAttributeSchema);
            expect(res.body.attribute.x_org_id).to.be.eq(orgId);
            expect(res.body.attribute.type).to.be.eq(payloadData.type);
            expect(res.body.attribute.name).to.be.eq(payloadData.name);
            expect(res.body.attribute.code).to.be.eq(payloadData.code);
            expect(res.body.attribute.vms_visible).to.be.false;
            expect(res.body.attribute.vms_editable).to.be.false;
            expect(res.body.attribute.store_filter).to.be.false;
            expect(res.body.attribute.store_display_pdp).to.be.false;
            expect(res.body.attribute.store_display_plp).to.be.false;
            expect(res.body.attribute.store_search).to.be.false;
            expect(res.body.attribute.store_compare).to.be.false;
            expect(res.body.attribute.active).to.be.true;
            expect(res.body.attribute.mandatory).to.be.true;
            expect(res.body.attribute.min).to.be.eq(minVal);
            expect(res.body.attribute.max).to.be.null;
            expect(res.body.attribute.auto_sync_to_prod).to.be.true;
        });

        it('Create Attribute - Decimal Attribute is created sucessfully, Value for Min parameter is sent as positive integer', async function () {
            const minVal = faker.datatype.number({ min: 1, max: 100000, precision: 0.01 });
            endpoint = creatAttribute(orgId);
            attributeNameCode = 'DecimalMinPos';
            payloadData = attributePayloads.createDecimalAttributePayload(attributeNameCode);
            payload = JSON.stringify({
                "name": payloadData.name,
                "code": payloadData.code,
                "type": payloadData.type,
                "min": minVal
            });
            signed_headers = getSignedRequestHeaders("POST", baseUrl, endpoint, payload, {});
            headers = {
                'Content-type': 'application/json;charset=UTF-8',
                'x-ccl-param': signed_headers["headers"]["x-ccl-param"],
                'x-ccl-signature': signed_headers["headers"]["x-ccl-signature"],
                'Cookie': cookie
            };
            res = await request
                .post(endpoint)
                .set(headers)
                .send(payload);
            tempVarId = await res.body.attribute._id;
            FO.appendToFile(attributeDetailsFile, attributeNameCode, tempVarId);
            FO.appendToFile(attributeDetailsFile, "DecimalMinPosValue", minVal);
            expect(res.statusCode).to.be.eq(201);
            expect(res.body).to.be.jsonSchema(schemas.successNumDecAttributeSchema);
            expect(res.body.attribute.x_org_id).to.be.eq(orgId);
            expect(res.body.attribute.type).to.be.eq(payloadData.type);
            expect(res.body.attribute.name).to.be.eq(payloadData.name);
            expect(res.body.attribute.code).to.be.eq(payloadData.code);
            expect(res.body.attribute.vms_visible).to.be.false;
            expect(res.body.attribute.vms_editable).to.be.false;
            expect(res.body.attribute.store_filter).to.be.false;
            expect(res.body.attribute.store_display_pdp).to.be.false;
            expect(res.body.attribute.store_display_plp).to.be.false;
            expect(res.body.attribute.store_search).to.be.false;
            expect(res.body.attribute.store_compare).to.be.false;
            expect(res.body.attribute.active).to.be.true;
            expect(res.body.attribute.mandatory).to.be.true;
            expect(res.body.attribute.min).to.be.eq(minVal);
            expect(res.body.attribute.max).to.be.null;
            expect(res.body.attribute.auto_sync_to_prod).to.be.true;
        });

        it('Create Attribute - Decimal Attribute is created sucessfully, Value for Max parameter is sent as negative decimal value', async function () {
            const maxVal = faker.datatype.number({ min: -100000, max: -1, precision: 0.01 });
            endpoint = creatAttribute(orgId);
            attributeNameCode = 'DecimalMaxNeg';
            payloadData = attributePayloads.createDecimalAttributePayload(attributeNameCode);
            payload = JSON.stringify({
                "name": payloadData.name,
                "code": payloadData.code,
                "type": payloadData.type,
                "max": maxVal
            });
            signed_headers = getSignedRequestHeaders("POST", baseUrl, endpoint, payload, {});
            headers = {
                'Content-type': 'application/json;charset=UTF-8',
                'x-ccl-param': signed_headers["headers"]["x-ccl-param"],
                'x-ccl-signature': signed_headers["headers"]["x-ccl-signature"],
                'Cookie': cookie
            };
            res = await request
                .post(endpoint)
                .set(headers)
                .send(payload);
            tempVarId = await res.body.attribute._id;
            FO.appendToFile(attributeDetailsFile, attributeNameCode, tempVarId);
            FO.appendToFile(attributeDetailsFile, "DecimalMaxNegValue", maxVal);
            expect(res.statusCode).to.be.eq(201);
            expect(res.body).to.be.jsonSchema(schemas.successNumDecAttributeSchema);
            expect(res.body.attribute.x_org_id).to.be.eq(orgId);
            expect(res.body.attribute.type).to.be.eq(payloadData.type);
            expect(res.body.attribute.name).to.be.eq(payloadData.name);
            expect(res.body.attribute.code).to.be.eq(payloadData.code);
            expect(res.body.attribute.vms_visible).to.be.false;
            expect(res.body.attribute.vms_editable).to.be.false;
            expect(res.body.attribute.store_filter).to.be.false;
            expect(res.body.attribute.store_display_pdp).to.be.false;
            expect(res.body.attribute.store_display_plp).to.be.false;
            expect(res.body.attribute.store_search).to.be.false;
            expect(res.body.attribute.store_compare).to.be.false;
            expect(res.body.attribute.active).to.be.true;
            expect(res.body.attribute.mandatory).to.be.true;
            expect(res.body.attribute.max).to.be.eq(maxVal);
            expect(res.body.attribute.min).to.be.null;
            expect(res.body.attribute.auto_sync_to_prod).to.be.true;
        });

        it('Create Attribute - Decimal Attribute is created sucessfully, Value for Max parameter is sent as positive decimal Value', async function () {
            const maxVal = faker.datatype.number({ min: 1, max: 100000, precision: 0.01 });
            endpoint = creatAttribute(orgId);
            attributeNameCode = 'DecimalMaxPos';
            payloadData = attributePayloads.createDecimalAttributePayload(attributeNameCode);
            payload = JSON.stringify({
                "name": payloadData.name,
                "code": payloadData.code,
                "type": payloadData.type,
                "max": maxVal
            });
            signed_headers = getSignedRequestHeaders("POST", baseUrl, endpoint, payload, {});
            headers = {
                'Content-type': 'application/json;charset=UTF-8',
                'x-ccl-param': signed_headers["headers"]["x-ccl-param"],
                'x-ccl-signature': signed_headers["headers"]["x-ccl-signature"],
                'Cookie': cookie
            };
            res = await request
                .post(endpoint)
                .set(headers)
                .send(payload);
            tempVarId = await res.body.attribute._id;
            FO.appendToFile(attributeDetailsFile, attributeNameCode, tempVarId);
            FO.appendToFile(attributeDetailsFile, "DecimalMaxPosValue", maxVal);
            expect(res.statusCode).to.be.eq(201);
            expect(res.body).to.be.jsonSchema(schemas.successNumDecAttributeSchema);
            expect(res.body.attribute.x_org_id).to.be.eq(orgId);
            expect(res.body.attribute.type).to.be.eq(payloadData.type);
            expect(res.body.attribute.name).to.be.eq(payloadData.name);
            expect(res.body.attribute.code).to.be.eq(payloadData.code);
            expect(res.body.attribute.vms_visible).to.be.false;
            expect(res.body.attribute.vms_editable).to.be.false;
            expect(res.body.attribute.store_filter).to.be.false;
            expect(res.body.attribute.store_display_pdp).to.be.false;
            expect(res.body.attribute.store_display_plp).to.be.false;
            expect(res.body.attribute.store_search).to.be.false;
            expect(res.body.attribute.store_compare).to.be.false;
            expect(res.body.attribute.active).to.be.true;
            expect(res.body.attribute.mandatory).to.be.true;
            expect(res.body.attribute.max).to.be.eq(maxVal);
            expect(res.body.attribute.min).to.be.null;
            expect(res.body.attribute.auto_sync_to_prod).to.be.true;
        });

        it('Create Attribute - Decimal Attribute is created sucessfully, Value for Min parameter is sent as integer value', async function () {
            const minVal = faker.datatype.number({ min: -100000, max: 100000 });
            endpoint = creatAttribute(orgId);
            attributeNameCode = 'DecimalMinInt';
            payloadData = attributePayloads.createDecimalAttributePayload(attributeNameCode);
            payload = JSON.stringify({
                "name": payloadData.name,
                "code": payloadData.code,
                "type": payloadData.type,
                "min": minVal
            });
            signed_headers = getSignedRequestHeaders("POST", baseUrl, endpoint, payload, {});
            headers = {
                'Content-type': 'application/json;charset=UTF-8',
                'x-ccl-param': signed_headers["headers"]["x-ccl-param"],
                'x-ccl-signature': signed_headers["headers"]["x-ccl-signature"],
                'Cookie': cookie
            };
            res = await request
                .post(endpoint)
                .set(headers)
                .send(payload);
            tempVarId = await res.body.attribute._id;
            FO.appendToFile(attributeDetailsFile, attributeNameCode, tempVarId);
            FO.appendToFile(attributeDetailsFile, "DecimalMinIntValue", minVal);
            expect(res.statusCode).to.be.eq(201);
            expect(res.body).to.be.jsonSchema(schemas.successNumDecAttributeSchema);
            expect(res.body.attribute.x_org_id).to.be.eq(orgId);
            expect(res.body.attribute.type).to.be.eq(payloadData.type);
            expect(res.body.attribute.name).to.be.eq(payloadData.name);
            expect(res.body.attribute.code).to.be.eq(payloadData.code);
            expect(res.body.attribute.vms_visible).to.be.false;
            expect(res.body.attribute.vms_editable).to.be.false;
            expect(res.body.attribute.store_filter).to.be.false;
            expect(res.body.attribute.store_display_pdp).to.be.false;
            expect(res.body.attribute.store_display_plp).to.be.false;
            expect(res.body.attribute.store_search).to.be.false;
            expect(res.body.attribute.store_compare).to.be.false;
            expect(res.body.attribute.active).to.be.true;
            expect(res.body.attribute.mandatory).to.be.true;
            expect(res.body.attribute.min).to.be.eq(minVal);
            expect(res.body.attribute.max).to.be.null;
            expect(res.body.attribute.auto_sync_to_prod).to.be.true;
        });

        it('Create Attribute - Decimal Attribute is created sucessfully, Value for Max parameter is sent as integer value', async function () {
            const maxVal = faker.datatype.number({ min: -100000, max: 100000 });
            endpoint = creatAttribute(orgId);
            attributeNameCode = 'DecimalMaxInt';
            payloadData = attributePayloads.createDecimalAttributePayload(attributeNameCode);
            payload = JSON.stringify({
                "name": payloadData.name,
                "code": payloadData.code,
                "type": payloadData.type,
                "max": maxVal
            });
            signed_headers = getSignedRequestHeaders("POST", baseUrl, endpoint, payload, {});
            headers = {
                'Content-type': 'application/json;charset=UTF-8',
                'x-ccl-param': signed_headers["headers"]["x-ccl-param"],
                'x-ccl-signature': signed_headers["headers"]["x-ccl-signature"],
                'Cookie': cookie
            };
            res = await request
                .post(endpoint)
                .set(headers)
                .send(payload);
            tempVarId = await res.body.attribute._id;
            FO.appendToFile(attributeDetailsFile, attributeNameCode, tempVarId);
            FO.appendToFile(attributeDetailsFile, "DecimalMaxIntValue", maxVal);
            expect(res.statusCode).to.be.eq(201);
            expect(res.body).to.be.jsonSchema(schemas.successNumDecAttributeSchema);
            expect(res.body.attribute.x_org_id).to.be.eq(orgId);
            expect(res.body.attribute.type).to.be.eq(payloadData.type);
            expect(res.body.attribute.name).to.be.eq(payloadData.name);
            expect(res.body.attribute.code).to.be.eq(payloadData.code);
            expect(res.body.attribute.vms_visible).to.be.false;
            expect(res.body.attribute.vms_editable).to.be.false;
            expect(res.body.attribute.store_filter).to.be.false;
            expect(res.body.attribute.store_display_pdp).to.be.false;
            expect(res.body.attribute.store_display_plp).to.be.false;
            expect(res.body.attribute.store_search).to.be.false;
            expect(res.body.attribute.store_compare).to.be.false;
            expect(res.body.attribute.active).to.be.true;
            expect(res.body.attribute.mandatory).to.be.true;
            expect(res.body.attribute.max).to.be.eq(maxVal);
            expect(res.body.attribute.min).to.be.null;
            expect(res.body.attribute.auto_sync_to_prod).to.be.true;
        });

        it('Create Attribute - call fails when Min value is sent higher than Max value for Decimal attribute type', async function () {
            endpoint = creatAttribute(orgId);
            attributeNameCode = 'invalid';
            payloadData = attributePayloads.createDecimalAttributePayload(attributeNameCode);
            payload = JSON.stringify({
                "name": payloadData.name,
                "code": payloadData.code,
                "type": payloadData.type,
                "max": payloadData.min,
                "min": payloadData.max
            });
            signed_headers = getSignedRequestHeaders("POST", baseUrl, endpoint, payload, {});
            headers = {
                'Content-type': 'application/json;charset=UTF-8',
                'x-ccl-param': signed_headers["headers"]["x-ccl-param"],
                'x-ccl-signature': signed_headers["headers"]["x-ccl-signature"],
                'Cookie': cookie
            };
            res = await request
                .post(endpoint)
                .set(headers)
                .send(payload);
            expect(res.statusCode).to.be.eq(400);
            expect(res.body.error).to.be.eq('Error: Max value cannot be less than min value');
        });

        it('Create Attribute - call fails when string value is sent for Min parameter for decimal attribute type', async function () {
            endpoint = creatAttribute(orgId);
            payloadData = attributePayloads.createDecimalAttributePayload(attributeNameCode);
            payload = JSON.stringify({
                "name": payloadData.name,
                "code": payloadData.code,
                "type": payloadData.type,
                "min": faker.random.alpha(5)
            });
            signed_headers = getSignedRequestHeaders("POST", baseUrl, endpoint, payload, {});
            headers = {
                'Content-type': 'application/json;charset=UTF-8',
                'x-ccl-param': signed_headers["headers"]["x-ccl-param"],
                'x-ccl-signature': signed_headers["headers"]["x-ccl-signature"],
                'Cookie': cookie
            };
            res = await request
                .post(endpoint)
                .set(headers)
                .send(payload);
            expect(res.statusCode).to.be.eq(400);
            expect(res.body.error).to.contain('ValidationError: min: Cast to Number');
        });

        it('Create Attribute - call fails when string value is sent for Max parameter for decimal attribute type', async function () {
            endpoint = creatAttribute(orgId);
            payloadData = attributePayloads.createDecimalAttributePayload(attributeNameCode);
            payload = JSON.stringify({
                "name": payloadData.name,
                "code": payloadData.code,
                "type": payloadData.type,
                "max": faker.random.alpha(5)
            });
            signed_headers = getSignedRequestHeaders("POST", baseUrl, endpoint, payload, {});
            headers = {
                'Content-type': 'application/json;charset=UTF-8',
                'x-ccl-param': signed_headers["headers"]["x-ccl-param"],
                'x-ccl-signature': signed_headers["headers"]["x-ccl-signature"],
                'Cookie': cookie
            };
            res = await request
                .post(endpoint)
                .set(headers)
                .send(payload);
            expect(res.statusCode).to.be.eq(400);
            expect(res.body.error).to.contain('ValidationError: max: Cast to Number');
        });

        it('Create Attribute - User is logged in, List Attribute is created sucessfully', async function () {
            endpoint = creatAttribute(orgId);
            attributeNameCode = 'ListRandom';
            payloadData = attributePayloads.createListAttributePayload(attributeNameCode);
            payload = JSON.stringify({
                "active": payloadData.active,
                "name": payloadData.name,
                "code": payloadData.code,
                "description": payloadData.description,
                "tags": payloadData.tags,
                "type": payloadData.type,
                "mandatory": payloadData.mandatory,
                "auto_sync_to_prod": payloadData.auto_sync_to_prod,
                "formatting": payloadData.formatting,
                "allowed_values": payloadData.allowed_values,
                "allow_multiple": payloadData.allow_multiple,
                "vms_visible": payloadData.vms_visible,
                "vms_editable": payloadData.vms_editable,
                "store_filter": payloadData.store_filter,
                "store_display_pdp": payloadData.store_display_pdp,
                "store_display_plp": payloadData.store_display_plp,
                "store_search": payloadData.store_search,
                "store_compare": payloadData.store_compare
            });
            signed_headers = getSignedRequestHeaders("POST", baseUrl, endpoint, payload, {});
            headers = {
                'Content-type': 'application/json;charset=UTF-8',
                'x-ccl-param': signed_headers["headers"]["x-ccl-param"],
                'x-ccl-signature': signed_headers["headers"]["x-ccl-signature"],
                'Cookie': cookie
            };
            res = await request
                .post(endpoint)
                .set(headers)
                .send(payload);
            tempVarId = await res.body.attribute._id;
            FO.appendToFile(attributeDetailsFile, attributeNameCode, tempVarId);
            expect(res.statusCode).to.be.eq(201);
            expect(res.body).to.be.jsonSchema(schemas.successListAttributeSchema);
            expect(res.body.attribute.formatting).to.be.eq(payloadData.formatting);
            expect(res.body.attribute.x_org_id).to.be.eq(orgId);
            expect(res.body.attribute.name).to.be.eq(payloadData.name);
            expect(res.body.attribute.code).to.be.eq(payloadData.code);
            expect(res.body.attribute.description).to.be.eq(payloadData.description);
            expect(res.body.attribute.tags.length).to.be.eq(payloadData.tags.length);
            expect(res.body.attribute.allowed_values.length).to.be.eq(payloadData.allowed_values.length);
            expect(res.body.attribute.allow_multiple).to.be.eq(payloadData.allow_multiple);
            expect(res.body.attribute.vms_visible).to.be.eq(payloadData.vms_visible);
            expect(res.body.attribute.vms_editable).to.be.eq(payloadData.vms_editable);
            expect(res.body.attribute.store_filter).to.be.eq(payloadData.store_filter);
            expect(res.body.attribute.store_display_pdp).to.be.eq(payloadData.store_display_pdp);
            expect(res.body.attribute.store_display_plp).to.be.eq(payloadData.store_display_plp);
            expect(res.body.attribute.store_search).to.be.eq(payloadData.store_search);
            expect(res.body.attribute.store_compare).to.be.eq(payloadData.store_compare);
            expect(res.body.attribute.active).to.be.eq(payloadData.active);
            expect(res.body.attribute.mandatory).to.be.eq(payloadData.mandatory);
            expect(res.body.attribute.auto_sync_to_prod).to.be.eq(payloadData.auto_sync_to_prod);
            expect(compareArrayData(res.body.attribute.tags, payloadData.tags)).to.be.true;
            expect(compareArrayData(res.body.attribute.allowed_values, payloadData.allowed_values)).to.be.true;
        });

        it('Create Attribute - List Attribute is created sucessfully when only Name, Code and Type values are sent ', async function () {
            endpoint = creatAttribute(orgId);
            attributeNameCode = 'ListDef';
            payloadData = attributePayloads.createListAttributePayload(attributeNameCode);
            payload = JSON.stringify({
                "name": payloadData.name,
                "code": payloadData.code,
                "type": payloadData.type
            });
            signed_headers = getSignedRequestHeaders("POST", baseUrl, endpoint, payload, {});
            headers = {
                'Content-type': 'application/json;charset=UTF-8',
                'x-ccl-param': signed_headers["headers"]["x-ccl-param"],
                'x-ccl-signature': signed_headers["headers"]["x-ccl-signature"],
                'Cookie': cookie
            };
            res = await request
                .post(endpoint)
                .set(headers)
                .send(payload);
            tempVarId = await res.body.attribute._id;
            FO.appendToFile(attributeDetailsFile, attributeNameCode, tempVarId);
            expect(res.statusCode).to.be.eq(201);
            expect(res.body).to.be.jsonSchema(schemas.successListAttributeSchema);
            expect(res.body.attribute.formatting).to.be.eq("None");
            expect(res.body.attribute.x_org_id).to.be.eq(orgId);
            expect(res.body.attribute.name).to.be.eq(payloadData.name);
            expect(res.body.attribute.code).to.be.eq(payloadData.code);
            expect(res.body.attribute.tags.length).to.be.eq(0);
            expect(res.body.attribute.allowed_values.length).to.be.eq(0);
            expect(res.body.attribute.allow_multiple).to.be.false;
            expect(res.body.attribute.vms_visible).to.be.false;
            expect(res.body.attribute.vms_editable).to.be.false;
            expect(res.body.attribute.store_filter).to.be.false;
            expect(res.body.attribute.store_display_pdp).to.be.false;
            expect(res.body.attribute.store_display_plp).to.be.false;
            expect(res.body.attribute.store_search).to.be.false;
            expect(res.body.attribute.store_compare).to.be.false;
            expect(res.body.attribute.active).to.be.true;
            expect(res.body.attribute.mandatory).to.be.true;
            expect(res.body.attribute.auto_sync_to_prod).to.be.true;
        });

        it('Create Attribute - List Attribute is created sucessfully, Formatting is send as Uppercase', async function () {
            endpoint = creatAttribute(orgId);
            attributeNameCode = 'ListUpper';
            payloadData = attributePayloads.createListAttributePayload(attributeNameCode);
            payload = JSON.stringify({
                "name": payloadData.name,
                "code": payloadData.code,
                "type": payloadData.type,
                "formatting": "Uppercase"
            });
            signed_headers = getSignedRequestHeaders("POST", baseUrl, endpoint, payload, {});
            headers = {
                'Content-type': 'application/json;charset=UTF-8',
                'x-ccl-param': signed_headers["headers"]["x-ccl-param"],
                'x-ccl-signature': signed_headers["headers"]["x-ccl-signature"],
                'Cookie': cookie
            };
            res = await request
                .post(endpoint)
                .set(headers)
                .send(payload);
            tempVarId = await res.body.attribute._id;
            FO.appendToFile(attributeDetailsFile, attributeNameCode, tempVarId);
            expect(res.statusCode).to.be.eq(201);
            expect(res.body).to.be.jsonSchema(schemas.successListAttributeSchema);
            expect(res.body.attribute.formatting).to.be.eq("Uppercase");
            expect(res.body.attribute.x_org_id).to.be.eq(orgId);
            expect(res.body.attribute.name).to.be.eq(payloadData.name);
            expect(res.body.attribute.code).to.be.eq(payloadData.code);
            expect(res.body.attribute.tags.length).to.be.eq(0);
            expect(res.body.attribute.allowed_values.length).to.be.eq(0);
            expect(res.body.attribute.allow_multiple).to.be.false;
            expect(res.body.attribute.vms_visible).to.be.false;
            expect(res.body.attribute.vms_editable).to.be.false;
            expect(res.body.attribute.store_filter).to.be.false;
            expect(res.body.attribute.store_display_pdp).to.be.false;
            expect(res.body.attribute.store_display_plp).to.be.false;
            expect(res.body.attribute.store_search).to.be.false;
            expect(res.body.attribute.store_compare).to.be.false;
            expect(res.body.attribute.active).to.be.true;
            expect(res.body.attribute.mandatory).to.be.true;
            expect(res.body.attribute.auto_sync_to_prod).to.be.true;
        });

        it('Create Attribute - List Attribute is created sucessfully, Formatting is send as Lowercase', async function () {
            endpoint = creatAttribute(orgId);
            attributeNameCode = 'ListLower';
            payloadData = attributePayloads.createListAttributePayload(attributeNameCode);
            payload = JSON.stringify({
                "name": payloadData.name,
                "code": payloadData.code,
                "type": payloadData.type,
                "formatting": "Lowercase"
            });
            signed_headers = getSignedRequestHeaders("POST", baseUrl, endpoint, payload, {});
            headers = {
                'Content-type': 'application/json;charset=UTF-8',
                'x-ccl-param': signed_headers["headers"]["x-ccl-param"],
                'x-ccl-signature': signed_headers["headers"]["x-ccl-signature"],
                'Cookie': cookie
            };
            res = await request
                .post(endpoint)
                .set(headers)
                .send(payload);
            tempVarId = await res.body.attribute._id;
            FO.appendToFile(attributeDetailsFile, attributeNameCode, tempVarId);
            expect(res.statusCode).to.be.eq(201);
            expect(res.body).to.be.jsonSchema(schemas.successListAttributeSchema);
            expect(res.body.attribute.formatting).to.be.eq("Lowercase");
            expect(res.body.attribute.x_org_id).to.be.eq(orgId);
            expect(res.body.attribute.name).to.be.eq(payloadData.name);
            expect(res.body.attribute.code).to.be.eq(payloadData.code);
            expect(res.body.attribute.tags.length).to.be.eq(0);
            expect(res.body.attribute.allowed_values.length).to.be.eq(0);
            expect(res.body.attribute.allow_multiple).to.be.false;
            expect(res.body.attribute.vms_visible).to.be.false;
            expect(res.body.attribute.vms_editable).to.be.false;
            expect(res.body.attribute.store_filter).to.be.false;
            expect(res.body.attribute.store_display_pdp).to.be.false;
            expect(res.body.attribute.store_display_plp).to.be.false;
            expect(res.body.attribute.store_search).to.be.false;
            expect(res.body.attribute.store_compare).to.be.false;
            expect(res.body.attribute.active).to.be.true;
            expect(res.body.attribute.mandatory).to.be.true;
            expect(res.body.attribute.auto_sync_to_prod).to.be.true;
        });

        it('Create Attribute - List Attribute is created sucessfully, Formatting is send as None', async function () {
            endpoint = creatAttribute(orgId);
            attributeNameCode = 'ListNone';
            payloadData = attributePayloads.createListAttributePayload(attributeNameCode);
            payload = JSON.stringify({
                "name": payloadData.name,
                "code": payloadData.code,
                "type": payloadData.type,
                "formatting": "None"
            });
            signed_headers = getSignedRequestHeaders("POST", baseUrl, endpoint, payload, {});
            headers = {
                'Content-type': 'application/json;charset=UTF-8',
                'x-ccl-param': signed_headers["headers"]["x-ccl-param"],
                'x-ccl-signature': signed_headers["headers"]["x-ccl-signature"],
                'Cookie': cookie
            };
            res = await request
                .post(endpoint)
                .set(headers)
                .send(payload);
            tempVarId = await res.body.attribute._id;
            FO.appendToFile(attributeDetailsFile, attributeNameCode, tempVarId);
            expect(res.statusCode).to.be.eq(201);
            expect(res.body).to.be.jsonSchema(schemas.successListAttributeSchema);
            expect(res.body.attribute.formatting).to.be.eq("None");
            expect(res.body.attribute.x_org_id).to.be.eq(orgId);
            expect(res.body.attribute.name).to.be.eq(payloadData.name);
            expect(res.body.attribute.code).to.be.eq(payloadData.code);
            expect(res.body.attribute.tags.length).to.be.eq(0);
            expect(res.body.attribute.allowed_values.length).to.be.eq(0);
            expect(res.body.attribute.allow_multiple).to.be.false;
            expect(res.body.attribute.vms_visible).to.be.false;
            expect(res.body.attribute.vms_editable).to.be.false;
            expect(res.body.attribute.store_filter).to.be.false;
            expect(res.body.attribute.store_display_pdp).to.be.false;
            expect(res.body.attribute.store_display_plp).to.be.false;
            expect(res.body.attribute.store_search).to.be.false;
            expect(res.body.attribute.store_compare).to.be.false;
            expect(res.body.attribute.active).to.be.true;
            expect(res.body.attribute.mandatory).to.be.true;
            expect(res.body.attribute.auto_sync_to_prod).to.be.true;
        });

        it('Create Attribute - List Attribute is created sucessfully, allow_multiple is send as true', async function () {
            endpoint = creatAttribute(orgId);
            attributeNameCode = 'ListAMTrue';
            payloadData = attributePayloads.createListAttributePayload(attributeNameCode);
            payload = JSON.stringify({
                "name": payloadData.name,
                "code": payloadData.code,
                "type": payloadData.type,
                "allow_multiple": true
            });
            signed_headers = getSignedRequestHeaders("POST", baseUrl, endpoint, payload, {});
            headers = {
                'Content-type': 'application/json;charset=UTF-8',
                'x-ccl-param': signed_headers["headers"]["x-ccl-param"],
                'x-ccl-signature': signed_headers["headers"]["x-ccl-signature"],
                'Cookie': cookie
            };
            res = await request
                .post(endpoint)
                .set(headers)
                .send(payload);
            tempVarId = await res.body.attribute._id;
            FO.appendToFile(attributeDetailsFile, attributeNameCode, tempVarId);
            expect(res.statusCode).to.be.eq(201);
            expect(res.body).to.be.jsonSchema(schemas.successListAttributeSchema);
            expect(res.body.attribute.formatting).to.be.eq("None");
            expect(res.body.attribute.x_org_id).to.be.eq(orgId);
            expect(res.body.attribute.name).to.be.eq(payloadData.name);
            expect(res.body.attribute.code).to.be.eq(payloadData.code);
            expect(res.body.attribute.tags.length).to.be.eq(0);
            expect(res.body.attribute.allowed_values.length).to.be.eq(0);
            expect(res.body.attribute.allow_multiple).to.be.true;
            expect(res.body.attribute.vms_visible).to.be.false;
            expect(res.body.attribute.vms_editable).to.be.false;
            expect(res.body.attribute.store_filter).to.be.false;
            expect(res.body.attribute.store_display_pdp).to.be.false;
            expect(res.body.attribute.store_display_plp).to.be.false;
            expect(res.body.attribute.store_search).to.be.false;
            expect(res.body.attribute.store_compare).to.be.false;
            expect(res.body.attribute.active).to.be.true;
            expect(res.body.attribute.mandatory).to.be.true;
            expect(res.body.attribute.auto_sync_to_prod).to.be.true;
        });

        it('Create Attribute - List Attribute is created sucessfully, allow_multiple is send as false', async function () {
            endpoint = creatAttribute(orgId);
            attributeNameCode = 'ListAMFalse';
            payloadData = attributePayloads.createListAttributePayload(attributeNameCode);
            payload = JSON.stringify({
                "name": payloadData.name,
                "code": payloadData.code,
                "type": payloadData.type,
                "allow_multiple": false
            });
            signed_headers = getSignedRequestHeaders("POST", baseUrl, endpoint, payload, {});
            headers = {
                'Content-type': 'application/json;charset=UTF-8',
                'x-ccl-param': signed_headers["headers"]["x-ccl-param"],
                'x-ccl-signature': signed_headers["headers"]["x-ccl-signature"],
                'Cookie': cookie
            };
            res = await request
                .post(endpoint)
                .set(headers)
                .send(payload);
            tempVarId = await res.body.attribute._id;
            FO.appendToFile(attributeDetailsFile, attributeNameCode, tempVarId);
            expect(res.statusCode).to.be.eq(201);
            expect(res.body).to.be.jsonSchema(schemas.successListAttributeSchema);
            expect(res.body.attribute.formatting).to.be.eq("None");
            expect(res.body.attribute.x_org_id).to.be.eq(orgId);
            expect(res.body.attribute.name).to.be.eq(payloadData.name);
            expect(res.body.attribute.code).to.be.eq(payloadData.code);
            expect(res.body.attribute.tags.length).to.be.eq(0);
            expect(res.body.attribute.allowed_values.length).to.be.eq(0);
            expect(res.body.attribute.allow_multiple).to.be.false;
            expect(res.body.attribute.vms_visible).to.be.false;
            expect(res.body.attribute.vms_editable).to.be.false;
            expect(res.body.attribute.store_filter).to.be.false;
            expect(res.body.attribute.store_display_pdp).to.be.false;
            expect(res.body.attribute.store_display_plp).to.be.false;
            expect(res.body.attribute.store_search).to.be.false;
            expect(res.body.attribute.store_compare).to.be.false;
            expect(res.body.attribute.active).to.be.true;
            expect(res.body.attribute.mandatory).to.be.true;
            expect(res.body.attribute.auto_sync_to_prod).to.be.true;
        });

        it('Create Attribute - call fails when allow_multiple is send as random string for List Attribute', async function () {
            endpoint = creatAttribute(orgId);
            attributeNameCode = 'invalid';
            payloadData = attributePayloads.createListAttributePayload(attributeNameCode);
            payload = JSON.stringify({
                "name": payloadData.name,
                "code": payloadData.code,
                "type": payloadData.type,
                "allow_multiple": faker.random.alphaNumeric(10)
            });
            signed_headers = getSignedRequestHeaders("POST", baseUrl, endpoint, payload, {});
            headers = {
                'Content-type': 'application/json;charset=UTF-8',
                'x-ccl-param': signed_headers["headers"]["x-ccl-param"],
                'x-ccl-signature': signed_headers["headers"]["x-ccl-signature"],
                'Cookie': cookie
            };
            res = await request
                .post(endpoint)
                .set(headers)
                .send(payload);
            expect(res.statusCode).to.be.eq(400);
            expect(res.body.error).to.contain(`ValidationError: allow_multiple: Cast to Boolean failed`)
        });

        it('Create Attribute - call fails when random string is sent in Formatting for List type attribute', async function () {
            endpoint = creatAttribute(orgId);
            const randomString = faker.random.alphaNumeric(10);
            payloadData = attributePayloads.createListAttributePayload(attributeNameCode);
            payload = JSON.stringify({
                "name": payloadData.name,
                "code": payloadData.code,
                "type": payloadData.type,
                "formatting": randomString
            });
            signed_headers = getSignedRequestHeaders("POST", baseUrl, endpoint, payload, {});
            headers = {
                'Content-type': 'application/json;charset=UTF-8',
                'x-ccl-param': signed_headers["headers"]["x-ccl-param"],
                'x-ccl-signature': signed_headers["headers"]["x-ccl-signature"],
                'Cookie': cookie
            };
            res = await request
                .post(endpoint)
                .set(headers)
                .send(payload);
            expect(res.statusCode).to.be.eq(400);
            expect(res.body.error).to.be.eq(`ValidationError: formatting: \`${randomString}\` is not a valid enum value for path \`formatting\`.`);
        });

        it('Create Attribute - User is logged in, File Attribute is created sucessfully', async function () {
            endpoint = creatAttribute(orgId);
            attributeNameCode = 'FileRandom';
            payloadData = attributePayloads.createFileAttributePayload(attributeNameCode);
            payload = JSON.stringify({
                "active": payloadData.active,
                "name": payloadData.name,
                "code": payloadData.code,
                "description": payloadData.description,
                "tags": payloadData.tags,
                "type": payloadData.type,
                "mandatory": payloadData.mandatory,
                "auto_sync_to_prod": payloadData.auto_sync_to_prod,
                "allowed_extensions": payloadData.allowed_extensions,
                "max_size": payloadData.max_size,
                "allow_multiple": payloadData.allow_multiple,
                "vms_visible": payloadData.vms_visible,
                "vms_editable": payloadData.vms_editable,
                "store_filter": payloadData.store_filter,
                "store_display_pdp": payloadData.store_display_pdp,
                "store_display_plp": payloadData.store_display_plp,
                "store_search": payloadData.store_search,
                "store_compare": payloadData.store_compare
            });
            signed_headers = getSignedRequestHeaders("POST", baseUrl, endpoint, payload, {});
            headers = {
                'Content-type': 'application/json;charset=UTF-8',
                'x-ccl-param': signed_headers["headers"]["x-ccl-param"],
                'x-ccl-signature': signed_headers["headers"]["x-ccl-signature"],
                'Cookie': cookie
            };
            res = await request
                .post(endpoint)
                .set(headers)
                .send(payload);
            tempVarId = await res.body.attribute._id;
            FO.appendToFile(attributeDetailsFile, attributeNameCode, tempVarId);
            expect(res.statusCode).to.be.eq(201);
            expect(res.body).to.be.jsonSchema(schemas.successFileMedAttributeSchema);
            expect(res.body.attribute.x_org_id).to.be.eq(orgId);
            expect(res.body.attribute.name).to.be.eq(payloadData.name);
            expect(res.body.attribute.code).to.be.eq(payloadData.code);
            expect(res.body.attribute.description).to.be.eq(payloadData.description);
            expect(res.body.attribute.tags.length).to.be.eq(payloadData.tags.length);
            expect(res.body.attribute.allowed_extensions.length).to.be.eq(payloadData.allowed_extensions.length);
            expect(res.body.attribute.allow_multiple).to.be.eq(payloadData.allow_multiple);
            expect(res.body.attribute.vms_visible).to.be.eq(payloadData.vms_visible);
            expect(res.body.attribute.vms_editable).to.be.eq(payloadData.vms_editable);
            expect(res.body.attribute.store_filter).to.be.eq(payloadData.store_filter);
            expect(res.body.attribute.store_display_pdp).to.be.eq(payloadData.store_display_pdp);
            expect(res.body.attribute.store_display_plp).to.be.eq(payloadData.store_display_plp);
            expect(res.body.attribute.store_search).to.be.eq(payloadData.store_search);
            expect(res.body.attribute.store_compare).to.be.eq(payloadData.store_compare);
            expect(res.body.attribute.active).to.be.eq(payloadData.active);
            expect(res.body.attribute.mandatory).to.be.eq(payloadData.mandatory);
            expect(res.body.attribute.auto_sync_to_prod).to.be.eq(payloadData.auto_sync_to_prod);
            expect(compareArrayData(res.body.attribute.tags, payloadData.tags)).to.be.true;
            expect(compareArrayData(res.body.attribute.allowed_extensions, payloadData.allowed_extensions)).to.be.true;
        });

        it('File Attribute is created sucessfully, only Name, Code and Type values are sent', async function () {
            endpoint = creatAttribute(orgId);
            attributeNameCode = 'FileDef';
            payloadData = attributePayloads.createFileAttributePayload(attributeNameCode);
            payload = JSON.stringify({
                "name": payloadData.name,
                "code": payloadData.code,
                "type": payloadData.type
            });
            signed_headers = getSignedRequestHeaders("POST", baseUrl, endpoint, payload, {});
            headers = {
                'Content-type': 'application/json;charset=UTF-8',
                'x-ccl-param': signed_headers["headers"]["x-ccl-param"],
                'x-ccl-signature': signed_headers["headers"]["x-ccl-signature"],
                'Cookie': cookie
            };
            res = await request
                .post(endpoint)
                .set(headers)
                .send(payload);
            tempVarId = await res.body.attribute._id;
            FO.appendToFile(attributeDetailsFile, attributeNameCode, tempVarId);
            expect(res.statusCode).to.be.eq(201);
            expect(res.body).to.be.jsonSchema(schemas.successFileMedAttributeSchema);
            expect(res.body.attribute.x_org_id).to.be.eq(orgId);
            expect(res.body.attribute.type).to.be.eq(payloadData.type);
            expect(res.body.attribute.name).to.be.eq(payloadData.name);
            expect(res.body.attribute.code).to.be.eq(payloadData.code);
            expect(res.body.attribute.allow_multiple).to.be.false;
            expect(res.body.attribute.vms_visible).to.be.false;
            expect(res.body.attribute.vms_editable).to.be.false;
            expect(res.body.attribute.store_filter).to.be.false;
            expect(res.body.attribute.store_display_pdp).to.be.false;
            expect(res.body.attribute.store_display_plp).to.be.false;
            expect(res.body.attribute.store_search).to.be.false;
            expect(res.body.attribute.store_compare).to.be.false;
            expect(res.body.attribute.active).to.be.true;
            expect(res.body.attribute.mandatory).to.be.true;
            expect(res.body.attribute.auto_sync_to_prod).to.be.true;
        });

        it('File Attribute is created sucessfully, Allow Multiple is sent as true', async function () {
            endpoint = creatAttribute(orgId);
            attributeNameCode = 'FileAMTrue';
            payloadData = attributePayloads.createFileAttributePayload(attributeNameCode);
            payload = JSON.stringify({
                "name": payloadData.name,
                "code": payloadData.code,
                "type": payloadData.type,
                "allow_multiple": true
            });
            signed_headers = getSignedRequestHeaders("POST", baseUrl, endpoint, payload, {});
            headers = {
                'Content-type': 'application/json;charset=UTF-8',
                'x-ccl-param': signed_headers["headers"]["x-ccl-param"],
                'x-ccl-signature': signed_headers["headers"]["x-ccl-signature"],
                'Cookie': cookie
            };
            res = await request
                .post(endpoint)
                .set(headers)
                .send(payload);
            tempVarId = await res.body.attribute._id;
            FO.appendToFile(attributeDetailsFile, attributeNameCode, tempVarId);
            expect(res.statusCode).to.be.eq(201);
            expect(res.body).to.be.jsonSchema(schemas.successFileMedAttributeSchema);
            expect(res.body.attribute.x_org_id).to.be.eq(orgId);
            expect(res.body.attribute.type).to.be.eq(payloadData.type);
            expect(res.body.attribute.name).to.be.eq(payloadData.name);
            expect(res.body.attribute.code).to.be.eq(payloadData.code);
            expect(res.body.attribute.allow_multiple).to.be.true;
            expect(res.body.attribute.vms_visible).to.be.false;
            expect(res.body.attribute.vms_editable).to.be.false;
            expect(res.body.attribute.store_filter).to.be.false;
            expect(res.body.attribute.store_display_pdp).to.be.false;
            expect(res.body.attribute.store_display_plp).to.be.false;
            expect(res.body.attribute.store_search).to.be.false;
            expect(res.body.attribute.store_compare).to.be.false;
            expect(res.body.attribute.active).to.be.true;
            expect(res.body.attribute.mandatory).to.be.true;
            expect(res.body.attribute.auto_sync_to_prod).to.be.true;
        });

        it('File Attribute is created sucessfully, Allow Multiple is sent as false', async function () {
            endpoint = creatAttribute(orgId);
            attributeNameCode = 'FileAMFalse';
            payloadData = attributePayloads.createFileAttributePayload(attributeNameCode);
            payload = JSON.stringify({
                "name": payloadData.name,
                "code": payloadData.code,
                "type": payloadData.type,
                "allow_multiple": false
            });
            signed_headers = getSignedRequestHeaders("POST", baseUrl, endpoint, payload, {});
            headers = {
                'Content-type': 'application/json;charset=UTF-8',
                'x-ccl-param': signed_headers["headers"]["x-ccl-param"],
                'x-ccl-signature': signed_headers["headers"]["x-ccl-signature"],
                'Cookie': cookie
            };
            res = await request
                .post(endpoint)
                .set(headers)
                .send(payload);
            tempVarId = await res.body.attribute._id;
            FO.appendToFile(attributeDetailsFile, attributeNameCode, tempVarId);
            expect(res.statusCode).to.be.eq(201);
            expect(res.body).to.be.jsonSchema(schemas.successFileMedAttributeSchema);
            expect(res.body.attribute.x_org_id).to.be.eq(orgId);
            expect(res.body.attribute.type).to.be.eq(payloadData.type);
            expect(res.body.attribute.name).to.be.eq(payloadData.name);
            expect(res.body.attribute.code).to.be.eq(payloadData.code);
            expect(res.body.attribute.allow_multiple).to.be.false;
            expect(res.body.attribute.vms_visible).to.be.false;
            expect(res.body.attribute.vms_editable).to.be.false;
            expect(res.body.attribute.store_filter).to.be.false;
            expect(res.body.attribute.store_display_pdp).to.be.false;
            expect(res.body.attribute.store_display_plp).to.be.false;
            expect(res.body.attribute.store_search).to.be.false;
            expect(res.body.attribute.store_compare).to.be.false;
            expect(res.body.attribute.active).to.be.true;
            expect(res.body.attribute.mandatory).to.be.true;
            expect(res.body.attribute.auto_sync_to_prod).to.be.true;
        });

        it('File Attribute is created sucessfully, Max Size parameter is sent', async function () {
            endpoint = creatAttribute(orgId);
            attributeNameCode = 'FileMSize';
            payloadData = attributePayloads.createFileAttributePayload(attributeNameCode);
            payload = JSON.stringify({
                "name": payloadData.name,
                "code": payloadData.code,
                "type": payloadData.type,
                "max_size": payloadData.max_size
            });
            signed_headers = getSignedRequestHeaders("POST", baseUrl, endpoint, payload, {});
            headers = {
                'Content-type': 'application/json;charset=UTF-8',
                'x-ccl-param': signed_headers["headers"]["x-ccl-param"],
                'x-ccl-signature': signed_headers["headers"]["x-ccl-signature"],
                'Cookie': cookie
            };
            res = await request
                .post(endpoint)
                .set(headers)
                .send(payload);
            tempVarId = await res.body.attribute._id;
            FO.appendToFile(attributeDetailsFile, attributeNameCode, tempVarId);
            expect(res.statusCode).to.be.eq(201);
            expect(res.body).to.be.jsonSchema(schemas.successFileMedAttributeSchema);
            expect(res.body.attribute.x_org_id).to.be.eq(orgId);
            expect(res.body.attribute.type).to.be.eq(payloadData.type);
            expect(res.body.attribute.name).to.be.eq(payloadData.name);
            expect(res.body.attribute.code).to.be.eq(payloadData.code);
            expect(res.body.attribute.max_size).to.be.eq(payloadData.max_size);
            expect(res.body.attribute.allow_multiple).to.be.false;
            expect(res.body.attribute.vms_visible).to.be.false;
            expect(res.body.attribute.vms_editable).to.be.false;
            expect(res.body.attribute.store_filter).to.be.false;
            expect(res.body.attribute.store_display_pdp).to.be.false;
            expect(res.body.attribute.store_display_plp).to.be.false;
            expect(res.body.attribute.store_search).to.be.false;
            expect(res.body.attribute.store_compare).to.be.false;
            expect(res.body.attribute.active).to.be.true;
            expect(res.body.attribute.mandatory).to.be.true;
            expect(res.body.attribute.auto_sync_to_prod).to.be.true;
        });

        it('Create Attribute fails, Allow Multiple is sent as random string for File type', async function () {
            endpoint = creatAttribute(orgId);
            attributeNameCode = 'invalid'
            payloadData = attributePayloads.createFileAttributePayload(attributeNameCode);
            payload = JSON.stringify({
                "name": payloadData.name,
                "code": payloadData.code,
                "type": payloadData.type,
                "allow_multiple": faker.random.alpha(10)
            });
            signed_headers = getSignedRequestHeaders("POST", baseUrl, endpoint, payload, {});
            headers = {
                'Content-type': 'application/json;charset=UTF-8',
                'x-ccl-param': signed_headers["headers"]["x-ccl-param"],
                'x-ccl-signature': signed_headers["headers"]["x-ccl-signature"],
                'Cookie': cookie
            };
            res = await request
                .post(endpoint)
                .set(headers)
                .send(payload);
            expect(res.statusCode).to.be.eq(400);
            expect(res.body.error).to.contain('ValidationError: allow_multiple:');
        });

        it('Create Attribute fails, Max Size is sent as negative value for File type', async function () {
            const size = faker.datatype.number({ min: -200, max: -1 }),
                endpoint = creatAttribute(orgId);
            payloadData = attributePayloads.createFileAttributePayload(attributeNameCode);
            payload = JSON.stringify({
                "name": payloadData.name,
                "code": payloadData.code,
                "type": payloadData.type,
                "max_size": size
            });
            signed_headers = getSignedRequestHeaders("POST", baseUrl, endpoint, payload, {});
            headers = {
                'Content-type': 'application/json;charset=UTF-8',
                'x-ccl-param': signed_headers["headers"]["x-ccl-param"],
                'x-ccl-signature': signed_headers["headers"]["x-ccl-signature"],
                'Cookie': cookie
            };
            res = await request
                .post(endpoint)
                .set(headers)
                .send(payload);
            expect(res.statusCode).to.be.eq(400);
            expect(res.body.error).to.be.eq(`ValidationError: max_size: ${size} is not a positive integer`);
        });

        it('Create Attribute fails, Max Size is sent as 0 for File tyoe', async function () {
            endpoint = creatAttribute(orgId);
            payloadData = attributePayloads.createFileAttributePayload(attributeNameCode);
            payload = JSON.stringify({
                "name": payloadData.name,
                "code": payloadData.code,
                "type": payloadData.type,
                "max_size": 0
            });
            signed_headers = getSignedRequestHeaders("POST", baseUrl, endpoint, payload, {});
            headers = {
                'Content-type': 'application/json;charset=UTF-8',
                'x-ccl-param': signed_headers["headers"]["x-ccl-param"],
                'x-ccl-signature': signed_headers["headers"]["x-ccl-signature"],
                'Cookie': cookie
            };
            res = await request
                .post(endpoint)
                .set(headers)
                .send(payload);
            expect(res.statusCode).to.be.eq(400);
            expect(res.body.error).to.be.eq(`ValidationError: max_size: 0 is not a positive integer`);
        });

        it('Create Attribute fails, Max Size is sent as a decimal value for File type', async function () {
            endpoint = creatAttribute(orgId);
            payloadData = attributePayloads.createFileAttributePayload(attributeNameCode);
            const mSize = faker.datatype.number({ min: 1, max: 10000, precision: 0.01 });
            payload = JSON.stringify({
                "name": payloadData.name,
                "code": payloadData.code,
                "type": payloadData.type,
                "max_size": mSize
            });
            signed_headers = getSignedRequestHeaders("POST", baseUrl, endpoint, payload, {});
            headers = {
                'Content-type': 'application/json;charset=UTF-8',
                'x-ccl-param': signed_headers["headers"]["x-ccl-param"],
                'x-ccl-signature': signed_headers["headers"]["x-ccl-signature"],
                'Cookie': cookie
            };
            res = await request
                .post(endpoint)
                .set(headers)
                .send(payload);
            expect(res.statusCode).to.be.eq(400);
            expect(res.body.error).to.be.eq(`ValidationError: max_size: ${mSize} is not a positive integer`);
        });

        it('Create Attribute fails, Max Size is sent as random string for File type', async function () {
            endpoint = creatAttribute(orgId);
            payloadData = attributePayloads.createFileAttributePayload(attributeNameCode);
            payload = JSON.stringify({
                "name": payloadData.name,
                "code": payloadData.code,
                "type": payloadData.type,
                "max_size": faker.random.alpha(10)
            });
            signed_headers = getSignedRequestHeaders("POST", baseUrl, endpoint, payload, {});
            headers = {
                'Content-type': 'application/json;charset=UTF-8',
                'x-ccl-param': signed_headers["headers"]["x-ccl-param"],
                'x-ccl-signature': signed_headers["headers"]["x-ccl-signature"],
                'Cookie': cookie
            };
            res = await request
                .post(endpoint)
                .set(headers)
                .send(payload);
            expect(res.statusCode).to.be.eq(400);
            expect(res.body.error).to.contain('ValidationError: max_size:');
        });

        it('Create Attribute - User is logged in, Media Attribute is created sucessfully', async function () {
            endpoint = creatAttribute(orgId);
            attributeNameCode = 'MediaRandom';
            payloadData = attributePayloads.createMediaAttributePayload(attributeNameCode);
            payload = JSON.stringify({
                "active": payloadData.active,
                "name": payloadData.name,
                "code": payloadData.code,
                "description": payloadData.description,
                "tags": payloadData.tags,
                "type": payloadData.type,
                "mandatory": payloadData.mandatory,
                "media_type": payloadData.media_type,
                "allowed_extensions": payloadData.allowed_extensions,
                "max_size": payloadData.max_size,
                "auto_sync_to_prod": payloadData.auto_sync_to_prod,
                "allow_multiple": payloadData.allow_multiple,
                "vms_visible": payloadData.vms_visible,
                "vms_editable": payloadData.vms_editable,
                "store_filter": payloadData.store_filter,
                "store_display_pdp": payloadData.store_display_pdp,
                "store_display_plp": payloadData.store_display_plp,
                "store_search": payloadData.store_search,
                "store_compare": payloadData.store_compare
            });
            signed_headers = getSignedRequestHeaders("POST", baseUrl, endpoint, payload, {});
            headers = {
                'Content-type': 'application/json;charset=UTF-8',
                'x-ccl-param': signed_headers["headers"]["x-ccl-param"],
                'x-ccl-signature': signed_headers["headers"]["x-ccl-signature"],
                'Cookie': cookie
            };
            res = await request
                .post(endpoint)
                .set(headers)
                .send(payload);
            tempVarId = await res.body.attribute._id;
            FO.appendToFile(attributeDetailsFile, attributeNameCode, tempVarId);
            expect(res.statusCode).to.be.eq(201);
            expect(res.body).to.be.jsonSchema(schemas.successFileMedAttributeSchema);
            expect(res.body.attribute.x_org_id).to.be.eq(orgId);
            expect(res.body.attribute.name).to.be.eq(payloadData.name);
            expect(res.body.attribute.code).to.be.eq(payloadData.code);
            expect(res.body.attribute.max_size).to.be.eq(payloadData.max_size);
            expect(res.body.attribute.media_type).to.be.eq(payloadData.media_type);
            expect(res.body.attribute.description).to.be.eq(payloadData.description);
            expect(res.body.attribute.tags.length).to.be.eq(payloadData.tags.length);
            expect(res.body.attribute.allow_multiple).to.be.eq(payloadData.allow_multiple);
            expect(res.body.attribute.vms_visible).to.be.eq(payloadData.vms_visible);
            expect(res.body.attribute.vms_editable).to.be.eq(payloadData.vms_editable);
            expect(res.body.attribute.store_filter).to.be.eq(payloadData.store_filter);
            expect(res.body.attribute.store_display_pdp).to.be.eq(payloadData.store_display_pdp);
            expect(res.body.attribute.store_display_plp).to.be.eq(payloadData.store_display_plp);
            expect(res.body.attribute.store_search).to.be.eq(payloadData.store_search);
            expect(res.body.attribute.store_compare).to.be.eq(payloadData.store_compare);
            expect(res.body.attribute.active).to.be.eq(payloadData.active);
            expect(res.body.attribute.mandatory).to.be.eq(payloadData.mandatory);
            expect(res.body.attribute.auto_sync_to_prod).to.be.eq(payloadData.auto_sync_to_prod);
            expect(res.body.attribute.allowed_extensions.length).to.be.eq(payloadData.allowed_extensions.length);
            expect(compareArrayData(res.body.attribute.tags, payloadData.tags)).to.be.true;
            expect(compareArrayData(res.body.attribute.allowed_extensions, payloadData.allowed_extensions)).to.be.true;
        });

        it('Media Attribute is created sucessfully, only Name, Code and Type values are sent', async function () {
            endpoint = creatAttribute(orgId);
            attributeNameCode = 'MediaDef';
            payloadData = attributePayloads.createMediaAttributePayload(attributeNameCode);
            payload = JSON.stringify({
                "name": payloadData.name,
                "code": payloadData.code,
                "type": payloadData.type
            });
            signed_headers = getSignedRequestHeaders("POST", baseUrl, endpoint, payload, {});
            headers = {
                'Content-type': 'application/json;charset=UTF-8',
                'x-ccl-param': signed_headers["headers"]["x-ccl-param"],
                'x-ccl-signature': signed_headers["headers"]["x-ccl-signature"],
                'Cookie': cookie
            };
            res = await request
                .post(endpoint)
                .set(headers)
                .send(payload);
            tempVarId = await res.body.attribute._id;
            FO.appendToFile(attributeDetailsFile, attributeNameCode, tempVarId);
            expect(res.statusCode).to.be.eq(201);
            expect(res.body).to.be.jsonSchema(schemas.successFileMedAttributeSchema);
            expect(res.body.attribute.x_org_id).to.be.eq(orgId);
            expect(res.body.attribute.type).to.be.eq(payloadData.type);
            expect(res.body.attribute.name).to.be.eq(payloadData.name);
            expect(res.body.attribute.code).to.be.eq(payloadData.code);
            expect(res.body.attribute.allow_multiple).to.be.false;
            expect(res.body.attribute.vms_visible).to.be.false;
            expect(res.body.attribute.vms_editable).to.be.false;
            expect(res.body.attribute.store_filter).to.be.false;
            expect(res.body.attribute.store_display_pdp).to.be.false;
            expect(res.body.attribute.store_display_plp).to.be.false;
            expect(res.body.attribute.store_search).to.be.false;
            expect(res.body.attribute.store_compare).to.be.false;
            expect(res.body.attribute.active).to.be.true;
            expect(res.body.attribute.mandatory).to.be.true;
            expect(res.body.attribute.auto_sync_to_prod).to.be.true;
        });

        it('Media Attribute is created sucessfully, Allow Multiple is sent as true', async function () {
            endpoint = creatAttribute(orgId);
            attributeNameCode = 'MediaAMTrue';
            payloadData = attributePayloads.createMediaAttributePayload(attributeNameCode);
            payload = JSON.stringify({
                "name": payloadData.name,
                "code": payloadData.code,
                "type": payloadData.type,
                "allow_multiple": true
            });
            signed_headers = getSignedRequestHeaders("POST", baseUrl, endpoint, payload, {});
            headers = {
                'Content-type': 'application/json;charset=UTF-8',
                'x-ccl-param': signed_headers["headers"]["x-ccl-param"],
                'x-ccl-signature': signed_headers["headers"]["x-ccl-signature"],
                'Cookie': cookie
            };
            res = await request
                .post(endpoint)
                .set(headers)
                .send(payload);
            tempVarId = await res.body.attribute._id;
            FO.appendToFile(attributeDetailsFile, attributeNameCode, tempVarId);
            expect(res.statusCode).to.be.eq(201);
            expect(res.body).to.be.jsonSchema(schemas.successFileMedAttributeSchema);
            expect(res.body.attribute.x_org_id).to.be.eq(orgId);
            expect(res.body.attribute.type).to.be.eq(payloadData.type);
            expect(res.body.attribute.name).to.be.eq(payloadData.name);
            expect(res.body.attribute.code).to.be.eq(payloadData.code);
            expect(res.body.attribute.allow_multiple).to.be.true;
            expect(res.body.attribute.vms_visible).to.be.false;
            expect(res.body.attribute.vms_editable).to.be.false;
            expect(res.body.attribute.store_filter).to.be.false;
            expect(res.body.attribute.store_display_pdp).to.be.false;
            expect(res.body.attribute.store_display_plp).to.be.false;
            expect(res.body.attribute.store_search).to.be.false;
            expect(res.body.attribute.store_compare).to.be.false;
            expect(res.body.attribute.active).to.be.true;
            expect(res.body.attribute.mandatory).to.be.true;
            expect(res.body.attribute.auto_sync_to_prod).to.be.true;
        });

        it('Media Attribute is created sucessfully, Allow Multiple is sent as false', async function () {
            endpoint = creatAttribute(orgId);
            attributeNameCode = 'MediaAMFalse';
            payloadData = attributePayloads.createMediaAttributePayload(attributeNameCode);
            payload = JSON.stringify({
                "name": payloadData.name,
                "code": payloadData.code,
                "type": payloadData.type,
                "allow_multiple": false
            });
            signed_headers = getSignedRequestHeaders("POST", baseUrl, endpoint, payload, {});
            headers = {
                'Content-type': 'application/json;charset=UTF-8',
                'x-ccl-param': signed_headers["headers"]["x-ccl-param"],
                'x-ccl-signature': signed_headers["headers"]["x-ccl-signature"],
                'Cookie': cookie
            };
            res = await request
                .post(endpoint)
                .set(headers)
                .send(payload);
            tempVarId = await res.body.attribute._id;
            FO.appendToFile(attributeDetailsFile, attributeNameCode, tempVarId);
            expect(res.statusCode).to.be.eq(201);
            expect(res.body).to.be.jsonSchema(schemas.successFileMedAttributeSchema);
            expect(res.body.attribute.x_org_id).to.be.eq(orgId);
            expect(res.body.attribute.type).to.be.eq(payloadData.type);
            expect(res.body.attribute.name).to.be.eq(payloadData.name);
            expect(res.body.attribute.code).to.be.eq(payloadData.code);
            expect(res.body.attribute.allow_multiple).to.be.false;
            expect(res.body.attribute.vms_visible).to.be.false;
            expect(res.body.attribute.vms_editable).to.be.false;
            expect(res.body.attribute.store_filter).to.be.false;
            expect(res.body.attribute.store_display_pdp).to.be.false;
            expect(res.body.attribute.store_display_plp).to.be.false;
            expect(res.body.attribute.store_search).to.be.false;
            expect(res.body.attribute.store_compare).to.be.false;
            expect(res.body.attribute.active).to.be.true;
            expect(res.body.attribute.mandatory).to.be.true;
            expect(res.body.attribute.auto_sync_to_prod).to.be.true;
        });

        it('Media Attribute is created sucessfully, Max Size parameter is sent', async function () {
            endpoint = creatAttribute(orgId);
            attributeNameCode = 'MediaMSize';
            payloadData = attributePayloads.createMediaAttributePayload(attributeNameCode);
            payload = JSON.stringify({
                "name": payloadData.name,
                "code": payloadData.code,
                "type": payloadData.type,
                "max_size": payloadData.max_size
            });
            signed_headers = getSignedRequestHeaders("POST", baseUrl, endpoint, payload, {});
            headers = {
                'Content-type': 'application/json;charset=UTF-8',
                'x-ccl-param': signed_headers["headers"]["x-ccl-param"],
                'x-ccl-signature': signed_headers["headers"]["x-ccl-signature"],
                'Cookie': cookie
            };
            res = await request
                .post(endpoint)
                .set(headers)
                .send(payload);
            tempVarId = await res.body.attribute._id;
            FO.appendToFile(attributeDetailsFile, attributeNameCode, tempVarId);
            expect(res.statusCode).to.be.eq(201);
            expect(res.body).to.be.jsonSchema(schemas.successFileMedAttributeSchema);
            expect(res.body.attribute.x_org_id).to.be.eq(orgId);
            expect(res.body.attribute.max_size).to.be.eq(payloadData.max_size);
            expect(res.body.attribute.type).to.be.eq(payloadData.type);
            expect(res.body.attribute.name).to.be.eq(payloadData.name);
            expect(res.body.attribute.code).to.be.eq(payloadData.code);
            expect(res.body.attribute.allow_multiple).to.be.false;
            expect(res.body.attribute.vms_visible).to.be.false;
            expect(res.body.attribute.vms_editable).to.be.false;
            expect(res.body.attribute.store_filter).to.be.false;
            expect(res.body.attribute.store_display_pdp).to.be.false;
            expect(res.body.attribute.store_display_plp).to.be.false;
            expect(res.body.attribute.store_search).to.be.false;
            expect(res.body.attribute.store_compare).to.be.false;
            expect(res.body.attribute.active).to.be.true;
            expect(res.body.attribute.mandatory).to.be.true;
            expect(res.body.attribute.auto_sync_to_prod).to.be.true;
        });

        it('Media Attribute is created sucessfully, Allow Multiple is sent as random string', async function () {
            endpoint = creatAttribute(orgId);
            attributeNameCode = 'invalid';
            payloadData = attributePayloads.createMediaAttributePayload(attributeNameCode);
            payload = JSON.stringify({
                "name": payloadData.name,
                "code": payloadData.code,
                "type": payloadData.type,
                "allow_multiple": faker.random.alpha(10)
            });
            signed_headers = getSignedRequestHeaders("POST", baseUrl, endpoint, payload, {});
            headers = {
                'Content-type': 'application/json;charset=UTF-8',
                'x-ccl-param': signed_headers["headers"]["x-ccl-param"],
                'x-ccl-signature': signed_headers["headers"]["x-ccl-signature"],
                'Cookie': cookie
            };
            res = await request
                .post(endpoint)
                .set(headers)
                .send(payload);
            expect(res.statusCode).to.be.eq(400);
            expect(res.body.error).to.contain('ValidationError: allow_multiple: Cast to Boolean failed');
        });

        it('Create Media Attribute calls fails, Max Size parameter is sent as 0', async function () {
            endpoint = creatAttribute(orgId);
            payloadData = attributePayloads.createMediaAttributePayload(attributeNameCode);
            payload = JSON.stringify({
                "name": payloadData.name,
                "code": payloadData.code,
                "type": payloadData.type,
                "max_size": 0
            });
            signed_headers = getSignedRequestHeaders("POST", baseUrl, endpoint, payload, {});
            headers = {
                'Content-type': 'application/json;charset=UTF-8',
                'x-ccl-param': signed_headers["headers"]["x-ccl-param"],
                'x-ccl-signature': signed_headers["headers"]["x-ccl-signature"],
                'Cookie': cookie
            };
            res = await request
                .post(endpoint)
                .set(headers)
                .send(payload);
            expect(res.statusCode).to.be.eq(400);
            expect(res.body.error).to.be.eq(`ValidationError: max_size: 0 is not a positive integer`);
        });

        it('Create Media Attribute calls fails, Max Size parameter is sent as decimal value', async function () {
            const mSize = faker.datatype.number({ min: 1, max: 10000, precision: 0.01 });
            endpoint = creatAttribute(orgId);
            payloadData = attributePayloads.createMediaAttributePayload(attributeNameCode);
            payload = JSON.stringify({
                "name": payloadData.name,
                "code": payloadData.code,
                "type": payloadData.type,
                "max_size": mSize
            });
            signed_headers = getSignedRequestHeaders("POST", baseUrl, endpoint, payload, {});
            headers = {
                'Content-type': 'application/json;charset=UTF-8',
                'x-ccl-param': signed_headers["headers"]["x-ccl-param"],
                'x-ccl-signature': signed_headers["headers"]["x-ccl-signature"],
                'Cookie': cookie
            };
            res = await request
                .post(endpoint)
                .set(headers)
                .send(payload);
            expect(res.statusCode).to.be.eq(400);
            expect(res.body.error).to.be.eq(`ValidationError: max_size: ${mSize} is not a positive integer`);
        });

        it('Create Media Attribute calls fails, Max Size parameter is sent as negative value', async function () {
            const mSize = faker.datatype.number({ min: -10000, max: -1 });
            endpoint = creatAttribute(orgId);
            payloadData = attributePayloads.createMediaAttributePayload(attributeNameCode);
            payload = JSON.stringify({
                "name": payloadData.name,
                "code": payloadData.code,
                "type": payloadData.type,
                "max_size": mSize
            });
            signed_headers = getSignedRequestHeaders("POST", baseUrl, endpoint, payload, {});
            headers = {
                'Content-type': 'application/json;charset=UTF-8',
                'x-ccl-param': signed_headers["headers"]["x-ccl-param"],
                'x-ccl-signature': signed_headers["headers"]["x-ccl-signature"],
                'Cookie': cookie
            };
            res = await request
                .post(endpoint)
                .set(headers)
                .send(payload);
            expect(res.statusCode).to.be.eq(400);
            expect(res.body.error).to.be.eq(`ValidationError: max_size: ${mSize} is not a positive integer`);
        });

        it('Create Media Attribute calls fails, Max Size parameter is sent as string value', async function () {
            const mSize = faker.random.alpha(10);
            endpoint = creatAttribute(orgId);
            payloadData = attributePayloads.createMediaAttributePayload(attributeNameCode);
            payload = JSON.stringify({
                "name": payloadData.name,
                "code": payloadData.code,
                "type": payloadData.type,
                "max_size": mSize
            });
            signed_headers = getSignedRequestHeaders("POST", baseUrl, endpoint, payload, {});
            headers = {
                'Content-type': 'application/json;charset=UTF-8',
                'x-ccl-param': signed_headers["headers"]["x-ccl-param"],
                'x-ccl-signature': signed_headers["headers"]["x-ccl-signature"],
                'Cookie': cookie
            };
            res = await request
                .post(endpoint)
                .set(headers)
                .send(payload);
            expect(res.statusCode).to.be.eq(400);
            expect(res.body.error).to.contains(`ValidationError: max_size:`);
        });

        it('Create Attribute calls fails, type parameter is sent as a random string value', async function () {
            const typeData = faker.random.alpha(10);
            endpoint = creatAttribute(orgId);
            payloadData = attributePayloads.createMediaAttributePayload(attributeNameCode);
            payload = JSON.stringify({
                "name": payloadData.name,
                "code": payloadData.code,
                "type": typeData
            });
            signed_headers = getSignedRequestHeaders("POST", baseUrl, endpoint, payload, {});
            headers = {
                'Content-type': 'application/json;charset=UTF-8',
                'x-ccl-param': signed_headers["headers"]["x-ccl-param"],
                'x-ccl-signature': signed_headers["headers"]["x-ccl-signature"],
                'Cookie': cookie
            };
            res = await request
                .post(endpoint)
                .set(headers)
                .send(payload);
            expect(res.statusCode).to.be.eq(400);
            expect(res.body.error).to.be.eq(`ValidationError: type: \`${typeData}\` is not a valid enum value for path \`type\`.`);
        });

        it('Create Media Attribute is successfull, media_type parameter is sent as a image', async function () {
            const fileAllowedValues = ["jpeg", "png", "gif", "webp", "jfif", "mp4", "mov"];
            const selMediaType = "image";
            const fileAllowedArray = [];
            const fileAllowedArraySize = faker.datatype.number({ min: 1, max: 5 });
            for (let i = 0; i < fileAllowedArraySize; i++) {
                fileAllowedArray.push(fileAllowedValues[i]);
            }
            endpoint = creatAttribute(orgId);
            attributeNameCode = 'MediaImage';
            payloadData = attributePayloads.createMediaAttributePayload(attributeNameCode);
            payload = JSON.stringify({
                "name": payloadData.name,
                "code": payloadData.code,
                "type": payloadData.type,
                "media_type": selMediaType,
                "allowed_extensions": fileAllowedArray
            });
            signed_headers = getSignedRequestHeaders("POST", baseUrl, endpoint, payload, {});
            headers = {
                'Content-type': 'application/json;charset=UTF-8',
                'x-ccl-param': signed_headers["headers"]["x-ccl-param"],
                'x-ccl-signature': signed_headers["headers"]["x-ccl-signature"],
                'Cookie': cookie
            };
            res = await request
                .post(endpoint)
                .set(headers)
                .send(payload);
            tempVarId = await res.body.attribute._id;
            FO.appendToFile(attributeDetailsFile, attributeNameCode, tempVarId);
            expect(res.statusCode).to.be.eq(201);
            expect(res.body).to.be.jsonSchema(schemas.successFileMedAttributeSchema);
            expect(res.body.attribute.x_org_id).to.be.eq(orgId);
            expect(res.body.attribute.name).to.be.eq(payloadData.name);
            expect(res.body.attribute.code).to.be.eq(payloadData.code);
            expect(res.body.attribute.type).to.be.eq(payloadData.type);
            expect(res.body.attribute.media_type).to.be.eq(selMediaType);
            expect(res.body.attribute.allowed_extensions.length).to.be.eq(fileAllowedArray.length);
            expect(compareArrayData(res.body.attribute.allowed_extensions, fileAllowedArray)).to.be.true;
            expect(res.body.attribute.allow_multiple).to.be.false;
            expect(res.body.attribute.vms_visible).to.be.false;
            expect(res.body.attribute.vms_editable).to.be.false;
            expect(res.body.attribute.store_filter).to.be.false;
            expect(res.body.attribute.store_display_pdp).to.be.false;
            expect(res.body.attribute.store_display_plp).to.be.false;
            expect(res.body.attribute.store_search).to.be.false;
            expect(res.body.attribute.store_compare).to.be.false;
            expect(res.body.attribute.active).to.be.true;
            expect(res.body.attribute.mandatory).to.be.true;
            expect(res.body.attribute.auto_sync_to_prod).to.be.true;
        });

        it('Create Media Attribute is successfull, media_type parameter is sent as a image and allowed values contain jpeg', async function () {
            const selMediaType = "image";
            const fileAllowedArray = ["jpeg"];
            endpoint = creatAttribute(orgId);
            attributeNameCode = 'MediaJpeg';
            payloadData = attributePayloads.createMediaAttributePayload(attributeNameCode);
            payload = JSON.stringify({
                "name": payloadData.name,
                "code": payloadData.code,
                "type": payloadData.type,
                "media_type": selMediaType,
                "allowed_extensions": fileAllowedArray
            });
            signed_headers = getSignedRequestHeaders("POST", baseUrl, endpoint, payload, {});
            headers = {
                'Content-type': 'application/json;charset=UTF-8',
                'x-ccl-param': signed_headers["headers"]["x-ccl-param"],
                'x-ccl-signature': signed_headers["headers"]["x-ccl-signature"],
                'Cookie': cookie
            };
            res = await request
                .post(endpoint)
                .set(headers)
                .send(payload);
            tempVarId = await res.body.attribute._id;
            FO.appendToFile(attributeDetailsFile, attributeNameCode, tempVarId);
            expect(res.statusCode).to.be.eq(201);
            expect(res.body).to.be.jsonSchema(schemas.successFileMedAttributeSchema);
            expect(res.body.attribute.x_org_id).to.be.eq(orgId);
            expect(res.body.attribute.name).to.be.eq(payloadData.name);
            expect(res.body.attribute.code).to.be.eq(payloadData.code);
            expect(res.body.attribute.type).to.be.eq(payloadData.type);
            expect(res.body.attribute.media_type).to.be.eq(selMediaType);
            expect(res.body.attribute.allowed_extensions.length).to.be.eq(fileAllowedArray.length);
            expect(compareArrayData(res.body.attribute.allowed_extensions, fileAllowedArray)).to.be.true;
            expect(res.body.attribute.allow_multiple).to.be.false;
            expect(res.body.attribute.vms_visible).to.be.false;
            expect(res.body.attribute.vms_editable).to.be.false;
            expect(res.body.attribute.store_filter).to.be.false;
            expect(res.body.attribute.store_display_pdp).to.be.false;
            expect(res.body.attribute.store_display_plp).to.be.false;
            expect(res.body.attribute.store_search).to.be.false;
            expect(res.body.attribute.store_compare).to.be.false;
            expect(res.body.attribute.active).to.be.true;
            expect(res.body.attribute.mandatory).to.be.true;
            expect(res.body.attribute.auto_sync_to_prod).to.be.true;
        });

        it('Create Media Attribute is successfull, media_type parameter is sent as a image and allowed values contain png', async function () {
            const selMediaType = "image";
            const fileAllowedArray = ["png"];
            endpoint = creatAttribute(orgId);
            attributeNameCode = 'MediaPng';
            payloadData = attributePayloads.createMediaAttributePayload(attributeNameCode);
            payload = JSON.stringify({
                "name": payloadData.name,
                "code": payloadData.code,
                "type": payloadData.type,
                "media_type": selMediaType,
                "allowed_extensions": fileAllowedArray
            });
            signed_headers = getSignedRequestHeaders("POST", baseUrl, endpoint, payload, {});
            headers = {
                'Content-type': 'application/json;charset=UTF-8',
                'x-ccl-param': signed_headers["headers"]["x-ccl-param"],
                'x-ccl-signature': signed_headers["headers"]["x-ccl-signature"],
                'Cookie': cookie
            };
            res = await request
                .post(endpoint)
                .set(headers)
                .send(payload);
            tempVarId = await res.body.attribute._id;
            FO.appendToFile(attributeDetailsFile, attributeNameCode, tempVarId);
            expect(res.statusCode).to.be.eq(201);
            expect(res.body).to.be.jsonSchema(schemas.successFileMedAttributeSchema);
            expect(res.body.attribute.x_org_id).to.be.eq(orgId);
            expect(res.body.attribute.name).to.be.eq(payloadData.name);
            expect(res.body.attribute.code).to.be.eq(payloadData.code);
            expect(res.body.attribute.type).to.be.eq(payloadData.type);
            expect(res.body.attribute.media_type).to.be.eq(selMediaType);
            expect(res.body.attribute.allowed_extensions.length).to.be.eq(fileAllowedArray.length);
            expect(compareArrayData(res.body.attribute.allowed_extensions, fileAllowedArray)).to.be.true;
            expect(res.body.attribute.allow_multiple).to.be.false;
            expect(res.body.attribute.vms_visible).to.be.false;
            expect(res.body.attribute.vms_editable).to.be.false;
            expect(res.body.attribute.store_filter).to.be.false;
            expect(res.body.attribute.store_display_pdp).to.be.false;
            expect(res.body.attribute.store_display_plp).to.be.false;
            expect(res.body.attribute.store_search).to.be.false;
            expect(res.body.attribute.store_compare).to.be.false;
            expect(res.body.attribute.active).to.be.true;
            expect(res.body.attribute.mandatory).to.be.true;
            expect(res.body.attribute.auto_sync_to_prod).to.be.true;
        });

        it('Create Media Attribute is successfull, media_type parameter is sent as a image and allowed values contain gif', async function () {
            const selMediaType = "image";
            const fileAllowedArray = ["gif"];
            endpoint = creatAttribute(orgId);
            attributeNameCode = 'MediaGif';
            payloadData = attributePayloads.createMediaAttributePayload(attributeNameCode);
            payload = JSON.stringify({
                "name": payloadData.name,
                "code": payloadData.code,
                "type": payloadData.type,
                "media_type": selMediaType,
                "allowed_extensions": fileAllowedArray
            });
            signed_headers = getSignedRequestHeaders("POST", baseUrl, endpoint, payload, {});
            headers = {
                'Content-type': 'application/json;charset=UTF-8',
                'x-ccl-param': signed_headers["headers"]["x-ccl-param"],
                'x-ccl-signature': signed_headers["headers"]["x-ccl-signature"],
                'Cookie': cookie
            };
            res = await request
                .post(endpoint)
                .set(headers)
                .send(payload);
            tempVarId = await res.body.attribute._id;
            FO.appendToFile(attributeDetailsFile, attributeNameCode, tempVarId);
            expect(res.statusCode).to.be.eq(201);
            expect(res.body).to.be.jsonSchema(schemas.successFileMedAttributeSchema);
            expect(res.body.attribute.x_org_id).to.be.eq(orgId);
            expect(res.body.attribute.name).to.be.eq(payloadData.name);
            expect(res.body.attribute.code).to.be.eq(payloadData.code);
            expect(res.body.attribute.type).to.be.eq(payloadData.type);
            expect(res.body.attribute.media_type).to.be.eq(selMediaType);
            expect(res.body.attribute.allowed_extensions.length).to.be.eq(fileAllowedArray.length);
            expect(compareArrayData(res.body.attribute.allowed_extensions, fileAllowedArray)).to.be.true;
            expect(res.body.attribute.allow_multiple).to.be.false;
            expect(res.body.attribute.vms_visible).to.be.false;
            expect(res.body.attribute.vms_editable).to.be.false;
            expect(res.body.attribute.store_filter).to.be.false;
            expect(res.body.attribute.store_display_pdp).to.be.false;
            expect(res.body.attribute.store_display_plp).to.be.false;
            expect(res.body.attribute.store_search).to.be.false;
            expect(res.body.attribute.store_compare).to.be.false;
            expect(res.body.attribute.active).to.be.true;
            expect(res.body.attribute.mandatory).to.be.true;
            expect(res.body.attribute.auto_sync_to_prod).to.be.true;
        });

        it('Create Media Attribute is successfull, media_type parameter is sent as a image and allowed values contain webp', async function () {
            const selMediaType = "image";
            const fileAllowedArray = ["webp"];
            endpoint = creatAttribute(orgId);
            attributeNameCode = 'MediaWebp';
            payloadData = attributePayloads.createMediaAttributePayload(attributeNameCode);
            payload = JSON.stringify({
                "name": payloadData.name,
                "code": payloadData.code,
                "type": payloadData.type,
                "media_type": selMediaType,
                "allowed_extensions": fileAllowedArray
            });
            signed_headers = getSignedRequestHeaders("POST", baseUrl, endpoint, payload, {});
            headers = {
                'Content-type': 'application/json;charset=UTF-8',
                'x-ccl-param': signed_headers["headers"]["x-ccl-param"],
                'x-ccl-signature': signed_headers["headers"]["x-ccl-signature"],
                'Cookie': cookie
            };
            res = await request
                .post(endpoint)
                .set(headers)
                .send(payload);
            tempVarId = await res.body.attribute._id;
            FO.appendToFile(attributeDetailsFile, attributeNameCode, tempVarId);
            expect(res.statusCode).to.be.eq(201);
            expect(res.body).to.be.jsonSchema(schemas.successFileMedAttributeSchema);
            expect(res.body.attribute.x_org_id).to.be.eq(orgId);
            expect(res.body.attribute.name).to.be.eq(payloadData.name);
            expect(res.body.attribute.code).to.be.eq(payloadData.code);
            expect(res.body.attribute.type).to.be.eq(payloadData.type);
            expect(res.body.attribute.media_type).to.be.eq(selMediaType);
            expect(res.body.attribute.allowed_extensions.length).to.be.eq(fileAllowedArray.length);
            expect(compareArrayData(res.body.attribute.allowed_extensions, fileAllowedArray)).to.be.true;
            expect(res.body.attribute.allow_multiple).to.be.false;
            expect(res.body.attribute.vms_visible).to.be.false;
            expect(res.body.attribute.vms_editable).to.be.false;
            expect(res.body.attribute.store_filter).to.be.false;
            expect(res.body.attribute.store_display_pdp).to.be.false;
            expect(res.body.attribute.store_display_plp).to.be.false;
            expect(res.body.attribute.store_search).to.be.false;
            expect(res.body.attribute.store_compare).to.be.false;
            expect(res.body.attribute.active).to.be.true;
            expect(res.body.attribute.mandatory).to.be.true;
            expect(res.body.attribute.auto_sync_to_prod).to.be.true;
        });

        it('Create Media Attribute is successfull, media_type parameter is sent as a image and allowed values contain jfif', async function () {
            const selMediaType = "image";
            const fileAllowedArray = ["jfif"];
            endpoint = creatAttribute(orgId);
            attributeNameCode = 'MediaJfif';
            payloadData = attributePayloads.createMediaAttributePayload(attributeNameCode);
            payload = JSON.stringify({
                "name": payloadData.name,
                "code": payloadData.code,
                "type": payloadData.type,
                "media_type": selMediaType,
                "allowed_extensions": fileAllowedArray
            });
            signed_headers = getSignedRequestHeaders("POST", baseUrl, endpoint, payload, {});
            headers = {
                'Content-type': 'application/json;charset=UTF-8',
                'x-ccl-param': signed_headers["headers"]["x-ccl-param"],
                'x-ccl-signature': signed_headers["headers"]["x-ccl-signature"],
                'Cookie': cookie
            };
            res = await request
                .post(endpoint)
                .set(headers)
                .send(payload);
            tempVarId = await res.body.attribute._id;
            FO.appendToFile(attributeDetailsFile, attributeNameCode, tempVarId);
            expect(res.statusCode).to.be.eq(201);
            expect(res.body).to.be.jsonSchema(schemas.successFileMedAttributeSchema);
            expect(res.body.attribute.x_org_id).to.be.eq(orgId);
            expect(res.body.attribute.name).to.be.eq(payloadData.name);
            expect(res.body.attribute.code).to.be.eq(payloadData.code);
            expect(res.body.attribute.type).to.be.eq(payloadData.type);
            expect(res.body.attribute.media_type).to.be.eq(selMediaType);
            expect(res.body.attribute.allowed_extensions.length).to.be.eq(fileAllowedArray.length);
            expect(compareArrayData(res.body.attribute.allowed_extensions, fileAllowedArray)).to.be.true;
            expect(res.body.attribute.allow_multiple).to.be.false;
            expect(res.body.attribute.vms_visible).to.be.false;
            expect(res.body.attribute.vms_editable).to.be.false;
            expect(res.body.attribute.store_filter).to.be.false;
            expect(res.body.attribute.store_display_pdp).to.be.false;
            expect(res.body.attribute.store_display_plp).to.be.false;
            expect(res.body.attribute.store_search).to.be.false;
            expect(res.body.attribute.store_compare).to.be.false;
            expect(res.body.attribute.active).to.be.true;
            expect(res.body.attribute.mandatory).to.be.true;
            expect(res.body.attribute.auto_sync_to_prod).to.be.true;
        });

        it('Create Media Attribute is successfull, media_type parameter is sent as a image and allowed values contain all allowed types', async function () {
            const selMediaType = "image";
            const fileAllowedArray = ["jfif", "jpeg", "png", "gif", "webp"];
            endpoint = creatAttribute(orgId);
            attributeNameCode = 'MediaImageAll';
            payloadData = attributePayloads.createMediaAttributePayload(attributeNameCode);
            payload = JSON.stringify({
                "name": payloadData.name,
                "code": payloadData.code,
                "type": payloadData.type,
                "media_type": selMediaType,
                "allowed_extensions": fileAllowedArray
            });
            signed_headers = getSignedRequestHeaders("POST", baseUrl, endpoint, payload, {});
            headers = {
                'Content-type': 'application/json;charset=UTF-8',
                'x-ccl-param': signed_headers["headers"]["x-ccl-param"],
                'x-ccl-signature': signed_headers["headers"]["x-ccl-signature"],
                'Cookie': cookie
            };
            res = await request
                .post(endpoint)
                .set(headers)
                .send(payload);
            tempVarId = await res.body.attribute._id;
            FO.appendToFile(attributeDetailsFile, attributeNameCode, tempVarId);
            expect(res.statusCode).to.be.eq(201);
            expect(res.body).to.be.jsonSchema(schemas.successFileMedAttributeSchema);
            expect(res.body.attribute.x_org_id).to.be.eq(orgId);
            expect(res.body.attribute.name).to.be.eq(payloadData.name);
            expect(res.body.attribute.code).to.be.eq(payloadData.code);
            expect(res.body.attribute.type).to.be.eq(payloadData.type);
            expect(res.body.attribute.media_type).to.be.eq(selMediaType);
            expect(res.body.attribute.allowed_extensions.length).to.be.eq(fileAllowedArray.length);
            expect(compareArrayData(res.body.attribute.allowed_extensions, fileAllowedArray)).to.be.true;
            expect(res.body.attribute.allow_multiple).to.be.false;
            expect(res.body.attribute.vms_visible).to.be.false;
            expect(res.body.attribute.vms_editable).to.be.false;
            expect(res.body.attribute.store_filter).to.be.false;
            expect(res.body.attribute.store_display_pdp).to.be.false;
            expect(res.body.attribute.store_display_plp).to.be.false;
            expect(res.body.attribute.store_search).to.be.false;
            expect(res.body.attribute.store_compare).to.be.false;
            expect(res.body.attribute.active).to.be.true;
            expect(res.body.attribute.mandatory).to.be.true;
            expect(res.body.attribute.auto_sync_to_prod).to.be.true;
        });

        it('Create Media Attribute is successfull, media_type parameter is sent as a image and allowed values contain valid image type', async function () {
            const selMediaType = "image";
            const fileAllowedArrayValues = ["jfif", "jpeg", "png", "gif", "webp"];
            const fileAllowedArray = [];
            const fileAllowedArraySize = faker.datatype.number({ min: 1, max: 5 });
            for (let i = 0; i < fileAllowedArraySize; i++) {
                fileAllowedArray.push(fileAllowedArrayValues[i]);
            }
            endpoint = creatAttribute(orgId);
            attributeNameCode = 'MediaImageRandom';
            payloadData = attributePayloads.createMediaAttributePayload(attributeNameCode);
            payload = JSON.stringify({
                "name": payloadData.name,
                "code": payloadData.code,
                "type": payloadData.type,
                "media_type": selMediaType,
                "allowed_extensions": fileAllowedArray
            });
            signed_headers = getSignedRequestHeaders("POST", baseUrl, endpoint, payload, {});
            headers = {
                'Content-type': 'application/json;charset=UTF-8',
                'x-ccl-param': signed_headers["headers"]["x-ccl-param"],
                'x-ccl-signature': signed_headers["headers"]["x-ccl-signature"],
                'Cookie': cookie
            };
            res = await request
                .post(endpoint)
                .set(headers)
                .send(payload);
            tempVarId = await res.body.attribute._id;
            FO.appendToFile(attributeDetailsFile, attributeNameCode, tempVarId);
            expect(res.statusCode).to.be.eq(201);
            expect(res.body).to.be.jsonSchema(schemas.successFileMedAttributeSchema);
            expect(res.body.attribute.x_org_id).to.be.eq(orgId);
            expect(res.body.attribute.name).to.be.eq(payloadData.name);
            expect(res.body.attribute.code).to.be.eq(payloadData.code);
            expect(res.body.attribute.type).to.be.eq(payloadData.type);
            expect(res.body.attribute.media_type).to.be.eq(selMediaType);
            expect(res.body.attribute.allowed_extensions.length).to.be.eq(fileAllowedArray.length);
            expect(compareArrayData(res.body.attribute.allowed_extensions, fileAllowedArray)).to.be.true;
            expect(res.body.attribute.allow_multiple).to.be.false;
            expect(res.body.attribute.vms_visible).to.be.false;
            expect(res.body.attribute.vms_editable).to.be.false;
            expect(res.body.attribute.store_filter).to.be.false;
            expect(res.body.attribute.store_display_pdp).to.be.false;
            expect(res.body.attribute.store_display_plp).to.be.false;
            expect(res.body.attribute.store_search).to.be.false;
            expect(res.body.attribute.store_compare).to.be.false;
            expect(res.body.attribute.active).to.be.true;
            expect(res.body.attribute.mandatory).to.be.true;
            expect(res.body.attribute.auto_sync_to_prod).to.be.true;
        });

        it('Create Media Attribute is successfull, media_type parameter is sent as a image and allowed values contain random string', async function () {
            const selMediaType = "image";
            const fileAllowedArray = [faker.random.alpha(10)];
            endpoint = creatAttribute(orgId);
            attributeNameCode = 'invalid';
            payloadData = attributePayloads.createMediaAttributePayload(attributeNameCode);
            payload = JSON.stringify({
                "name": payloadData.name,
                "code": payloadData.code,
                "type": payloadData.type,
                "media_type": selMediaType,
                "allowed_extensions": fileAllowedArray
            });
            signed_headers = getSignedRequestHeaders("POST", baseUrl, endpoint, payload, {});
            headers = {
                'Content-type': 'application/json;charset=UTF-8',
                'x-ccl-param': signed_headers["headers"]["x-ccl-param"],
                'x-ccl-signature': signed_headers["headers"]["x-ccl-signature"],
                'Cookie': cookie
            };
            res = await request
                .post(endpoint)
                .set(headers)
                .send(payload);
            expect(res.statusCode).to.be.eq(400);
            expect(res.body.error).to.be.eq('Error: Invalid extension sent')
        });

        it('Create Media Attribute is successfull, media_type parameter is sent as a video', async function () {
            const fileAllowedValues = ["jpeg", "png", "gif", "webp", "jfif", "mp4", "mov"];
            const selMediaType = "video";
            const fileAllowedArray = [];
            const fileAllowedArraySize = faker.datatype.number({ min: 1, max: 2 });
            for (let i = 0; i < fileAllowedArraySize; i++) {
                fileAllowedArray.push(fileAllowedValues[i + 5]);
            }
            endpoint = creatAttribute(orgId);
            attributeNameCode = 'MediaVideo';
            payloadData = attributePayloads.createMediaAttributePayload(attributeNameCode);
            payload = JSON.stringify({
                "name": payloadData.name,
                "code": payloadData.code,
                "type": payloadData.type,
                "media_type": selMediaType,
                "allowed_extensions": fileAllowedArray
            });
            signed_headers = getSignedRequestHeaders("POST", baseUrl, endpoint, payload, {});
            headers = {
                'Content-type': 'application/json;charset=UTF-8',
                'x-ccl-param': signed_headers["headers"]["x-ccl-param"],
                'x-ccl-signature': signed_headers["headers"]["x-ccl-signature"],
                'Cookie': cookie
            };
            res = await request
                .post(endpoint)
                .set(headers)
                .send(payload);
            tempVarId = await res.body.attribute._id;
            FO.appendToFile(attributeDetailsFile, attributeNameCode, tempVarId);
            expect(res.statusCode).to.be.eq(201);
            expect(res.body).to.be.jsonSchema(schemas.successFileMedAttributeSchema);
            expect(res.body.attribute.x_org_id).to.be.eq(orgId);
            expect(res.body.attribute.name).to.be.eq(payloadData.name);
            expect(res.body.attribute.code).to.be.eq(payloadData.code);
            expect(res.body.attribute.type).to.be.eq(payloadData.type);
            expect(res.body.attribute.media_type).to.be.eq(selMediaType);
            expect(res.body.attribute.allowed_extensions.length).to.be.eq(fileAllowedArray.length);
            expect(compareArrayData(res.body.attribute.allowed_extensions, fileAllowedArray)).to.be.true;
            expect(res.body.attribute.allow_multiple).to.be.false;
            expect(res.body.attribute.vms_visible).to.be.false;
            expect(res.body.attribute.vms_editable).to.be.false;
            expect(res.body.attribute.store_filter).to.be.false;
            expect(res.body.attribute.store_display_pdp).to.be.false;
            expect(res.body.attribute.store_display_plp).to.be.false;
            expect(res.body.attribute.store_search).to.be.false;
            expect(res.body.attribute.store_compare).to.be.false;
            expect(res.body.attribute.active).to.be.true;
            expect(res.body.attribute.mandatory).to.be.true;
            expect(res.body.attribute.auto_sync_to_prod).to.be.true;
        });

        it('Create Media Attribute is successfull, media_type parameter is sent as a video and allowed extension is sent as mov', async function () {
            const selMediaType = "video";
            const fileAllowedArray = ["mov"];
            endpoint = creatAttribute(orgId);
            attributeNameCode = 'MediaMov';
            payloadData = attributePayloads.createMediaAttributePayload(attributeNameCode);
            payload = JSON.stringify({
                "name": payloadData.name,
                "code": payloadData.code,
                "type": payloadData.type,
                "media_type": selMediaType,
                "allowed_extensions": fileAllowedArray
            });
            signed_headers = getSignedRequestHeaders("POST", baseUrl, endpoint, payload, {});
            headers = {
                'Content-type': 'application/json;charset=UTF-8',
                'x-ccl-param': signed_headers["headers"]["x-ccl-param"],
                'x-ccl-signature': signed_headers["headers"]["x-ccl-signature"],
                'Cookie': cookie
            };
            res = await request
                .post(endpoint)
                .set(headers)
                .send(payload);
            tempVarId = await res.body.attribute._id;
            FO.appendToFile(attributeDetailsFile, attributeNameCode, tempVarId);
            expect(res.statusCode).to.be.eq(201);
            expect(res.body).to.be.jsonSchema(schemas.successFileMedAttributeSchema);
            expect(res.body.attribute.x_org_id).to.be.eq(orgId);
            expect(res.body.attribute.name).to.be.eq(payloadData.name);
            expect(res.body.attribute.code).to.be.eq(payloadData.code);
            expect(res.body.attribute.type).to.be.eq(payloadData.type);
            expect(res.body.attribute.media_type).to.be.eq(selMediaType);
            expect(res.body.attribute.allowed_extensions.length).to.be.eq(fileAllowedArray.length);
            expect(compareArrayData(res.body.attribute.allowed_extensions, fileAllowedArray)).to.be.true;
            expect(res.body.attribute.allow_multiple).to.be.false;
            expect(res.body.attribute.vms_visible).to.be.false;
            expect(res.body.attribute.vms_editable).to.be.false;
            expect(res.body.attribute.store_filter).to.be.false;
            expect(res.body.attribute.store_display_pdp).to.be.false;
            expect(res.body.attribute.store_display_plp).to.be.false;
            expect(res.body.attribute.store_search).to.be.false;
            expect(res.body.attribute.store_compare).to.be.false;
            expect(res.body.attribute.active).to.be.true;
            expect(res.body.attribute.mandatory).to.be.true;
            expect(res.body.attribute.auto_sync_to_prod).to.be.true;
        });

        it('Create Media Attribute is successfull, media_type parameter is sent as a video and allowed extension is sent as mp4', async function () {
            const selMediaType = "video";
            const fileAllowedArray = ["mp4"];
            endpoint = creatAttribute(orgId);
            attributeNameCode = 'MediaMp4';
            payloadData = attributePayloads.createMediaAttributePayload(attributeNameCode);
            payload = JSON.stringify({
                "name": payloadData.name,
                "code": payloadData.code,
                "type": payloadData.type,
                "media_type": selMediaType,
                "allowed_extensions": fileAllowedArray
            });
            signed_headers = getSignedRequestHeaders("POST", baseUrl, endpoint, payload, {});
            headers = {
                'Content-type': 'application/json;charset=UTF-8',
                'x-ccl-param': signed_headers["headers"]["x-ccl-param"],
                'x-ccl-signature': signed_headers["headers"]["x-ccl-signature"],
                'Cookie': cookie
            };
            res = await request
                .post(endpoint)
                .set(headers)
                .send(payload);
            tempVarId = await res.body.attribute._id;
            FO.appendToFile(attributeDetailsFile, attributeNameCode, tempVarId);
            expect(res.statusCode).to.be.eq(201);
            expect(res.body).to.be.jsonSchema(schemas.successFileMedAttributeSchema);
            expect(res.body.attribute.x_org_id).to.be.eq(orgId);
            expect(res.body.attribute.name).to.be.eq(payloadData.name);
            expect(res.body.attribute.code).to.be.eq(payloadData.code);
            expect(res.body.attribute.type).to.be.eq(payloadData.type);
            expect(res.body.attribute.media_type).to.be.eq(selMediaType);
            expect(res.body.attribute.allowed_extensions.length).to.be.eq(fileAllowedArray.length);
            expect(compareArrayData(res.body.attribute.allowed_extensions, fileAllowedArray)).to.be.true;
            expect(res.body.attribute.allow_multiple).to.be.false;
            expect(res.body.attribute.vms_visible).to.be.false;
            expect(res.body.attribute.vms_editable).to.be.false;
            expect(res.body.attribute.store_filter).to.be.false;
            expect(res.body.attribute.store_display_pdp).to.be.false;
            expect(res.body.attribute.store_display_plp).to.be.false;
            expect(res.body.attribute.store_search).to.be.false;
            expect(res.body.attribute.store_compare).to.be.false;
            expect(res.body.attribute.active).to.be.true;
            expect(res.body.attribute.mandatory).to.be.true;
            expect(res.body.attribute.auto_sync_to_prod).to.be.true;
        });

        it('Create Media Attribute is successfull, media_type parameter is sent as a video and allowed extension is sent as mov and mp4', async function () {
            const selMediaType = "video";
            const fileAllowedArray = ["mp4", "mov"];
            endpoint = creatAttribute(orgId);
            attributeNameCode = 'MediaVidAll';
            payloadData = attributePayloads.createMediaAttributePayload(attributeNameCode);
            payload = JSON.stringify({
                "name": payloadData.name,
                "code": payloadData.code,
                "type": payloadData.type,
                "media_type": selMediaType,
                "allowed_extensions": fileAllowedArray
            });
            signed_headers = getSignedRequestHeaders("POST", baseUrl, endpoint, payload, {});
            headers = {
                'Content-type': 'application/json;charset=UTF-8',
                'x-ccl-param': signed_headers["headers"]["x-ccl-param"],
                'x-ccl-signature': signed_headers["headers"]["x-ccl-signature"],
                'Cookie': cookie
            };
            res = await request
                .post(endpoint)
                .set(headers)
                .send(payload);
            tempVarId = await res.body.attribute._id;
            FO.appendToFile(attributeDetailsFile, attributeNameCode, tempVarId);
            expect(res.statusCode).to.be.eq(201);
            expect(res.body).to.be.jsonSchema(schemas.successFileMedAttributeSchema);
            expect(res.body.attribute.x_org_id).to.be.eq(orgId);
            expect(res.body.attribute.name).to.be.eq(payloadData.name);
            expect(res.body.attribute.code).to.be.eq(payloadData.code);
            expect(res.body.attribute.type).to.be.eq(payloadData.type);
            expect(res.body.attribute.media_type).to.be.eq(selMediaType);
            expect(res.body.attribute.allowed_extensions.length).to.be.eq(fileAllowedArray.length);
            expect(compareArrayData(res.body.attribute.allowed_extensions, fileAllowedArray)).to.be.true;
            expect(res.body.attribute.allow_multiple).to.be.false;
            expect(res.body.attribute.vms_visible).to.be.false;
            expect(res.body.attribute.vms_editable).to.be.false;
            expect(res.body.attribute.store_filter).to.be.false;
            expect(res.body.attribute.store_display_pdp).to.be.false;
            expect(res.body.attribute.store_display_plp).to.be.false;
            expect(res.body.attribute.store_search).to.be.false;
            expect(res.body.attribute.store_compare).to.be.false;
            expect(res.body.attribute.active).to.be.true;
            expect(res.body.attribute.mandatory).to.be.true;
            expect(res.body.attribute.auto_sync_to_prod).to.be.true;
        });

        it('Create Media Attribute is successfull, media_type parameter is sent as a video and allowed extension have valid values', async function () {
            const selMediaType = "video";
            const fileAllowedArrayValues = ["mp4", "mov"];
            const fileAllowedArray = [];
            const fileAllowedArraySize = faker.datatype.number({ min: 1, max: 2 });
            for (let i = 0; i < fileAllowedArraySize; i++) {
                fileAllowedArray.push(fileAllowedArrayValues[i]);
            }
            endpoint = creatAttribute(orgId);
            attributeNameCode = 'MediaVidRandom';
            payloadData = attributePayloads.createMediaAttributePayload(attributeNameCode);
            payload = JSON.stringify({
                "name": payloadData.name,
                "code": payloadData.code,
                "type": payloadData.type,
                "media_type": selMediaType,
                "allowed_extensions": fileAllowedArray
            });
            signed_headers = getSignedRequestHeaders("POST", baseUrl, endpoint, payload, {});
            headers = {
                'Content-type': 'application/json;charset=UTF-8',
                'x-ccl-param': signed_headers["headers"]["x-ccl-param"],
                'x-ccl-signature': signed_headers["headers"]["x-ccl-signature"],
                'Cookie': cookie
            };
            res = await request
                .post(endpoint)
                .set(headers)
                .send(payload);
            tempVarId = await res.body.attribute._id;
            FO.appendToFile(attributeDetailsFile, attributeNameCode, tempVarId);
            expect(res.statusCode).to.be.eq(201);
            expect(res.body).to.be.jsonSchema(schemas.successFileMedAttributeSchema);
            expect(res.body.attribute.x_org_id).to.be.eq(orgId);
            expect(res.body.attribute.name).to.be.eq(payloadData.name);
            expect(res.body.attribute.code).to.be.eq(payloadData.code);
            expect(res.body.attribute.type).to.be.eq(payloadData.type);
            expect(res.body.attribute.media_type).to.be.eq(selMediaType);
            expect(res.body.attribute.allowed_extensions.length).to.be.eq(fileAllowedArray.length);
            expect(compareArrayData(res.body.attribute.allowed_extensions, fileAllowedArray)).to.be.true;
            expect(res.body.attribute.allow_multiple).to.be.false;
            expect(res.body.attribute.vms_visible).to.be.false;
            expect(res.body.attribute.vms_editable).to.be.false;
            expect(res.body.attribute.store_filter).to.be.false;
            expect(res.body.attribute.store_display_pdp).to.be.false;
            expect(res.body.attribute.store_display_plp).to.be.false;
            expect(res.body.attribute.store_search).to.be.false;
            expect(res.body.attribute.store_compare).to.be.false;
            expect(res.body.attribute.active).to.be.true;
            expect(res.body.attribute.mandatory).to.be.true;
            expect(res.body.attribute.auto_sync_to_prod).to.be.true;
        });

        it('Create Media Attribute is not successfull, media_type parameter is sent as a video and allowed values contain random string', async function () {
            const selMediaType = "video";
            const fileAllowedArray = [faker.random.alpha(10)];
            endpoint = creatAttribute(orgId);
            attributeNameCode = 'invalid';
            payloadData = attributePayloads.createMediaAttributePayload(attributeNameCode);
            payload = JSON.stringify({
                "name": payloadData.name,
                "code": payloadData.code,
                "type": payloadData.type,
                "media_type": selMediaType,
                "allowed_extensions": fileAllowedArray
            });
            signed_headers = getSignedRequestHeaders("POST", baseUrl, endpoint, payload, {});
            headers = {
                'Content-type': 'application/json;charset=UTF-8',
                'x-ccl-param': signed_headers["headers"]["x-ccl-param"],
                'x-ccl-signature': signed_headers["headers"]["x-ccl-signature"],
                'Cookie': cookie
            };
            res = await request
                .post(endpoint)
                .set(headers)
                .send(payload);
            expect(res.statusCode).to.be.eq(400);
            expect(res.body.error).to.be.eq('Error: Invalid extension sent')
        });

        it('Create Media Attribute is not successfull, media_type parameter is sent as random string', async function () {
            const selMediaType = faker.random.alpha(10);
            const fileAllowedArray = [faker.random.alpha(10)];
            endpoint = creatAttribute(orgId);
            payloadData = attributePayloads.createMediaAttributePayload(attributeNameCode);
            payload = JSON.stringify({
                "name": payloadData.name,
                "code": payloadData.code,
                "type": payloadData.type,
                "media_type": selMediaType,
                "allowed_extensions": fileAllowedArray
            });
            signed_headers = getSignedRequestHeaders("POST", baseUrl, endpoint, payload, {});
            headers = {
                'Content-type': 'application/json;charset=UTF-8',
                'x-ccl-param': signed_headers["headers"]["x-ccl-param"],
                'x-ccl-signature': signed_headers["headers"]["x-ccl-signature"],
                'Cookie': cookie
            };
            res = await request
                .post(endpoint)
                .set(headers)
                .send(payload);
            expect(res.statusCode).to.be.eq(400);
            expect(res.body.error).to.be.eq('Error: Incorrect media type sent')
        });

    });

    describe('Get Attributes @cdm @attributes', async function () {

        describe('Get All attributes test cases', async function () {

            it('Get All Attributes - User is not logged in', async function () {
                endpoint = getAllAttributes(orgId);
                payload = null;
                signed_headers = getSignedRequestHeaders("GET", baseUrl, endpoint, payload, {});
                headers = {
                    'Content-type': 'application/json;charset=UTF-8',
                    'x-ccl-param': signed_headers["headers"]["x-ccl-param"],
                    'x-ccl-signature': signed_headers["headers"]["x-ccl-signature"]
                };
                res = await request
                    .get(endpoint)
                    .set(headers);
                expect(res.statusCode).to.be.eq(403);
                expect(res.body.error).to.be.eq('Unauthorized');
            });

            it('Get All Attributes - User is logged in but invalid orgId is provided', async function () {
                endpoint = getAllAttributes(orgId.substring(0, orgId.length - 1));
                payload = null;
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
                expect(res.statusCode).to.be.eq(401);
                expect(res.body.error).to.be.eq('Invalid organisation');
            });

            it('Get All Attributes - User is logged in', async function () {
                endpoint = getAllAttributes(orgId);
                payload = null;
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
                totalAttributesCount = res.body.item_total;
                let expectedDocumentsInCurrPage;
                if (totalAttributesCount > 10) {
                    expectedDocumentsInCurrPage = 10
                }
                else {
                    expectedDocumentsInCurrPage = totalAttributesCount;
                }
                expect(res.statusCode).to.be.eq(200);
                expect(res.body).to.be.jsonSchema(schemas.getAllAttributesSchema);
                expect(res.body.documentsInCurrPage).to.be.eq(expectedDocumentsInCurrPage);
                expect(res.body.currPage).to.be.eq(1);
            });

            it('Get All Attributes - User is logged in and only active attributes are fetched', async function () {
                endpoint = getAllAttributes(orgId) + "&active=true";
                payload = null;
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
                totalActiveAttributesCount = res.body.item_total;
                let expectedDocumentsInCurrPage;
                if (totalActiveAttributesCount > 10) {
                    expectedDocumentsInCurrPage = 10
                }
                else {
                    expectedDocumentsInCurrPage = totalActiveAttributesCount;
                }
                expect(res.statusCode).to.be.eq(200);
                expect(res.body).to.be.jsonSchema(schemas.getAllAttributesSchema);
                expect(res.body.documentsInCurrPage).to.be.eq(expectedDocumentsInCurrPage);
                expect(res.body.currPage).to.be.eq(1);
                for (let i = 0; i < expectedDocumentsInCurrPage; i++) {
                    expect(res.body.resources[i].active).to.be.true;
                }
            });

            it('Get All Attributes - User is logged in and only inactive attributes are fetched', async function () {
                endpoint = getAllAttributes(orgId) + "&active=false";
                payload = null;
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
                totalInActiveAttributesCount = res.body.item_total;
                let expectedDocumentsInCurrPage;
                if (totalInActiveAttributesCount > 10) {
                    expectedDocumentsInCurrPage = 10
                }
                else {
                    expectedDocumentsInCurrPage = totalInActiveAttributesCount;
                }
                expect(res.statusCode).to.be.eq(200);
                expect(res.body).to.be.jsonSchema(schemas.getAllAttributesSchema);
                expect(res.body.documentsInCurrPage).to.be.eq(expectedDocumentsInCurrPage);
                expect(res.body.currPage).to.be.eq(1);
                for (let i = 0; i < expectedDocumentsInCurrPage; i++) {
                    expect(res.body.resources[i].active).to.be.false;
                }
            });

            it('Get All Attributes - User is logged in and limit is sent as 20', async function () {
                endpoint = getAllAttributes(orgId) + "&limit=20";
                payload = null;
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
                totalAttributesCount = res.body.item_total;
                let expectedDocumentsInCurrPage;
                if (totalAttributesCount > 20) {
                    expectedDocumentsInCurrPage = 20
                }
                else {
                    expectedDocumentsInCurrPage = totalAttributesCount;
                }
                expect(res.statusCode).to.be.eq(200);
                expect(res.body).to.be.jsonSchema(schemas.getAllAttributesSchema);
                expect(res.body.documentsInCurrPage).to.be.eq(expectedDocumentsInCurrPage);
                expect(res.body.currPage).to.be.eq(1);
            });

            it('Get All Attributes - User is logged in and limit is sent as 20 and only active attributes are fetched', async function () {
                endpoint = getAllAttributes(orgId) + "&limit=20&active=true";
                payload = null;
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
                totalActiveAttributesCount = res.body.item_total;
                let expectedDocumentsInCurrPage;
                if (totalActiveAttributesCount > 20) {
                    expectedDocumentsInCurrPage = 20
                }
                else {
                    expectedDocumentsInCurrPage = totalActiveAttributesCount;
                }
                expect(res.statusCode).to.be.eq(200);
                expect(res.body).to.be.jsonSchema(schemas.getAllAttributesSchema);
                expect(res.body.documentsInCurrPage).to.be.eq(expectedDocumentsInCurrPage);
                expect(res.body.currPage).to.be.eq(1);
                for (let i = 0; i < expectedDocumentsInCurrPage; i++) {
                    expect(res.body.resources[i].active).to.be.true;
                }
            });

            it('Get All Attributes - User is logged in and limit is sent as 20 and only inactive attributes are fetched', async function () {
                endpoint = getAllAttributes(orgId) + "&limit=20&active=false";
                payload = null;
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
                totalInActiveAttributesCount = res.body.item_total;
                let expectedDocumentsInCurrPage;
                if (totalInActiveAttributesCount > 20) {
                    expectedDocumentsInCurrPage = 20
                }
                else {
                    expectedDocumentsInCurrPage = totalInActiveAttributesCount;
                }
                expect(res.statusCode).to.be.eq(200);
                expect(res.body).to.be.jsonSchema(schemas.getAllAttributesSchema);
                expect(res.body.documentsInCurrPage).to.be.eq(expectedDocumentsInCurrPage);
                expect(res.body.currPage).to.be.eq(1);
                for (let i = 0; i < expectedDocumentsInCurrPage; i++) {
                    expect(res.body.resources[i].active).to.be.false;
                }
            });

            it('Get All Attributes - For the last and secondLast pages', async function () {
                endpoint = getAllAttributes(orgId);
                let numberOfPages, itemsOnLastPage;
                if (totalAttributesCount % 10 == 0) {
                    numberOfPages = totalAttributesCount / 10;
                    itemsOnLastPage = 10;
                }
                else {
                    numberOfPages = Math.floor(totalAttributesCount / 10) + 1;
                    itemsOnLastPage = totalAttributesCount % 10;
                }
                let modifyiedEndpoint;
                if (numberOfPages > 1) {
                    for (let i = numberOfPages - 1; i <= numberOfPages; i++) {
                        if (i != numberOfPages) {
                            modifyiedEndpoint = endpoint.substring(0, endpoint.length - 1) + i;
                            signed_headers = getSignedRequestHeaders("GET", baseUrl, modifyiedEndpoint, payload, {});
                            headers = {
                                'Content-type': 'application/json;charset=UTF-8',
                                'x-ccl-param': signed_headers["headers"]["x-ccl-param"],
                                'x-ccl-signature': signed_headers["headers"]["x-ccl-signature"],
                                'Cookie': cookie
                            };
                            res = await request
                                .get(modifyiedEndpoint)
                                .set(headers);
                            expect(res.statusCode).to.be.eq(200);
                            expect(res.body).to.be.jsonSchema(schemas.getAllAttributesSchema);
                            expect(res.body.documentsInCurrPage).to.be.eq(10);
                            expect(res.body.currPage).to.be.eq(i);
                        }
                        else if (i === numberOfPages) {
                            modifyiedEndpoint = endpoint.substring(0, endpoint.length - 1) + i;
                            signed_headers = getSignedRequestHeaders("GET", baseUrl, modifyiedEndpoint, payload, {});
                            headers = {
                                'Content-type': 'application/json;charset=UTF-8',
                                'x-ccl-param': signed_headers["headers"]["x-ccl-param"],
                                'x-ccl-signature': signed_headers["headers"]["x-ccl-signature"],
                                'Cookie': cookie
                            };
                            res = await request
                                .get(modifyiedEndpoint)
                                .set(headers);
                            expect(res.statusCode).to.be.eq(200);
                            expect(res.body).to.be.jsonSchema(schemas.getAllAttributesSchema);
                            expect(res.body.documentsInCurrPage).to.be.eq(itemsOnLastPage);
                            expect(res.body.currPage).to.be.eq(i);
                        }
                    }
                }
            });

            it('Get All Attributes - For all the last and secondLast pages when limit is set to 20', async function () {
                endpoint = getAllAttributes(orgId);
                let numberOfPages, itemsOnLastPage;
                if (totalAttributesCount % 20 == 0) {
                    numberOfPages = totalAttributesCount / 20;
                    itemsOnLastPage = 20;
                }
                else {
                    numberOfPages = Math.floor(totalAttributesCount / 20) + 1;
                    itemsOnLastPage = totalAttributesCount % 20;
                }
                let modifyiedEndpoint;
                if (numberOfPages > 1) {
                    for (let i = numberOfPages - 1; i <= numberOfPages; i++) {
                        if (i != numberOfPages) {
                            modifyiedEndpoint = endpoint.substring(0, endpoint.length - 1) + i + "&limit=20";
                            signed_headers = getSignedRequestHeaders("GET", baseUrl, modifyiedEndpoint, payload, {});
                            headers = {
                                'Content-type': 'application/json;charset=UTF-8',
                                'x-ccl-param': signed_headers["headers"]["x-ccl-param"],
                                'x-ccl-signature': signed_headers["headers"]["x-ccl-signature"],
                                'Cookie': cookie
                            };
                            res = await request
                                .get(modifyiedEndpoint)
                                .set(headers);
                            expect(res.statusCode).to.be.eq(200);
                            expect(res.body).to.be.jsonSchema(schemas.getAllAttributesSchema);
                            expect(res.body.documentsInCurrPage).to.be.eq(20);
                            expect(res.body.currPage).to.be.eq(i);
                        }
                        else if (i === numberOfPages) {
                            modifyiedEndpoint = endpoint.substring(0, endpoint.length - 1) + i + "&limit=20";
                            signed_headers = getSignedRequestHeaders("GET", baseUrl, modifyiedEndpoint, payload, {});
                            headers = {
                                'Content-type': 'application/json;charset=UTF-8',
                                'x-ccl-param': signed_headers["headers"]["x-ccl-param"],
                                'x-ccl-signature': signed_headers["headers"]["x-ccl-signature"],
                                'Cookie': cookie
                            };
                            res = await request
                                .get(modifyiedEndpoint)
                                .set(headers);
                            expect(res.statusCode).to.be.eq(200);
                            expect(res.body).to.be.jsonSchema(schemas.getAllAttributesSchema);
                            expect(res.body.documentsInCurrPage).to.be.eq(itemsOnLastPage);
                            expect(res.body.currPage).to.be.eq(i);
                        }
                    }
                }
            });

            it('Get All Attributes - For all the last and secondLast pages when limit is set to 20 and only fetching active attributes', async function () {
                endpoint = getAllAttributes(orgId);
                let numberOfPages, itemsOnLastPage;
                if (totalActiveAttributesCount % 20 == 0) {
                    numberOfPages = totalActiveAttributesCount / 20;
                    itemsOnLastPage = 20;
                }
                else {
                    numberOfPages = Math.floor(totalActiveAttributesCount / 20) + 1;
                    itemsOnLastPage = totalActiveAttributesCount % 20;
                }
                let modifyiedEndpoint;
                if (numberOfPages > 1) {
                    for (let i = numberOfPages - 1; i <= numberOfPages; i++) {
                        if (i != numberOfPages) {
                            modifyiedEndpoint = endpoint.substring(0, endpoint.length - 1) + i + "&limit=20&active=true";
                            signed_headers = getSignedRequestHeaders("GET", baseUrl, modifyiedEndpoint, payload, {});
                            headers = {
                                'Content-type': 'application/json;charset=UTF-8',
                                'x-ccl-param': signed_headers["headers"]["x-ccl-param"],
                                'x-ccl-signature': signed_headers["headers"]["x-ccl-signature"],
                                'Cookie': cookie
                            };
                            res = await request
                                .get(modifyiedEndpoint)
                                .set(headers);
                            expect(res.statusCode).to.be.eq(200);
                            expect(res.body).to.be.jsonSchema(schemas.getAllAttributesSchema);
                            expect(res.body.documentsInCurrPage).to.be.eq(20);
                            expect(res.body.currPage).to.be.eq(i);
                            for (let i = 0; i < 20; i++) {
                                expect(res.body.resources[i].active).to.be.true;
                            }
                        }
                        else if (i === numberOfPages) {
                            modifyiedEndpoint = endpoint.substring(0, endpoint.length - 1) + i + "&limit=20&active=true";
                            signed_headers = getSignedRequestHeaders("GET", baseUrl, modifyiedEndpoint, payload, {});
                            headers = {
                                'Content-type': 'application/json;charset=UTF-8',
                                'x-ccl-param': signed_headers["headers"]["x-ccl-param"],
                                'x-ccl-signature': signed_headers["headers"]["x-ccl-signature"],
                                'Cookie': cookie
                            };
                            res = await request
                                .get(modifyiedEndpoint)
                                .set(headers);
                            expect(res.statusCode).to.be.eq(200);
                            expect(res.body).to.be.jsonSchema(schemas.getAllAttributesSchema);
                            expect(res.body.documentsInCurrPage).to.be.eq(itemsOnLastPage);
                            expect(res.body.currPage).to.be.eq(i);
                            for (let i = 0; i < itemsOnLastPage; i++) {
                                expect(res.body.resources[i].active).to.be.true;
                            }
                        }
                    }
                }
            });

            it('Get All Attributes - For all the last and secondLast pages when limit is set to 20 and only fetching inactive attributes', async function () {
                endpoint = getAllAttributes(orgId);
                let numberOfPages, itemsOnLastPage;
                if (totalInActiveAttributesCount % 20 == 0) {
                    numberOfPages = totalInActiveAttributesCount / 20;
                    itemsOnLastPage = 20;
                }
                else {
                    numberOfPages = Math.floor(totalInActiveAttributesCount / 20) + 1;
                    itemsOnLastPage = totalInActiveAttributesCount % 20;
                }
                let modifyiedEndpoint;
                if (numberOfPages > 1) {
                    for (let i = numberOfPages - 1; i <= numberOfPages; i++) {
                        if (i != numberOfPages) {
                            modifyiedEndpoint = endpoint.substring(0, endpoint.length - 1) + i + "&limit=20&active=false";
                            signed_headers = getSignedRequestHeaders("GET", baseUrl, modifyiedEndpoint, payload, {});
                            headers = {
                                'Content-type': 'application/json;charset=UTF-8',
                                'x-ccl-param': signed_headers["headers"]["x-ccl-param"],
                                'x-ccl-signature': signed_headers["headers"]["x-ccl-signature"],
                                'Cookie': cookie
                            };
                            res = await request
                                .get(modifyiedEndpoint)
                                .set(headers);
                            expect(res.statusCode).to.be.eq(200);
                            expect(res.body).to.be.jsonSchema(schemas.getAllAttributesSchema);
                            expect(res.body.documentsInCurrPage).to.be.eq(20);
                            expect(res.body.currPage).to.be.eq(i);
                            for (let i = 0; i < 20; i++) {
                                expect(res.body.resources[i].active).to.be.false;
                            }
                        }
                        else if (i === numberOfPages) {
                            modifyiedEndpoint = endpoint.substring(0, endpoint.length - 1) + i + "&limit=20&active=false";
                            signed_headers = getSignedRequestHeaders("GET", baseUrl, modifyiedEndpoint, payload, {});
                            headers = {
                                'Content-type': 'application/json;charset=UTF-8',
                                'x-ccl-param': signed_headers["headers"]["x-ccl-param"],
                                'x-ccl-signature': signed_headers["headers"]["x-ccl-signature"],
                                'Cookie': cookie
                            };
                            res = await request
                                .get(modifyiedEndpoint)
                                .set(headers);
                            expect(res.statusCode).to.be.eq(200);
                            expect(res.body).to.be.jsonSchema(schemas.getAllAttributesSchema);
                            expect(res.body.documentsInCurrPage).to.be.eq(itemsOnLastPage);
                            expect(res.body.currPage).to.be.eq(i);
                            for (let i = 0; i < itemsOnLastPage; i++) {
                                expect(res.body.resources[i].active).to.be.false;
                            }
                        }
                    }
                }
            });

            it('Get All Attributes - Page has no data', async function () {
                endpoint = getAllAttributes(orgId);
                let invalidPageNumber;
                if (totalAttributesCount % 10 == 0) {
                    invalidPageNumber = totalAttributesCount / 10 + 1;
                }
                else {
                    invalidPageNumber = Math.floor(totalAttributesCount / 10) + 2;
                }
                let modifyiedEndpoint = endpoint.substring(0, endpoint.length - 1) + invalidPageNumber;
                payload = null;
                signed_headers = getSignedRequestHeaders("GET", baseUrl, modifyiedEndpoint, payload, {});
                headers = {
                    'Content-type': 'application/json;charset=UTF-8',
                    'x-ccl-param': signed_headers["headers"]["x-ccl-param"],
                    'x-ccl-signature': signed_headers["headers"]["x-ccl-signature"],
                    'Cookie': cookie
                };
                res = await request
                    .get(modifyiedEndpoint)
                    .set(headers);
                expect(res.statusCode).to.be.eq(200);
                expect(res.body).to.be.jsonSchema(schemas.getAllAttributesSchema);
                expect(res.body.documentsInCurrPage).to.be.eq(0);
                expect(res.body.currPage).to.be.eq(invalidPageNumber);
                expect(res.body.resources.length).to.be.eq(0);
            });
        });

        describe('Get Specific attributes test cases', async function () {

            it('Get Specific attribute, user is not logged in', async function () {
                attId = FO.getValueFromFile(attributeDetailsFile, 'ShortTextRandom');
                endpoint = getSpecificAttributes(orgId, attId);
                payload = null;
                signed_headers = getSignedRequestHeaders("GET", baseUrl, endpoint, payload, {});
                headers = {
                    'Content-type': 'application/json;charset=UTF-8',
                    'x-ccl-param': signed_headers["headers"]["x-ccl-param"],
                    'x-ccl-signature': signed_headers["headers"]["x-ccl-signature"]
                };
                res = await request
                    .get(endpoint)
                    .set(headers);
                expect(res.statusCode).to.be.eq(403);
                expect(res.body.error).to.be.eq('Unauthorized');
            });

            it('Get Specific Attributes - User is logged in but invalid orgId is provided', async function () {
                attId = FO.getValueFromFile(attributeDetailsFile, 'ShortTextRandom');
                endpoint = getSpecificAttributes(orgId.substring(0, orgId.length - 1), attId);
                payload = null;
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
                expect(res.statusCode).to.be.eq(401);
                expect(res.body.error).to.be.eq('Invalid organisation');
            });

            it('Get Specific Attributes - Invalid attribute id is sent', async function () {
                attId = FO.getValueFromFile(attributeDetailsFile, 'ShortTextRandom');
                endpoint = getSpecificAttributes(orgId, attId.substring(0, attId.length - 1));
                payload = null;
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
                expect(res.statusCode).to.be.eq(404);
                expect(res.body.error).to.be.eq('Unable to find attribute with given ID.');
            });

            it('Get Specific Attributes - Get ShortText type Attribute', async function () {
                attId = FO.getValueFromFile(attributeDetailsFile, 'ShortTextRandom');
                endpoint = getSpecificAttributes(orgId, attId);
                payload = null;
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
                expect(res.body).to.be.jsonSchema(schemas.getShortTextAttributeSchema);
            });

            it('Get Specific Attributes - Get Paragraph type Attribute', async function () {
                attId = FO.getValueFromFile(attributeDetailsFile, 'ParagraphRandom');
                endpoint = getSpecificAttributes(orgId, attId);
                payload = null;
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
                expect(res.body).to.be.jsonSchema(schemas.getParagraphAttributeSchema);
            });

            it('Get Specific Attributes - Get HTML type Attribute', async function () {
                attId = FO.getValueFromFile(attributeDetailsFile, 'HTMLRandom');
                endpoint = getSpecificAttributes(orgId, attId);
                payload = null;
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
                expect(res.body).to.be.jsonSchema(schemas.getBasicAttributeSchema);
            });

            it('Get Specific Attributes - Get Date type Attribute', async function () {
                attId = FO.getValueFromFile(attributeDetailsFile, 'DateRandom');
                endpoint = getSpecificAttributes(orgId, attId);
                payload = null;
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
                expect(res.body).to.be.jsonSchema(schemas.getBasicAttributeSchema);
            });

            it('Get Specific Attributes - Get Boolean type Attribute', async function () {
                attId = FO.getValueFromFile(attributeDetailsFile, 'BooleanRandom');
                endpoint = getSpecificAttributes(orgId, attId);
                payload = null;
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
                expect(res.body).to.be.jsonSchema(schemas.getBasicAttributeSchema);
            });

            it('Get Specific Attributes - Get URL type Attribute', async function () {
                attId = FO.getValueFromFile(attributeDetailsFile, 'URLRandom');
                endpoint = getSpecificAttributes(orgId, attId);
                payload = null;
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
                expect(res.body).to.be.jsonSchema(schemas.getBasicAttributeSchema);
            });

            it('Get Specific Attributes - Get Number type Attribute', async function () {
                attId = FO.getValueFromFile(attributeDetailsFile, 'NumberRandom');
                endpoint = getSpecificAttributes(orgId, attId);
                payload = null;
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
                expect(res.body).to.be.jsonSchema(schemas.getNumDecAttributeSchema);
            });

            it('Get Specific Attributes - Get Decimal type Attribute', async function () {
                attId = FO.getValueFromFile(attributeDetailsFile, 'DecimalRandom');
                endpoint = getSpecificAttributes(orgId, attId);
                payload = null;
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
                expect(res.body).to.be.jsonSchema(schemas.getNumDecAttributeSchema);
            });

            it('Get Specific Attributes - Get File type Attribute', async function () {
                attId = FO.getValueFromFile(attributeDetailsFile, 'FileRandom');
                endpoint = getSpecificAttributes(orgId, attId);
                payload = null;
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
                expect(res.body).to.be.jsonSchema(schemas.getFileMedAttributeSchema);
            });

            it('Get Specific Attributes - Get Media type Attribute', async function () {
                attId = FO.getValueFromFile(attributeDetailsFile, 'MediaRandom');
                endpoint = getSpecificAttributes(orgId, attId);
                payload = null;
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
                expect(res.body).to.be.jsonSchema(schemas.getFileMedAttributeSchema);
            });
        });
    });

    describe('Update Specific Attributes @cdm @attributes', async function () {

        it('Update Specific attribute, user is not logged in', async function () {
            attId = FO.getValueFromFile(attributeDetailsFile, 'ShortTextRandom');
            endpoint = update_delete_SpecificAttributes(orgId, attId);
            payloadData = attributePayloads.createShortTextAttributePayload('ShortTextRandomUp');
            payload = {
                active: payloadData.active,
                name: payloadData.name,
                description: payloadData.description
            }
            payloadJSON = JSON.stringify(payload);
            signed_headers = getSignedRequestHeaders("PATCH", baseUrl, endpoint, payloadJSON, {});
            headers = {
                'Content-type': 'application/json;charset=UTF-8',
                'x-ccl-param': signed_headers["headers"]["x-ccl-param"],
                'x-ccl-signature': signed_headers["headers"]["x-ccl-signature"]
            };
            res = await request
                .patch(endpoint)
                .set(headers)
                .send(payloadJSON);
            expect(res.statusCode).to.be.eq(403);
            expect(res.body.error).to.be.eq('Unauthorized');
        });

        it('Update Specific Attributes - User is logged in but invalid orgId is provided', async function () {
            attId = FO.getValueFromFile(attributeDetailsFile, 'ShortTextRandom');
            endpoint = update_delete_SpecificAttributes(orgId.substring(0, orgId.length - 1), attId);
            payloadData = attributePayloads.createShortTextAttributePayload('ShortTextRandomUp');
            payload = {
                active: payloadData.active,
                name: payloadData.name,
                description: payloadData.description
            }
            payloadJSON = JSON.stringify(payload);
            signed_headers = getSignedRequestHeaders("PATCH", baseUrl, endpoint, payloadJSON, {});
            headers = {
                'Content-type': 'application/json;charset=UTF-8',
                'x-ccl-param': signed_headers["headers"]["x-ccl-param"],
                'x-ccl-signature': signed_headers["headers"]["x-ccl-signature"],
                'Cookie': cookie
            };
            res = await request
                .patch(endpoint)
                .set(headers)
                .send(payloadJSON);
            expect(res.statusCode).to.be.eq(401);
            expect(res.body.error).to.be.eq('Invalid organisation');
        });

        it('Update Specific Attributes - Invalid attribute id is sent', async function () {
            attId = FO.getValueFromFile(attributeDetailsFile, 'ShortTextRandom');
            endpoint = update_delete_SpecificAttributes(orgId, attId.substring(0, attId.length - 1));
            payloadData = attributePayloads.createShortTextAttributePayload('ShortTextRandomUp');
            payload = {
                active: payloadData.active,
                name: payloadData.name,
                description: payloadData.description
            }
            payloadJSON = JSON.stringify(payload);
            signed_headers = getSignedRequestHeaders("PATCH", baseUrl, endpoint, payloadJSON, {});
            headers = {
                'Content-type': 'application/json;charset=UTF-8',
                'x-ccl-param': signed_headers["headers"]["x-ccl-param"],
                'x-ccl-signature': signed_headers["headers"]["x-ccl-signature"],
                'Cookie': cookie
            };
            res = await request
                .patch(endpoint)
                .set(headers)
                .send(payloadJSON);
            expect(res.statusCode).to.be.eq(404);
            expect(res.body.error).to.be.eq('Unable to find attribute with given ID.');
        });

        it('Update Specific Attributes - Updating Short Text Attribute', async function () {
            attId = FO.getValueFromFile(attributeDetailsFile, 'ShortTextRandom');
            endpoint = update_delete_SpecificAttributes(orgId, attId);
            payloadData = attributePayloads.createShortTextAttributePayload('ShortTextRandomUp');
            payload = {
                active: payloadData.active,
                name: payloadData.name,
                description: payloadData.description
            }
            payloadJSON = JSON.stringify(payload);
            signed_headers = getSignedRequestHeaders("PATCH", baseUrl, endpoint, payloadJSON, {});
            headers = {
                'Content-type': 'application/json;charset=UTF-8',
                'x-ccl-param': signed_headers["headers"]["x-ccl-param"],
                'x-ccl-signature': signed_headers["headers"]["x-ccl-signature"],
                'Cookie': cookie
            };
            res = await request
                .patch(endpoint)
                .set(headers)
                .send(payloadJSON);
            expect(res.statusCode).to.be.eq(200);
            expect(res.body).to.be.jsonSchema(schemas.getShortTextAttributeSchema);
            expect(res.body.active).to.be.eq(payloadData.active);
            expect(res.body.name).to.be.eq(payloadData.name);
            expect(res.body.description).to.be.eq(payloadData.description);
        });

        it('Update Specific Attributes - Updating Paragraph Attribute', async function () {
            attId = FO.getValueFromFile(attributeDetailsFile, 'ParagraphRandom');
            endpoint = update_delete_SpecificAttributes(orgId, attId);
            payloadData = attributePayloads.createParagraphAttributePayload('ParagraphRandomUp');
            payload = {
                active: payloadData.active,
                name: payloadData.name,
                description: payloadData.description
            }
            payloadJSON = JSON.stringify(payload);
            signed_headers = getSignedRequestHeaders("PATCH", baseUrl, endpoint, payloadJSON, {});
            headers = {
                'Content-type': 'application/json;charset=UTF-8',
                'x-ccl-param': signed_headers["headers"]["x-ccl-param"],
                'x-ccl-signature': signed_headers["headers"]["x-ccl-signature"],
                'Cookie': cookie
            };
            res = await request
                .patch(endpoint)
                .set(headers)
                .send(payloadJSON);
            expect(res.statusCode).to.be.eq(200);
            expect(res.body).to.be.jsonSchema(schemas.getParagraphAttributeSchema);
            expect(res.body.active).to.be.eq(payloadData.active);
            expect(res.body.name).to.be.eq(payloadData.name);
            expect(res.body.description).to.be.eq(payloadData.description);
        });

        it('Update Specific Attributes - Updating HTML Attribute', async function () {
            attId = FO.getValueFromFile(attributeDetailsFile, 'HTMLRandom');
            endpoint = update_delete_SpecificAttributes(orgId, attId);
            payloadData = attributePayloads.attributePayloadBasicType('HTMLRandomUp');
            payload = {
                active: payloadData.active,
                name: payloadData.name,
                description: payloadData.description
            }
            payloadJSON = JSON.stringify(payload);
            signed_headers = getSignedRequestHeaders("PATCH", baseUrl, endpoint, payloadJSON, {});
            headers = {
                'Content-type': 'application/json;charset=UTF-8',
                'x-ccl-param': signed_headers["headers"]["x-ccl-param"],
                'x-ccl-signature': signed_headers["headers"]["x-ccl-signature"],
                'Cookie': cookie
            };
            res = await request
                .patch(endpoint)
                .set(headers)
                .send(payloadJSON);
            expect(res.statusCode).to.be.eq(200);
            expect(res.body).to.be.jsonSchema(schemas.getBasicAttributeSchema);
            expect(res.body.active).to.be.eq(payloadData.active);
            expect(res.body.name).to.be.eq(payloadData.name);
            expect(res.body.description).to.be.eq(payloadData.description);
        });

        it('Update Specific Attributes - Updating URL Attribute', async function () {
            attId = FO.getValueFromFile(attributeDetailsFile, 'URLRandom');
            endpoint = update_delete_SpecificAttributes(orgId, attId);
            payloadData = attributePayloads.attributePayloadBasicType('URLRandomUp');
            payload = {
                active: payloadData.active,
                name: payloadData.name,
                description: payloadData.description
            }
            payloadJSON = JSON.stringify(payload);
            signed_headers = getSignedRequestHeaders("PATCH", baseUrl, endpoint, payloadJSON, {});
            headers = {
                'Content-type': 'application/json;charset=UTF-8',
                'x-ccl-param': signed_headers["headers"]["x-ccl-param"],
                'x-ccl-signature': signed_headers["headers"]["x-ccl-signature"],
                'Cookie': cookie
            };
            res = await request
                .patch(endpoint)
                .set(headers)
                .send(payloadJSON);
            expect(res.statusCode).to.be.eq(200);
            expect(res.body).to.be.jsonSchema(schemas.getBasicAttributeSchema);
            expect(res.body.active).to.be.eq(payloadData.active);
            expect(res.body.name).to.be.eq(payloadData.name);
            expect(res.body.description).to.be.eq(payloadData.description);
        });

        it('Update Specific Attributes - Updating Date Attribute', async function () {
            attId = FO.getValueFromFile(attributeDetailsFile, 'DateRandom');
            endpoint = update_delete_SpecificAttributes(orgId, attId);
            payloadData = attributePayloads.attributePayloadBasicType('DateRandomUp');
            payload = {
                active: payloadData.active,
                name: payloadData.name,
                description: payloadData.description
            }
            payloadJSON = JSON.stringify(payload);
            signed_headers = getSignedRequestHeaders("PATCH", baseUrl, endpoint, payloadJSON, {});
            headers = {
                'Content-type': 'application/json;charset=UTF-8',
                'x-ccl-param': signed_headers["headers"]["x-ccl-param"],
                'x-ccl-signature': signed_headers["headers"]["x-ccl-signature"],
                'Cookie': cookie
            };
            res = await request
                .patch(endpoint)
                .set(headers)
                .send(payloadJSON);
            expect(res.statusCode).to.be.eq(200);
            expect(res.body).to.be.jsonSchema(schemas.getBasicAttributeSchema);
            expect(res.body.active).to.be.eq(payloadData.active);
            expect(res.body.name).to.be.eq(payloadData.name);
            expect(res.body.description).to.be.eq(payloadData.description);
        });

        it('Update Specific Attributes - Updating Boolean Attribute', async function () {
            attId = FO.getValueFromFile(attributeDetailsFile, 'BooleanRandom');
            endpoint = update_delete_SpecificAttributes(orgId, attId);
            payloadData = attributePayloads.attributePayloadBasicType('BooleanRandomUp');
            payload = {
                active: payloadData.active,
                name: payloadData.name,
                description: payloadData.description
            }
            payloadJSON = JSON.stringify(payload);
            signed_headers = getSignedRequestHeaders("PATCH", baseUrl, endpoint, payloadJSON, {});
            headers = {
                'Content-type': 'application/json;charset=UTF-8',
                'x-ccl-param': signed_headers["headers"]["x-ccl-param"],
                'x-ccl-signature': signed_headers["headers"]["x-ccl-signature"],
                'Cookie': cookie
            };
            res = await request
                .patch(endpoint)
                .set(headers)
                .send(payloadJSON);
            expect(res.statusCode).to.be.eq(200);
            expect(res.body).to.be.jsonSchema(schemas.getBasicAttributeSchema);
            expect(res.body.active).to.be.eq(payloadData.active);
            expect(res.body.name).to.be.eq(payloadData.name);
            expect(res.body.description).to.be.eq(payloadData.description);
        });

        it('Update Specific Attributes - Updating Number Attribute', async function () {
            attId = FO.getValueFromFile(attributeDetailsFile, 'NumberRandom');
            endpoint = update_delete_SpecificAttributes(orgId, attId);
            payloadData = attributePayloads.createNumberAttributePayload('NumberRandomUp');
            payload = {
                active: payloadData.active,
                name: payloadData.name,
                description: payloadData.description
            }
            payloadJSON = JSON.stringify(payload);
            signed_headers = getSignedRequestHeaders("PATCH", baseUrl, endpoint, payloadJSON, {});
            headers = {
                'Content-type': 'application/json;charset=UTF-8',
                'x-ccl-param': signed_headers["headers"]["x-ccl-param"],
                'x-ccl-signature': signed_headers["headers"]["x-ccl-signature"],
                'Cookie': cookie
            };
            res = await request
                .patch(endpoint)
                .set(headers)
                .send(payloadJSON);
            expect(res.statusCode).to.be.eq(200);
            expect(res.body).to.be.jsonSchema(schemas.getNumDecAttributeSchema);
            expect(res.body.active).to.be.eq(payloadData.active);
            expect(res.body.name).to.be.eq(payloadData.name);
            expect(res.body.description).to.be.eq(payloadData.description);
        });

        it('Update Specific Attributes - Updating max parameter as positive integer for Number Attribute', async function () {
            attId = FO.getValueFromFile(attributeDetailsFile, 'NumberMaxNeg');
            endpoint = update_delete_SpecificAttributes(orgId, attId);
            const maxVal = faker.datatype.number({ min: 0, max: 100000 });
            payload = {
                max: maxVal
            }
            payloadJSON = JSON.stringify(payload);
            signed_headers = getSignedRequestHeaders("PATCH", baseUrl, endpoint, payloadJSON, {});
            headers = {
                'Content-type': 'application/json;charset=UTF-8',
                'x-ccl-param': signed_headers["headers"]["x-ccl-param"],
                'x-ccl-signature': signed_headers["headers"]["x-ccl-signature"],
                'Cookie': cookie
            };
            res = await request
                .patch(endpoint)
                .set(headers)
                .send(payloadJSON);
            expect(res.statusCode).to.be.eq(200);
            expect(res.body).to.be.jsonSchema(schemas.getNumDecAttributeSchema);
            expect(res.body.max).to.be.eq(maxVal);
        });

        it('Update Specific Attributes - Updating max parameter as negative integer for Number Attribute', async function () {
            attId = FO.getValueFromFile(attributeDetailsFile, 'NumberMaxNeg');
            endpoint = update_delete_SpecificAttributes(orgId, attId);
            const maxVal = faker.datatype.number({ min: -100000, max: -1 });
            payload = {
                max: maxVal
            }
            payloadJSON = JSON.stringify(payload);
            signed_headers = getSignedRequestHeaders("PATCH", baseUrl, endpoint, payloadJSON, {});
            headers = {
                'Content-type': 'application/json;charset=UTF-8',
                'x-ccl-param': signed_headers["headers"]["x-ccl-param"],
                'x-ccl-signature': signed_headers["headers"]["x-ccl-signature"],
                'Cookie': cookie
            };
            res = await request
                .patch(endpoint)
                .set(headers)
                .send(payloadJSON);
            expect(res.statusCode).to.be.eq(200);
            expect(res.body).to.be.jsonSchema(schemas.getNumDecAttributeSchema);
            expect(res.body.max).to.be.eq(maxVal);
        });

        it('Update Specific Attributes - Updating Max parameter for Number Attribute which does not have Max parameter set', async function () {
            attId = FO.getValueFromFile(attributeDetailsFile, 'NumberMin');
            endpoint = update_delete_SpecificAttributes(orgId, attId);
            const minVal = FO.getValueFromFile(attributeDetailsFile, 'NumberMinValue');
            const maxVal = faker.datatype.number({ min: minVal, max: 100000 });
            payload = {
                max: maxVal
            }
            payloadJSON = JSON.stringify(payload);
            signed_headers = getSignedRequestHeaders("PATCH", baseUrl, endpoint, payloadJSON, {});
            headers = {
                'Content-type': 'application/json;charset=UTF-8',
                'x-ccl-param': signed_headers["headers"]["x-ccl-param"],
                'x-ccl-signature': signed_headers["headers"]["x-ccl-signature"],
                'Cookie': cookie
            };
            res = await request
                .patch(endpoint)
                .set(headers)
                .send(payloadJSON);
            expect(res.statusCode).to.be.eq(200);
            expect(res.body).to.be.jsonSchema(schemas.getNumDecAttributeSchema);
            expect(res.body.max).to.be.eq(maxVal);
        });

        it('Update Specific Attributes - Updating max parameter as 0 for Number Attribute', async function () {
            attId = FO.getValueFromFile(attributeDetailsFile, 'NumberMin');
            endpoint = update_delete_SpecificAttributes(orgId, attId);
            const maxVal = 0;
            payload = {
                max: maxVal
            }
            payloadJSON = JSON.stringify(payload);
            signed_headers = getSignedRequestHeaders("PATCH", baseUrl, endpoint, payloadJSON, {});
            headers = {
                'Content-type': 'application/json;charset=UTF-8',
                'x-ccl-param': signed_headers["headers"]["x-ccl-param"],
                'x-ccl-signature': signed_headers["headers"]["x-ccl-signature"],
                'Cookie': cookie
            };
            res = await request
                .patch(endpoint)
                .set(headers)
                .send(payloadJSON);
            expect(res.statusCode).to.be.eq(200);
            expect(res.body).to.be.jsonSchema(schemas.getNumDecAttributeSchema);
            expect(res.body.max).to.be.eq(maxVal);
        });

        it('Update Specific Attributes - Updating min parameter as positive integer for Number Attribute', async function () {
            attId = FO.getValueFromFile(attributeDetailsFile, 'NumberMinNeg');
            endpoint = update_delete_SpecificAttributes(orgId, attId);
            const minVal = faker.datatype.number({ min: 0, max: 100000 });
            payload = {
                min: minVal
            }
            payloadJSON = JSON.stringify(payload);
            signed_headers = getSignedRequestHeaders("PATCH", baseUrl, endpoint, payloadJSON, {});
            headers = {
                'Content-type': 'application/json;charset=UTF-8',
                'x-ccl-param': signed_headers["headers"]["x-ccl-param"],
                'x-ccl-signature': signed_headers["headers"]["x-ccl-signature"],
                'Cookie': cookie
            };
            res = await request
                .patch(endpoint)
                .set(headers)
                .send(payloadJSON);
            expect(res.statusCode).to.be.eq(200);
            expect(res.body).to.be.jsonSchema(schemas.getNumDecAttributeSchema);
            expect(res.body.min).to.be.eq(minVal);
        });

        it('Update Specific Attributes - Updating min parameter as negative integer for Number Attribute', async function () {
            attId = FO.getValueFromFile(attributeDetailsFile, 'NumberMinNeg');
            endpoint = update_delete_SpecificAttributes(orgId, attId);
            const minVal = faker.datatype.number({ min: -100000, max: -1 });
            payload = {
                min: minVal
            }
            payloadJSON = JSON.stringify(payload);
            signed_headers = getSignedRequestHeaders("PATCH", baseUrl, endpoint, payloadJSON, {});
            headers = {
                'Content-type': 'application/json;charset=UTF-8',
                'x-ccl-param': signed_headers["headers"]["x-ccl-param"],
                'x-ccl-signature': signed_headers["headers"]["x-ccl-signature"],
                'Cookie': cookie
            };
            res = await request
                .patch(endpoint)
                .set(headers)
                .send(payloadJSON);
            expect(res.statusCode).to.be.eq(200);
            expect(res.body).to.be.jsonSchema(schemas.getNumDecAttributeSchema);
            expect(res.body.min).to.be.eq(minVal);
        });

        it('Update Specific Attributes - Updating Min parameter for Number Attribute which does not have Min parameter set', async function () {
            attId = FO.getValueFromFile(attributeDetailsFile, 'NumberMax');
            endpoint = update_delete_SpecificAttributes(orgId, attId);
            const maxVal = FO.getValueFromFile(attributeDetailsFile, 'NumberMaxValue');
            const minVal = faker.datatype.number({ min: -100000, max: maxVal });
            payload = {
                min: minVal
            }
            payloadJSON = JSON.stringify(payload);
            signed_headers = getSignedRequestHeaders("PATCH", baseUrl, endpoint, payloadJSON, {});
            headers = {
                'Content-type': 'application/json;charset=UTF-8',
                'x-ccl-param': signed_headers["headers"]["x-ccl-param"],
                'x-ccl-signature': signed_headers["headers"]["x-ccl-signature"],
                'Cookie': cookie
            };
            res = await request
                .patch(endpoint)
                .set(headers)
                .send(payloadJSON);
            expect(res.statusCode).to.be.eq(200);
            expect(res.body).to.be.jsonSchema(schemas.getNumDecAttributeSchema);
            expect(res.body.min).to.be.eq(minVal);
        });

        it('Update Specific Attributes - Updating min parameter as 0 for Number Attribute', async function () {
            attId = FO.getValueFromFile(attributeDetailsFile, 'NumberMax');
            endpoint = update_delete_SpecificAttributes(orgId, attId);
            const minVal = 0;
            payload = {
                min: minVal
            }
            payloadJSON = JSON.stringify(payload);
            signed_headers = getSignedRequestHeaders("PATCH", baseUrl, endpoint, payloadJSON, {});
            headers = {
                'Content-type': 'application/json;charset=UTF-8',
                'x-ccl-param': signed_headers["headers"]["x-ccl-param"],
                'x-ccl-signature': signed_headers["headers"]["x-ccl-signature"],
                'Cookie': cookie
            };
            res = await request
                .patch(endpoint)
                .set(headers)
                .send(payloadJSON);
            expect(res.statusCode).to.be.eq(200);
            expect(res.body).to.be.jsonSchema(schemas.getNumDecAttributeSchema);
            expect(res.body.min).to.be.eq(minVal);
        });

        it('Update Specific Attributes - Update Call fails when min parameter value is greater than max parameter for Number Attribute', async function () {
            attId = FO.getValueFromFile(attributeDetailsFile, 'NumberRandom');
            endpoint = update_delete_SpecificAttributes(orgId, attId);
            const minVal = FO.getValueFromFile(attributeDetailsFile, 'NumberRandomMax') + 1;
            payload = {
                min: minVal
            }
            payloadJSON = JSON.stringify(payload);
            signed_headers = getSignedRequestHeaders("PATCH", baseUrl, endpoint, payloadJSON, {});
            headers = {
                'Content-type': 'application/json;charset=UTF-8',
                'x-ccl-param': signed_headers["headers"]["x-ccl-param"],
                'x-ccl-signature': signed_headers["headers"]["x-ccl-signature"],
                'Cookie': cookie
            };
            res = await request
                .patch(endpoint)
                .set(headers)
                .send(payloadJSON);
            expect(res.statusCode).to.be.eq(400);
            expect(res.body.error).to.be.eq(`Max value cannot be less than min value`);
        });

        it('Update Specific Attributes - Update Call fails when Max parameter value is lesser than Min parameter for Number Attribute', async function () {
            attId = FO.getValueFromFile(attributeDetailsFile, 'NumberRandom');
            endpoint = update_delete_SpecificAttributes(orgId, attId);
            const maxVal = FO.getValueFromFile(attributeDetailsFile, 'NumberRandomMin') - 1;
            payload = {
                max: maxVal
            }
            payloadJSON = JSON.stringify(payload);
            signed_headers = getSignedRequestHeaders("PATCH", baseUrl, endpoint, payloadJSON, {});
            headers = {
                'Content-type': 'application/json;charset=UTF-8',
                'x-ccl-param': signed_headers["headers"]["x-ccl-param"],
                'x-ccl-signature': signed_headers["headers"]["x-ccl-signature"],
                'Cookie': cookie
            };
            res = await request
                .patch(endpoint)
                .set(headers)
                .send(payloadJSON);
            expect(res.statusCode).to.be.eq(400);
            expect(res.body.error).to.be.eq(`Max value cannot be less than min value`);
        });

        it('Update Specific Attributes - Update Call fails when decimal value is sent for Max parameter for Number Attribute', async function () {
            attId = FO.getValueFromFile(attributeDetailsFile, 'NumberRandom');
            endpoint = update_delete_SpecificAttributes(orgId, attId);
            const maxVal = faker.datatype.number({ min: -100000, max: 100000, precision: 0.001 });
            payload = {
                max: maxVal
            }
            payloadJSON = JSON.stringify(payload);
            signed_headers = getSignedRequestHeaders("PATCH", baseUrl, endpoint, payloadJSON, {});
            headers = {
                'Content-type': 'application/json;charset=UTF-8',
                'x-ccl-param': signed_headers["headers"]["x-ccl-param"],
                'x-ccl-signature': signed_headers["headers"]["x-ccl-signature"],
                'Cookie': cookie
            };
            res = await request
                .patch(endpoint)
                .set(headers)
                .send(payloadJSON);
            expect(res.statusCode).to.be.eq(400);
            expect(res.body.error).to.be.eq(`Validation failed: max: ${maxVal} is not an integer value`);
        });

        it('Update Specific Attributes - Update Call fails when decimal value is sent for Min parameter for Number Attribute', async function () {
            attId = FO.getValueFromFile(attributeDetailsFile, 'NumberRandom');
            endpoint = update_delete_SpecificAttributes(orgId, attId);
            const minVal = faker.datatype.number({ min: -100000, max: 100000, precision: 0.001 });
            payload = {
                min: minVal
            }
            payloadJSON = JSON.stringify(payload);
            signed_headers = getSignedRequestHeaders("PATCH", baseUrl, endpoint, payloadJSON, {});
            headers = {
                'Content-type': 'application/json;charset=UTF-8',
                'x-ccl-param': signed_headers["headers"]["x-ccl-param"],
                'x-ccl-signature': signed_headers["headers"]["x-ccl-signature"],
                'Cookie': cookie
            };
            res = await request
                .patch(endpoint)
                .set(headers)
                .send(payloadJSON);
            expect(res.statusCode).to.be.eq(400);
            expect(res.body.error).to.be.eq(`Validation failed: min: ${minVal} is not an integer value`);
        });

        it('Update Specific Attributes - Update Call fails when string is sent for Max parameter for Number Attribute', async function () {
            attId = FO.getValueFromFile(attributeDetailsFile, 'NumberRandom');
            endpoint = update_delete_SpecificAttributes(orgId, attId);
            const maxVal = faker.random.alpha(10);
            payload = {
                max: maxVal
            }
            payloadJSON = JSON.stringify(payload);
            signed_headers = getSignedRequestHeaders("PATCH", baseUrl, endpoint, payloadJSON, {});
            headers = {
                'Content-type': 'application/json;charset=UTF-8',
                'x-ccl-param': signed_headers["headers"]["x-ccl-param"],
                'x-ccl-signature': signed_headers["headers"]["x-ccl-signature"],
                'Cookie': cookie
            };
            res = await request
                .patch(endpoint)
                .set(headers)
                .send(payloadJSON);
            expect(res.statusCode).to.be.eq(400);
            expect(res.body.error).to.be.eq(`Cast to Number failed for value \"${maxVal}\" (type string) at path \"max\"`);
        });

        it('Update Specific Attributes - Update Call fails when string is sent for Min parameter for Number Attribute', async function () {
            attId = FO.getValueFromFile(attributeDetailsFile, 'NumberRandom');
            endpoint = update_delete_SpecificAttributes(orgId, attId);
            const minVal = faker.random.alpha(10);
            payload = {
                min: minVal
            }
            payloadJSON = JSON.stringify(payload);
            signed_headers = getSignedRequestHeaders("PATCH", baseUrl, endpoint, payloadJSON, {});
            headers = {
                'Content-type': 'application/json;charset=UTF-8',
                'x-ccl-param': signed_headers["headers"]["x-ccl-param"],
                'x-ccl-signature': signed_headers["headers"]["x-ccl-signature"],
                'Cookie': cookie
            };
            res = await request
                .patch(endpoint)
                .set(headers)
                .send(payloadJSON);
            expect(res.statusCode).to.be.eq(400);
            expect(res.body.error).to.be.eq(`Cast to Number failed for value \"${minVal}\" (type string) at path \"min\"`);
        });

        it('Update Specific Attributes - Updating Decimal Attribute', async function () {
            attId = FO.getValueFromFile(attributeDetailsFile, 'DecimalRandom');
            endpoint = update_delete_SpecificAttributes(orgId, attId);
            payloadData = attributePayloads.createDecimalAttributePayload('DecimalRandomUp');
            payload = {
                active: payloadData.active,
                name: payloadData.name,
                description: payloadData.description
            }
            payloadJSON = JSON.stringify(payload);
            signed_headers = getSignedRequestHeaders("PATCH", baseUrl, endpoint, payloadJSON, {});
            headers = {
                'Content-type': 'application/json;charset=UTF-8',
                'x-ccl-param': signed_headers["headers"]["x-ccl-param"],
                'x-ccl-signature': signed_headers["headers"]["x-ccl-signature"],
                'Cookie': cookie
            };
            res = await request
                .patch(endpoint)
                .set(headers)
                .send(payloadJSON);
            expect(res.statusCode).to.be.eq(200);
            expect(res.body).to.be.jsonSchema(schemas.getNumDecAttributeSchema);
            expect(res.body.active).to.be.eq(payloadData.active);
            expect(res.body.name).to.be.eq(payloadData.name);
            expect(res.body.description).to.be.eq(payloadData.description);
        });

        it('Update Specific Attributes - Updating max parameter as positive value for Decimal Attribute', async function () {
            attId = FO.getValueFromFile(attributeDetailsFile, 'DecimalMaxNeg');
            endpoint = update_delete_SpecificAttributes(orgId, attId);
            const maxVal = faker.datatype.number({ min: 0, max: 100000, precision: 0.001 });
            payload = {
                max: maxVal
            }
            payloadJSON = JSON.stringify(payload);
            signed_headers = getSignedRequestHeaders("PATCH", baseUrl, endpoint, payloadJSON, {});
            headers = {
                'Content-type': 'application/json;charset=UTF-8',
                'x-ccl-param': signed_headers["headers"]["x-ccl-param"],
                'x-ccl-signature': signed_headers["headers"]["x-ccl-signature"],
                'Cookie': cookie
            };
            res = await request
                .patch(endpoint)
                .set(headers)
                .send(payloadJSON);
            expect(res.statusCode).to.be.eq(200);
            expect(res.body).to.be.jsonSchema(schemas.getNumDecAttributeSchema);
            expect(res.body.max).to.be.eq(maxVal);
        });

        it('Update Specific Attributes - Updating max parameter as negative value for Decimal Attribute', async function () {
            attId = FO.getValueFromFile(attributeDetailsFile, 'DecimalMaxNeg');
            endpoint = update_delete_SpecificAttributes(orgId, attId);
            const maxVal = faker.datatype.number({ min: -100000, max: -1, precision: 0.001 });
            payload = {
                max: maxVal
            }
            payloadJSON = JSON.stringify(payload);
            signed_headers = getSignedRequestHeaders("PATCH", baseUrl, endpoint, payloadJSON, {});
            headers = {
                'Content-type': 'application/json;charset=UTF-8',
                'x-ccl-param': signed_headers["headers"]["x-ccl-param"],
                'x-ccl-signature': signed_headers["headers"]["x-ccl-signature"],
                'Cookie': cookie
            };
            res = await request
                .patch(endpoint)
                .set(headers)
                .send(payloadJSON);
            expect(res.statusCode).to.be.eq(200);
            expect(res.body).to.be.jsonSchema(schemas.getNumDecAttributeSchema);
            expect(res.body.max).to.be.eq(maxVal);
        });

        it('Update Specific Attributes - Updating Max parameter for Decimal Attribute which does not have Max parameter set', async function () {
            attId = FO.getValueFromFile(attributeDetailsFile, 'DecimalMin');
            endpoint = update_delete_SpecificAttributes(orgId, attId);
            const minVal = FO.getValueFromFile(attributeDetailsFile, 'DecimalMinValue');
            const maxVal = faker.datatype.number({ min: minVal, max: 100000, precision: 0.001 });
            payload = {
                max: maxVal
            }
            payloadJSON = JSON.stringify(payload);
            signed_headers = getSignedRequestHeaders("PATCH", baseUrl, endpoint, payloadJSON, {});
            headers = {
                'Content-type': 'application/json;charset=UTF-8',
                'x-ccl-param': signed_headers["headers"]["x-ccl-param"],
                'x-ccl-signature': signed_headers["headers"]["x-ccl-signature"],
                'Cookie': cookie
            };
            res = await request
                .patch(endpoint)
                .set(headers)
                .send(payloadJSON);
            expect(res.statusCode).to.be.eq(200);
            expect(res.body).to.be.jsonSchema(schemas.getNumDecAttributeSchema);
            expect(res.body.max).to.be.eq(maxVal);
        });

        it('Update Specific Attributes - Updating max parameter as 0 for Decimal Attribute', async function () {
            attId = FO.getValueFromFile(attributeDetailsFile, 'DecimalMin');
            endpoint = update_delete_SpecificAttributes(orgId, attId);
            const maxVal = 0;
            payload = {
                max: maxVal
            }
            payloadJSON = JSON.stringify(payload);
            signed_headers = getSignedRequestHeaders("PATCH", baseUrl, endpoint, payloadJSON, {});
            headers = {
                'Content-type': 'application/json;charset=UTF-8',
                'x-ccl-param': signed_headers["headers"]["x-ccl-param"],
                'x-ccl-signature': signed_headers["headers"]["x-ccl-signature"],
                'Cookie': cookie
            };
            res = await request
                .patch(endpoint)
                .set(headers)
                .send(payloadJSON);
            expect(res.statusCode).to.be.eq(200);
            expect(res.body).to.be.jsonSchema(schemas.getNumDecAttributeSchema);
            expect(res.body.max).to.be.eq(maxVal);
        });

        it('Update Specific Attributes - Updating min parameter as positive value for Decimal Attribute', async function () {
            attId = FO.getValueFromFile(attributeDetailsFile, 'DecimalMinNeg');
            endpoint = update_delete_SpecificAttributes(orgId, attId);
            const minVal = faker.datatype.number({ min: 0, max: 100000, precision: 0.001 });
            payload = {
                min: minVal
            }
            payloadJSON = JSON.stringify(payload);
            signed_headers = getSignedRequestHeaders("PATCH", baseUrl, endpoint, payloadJSON, {});
            headers = {
                'Content-type': 'application/json;charset=UTF-8',
                'x-ccl-param': signed_headers["headers"]["x-ccl-param"],
                'x-ccl-signature': signed_headers["headers"]["x-ccl-signature"],
                'Cookie': cookie
            };
            res = await request
                .patch(endpoint)
                .set(headers)
                .send(payloadJSON);
            expect(res.statusCode).to.be.eq(200);
            expect(res.body).to.be.jsonSchema(schemas.getNumDecAttributeSchema);
            expect(res.body.min).to.be.eq(minVal);
        });

        it('Update Specific Attributes - Updating min parameter as negative value for Decimal Attribute', async function () {
            attId = FO.getValueFromFile(attributeDetailsFile, 'DecimalMinNeg');
            endpoint = update_delete_SpecificAttributes(orgId, attId);
            const minVal = faker.datatype.number({ min: -100000, max: -1, precision: 0.001 });
            payload = {
                min: minVal
            }
            payloadJSON = JSON.stringify(payload);
            signed_headers = getSignedRequestHeaders("PATCH", baseUrl, endpoint, payloadJSON, {});
            headers = {
                'Content-type': 'application/json;charset=UTF-8',
                'x-ccl-param': signed_headers["headers"]["x-ccl-param"],
                'x-ccl-signature': signed_headers["headers"]["x-ccl-signature"],
                'Cookie': cookie
            };
            res = await request
                .patch(endpoint)
                .set(headers)
                .send(payloadJSON);
            expect(res.statusCode).to.be.eq(200);
            expect(res.body).to.be.jsonSchema(schemas.getNumDecAttributeSchema);
            expect(res.body.min).to.be.eq(minVal);
        });

        it('Update Specific Attributes - Updating Min parameter for Decimal Attribute which does not have Min parameter set', async function () {
            attId = FO.getValueFromFile(attributeDetailsFile, 'DecimalMax');
            endpoint = update_delete_SpecificAttributes(orgId, attId);
            const maxVal = FO.getValueFromFile(attributeDetailsFile, 'DecimalMaxValue');
            const minVal = faker.datatype.number({ min: -100000, max: maxVal, precision: 0.001 });
            payload = {
                min: minVal
            }
            payloadJSON = JSON.stringify(payload);
            signed_headers = getSignedRequestHeaders("PATCH", baseUrl, endpoint, payloadJSON, {});
            headers = {
                'Content-type': 'application/json;charset=UTF-8',
                'x-ccl-param': signed_headers["headers"]["x-ccl-param"],
                'x-ccl-signature': signed_headers["headers"]["x-ccl-signature"],
                'Cookie': cookie
            };
            res = await request
                .patch(endpoint)
                .set(headers)
                .send(payloadJSON);
            expect(res.statusCode).to.be.eq(200);
            expect(res.body).to.be.jsonSchema(schemas.getNumDecAttributeSchema);
            expect(res.body.min).to.be.eq(minVal);
        });

        it('Update Specific Attributes - Updating min parameter as 0 for Decimal Attribute', async function () {
            attId = FO.getValueFromFile(attributeDetailsFile, 'DecimalMax');
            endpoint = update_delete_SpecificAttributes(orgId, attId);
            const minVal = 0;
            payload = {
                min: minVal
            }
            payloadJSON = JSON.stringify(payload);
            signed_headers = getSignedRequestHeaders("PATCH", baseUrl, endpoint, payloadJSON, {});
            headers = {
                'Content-type': 'application/json;charset=UTF-8',
                'x-ccl-param': signed_headers["headers"]["x-ccl-param"],
                'x-ccl-signature': signed_headers["headers"]["x-ccl-signature"],
                'Cookie': cookie
            };
            res = await request
                .patch(endpoint)
                .set(headers)
                .send(payloadJSON);
            expect(res.statusCode).to.be.eq(200);
            expect(res.body).to.be.jsonSchema(schemas.getNumDecAttributeSchema);
            expect(res.body.min).to.be.eq(minVal);
        });

        it('Update Specific Attributes - Update Call fails when min parameter value is greater than max parameter for Decimal Attribute', async function () {
            attId = FO.getValueFromFile(attributeDetailsFile, 'DecimalRandom');
            endpoint = update_delete_SpecificAttributes(orgId, attId);
            const minVal = FO.getValueFromFile(attributeDetailsFile, 'DecimalRandomMax') + 1;
            payload = {
                min: minVal
            }
            payloadJSON = JSON.stringify(payload);
            signed_headers = getSignedRequestHeaders("PATCH", baseUrl, endpoint, payloadJSON, {});
            headers = {
                'Content-type': 'application/json;charset=UTF-8',
                'x-ccl-param': signed_headers["headers"]["x-ccl-param"],
                'x-ccl-signature': signed_headers["headers"]["x-ccl-signature"],
                'Cookie': cookie
            };
            res = await request
                .patch(endpoint)
                .set(headers)
                .send(payloadJSON);
            expect(res.statusCode).to.be.eq(400);
            expect(res.body.error).to.be.eq(`Max value cannot be less than min value`);
        });

        it('Update Specific Attributes - Update Call fails when Max parameter value is lesser than Min parameter for Decimal Attribute', async function () {
            attId = FO.getValueFromFile(attributeDetailsFile, 'DecimalRandom');
            endpoint = update_delete_SpecificAttributes(orgId, attId);
            const maxVal = FO.getValueFromFile(attributeDetailsFile, 'DecimalRandomMin') - 1;
            payload = {
                max: maxVal
            }
            payloadJSON = JSON.stringify(payload);
            signed_headers = getSignedRequestHeaders("PATCH", baseUrl, endpoint, payloadJSON, {});
            headers = {
                'Content-type': 'application/json;charset=UTF-8',
                'x-ccl-param': signed_headers["headers"]["x-ccl-param"],
                'x-ccl-signature': signed_headers["headers"]["x-ccl-signature"],
                'Cookie': cookie
            };
            res = await request
                .patch(endpoint)
                .set(headers)
                .send(payloadJSON);
            expect(res.statusCode).to.be.eq(400);
            expect(res.body.error).to.be.eq(`Max value cannot be less than min value`);
        });

        it('Update Specific Attributes - Update Call fails when string is sent for Max parameter for Decimal Attribute', async function () {
            attId = FO.getValueFromFile(attributeDetailsFile, 'DecimalRandom');
            endpoint = update_delete_SpecificAttributes(orgId, attId);
            const maxVal = faker.random.alpha(10);
            payload = {
                max: maxVal
            }
            payloadJSON = JSON.stringify(payload);
            signed_headers = getSignedRequestHeaders("PATCH", baseUrl, endpoint, payloadJSON, {});
            headers = {
                'Content-type': 'application/json;charset=UTF-8',
                'x-ccl-param': signed_headers["headers"]["x-ccl-param"],
                'x-ccl-signature': signed_headers["headers"]["x-ccl-signature"],
                'Cookie': cookie
            };
            res = await request
                .patch(endpoint)
                .set(headers)
                .send(payloadJSON);
            expect(res.statusCode).to.be.eq(400);
            expect(res.body.error).to.be.eq(`Cast to Number failed for value \"${maxVal}\" (type string) at path \"max\"`);
        });

        it('Update Specific Attributes - Update Call fails when string is sent for Min parameter for Decimal Attribute', async function () {
            attId = FO.getValueFromFile(attributeDetailsFile, 'DecimalRandom');
            endpoint = update_delete_SpecificAttributes(orgId, attId);
            const minVal = faker.random.alpha(10);
            payload = {
                min: minVal
            }
            payloadJSON = JSON.stringify(payload);
            signed_headers = getSignedRequestHeaders("PATCH", baseUrl, endpoint, payloadJSON, {});
            headers = {
                'Content-type': 'application/json;charset=UTF-8',
                'x-ccl-param': signed_headers["headers"]["x-ccl-param"],
                'x-ccl-signature': signed_headers["headers"]["x-ccl-signature"],
                'Cookie': cookie
            };
            res = await request
                .patch(endpoint)
                .set(headers)
                .send(payloadJSON);
            expect(res.statusCode).to.be.eq(400);
            expect(res.body.error).to.be.eq(`Cast to Number failed for value \"${minVal}\" (type string) at path \"min\"`);
        });

        it('Update Specific Attributes - Updating File Attribute', async function () {
            attId = FO.getValueFromFile(attributeDetailsFile, 'FileRandom');
            endpoint = update_delete_SpecificAttributes(orgId, attId);
            payloadData = attributePayloads.createFileAttributePayload('FileRandomUp');
            payload = {
                active: payloadData.active,
                name: payloadData.name,
                description: payloadData.description
            }
            payloadJSON = JSON.stringify(payload);
            signed_headers = getSignedRequestHeaders("PATCH", baseUrl, endpoint, payloadJSON, {});
            headers = {
                'Content-type': 'application/json;charset=UTF-8',
                'x-ccl-param': signed_headers["headers"]["x-ccl-param"],
                'x-ccl-signature': signed_headers["headers"]["x-ccl-signature"],
                'Cookie': cookie
            };
            res = await request
                .patch(endpoint)
                .set(headers)
                .send(payloadJSON);
            expect(res.statusCode).to.be.eq(200);
            expect(res.body).to.be.jsonSchema(schemas.getFileMedAttributeSchema);
            expect(res.body.active).to.be.eq(payloadData.active);
            expect(res.body.name).to.be.eq(payloadData.name);
            expect(res.body.description).to.be.eq(payloadData.description);
        });

        it('Update Specific Attributes - Updating allow_multiple parameter to true for File Attribute', async function () {
            attId = FO.getValueFromFile(attributeDetailsFile, 'FileAMFalse');
            endpoint = update_delete_SpecificAttributes(orgId, attId);
            payloadData = attributePayloads.createFileAttributePayload('FileAMFalseUp');
            payload = {
                allow_multiple: true
            }
            payloadJSON = JSON.stringify(payload);
            signed_headers = getSignedRequestHeaders("PATCH", baseUrl, endpoint, payloadJSON, {});
            headers = {
                'Content-type': 'application/json;charset=UTF-8',
                'x-ccl-param': signed_headers["headers"]["x-ccl-param"],
                'x-ccl-signature': signed_headers["headers"]["x-ccl-signature"],
                'Cookie': cookie
            };
            res = await request
                .patch(endpoint)
                .set(headers)
                .send(payloadJSON);
            expect(res.statusCode).to.be.eq(200);
            expect(res.body).to.be.jsonSchema(schemas.getFileMedAttributeSchema);
            expect(res.body.allow_multiple).to.be.true;
        });

        it('Update Specific Attributes - Updating allow_multiple parameter to false for File Attribute', async function () {
            attId = FO.getValueFromFile(attributeDetailsFile, 'FileAMFalse');
            endpoint = update_delete_SpecificAttributes(orgId, attId);
            payloadData = attributePayloads.createFileAttributePayload('FileAMFalseUp');
            payload = {
                allow_multiple: false
            }
            payloadJSON = JSON.stringify(payload);
            signed_headers = getSignedRequestHeaders("PATCH", baseUrl, endpoint, payloadJSON, {});
            headers = {
                'Content-type': 'application/json;charset=UTF-8',
                'x-ccl-param': signed_headers["headers"]["x-ccl-param"],
                'x-ccl-signature': signed_headers["headers"]["x-ccl-signature"],
                'Cookie': cookie
            };
            res = await request
                .patch(endpoint)
                .set(headers)
                .send(payloadJSON);
            expect(res.statusCode).to.be.eq(200);
            expect(res.body).to.be.jsonSchema(schemas.getFileMedAttributeSchema);
            expect(res.body.allow_multiple).to.be.false;
        });

        it('Update Specific Attributes - Update call fails when number is send as allow_multiple parameter for File Attribute', async function () {
            attId = FO.getValueFromFile(attributeDetailsFile, 'FileAMFalse');
            endpoint = update_delete_SpecificAttributes(orgId, attId);
            const invalid_allow_multiple = Number(faker.random.numeric(4));
            payload = {
                allow_multiple: invalid_allow_multiple
            }
            payloadJSON = JSON.stringify(payload);
            signed_headers = getSignedRequestHeaders("PATCH", baseUrl, endpoint, payloadJSON, {});
            headers = {
                'Content-type': 'application/json;charset=UTF-8',
                'x-ccl-param': signed_headers["headers"]["x-ccl-param"],
                'x-ccl-signature': signed_headers["headers"]["x-ccl-signature"],
                'Cookie': cookie
            };
            res = await request
                .patch(endpoint)
                .set(headers)
                .send(payloadJSON);
            expect(res.statusCode).to.be.eq(400);
            expect(res.body.error).to.be.eq(`Cast to Boolean failed for value \"${invalid_allow_multiple}\" (type number) at path \"allow_multiple\" because of \"CastError\"`);
        });

        it('Update Specific Attributes - Update call fails when string is send as allow_multiple parameter for File Attribute', async function () {
            attId = FO.getValueFromFile(attributeDetailsFile, 'FileAMFalse');
            endpoint = update_delete_SpecificAttributes(orgId, attId);
            const invalid_allow_multiple = faker.random.alpha(10);
            payload = {
                allow_multiple: invalid_allow_multiple
            }
            payloadJSON = JSON.stringify(payload);
            signed_headers = getSignedRequestHeaders("PATCH", baseUrl, endpoint, payloadJSON, {});
            headers = {
                'Content-type': 'application/json;charset=UTF-8',
                'x-ccl-param': signed_headers["headers"]["x-ccl-param"],
                'x-ccl-signature': signed_headers["headers"]["x-ccl-signature"],
                'Cookie': cookie
            };
            res = await request
                .patch(endpoint)
                .set(headers)
                .send(payloadJSON);
            expect(res.statusCode).to.be.eq(400);
            expect(res.body.error).to.be.eq(`Cast to Boolean failed for value \"${invalid_allow_multiple}\" (type string) at path \"allow_multiple\" because of \"CastError\"`);
        });

        it('Update Specific Attributes - Updating max_size parameter for File Attribute', async function () {
            attId = FO.getValueFromFile(attributeDetailsFile, 'FileMSize');
            endpoint = update_delete_SpecificAttributes(orgId, attId);
            payloadData = attributePayloads.createFileAttributePayload('FileMSizeUp');
            payload = {
                max_size: payloadData.max_size
            }
            payloadJSON = JSON.stringify(payload);
            signed_headers = getSignedRequestHeaders("PATCH", baseUrl, endpoint, payloadJSON, {});
            headers = {
                'Content-type': 'application/json;charset=UTF-8',
                'x-ccl-param': signed_headers["headers"]["x-ccl-param"],
                'x-ccl-signature': signed_headers["headers"]["x-ccl-signature"],
                'Cookie': cookie
            };
            res = await request
                .patch(endpoint)
                .set(headers)
                .send(payloadJSON);
            expect(res.statusCode).to.be.eq(200);
            expect(res.body).to.be.jsonSchema(schemas.getFileMedAttributeSchema);
            expect(res.body.max_size).to.be.eq(payloadData.max_size);
        });

        it('Update Specific Attributes - Update call fails when 0 is send for max_size parameter for File Attribute', async function () {
            attId = FO.getValueFromFile(attributeDetailsFile, 'FileMSize');
            endpoint = update_delete_SpecificAttributes(orgId, attId);
            const invalid_max_size = 0;
            payload = {
                max_size: invalid_max_size
            }
            payloadJSON = JSON.stringify(payload);
            signed_headers = getSignedRequestHeaders("PATCH", baseUrl, endpoint, payloadJSON, {});
            headers = {
                'Content-type': 'application/json;charset=UTF-8',
                'x-ccl-param': signed_headers["headers"]["x-ccl-param"],
                'x-ccl-signature': signed_headers["headers"]["x-ccl-signature"],
                'Cookie': cookie
            };
            res = await request
                .patch(endpoint)
                .set(headers)
                .send(payloadJSON);
            expect(res.statusCode).to.be.eq(400);
            expect(res.body.error).to.be.eq(`Validation failed: max_size: ${invalid_max_size} is not a positive integer`);
        });

        it('Update Specific Attributes - Update call fails when negative number is send for max_size parameter for File Attribute', async function () {
            attId = FO.getValueFromFile(attributeDetailsFile, 'FileMSize');
            endpoint = update_delete_SpecificAttributes(orgId, attId);
            const invalid_max_size = faker.datatype.number({ min: -10000, max: -1 });
            payload = {
                max_size: invalid_max_size
            }
            payloadJSON = JSON.stringify(payload);
            signed_headers = getSignedRequestHeaders("PATCH", baseUrl, endpoint, payloadJSON, {});
            headers = {
                'Content-type': 'application/json;charset=UTF-8',
                'x-ccl-param': signed_headers["headers"]["x-ccl-param"],
                'x-ccl-signature': signed_headers["headers"]["x-ccl-signature"],
                'Cookie': cookie
            };
            res = await request
                .patch(endpoint)
                .set(headers)
                .send(payloadJSON);
            expect(res.statusCode).to.be.eq(400);
            expect(res.body.error).to.be.eq(`Validation failed: max_size: ${invalid_max_size} is not a positive integer`);
        });

        it('Update Specific Attributes - Update call fails when decimal value is send for max_size parameter for File Attribute', async function () {
            attId = FO.getValueFromFile(attributeDetailsFile, 'FileMSize');
            endpoint = update_delete_SpecificAttributes(orgId, attId);
            const invalid_max_size = faker.datatype.number({ min: 1, max: 10000, precision: 0.01 });
            payload = {
                max_size: invalid_max_size
            }
            payloadJSON = JSON.stringify(payload);
            signed_headers = getSignedRequestHeaders("PATCH", baseUrl, endpoint, payloadJSON, {});
            headers = {
                'Content-type': 'application/json;charset=UTF-8',
                'x-ccl-param': signed_headers["headers"]["x-ccl-param"],
                'x-ccl-signature': signed_headers["headers"]["x-ccl-signature"],
                'Cookie': cookie
            };
            res = await request
                .patch(endpoint)
                .set(headers)
                .send(payloadJSON);
            expect(res.statusCode).to.be.eq(400);
            expect(res.body.error).to.be.eq(`Validation failed: max_size: ${invalid_max_size} is not a positive integer`);
        });

        it('Update Specific Attributes - Update call fails when string is send for max_size parameter for File Attribute', async function () {
            attId = FO.getValueFromFile(attributeDetailsFile, 'FileMSize');
            endpoint = update_delete_SpecificAttributes(orgId, attId);
            const invalid_max_size = faker.random.alpha(10)
            payload = {
                max_size: invalid_max_size
            }
            payloadJSON = JSON.stringify(payload);
            signed_headers = getSignedRequestHeaders("PATCH", baseUrl, endpoint, payloadJSON, {});
            headers = {
                'Content-type': 'application/json;charset=UTF-8',
                'x-ccl-param': signed_headers["headers"]["x-ccl-param"],
                'x-ccl-signature': signed_headers["headers"]["x-ccl-signature"],
                'Cookie': cookie
            };
            res = await request
                .patch(endpoint)
                .set(headers)
                .send(payloadJSON);
            expect(res.statusCode).to.be.eq(400);
            expect(res.body.error).to.be.eq(`Cast to Number failed for value \"${invalid_max_size}\" (type string) at path \"max_size\"`);
        });

        it('Update Specific Attributes - Updating allowed_extensions parameter for File Attribute', async function () {
            attId = FO.getValueFromFile(attributeDetailsFile, 'FileMSize');
            endpoint = update_delete_SpecificAttributes(orgId, attId);
            payloadData = attributePayloads.createFileAttributePayload('FileMSizeUp');
            payload = {
                allowed_extensions: payloadData.allowed_extensions
            }
            payloadJSON = JSON.stringify(payload);
            signed_headers = getSignedRequestHeaders("PATCH", baseUrl, endpoint, payloadJSON, {});
            headers = {
                'Content-type': 'application/json;charset=UTF-8',
                'x-ccl-param': signed_headers["headers"]["x-ccl-param"],
                'x-ccl-signature': signed_headers["headers"]["x-ccl-signature"],
                'Cookie': cookie
            };
            res = await request
                .patch(endpoint)
                .set(headers)
                .send(payloadJSON);
            expect(res.statusCode).to.be.eq(200);
            expect(res.body).to.be.jsonSchema(schemas.getFileMedAttributeSchema);
            expect(compareArrayData(res.body.allowed_extensions, payloadData.allowed_extensions)).to.be.true;
        });

        it('Update Specific Attributes - Updating allowed_extensions parameter for File Attribute', async function () {
            attId = FO.getValueFromFile(attributeDetailsFile, 'FileMSize');
            endpoint = update_delete_SpecificAttributes(orgId, attId);
            payloadData = attributePayloads.createFileAttributePayload('FileMSizeUp');
            payload = {
                tags: payloadData.tags
            }
            payloadJSON = JSON.stringify(payload);
            signed_headers = getSignedRequestHeaders("PATCH", baseUrl, endpoint, payloadJSON, {});
            headers = {
                'Content-type': 'application/json;charset=UTF-8',
                'x-ccl-param': signed_headers["headers"]["x-ccl-param"],
                'x-ccl-signature': signed_headers["headers"]["x-ccl-signature"],
                'Cookie': cookie
            };
            res = await request
                .patch(endpoint)
                .set(headers)
                .send(payloadJSON);
            expect(res.statusCode).to.be.eq(200);
            expect(res.body).to.be.jsonSchema(schemas.getFileMedAttributeSchema);
            expect(compareArrayData(res.body.tags, payloadData.tags)).to.be.true;
        });

        it('Update Specific Attributes - Update call fails when allowed_extensions array contain invalid datat for File Attribute', async function () {
            attId = FO.getValueFromFile(attributeDetailsFile, 'FileMSize');
            endpoint = update_delete_SpecificAttributes(orgId, attId);
            payloadData = attributePayloads.createFileAttributePayload('FileMSizeUp');
            let invalid_allowed_extensions = payloadData.allowed_extensions;
            invalid_allowed_extensions.push(faker.random.alpha(8));
            payload = {
                allowed_extensions: invalid_allowed_extensions
            }
            payloadJSON = JSON.stringify(payload);
            signed_headers = getSignedRequestHeaders("PATCH", baseUrl, endpoint, payloadJSON, {});
            headers = {
                'Content-type': 'application/json;charset=UTF-8',
                'x-ccl-param': signed_headers["headers"]["x-ccl-param"],
                'x-ccl-signature': signed_headers["headers"]["x-ccl-signature"],
                'Cookie': cookie
            };
            res = await request
                .patch(endpoint)
                .set(headers)
                .send(payloadJSON);
            expect(res.statusCode).to.be.eq(400);
            expect(res.body.error).to.be.eq(`Invalid File type sent.`);
        });

        it('Update Specific Attributes - Updating Media Attribute', async function () {
            attId = FO.getValueFromFile(attributeDetailsFile, 'MediaRandom');
            endpoint = update_delete_SpecificAttributes(orgId, attId);
            payloadData = attributePayloads.createMediaAttributePayload('MediaRandomUp');
            payload = {
                active: payloadData.active,
                name: payloadData.name,
                description: payloadData.description
            }
            payloadJSON = JSON.stringify(payload);
            signed_headers = getSignedRequestHeaders("PATCH", baseUrl, endpoint, payloadJSON, {});
            headers = {
                'Content-type': 'application/json;charset=UTF-8',
                'x-ccl-param': signed_headers["headers"]["x-ccl-param"],
                'x-ccl-signature': signed_headers["headers"]["x-ccl-signature"],
                'Cookie': cookie
            };
            res = await request
                .patch(endpoint)
                .set(headers)
                .send(payloadJSON);
            expect(res.statusCode).to.be.eq(200);
            expect(res.body).to.be.jsonSchema(schemas.getFileMedAttributeSchema);
            expect(res.body.active).to.be.eq(payloadData.active);
            expect(res.body.name).to.be.eq(payloadData.name);
            expect(res.body.description).to.be.eq(payloadData.description);
        });

        it('Update Specific Attributes - Updating allowed_extensions parameter for video type for Media Attribute', async function () {
            attId = FO.getValueFromFile(attributeDetailsFile, 'MediaVidRandom');
            endpoint = update_delete_SpecificAttributes(orgId, attId);
            const fileAllowedArrayValues = ["mp4", "mov"];
            const fileAllowedArray = [];
            const fileAllowedArraySize = faker.datatype.number({ min: 1, max: 2 });
            for (let i = 0; i < fileAllowedArraySize; i++) {
                fileAllowedArray.push(fileAllowedArrayValues[i]);
            }
            payload = {
                "allowed_extensions": fileAllowedArray
            }
            payloadJSON = JSON.stringify(payload);
            signed_headers = getSignedRequestHeaders("PATCH", baseUrl, endpoint, payloadJSON, {});
            headers = {
                'Content-type': 'application/json;charset=UTF-8',
                'x-ccl-param': signed_headers["headers"]["x-ccl-param"],
                'x-ccl-signature': signed_headers["headers"]["x-ccl-signature"],
                'Cookie': cookie
            };
            res = await request
                .patch(endpoint)
                .set(headers)
                .send(payloadJSON);
            expect(res.statusCode).to.be.eq(200);
            expect(res.body).to.be.jsonSchema(schemas.getFileMedAttributeSchema);
            expect(res.body.allowed_extensions.length).to.be.eq(fileAllowedArray.length);
            expect(compareArrayData(res.body.allowed_extensions, fileAllowedArray)).to.be.true;
            expect(res.body.allow_multiple).to.be.false;
        });

        it('Update Specific Attributes - Updating allowed_extensions parameter for image type for Media Attribute', async function () {
            attId = FO.getValueFromFile(attributeDetailsFile, 'MediaImageRandom');
            endpoint = update_delete_SpecificAttributes(orgId, attId);
            const fileAllowedArrayValues = ["jpeg", "png", "gif", "webp", "jfif"];
            const fileAllowedArray = [];
            const fileAllowedArraySize = faker.datatype.number({ min: 1, max: 5 });
            for (let i = 0; i < fileAllowedArraySize; i++) {
                fileAllowedArray.push(fileAllowedArrayValues[i]);
            }
            payload = {
                "allowed_extensions": fileAllowedArray
            }
            payloadJSON = JSON.stringify(payload);
            signed_headers = getSignedRequestHeaders("PATCH", baseUrl, endpoint, payloadJSON, {});
            headers = {
                'Content-type': 'application/json;charset=UTF-8',
                'x-ccl-param': signed_headers["headers"]["x-ccl-param"],
                'x-ccl-signature': signed_headers["headers"]["x-ccl-signature"],
                'Cookie': cookie
            };
            res = await request
                .patch(endpoint)
                .set(headers)
                .send(payloadJSON);
            expect(res.statusCode).to.be.eq(200);
            expect(res.body).to.be.jsonSchema(schemas.getFileMedAttributeSchema);
            expect(res.body.allowed_extensions.length).to.be.eq(fileAllowedArray.length);
            expect(compareArrayData(res.body.allowed_extensions, fileAllowedArray)).to.be.true;
            expect(res.body.allow_multiple).to.be.false;
        });

        it('Update Specific Attributes - Update call fails when random string is sent for media_type parameter for Media Attribute', async function () {
            attId = FO.getValueFromFile(attributeDetailsFile, 'MediaImageRandom');
            endpoint = update_delete_SpecificAttributes(orgId, attId);
            const invalid_media_type = faker.random.alpha(10);
            payload = {
                "media_type": invalid_media_type
            }
            payloadJSON = JSON.stringify(payload);
            signed_headers = getSignedRequestHeaders("PATCH", baseUrl, endpoint, payloadJSON, {});
            headers = {
                'Content-type': 'application/json;charset=UTF-8',
                'x-ccl-param': signed_headers["headers"]["x-ccl-param"],
                'x-ccl-signature': signed_headers["headers"]["x-ccl-signature"],
                'Cookie': cookie
            };
            res = await request
                .patch(endpoint)
                .set(headers)
                .send(payloadJSON);
            expect(res.statusCode).to.be.eq(400);
            expect(res.body.error).to.be.eq(`Incorrect media type sent`);
        });

        it('Update Specific Attributes - Updating allow_multiple parameter to false for Media Attribute', async function () {
            attId = FO.getValueFromFile(attributeDetailsFile, 'MediaAMTrue');
            endpoint = update_delete_SpecificAttributes(orgId, attId);
            payload = {
                allow_multiple: false
            }
            payloadJSON = JSON.stringify(payload);
            signed_headers = getSignedRequestHeaders("PATCH", baseUrl, endpoint, payloadJSON, {});
            headers = {
                'Content-type': 'application/json;charset=UTF-8',
                'x-ccl-param': signed_headers["headers"]["x-ccl-param"],
                'x-ccl-signature': signed_headers["headers"]["x-ccl-signature"],
                'Cookie': cookie
            };
            res = await request
                .patch(endpoint)
                .set(headers)
                .send(payloadJSON);
            expect(res.statusCode).to.be.eq(200);
            expect(res.body).to.be.jsonSchema(schemas.getFileMedAttributeSchema);
            expect(res.body.allow_multiple).to.be.false;
        });

        it('Update Specific Attributes - Updating allow_multiple parameter to true for Media Attribute', async function () {
            attId = FO.getValueFromFile(attributeDetailsFile, 'MediaAMTrue');
            endpoint = update_delete_SpecificAttributes(orgId, attId);
            payload = {
                allow_multiple: true
            }
            payloadJSON = JSON.stringify(payload);
            signed_headers = getSignedRequestHeaders("PATCH", baseUrl, endpoint, payloadJSON, {});
            headers = {
                'Content-type': 'application/json;charset=UTF-8',
                'x-ccl-param': signed_headers["headers"]["x-ccl-param"],
                'x-ccl-signature': signed_headers["headers"]["x-ccl-signature"],
                'Cookie': cookie
            };
            res = await request
                .patch(endpoint)
                .set(headers)
                .send(payloadJSON);
            expect(res.statusCode).to.be.eq(200);
            expect(res.body).to.be.jsonSchema(schemas.getFileMedAttributeSchema);
            expect(res.body.allow_multiple).to.be.true;
        });

        it('Update Specific Attributes - Update call fails when random string is sent for allow_multiple parameter for Media Attribute', async function () {
            attId = FO.getValueFromFile(attributeDetailsFile, 'MediaAMTrue');
            endpoint = update_delete_SpecificAttributes(orgId, attId);
            const invalid_allow_multiple = faker.random.alpha(10);
            payload = {
                allow_multiple: invalid_allow_multiple
            }
            payloadJSON = JSON.stringify(payload);
            signed_headers = getSignedRequestHeaders("PATCH", baseUrl, endpoint, payloadJSON, {});
            headers = {
                'Content-type': 'application/json;charset=UTF-8',
                'x-ccl-param': signed_headers["headers"]["x-ccl-param"],
                'x-ccl-signature': signed_headers["headers"]["x-ccl-signature"],
                'Cookie': cookie
            };
            res = await request
                .patch(endpoint)
                .set(headers)
                .send(payloadJSON);
            expect(res.statusCode).to.be.eq(400);
            expect(res.body.error).to.be.eq(`Cast to Boolean failed for value \"${invalid_allow_multiple}\" (type string) at path \"allow_multiple\" because of \"CastError\"`);
        });

        it('Update Specific Attributes - Update call fails when number is sent for allow_multiple parameter for Media Attribute', async function () {
            attId = FO.getValueFromFile(attributeDetailsFile, 'MediaAMTrue');
            endpoint = update_delete_SpecificAttributes(orgId, attId);
            const invalid_allow_multiple = Number(faker.random.numeric(5));
            payload = {
                allow_multiple: invalid_allow_multiple
            }
            payloadJSON = JSON.stringify(payload);
            signed_headers = getSignedRequestHeaders("PATCH", baseUrl, endpoint, payloadJSON, {});
            headers = {
                'Content-type': 'application/json;charset=UTF-8',
                'x-ccl-param': signed_headers["headers"]["x-ccl-param"],
                'x-ccl-signature': signed_headers["headers"]["x-ccl-signature"],
                'Cookie': cookie
            };
            res = await request
                .patch(endpoint)
                .set(headers)
                .send(payloadJSON);
            expect(res.statusCode).to.be.eq(400);
            expect(res.body.error).to.be.eq(`Cast to Boolean failed for value \"${invalid_allow_multiple}\" (type number) at path \"allow_multiple\" because of \"CastError\"`);
        });

        it('Update Specific Attributes - Updating max_size parameter for Media Attribute', async function () {
            attId = FO.getValueFromFile(attributeDetailsFile, 'MediaMSize');
            endpoint = update_delete_SpecificAttributes(orgId, attId);
            payloadData = attributePayloads.createFileAttributePayload('MediaMSizeUp');
            payload = {
                max_size: payloadData.max_size
            }
            payloadJSON = JSON.stringify(payload);
            signed_headers = getSignedRequestHeaders("PATCH", baseUrl, endpoint, payloadJSON, {});
            headers = {
                'Content-type': 'application/json;charset=UTF-8',
                'x-ccl-param': signed_headers["headers"]["x-ccl-param"],
                'x-ccl-signature': signed_headers["headers"]["x-ccl-signature"],
                'Cookie': cookie
            };
            res = await request
                .patch(endpoint)
                .set(headers)
                .send(payloadJSON);
            expect(res.statusCode).to.be.eq(200);
            expect(res.body).to.be.jsonSchema(schemas.getFileMedAttributeSchema);
            expect(res.body.max_size).to.be.eq(payloadData.max_size);
        });

        it('Update Specific Attributes - Update call fails when 0 is send for max_size parameter for Media Attribute', async function () {
            attId = FO.getValueFromFile(attributeDetailsFile, 'MediaMSize');
            endpoint = update_delete_SpecificAttributes(orgId, attId);
            const invalid_max_size = 0;
            payload = {
                max_size: invalid_max_size
            }
            payloadJSON = JSON.stringify(payload);
            signed_headers = getSignedRequestHeaders("PATCH", baseUrl, endpoint, payloadJSON, {});
            headers = {
                'Content-type': 'application/json;charset=UTF-8',
                'x-ccl-param': signed_headers["headers"]["x-ccl-param"],
                'x-ccl-signature': signed_headers["headers"]["x-ccl-signature"],
                'Cookie': cookie
            };
            res = await request
                .patch(endpoint)
                .set(headers)
                .send(payloadJSON);
            expect(res.statusCode).to.be.eq(400);
            expect(res.body.error).to.be.eq(`Validation failed: max_size: ${invalid_max_size} is not a positive integer`);
        });

        it('Update Specific Attributes - Update call fails when negative number is send for max_size parameter for Media Attribute', async function () {
            attId = FO.getValueFromFile(attributeDetailsFile, 'MediaMSize');
            endpoint = update_delete_SpecificAttributes(orgId, attId);
            const invalid_max_size = faker.datatype.number({ min: -10000, max: -1 });
            payload = {
                max_size: invalid_max_size
            }
            payloadJSON = JSON.stringify(payload);
            signed_headers = getSignedRequestHeaders("PATCH", baseUrl, endpoint, payloadJSON, {});
            headers = {
                'Content-type': 'application/json;charset=UTF-8',
                'x-ccl-param': signed_headers["headers"]["x-ccl-param"],
                'x-ccl-signature': signed_headers["headers"]["x-ccl-signature"],
                'Cookie': cookie
            };
            res = await request
                .patch(endpoint)
                .set(headers)
                .send(payloadJSON);
            expect(res.statusCode).to.be.eq(400);
            expect(res.body.error).to.be.eq(`Max size cannot be negative`);
        });

        it('Update Specific Attributes - Update call fails when decimal value is send for max_size parameter for Media Attribute', async function () {
            attId = FO.getValueFromFile(attributeDetailsFile, 'MediaMSize');
            endpoint = update_delete_SpecificAttributes(orgId, attId);
            const invalid_max_size = faker.datatype.number({ min: 1, max: 10000, precision: 0.01 });
            payload = {
                max_size: invalid_max_size
            }
            payloadJSON = JSON.stringify(payload);
            signed_headers = getSignedRequestHeaders("PATCH", baseUrl, endpoint, payloadJSON, {});
            headers = {
                'Content-type': 'application/json;charset=UTF-8',
                'x-ccl-param': signed_headers["headers"]["x-ccl-param"],
                'x-ccl-signature': signed_headers["headers"]["x-ccl-signature"],
                'Cookie': cookie
            };
            res = await request
                .patch(endpoint)
                .set(headers)
                .send(payloadJSON);
            expect(res.statusCode).to.be.eq(400);
            expect(res.body.error).to.be.eq(`Validation failed: max_size: ${invalid_max_size} is not a positive integer`);
        });

        it('Update Specific Attributes - Update call fails when string is send for max_size parameter for Media Attribute', async function () {
            attId = FO.getValueFromFile(attributeDetailsFile, 'MediaMSize');
            endpoint = update_delete_SpecificAttributes(orgId, attId);
            const invalid_max_size = faker.random.alpha(10);
            payload = {
                max_size: invalid_max_size
            }
            payloadJSON = JSON.stringify(payload);
            signed_headers = getSignedRequestHeaders("PATCH", baseUrl, endpoint, payloadJSON, {});
            headers = {
                'Content-type': 'application/json;charset=UTF-8',
                'x-ccl-param': signed_headers["headers"]["x-ccl-param"],
                'x-ccl-signature': signed_headers["headers"]["x-ccl-signature"],
                'Cookie': cookie
            };
            res = await request
                .patch(endpoint)
                .set(headers)
                .send(payloadJSON);
            expect(res.statusCode).to.be.eq(400);
            expect(res.body.error).to.be.eq(`Cast to Number failed for value \"${invalid_max_size}\" (type string) at path \"max_size\"`);
        });

        it('Update Specific Attributes - Updating List Attribute', async function () {
            attId = FO.getValueFromFile(attributeDetailsFile, 'ListRandom');
            endpoint = update_delete_SpecificAttributes(orgId, attId);
            payloadData = attributePayloads.createListAttributePayload('ListRandomUp');
            payload = {
                active: payloadData.active,
                name: payloadData.name,
                description: payloadData.description
            }
            payloadJSON = JSON.stringify(payload);
            signed_headers = getSignedRequestHeaders("PATCH", baseUrl, endpoint, payloadJSON, {});
            headers = {
                'Content-type': 'application/json;charset=UTF-8',
                'x-ccl-param': signed_headers["headers"]["x-ccl-param"],
                'x-ccl-signature': signed_headers["headers"]["x-ccl-signature"],
                'Cookie': cookie
            };
            res = await request
                .patch(endpoint)
                .set(headers)
                .send(payloadJSON);
            expect(res.statusCode).to.be.eq(200);
            expect(res.body).to.be.jsonSchema(schemas.getListAttributeSchema);
            expect(res.body.active).to.be.eq(payloadData.active);
            expect(res.body.name).to.be.eq(payloadData.name);
            expect(res.body.description).to.be.eq(payloadData.description);
        });

        it('Update Specific Attributes - Updating formatting value to Uppercase from None for List Attribute', async function () {
            attId = FO.getValueFromFile(attributeDetailsFile, 'ListNone');
            endpoint = update_delete_SpecificAttributes(orgId, attId);
            payload = {
                formatting: 'Uppercase'
            }
            payloadJSON = JSON.stringify(payload);
            signed_headers = getSignedRequestHeaders("PATCH", baseUrl, endpoint, payloadJSON, {});
            headers = {
                'Content-type': 'application/json;charset=UTF-8',
                'x-ccl-param': signed_headers["headers"]["x-ccl-param"],
                'x-ccl-signature': signed_headers["headers"]["x-ccl-signature"],
                'Cookie': cookie
            };
            res = await request
                .patch(endpoint)
                .set(headers)
                .send(payloadJSON);
            expect(res.statusCode).to.be.eq(200);
            expect(res.body).to.be.jsonSchema(schemas.getListAttributeSchema);
            expect(res.body.formatting).to.be.eq(`Uppercase`);
        });

        it('Update Specific Attributes - Updating formatting value to None for List Attribute', async function () {
            attId = FO.getValueFromFile(attributeDetailsFile, 'ListNone');
            endpoint = update_delete_SpecificAttributes(orgId, attId);
            payload = {
                formatting: 'None'
            }
            payloadJSON = JSON.stringify(payload);
            signed_headers = getSignedRequestHeaders("PATCH", baseUrl, endpoint, payloadJSON, {});
            headers = {
                'Content-type': 'application/json;charset=UTF-8',
                'x-ccl-param': signed_headers["headers"]["x-ccl-param"],
                'x-ccl-signature': signed_headers["headers"]["x-ccl-signature"],
                'Cookie': cookie
            };
            res = await request
                .patch(endpoint)
                .set(headers)
                .send(payloadJSON);
            expect(res.statusCode).to.be.eq(200);
            expect(res.body).to.be.jsonSchema(schemas.getListAttributeSchema);
            expect(res.body.formatting).to.be.eq(`None`);
        });

        it('Update Specific Attributes - Updating formatting value to Uppercase from Lowercase for List Attribute', async function () {
            attId = FO.getValueFromFile(attributeDetailsFile, 'ListLower');
            endpoint = update_delete_SpecificAttributes(orgId, attId);
            payload = {
                formatting: 'Uppercase'
            }
            payloadJSON = JSON.stringify(payload);
            signed_headers = getSignedRequestHeaders("PATCH", baseUrl, endpoint, payloadJSON, {});
            headers = {
                'Content-type': 'application/json;charset=UTF-8',
                'x-ccl-param': signed_headers["headers"]["x-ccl-param"],
                'x-ccl-signature': signed_headers["headers"]["x-ccl-signature"],
                'Cookie': cookie
            };
            res = await request
                .patch(endpoint)
                .set(headers)
                .send(payloadJSON);
            expect(res.statusCode).to.be.eq(200);
            expect(res.body).to.be.jsonSchema(schemas.getListAttributeSchema);
            expect(res.body.formatting).to.be.eq(`Uppercase`);
        });

        it('Update Specific Attributes - Updating formatting value to Lowercase for List Attribute', async function () {
            attId = FO.getValueFromFile(attributeDetailsFile, 'ListLower');
            endpoint = update_delete_SpecificAttributes(orgId, attId);
            payload = {
                formatting: 'Lowercase'
            }
            payloadJSON = JSON.stringify(payload);
            signed_headers = getSignedRequestHeaders("PATCH", baseUrl, endpoint, payloadJSON, {});
            headers = {
                'Content-type': 'application/json;charset=UTF-8',
                'x-ccl-param': signed_headers["headers"]["x-ccl-param"],
                'x-ccl-signature': signed_headers["headers"]["x-ccl-signature"],
                'Cookie': cookie
            };
            res = await request
                .patch(endpoint)
                .set(headers)
                .send(payloadJSON);
            expect(res.statusCode).to.be.eq(200);
            expect(res.body).to.be.jsonSchema(schemas.getListAttributeSchema);
            expect(res.body.formatting).to.be.eq(`Lowercase`);
        });

        it('Update Specific Attributes - Updating formatting value to None from Lowercase for List Attribute', async function () {
            attId = FO.getValueFromFile(attributeDetailsFile, 'ListLower');
            endpoint = update_delete_SpecificAttributes(orgId, attId);
            payload = {
                formatting: 'None'
            }
            payloadJSON = JSON.stringify(payload);
            signed_headers = getSignedRequestHeaders("PATCH", baseUrl, endpoint, payloadJSON, {});
            headers = {
                'Content-type': 'application/json;charset=UTF-8',
                'x-ccl-param': signed_headers["headers"]["x-ccl-param"],
                'x-ccl-signature': signed_headers["headers"]["x-ccl-signature"],
                'Cookie': cookie
            };
            res = await request
                .patch(endpoint)
                .set(headers)
                .send(payloadJSON);
            expect(res.statusCode).to.be.eq(200);
            expect(res.body).to.be.jsonSchema(schemas.getListAttributeSchema);
            expect(res.body.formatting).to.be.eq(`None`);
        });

        it('Update Specific Attributes - Updating formatting value to Lowercase from None for List Attribute', async function () {
            attId = FO.getValueFromFile(attributeDetailsFile, 'ListLower');
            endpoint = update_delete_SpecificAttributes(orgId, attId);
            payload = {
                formatting: 'Lowercase'
            }
            payloadJSON = JSON.stringify(payload);
            signed_headers = getSignedRequestHeaders("PATCH", baseUrl, endpoint, payloadJSON, {});
            headers = {
                'Content-type': 'application/json;charset=UTF-8',
                'x-ccl-param': signed_headers["headers"]["x-ccl-param"],
                'x-ccl-signature': signed_headers["headers"]["x-ccl-signature"],
                'Cookie': cookie
            };
            res = await request
                .patch(endpoint)
                .set(headers)
                .send(payloadJSON);
            expect(res.statusCode).to.be.eq(200);
            expect(res.body).to.be.jsonSchema(schemas.getListAttributeSchema);
            expect(res.body.formatting).to.be.eq(`Lowercase`);
        });

        it('Update Specific Attributes - Updating call fails when formatting value is sent as UpperCase for List Attribute', async function () {
            attId = FO.getValueFromFile(attributeDetailsFile, 'ListNone');
            endpoint = update_delete_SpecificAttributes(orgId, attId);
            payload = {
                formatting: 'UpperCase'
            }
            payloadJSON = JSON.stringify(payload);
            signed_headers = getSignedRequestHeaders("PATCH", baseUrl, endpoint, payloadJSON, {});
            headers = {
                'Content-type': 'application/json;charset=UTF-8',
                'x-ccl-param': signed_headers["headers"]["x-ccl-param"],
                'x-ccl-signature': signed_headers["headers"]["x-ccl-signature"],
                'Cookie': cookie
            };
            res = await request
                .patch(endpoint)
                .set(headers)
                .send(payloadJSON);
            expect(res.statusCode).to.be.eq(400);
            expect(res.body.error).to.be.eq(`Validation failed: formatting: \`UpperCase\` is not a valid enum value for path \`formatting\`.`);
        });

        it('Update Specific Attributes - Updating call fails when formatting value is sent as random string for List Attribute', async function () {
            attId = FO.getValueFromFile(attributeDetailsFile, 'ListNone');
            endpoint = update_delete_SpecificAttributes(orgId, attId);
            const invalid_formatting = faker.random.alpha(5);
            payload = {
                formatting: invalid_formatting
            }
            payloadJSON = JSON.stringify(payload);
            signed_headers = getSignedRequestHeaders("PATCH", baseUrl, endpoint, payloadJSON, {});
            headers = {
                'Content-type': 'application/json;charset=UTF-8',
                'x-ccl-param': signed_headers["headers"]["x-ccl-param"],
                'x-ccl-signature': signed_headers["headers"]["x-ccl-signature"],
                'Cookie': cookie
            };
            res = await request
                .patch(endpoint)
                .set(headers)
                .send(payloadJSON);
            expect(res.statusCode).to.be.eq(400);
            expect(res.body.error).to.be.eq(`Validation failed: formatting: \`${invalid_formatting}\` is not a valid enum value for path \`formatting\`.`);
        });

        it('Update Specific Attributes - Updating call fails when formatting value is sent as number for List Attribute', async function () {
            attId = FO.getValueFromFile(attributeDetailsFile, 'ListNone');
            endpoint = update_delete_SpecificAttributes(orgId, attId);
            const invalid_formatting = Number(faker.random.numeric(5));
            payload = {
                formatting: invalid_formatting
            }
            payloadJSON = JSON.stringify(payload);
            signed_headers = getSignedRequestHeaders("PATCH", baseUrl, endpoint, payloadJSON, {});
            headers = {
                'Content-type': 'application/json;charset=UTF-8',
                'x-ccl-param': signed_headers["headers"]["x-ccl-param"],
                'x-ccl-signature': signed_headers["headers"]["x-ccl-signature"],
                'Cookie': cookie
            };
            res = await request
                .patch(endpoint)
                .set(headers)
                .send(payloadJSON);
            expect(res.statusCode).to.be.eq(400);
            expect(res.body.error).to.be.eq(`Validation failed: formatting: \`${invalid_formatting}\` is not a valid enum value for path \`formatting\`.`);
        });

        it('Update Specific Attributes - Updating allow_multiple value as False for List Attribute', async function () {
            attId = FO.getValueFromFile(attributeDetailsFile, 'ListAMTrue');
            endpoint = update_delete_SpecificAttributes(orgId, attId);
            payload = {
                allow_multiple: false
            }
            payloadJSON = JSON.stringify(payload);
            signed_headers = getSignedRequestHeaders("PATCH", baseUrl, endpoint, payloadJSON, {});
            headers = {
                'Content-type': 'application/json;charset=UTF-8',
                'x-ccl-param': signed_headers["headers"]["x-ccl-param"],
                'x-ccl-signature': signed_headers["headers"]["x-ccl-signature"],
                'Cookie': cookie
            };
            res = await request
                .patch(endpoint)
                .set(headers)
                .send(payloadJSON);
            expect(res.statusCode).to.be.eq(200);
            expect(res.body).to.be.jsonSchema(schemas.getListAttributeSchema);
            expect(res.body.allow_multiple).to.be.false;
        });

        it('Update Specific Attributes - Updating allowed_values parameter for List Attribute', async function () {
            attId = FO.getValueFromFile(attributeDetailsFile, 'ListRandom');
            endpoint = update_delete_SpecificAttributes(orgId, attId);
            payloadData = attributePayloads.createListAttributePayload('ListRandomUp');
            payload = {
                allowed_values: payloadData.allowed_values
            }
            payloadJSON = JSON.stringify(payload);
            signed_headers = getSignedRequestHeaders("PATCH", baseUrl, endpoint, payloadJSON, {});
            headers = {
                'Content-type': 'application/json;charset=UTF-8',
                'x-ccl-param': signed_headers["headers"]["x-ccl-param"],
                'x-ccl-signature': signed_headers["headers"]["x-ccl-signature"],
                'Cookie': cookie
            };
            res = await request
                .patch(endpoint)
                .set(headers)
                .send(payloadJSON);
            expect(res.statusCode).to.be.eq(200);
            expect(res.body).to.be.jsonSchema(schemas.getListAttributeSchema);
            expect(compareArrayData(res.body.allowed_values, payloadData.allowed_values)).to.be.true;
        });

        it('Update Specific Attributes - Updating allow_multiple value as True for List Attribute', async function () {
            attId = FO.getValueFromFile(attributeDetailsFile, 'ListAMTrue');
            endpoint = update_delete_SpecificAttributes(orgId, attId);
            payload = {
                allow_multiple: true
            }
            payloadJSON = JSON.stringify(payload);
            signed_headers = getSignedRequestHeaders("PATCH", baseUrl, endpoint, payloadJSON, {});
            headers = {
                'Content-type': 'application/json;charset=UTF-8',
                'x-ccl-param': signed_headers["headers"]["x-ccl-param"],
                'x-ccl-signature': signed_headers["headers"]["x-ccl-signature"],
                'Cookie': cookie
            };
            res = await request
                .patch(endpoint)
                .set(headers)
                .send(payloadJSON);
            expect(res.statusCode).to.be.eq(200);
            expect(res.body).to.be.jsonSchema(schemas.getListAttributeSchema);
            expect(res.body.allow_multiple).to.be.true;
        });

        it('Update Specific Attributes - Updating call fails when allow_multiple value is sent as number for List Attribute', async function () {
            attId = FO.getValueFromFile(attributeDetailsFile, 'ListNone');
            endpoint = update_delete_SpecificAttributes(orgId, attId);
            const invalid_allow_multiple = Number(faker.random.numeric(5));
            payload = {
                allow_multiple: invalid_allow_multiple
            }
            payloadJSON = JSON.stringify(payload);
            signed_headers = getSignedRequestHeaders("PATCH", baseUrl, endpoint, payloadJSON, {});
            headers = {
                'Content-type': 'application/json;charset=UTF-8',
                'x-ccl-param': signed_headers["headers"]["x-ccl-param"],
                'x-ccl-signature': signed_headers["headers"]["x-ccl-signature"],
                'Cookie': cookie
            };
            res = await request
                .patch(endpoint)
                .set(headers)
                .send(payloadJSON);
            expect(res.statusCode).to.be.eq(400);
            expect(res.body.error).to.be.eq(`Cast to Boolean failed for value \"${invalid_allow_multiple}\" (type number) at path \"allow_multiple\" because of \"CastError\"`);
        });

        it('Update Specific Attributes - Updating call fails when allow_multiple value is sent as random string for List Attribute', async function () {
            attId = FO.getValueFromFile(attributeDetailsFile, 'ListNone');
            endpoint = update_delete_SpecificAttributes(orgId, attId);
            const invalid_allow_multiple = faker.random.alpha(10);
            payload = {
                allow_multiple: invalid_allow_multiple
            }
            payloadJSON = JSON.stringify(payload);
            signed_headers = getSignedRequestHeaders("PATCH", baseUrl, endpoint, payloadJSON, {});
            headers = {
                'Content-type': 'application/json;charset=UTF-8',
                'x-ccl-param': signed_headers["headers"]["x-ccl-param"],
                'x-ccl-signature': signed_headers["headers"]["x-ccl-signature"],
                'Cookie': cookie
            };
            res = await request
                .patch(endpoint)
                .set(headers)
                .send(payloadJSON);
            expect(res.statusCode).to.be.eq(400);
            expect(res.body.error).to.be.eq(`Cast to Boolean failed for value \"${invalid_allow_multiple}\" (type string) at path \"allow_multiple\" because of \"CastError\"`);
        });

        it('Update Specific Attributes - Updating mandatory parameter to true for List Attribute', async function () {
            attId = FO.getValueFromFile(attributeDetailsFile, 'ListRandom');
            endpoint = update_delete_SpecificAttributes(orgId, attId);
            payloadData = attributePayloads.createListAttributePayload('ListRandomUp');
            payload = {
                active: payloadData.active,
                name: payloadData.name,
                description: payloadData.description,
                mandatory: true
            }
            payloadJSON = JSON.stringify(payload);
            signed_headers = getSignedRequestHeaders("PATCH", baseUrl, endpoint, payloadJSON, {});
            headers = {
                'Content-type': 'application/json;charset=UTF-8',
                'x-ccl-param': signed_headers["headers"]["x-ccl-param"],
                'x-ccl-signature': signed_headers["headers"]["x-ccl-signature"],
                'Cookie': cookie
            };
            res = await request
                .patch(endpoint)
                .set(headers)
                .send(payloadJSON);
            expect(res.statusCode).to.be.eq(200);
            expect(res.body).to.be.jsonSchema(schemas.getListAttributeSchema);
            expect(res.body.active).to.be.eq(payloadData.active);
            expect(res.body.name).to.be.eq(payloadData.name);
            expect(res.body.mandatory).to.be.true;
            expect(res.body.description).to.be.eq(payloadData.description);
        });

        it('Update Specific Attributes - Updating mandatory parameter to false for List Attribute', async function () {
            attId = FO.getValueFromFile(attributeDetailsFile, 'ListRandom');
            endpoint = update_delete_SpecificAttributes(orgId, attId);
            payloadData = attributePayloads.createListAttributePayload('ListRandomUp');
            payload = {
                active: payloadData.active,
                name: payloadData.name,
                description: payloadData.description,
                mandatory: false
            }
            payloadJSON = JSON.stringify(payload);
            signed_headers = getSignedRequestHeaders("PATCH", baseUrl, endpoint, payloadJSON, {});
            headers = {
                'Content-type': 'application/json;charset=UTF-8',
                'x-ccl-param': signed_headers["headers"]["x-ccl-param"],
                'x-ccl-signature': signed_headers["headers"]["x-ccl-signature"],
                'Cookie': cookie
            };
            res = await request
                .patch(endpoint)
                .set(headers)
                .send(payloadJSON);
            expect(res.statusCode).to.be.eq(200);
            expect(res.body).to.be.jsonSchema(schemas.getListAttributeSchema);
            expect(res.body.active).to.be.eq(payloadData.active);
            expect(res.body.name).to.be.eq(payloadData.name);
            expect(res.body.mandatory).to.be.false;
            expect(res.body.description).to.be.eq(payloadData.description);
        });

        it('Update Specific Attributes - Updating limit parameter for Paragraph Attribute type', async function () {
            attId = FO.getValueFromFile(attributeDetailsFile, 'ParagraphRandom');
            endpoint = update_delete_SpecificAttributes(orgId, attId);
            payloadData = attributePayloads.createParagraphAttributePayload('ParagraphRandomUp');
            payload = {
                limit: payloadData.limit
            }
            payloadJSON = JSON.stringify(payload);
            signed_headers = getSignedRequestHeaders("PATCH", baseUrl, endpoint, payloadJSON, {});
            headers = {
                'Content-type': 'application/json;charset=UTF-8',
                'x-ccl-param': signed_headers["headers"]["x-ccl-param"],
                'x-ccl-signature': signed_headers["headers"]["x-ccl-signature"],
                'Cookie': cookie
            };
            res = await request
                .patch(endpoint)
                .set(headers)
                .send(payloadJSON);
            expect(res.statusCode).to.be.eq(200);
            expect(res.body).to.be.jsonSchema(schemas.getParagraphAttributeSchema);
            expect(res.body.limit).to.be.eq(payloadData.limit);
        });

        it('Update Specific Attributes - Updating Call fails when limit parameter is sent as negative value for Paragraph Attribute type', async function () {
            attId = FO.getValueFromFile(attributeDetailsFile, 'ParagraphRandom');
            endpoint = update_delete_SpecificAttributes(orgId, attId);
            payloadData = attributePayloads.createParagraphAttributePayload('ParagraphRandomUp');
            const invalid_limit = payloadData.limit * -1;
            payload = {
                limit: invalid_limit
            }
            payloadJSON = JSON.stringify(payload);
            signed_headers = getSignedRequestHeaders("PATCH", baseUrl, endpoint, payloadJSON, {});
            headers = {
                'Content-type': 'application/json;charset=UTF-8',
                'x-ccl-param': signed_headers["headers"]["x-ccl-param"],
                'x-ccl-signature': signed_headers["headers"]["x-ccl-signature"],
                'Cookie': cookie
            };
            res = await request
                .patch(endpoint)
                .set(headers)
                .send(payloadJSON);
            expect(res.statusCode).to.be.eq(400);
            expect(res.body.error).to.be.eq(`Validation failed: limit: ${invalid_limit} is not a positive integer`);
        });

        it('Update Specific Attributes - Updating Call fails when limit parameter is sent as negative value for Paragraph Attribute type', async function () {
            attId = FO.getValueFromFile(attributeDetailsFile, 'ParagraphRandom');
            endpoint = update_delete_SpecificAttributes(orgId, attId);
            payloadData = attributePayloads.createParagraphAttributePayload('ParagraphRandomUp');
            const invalid_limit = faker.datatype.number({ min: -100000, max: 100000, precision: 0.01 });
            payload = {
                limit: invalid_limit
            }
            payloadJSON = JSON.stringify(payload);
            signed_headers = getSignedRequestHeaders("PATCH", baseUrl, endpoint, payloadJSON, {});
            headers = {
                'Content-type': 'application/json;charset=UTF-8',
                'x-ccl-param': signed_headers["headers"]["x-ccl-param"],
                'x-ccl-signature': signed_headers["headers"]["x-ccl-signature"],
                'Cookie': cookie
            };
            res = await request
                .patch(endpoint)
                .set(headers)
                .send(payloadJSON);
            expect(res.statusCode).to.be.eq(400);
            expect(res.body.error).to.be.eq(`Validation failed: limit: ${invalid_limit} is not a positive integer`);
        });

        it('Update Specific Attributes - Updating Call fails when limit parameter is sent as string for Paragraph Attribute type', async function () {
            attId = FO.getValueFromFile(attributeDetailsFile, 'ParagraphRandom');
            endpoint = update_delete_SpecificAttributes(orgId, attId);
            payloadData = attributePayloads.createParagraphAttributePayload('ParagraphRandomUp');
            const invalid_limit = faker.random.alpha(10);
            payload = {
                limit: invalid_limit
            }
            payloadJSON = JSON.stringify(payload);
            signed_headers = getSignedRequestHeaders("PATCH", baseUrl, endpoint, payloadJSON, {});
            headers = {
                'Content-type': 'application/json;charset=UTF-8',
                'x-ccl-param': signed_headers["headers"]["x-ccl-param"],
                'x-ccl-signature': signed_headers["headers"]["x-ccl-signature"],
                'Cookie': cookie
            };
            res = await request
                .patch(endpoint)
                .set(headers)
                .send(payloadJSON);
            expect(res.statusCode).to.be.eq(400);
            expect(res.body.error).to.be.eq(`Cast to Number failed for value \"${invalid_limit}\" (type string) at path \"limit\"`);
        });

        it('Update Specific Attributes - Updating formatting from None to UpperCase for Short Text type', async function () {
            attId = FO.getValueFromFile(attributeDetailsFile, 'ShortTextNone');
            endpoint = update_delete_SpecificAttributes(orgId, attId);
            payloadData = attributePayloads.createShortTextAttributePayload('ShortTextNoneUp');
            const formatting = 'Uppercase';
            payload = {
                active: payloadData.active,
                name: payloadData.name,
                description: payloadData.description,
                formatting: formatting
            }
            payloadJSON = JSON.stringify(payload);
            signed_headers = getSignedRequestHeaders("PATCH", baseUrl, endpoint, payloadJSON, {});
            headers = {
                'Content-type': 'application/json;charset=UTF-8',
                'x-ccl-param': signed_headers["headers"]["x-ccl-param"],
                'x-ccl-signature': signed_headers["headers"]["x-ccl-signature"],
                'Cookie': cookie
            };
            res = await request
                .patch(endpoint)
                .set(headers)
                .send(payloadJSON);
            expect(res.statusCode).to.be.eq(200);
            expect(res.body).to.be.jsonSchema(schemas.getShortTextAttributeSchema);
            expect(res.body.active).to.be.eq(payloadData.active);
            expect(res.body.name).to.be.eq(payloadData.name);
            expect(res.body.formatting).to.be.eq(formatting);
            expect(res.body.description).to.be.eq(payloadData.description);
        });

        it('Update Specific Attributes - Updating formatting from UpperCase to None for Short Text type', async function () {
            attId = FO.getValueFromFile(attributeDetailsFile, 'ShortTextNone');
            endpoint = update_delete_SpecificAttributes(orgId, attId);
            payloadData = attributePayloads.createShortTextAttributePayload('ShortTextNoneUp');
            const formatting = 'None';
            payload = {
                active: payloadData.active,
                name: payloadData.name,
                description: payloadData.description,
                formatting: formatting
            }
            payloadJSON = JSON.stringify(payload);
            signed_headers = getSignedRequestHeaders("PATCH", baseUrl, endpoint, payloadJSON, {});
            headers = {
                'Content-type': 'application/json;charset=UTF-8',
                'x-ccl-param': signed_headers["headers"]["x-ccl-param"],
                'x-ccl-signature': signed_headers["headers"]["x-ccl-signature"],
                'Cookie': cookie
            };
            res = await request
                .patch(endpoint)
                .set(headers)
                .send(payloadJSON);
            expect(res.statusCode).to.be.eq(200);
            expect(res.body).to.be.jsonSchema(schemas.getShortTextAttributeSchema);
            expect(res.body.active).to.be.eq(payloadData.active);
            expect(res.body.name).to.be.eq(payloadData.name);
            expect(res.body.formatting).to.be.eq(formatting);
            expect(res.body.description).to.be.eq(payloadData.description);
        });

        it('Update Specific Attributes - Updating formatting from UpperCase to Lowercase for Short Text type', async function () {
            attId = FO.getValueFromFile(attributeDetailsFile, 'ShortTextUpper');
            endpoint = update_delete_SpecificAttributes(orgId, attId);
            payloadData = attributePayloads.createShortTextAttributePayload('ShortTextUpperUp');
            const formatting = 'Lowercase';
            payload = {
                active: payloadData.active,
                name: payloadData.name,
                description: payloadData.description,
                formatting: formatting
            }
            payloadJSON = JSON.stringify(payload);
            signed_headers = getSignedRequestHeaders("PATCH", baseUrl, endpoint, payloadJSON, {});
            headers = {
                'Content-type': 'application/json;charset=UTF-8',
                'x-ccl-param': signed_headers["headers"]["x-ccl-param"],
                'x-ccl-signature': signed_headers["headers"]["x-ccl-signature"],
                'Cookie': cookie
            };
            res = await request
                .patch(endpoint)
                .set(headers)
                .send(payloadJSON);
            expect(res.statusCode).to.be.eq(200);
            expect(res.body).to.be.jsonSchema(schemas.getShortTextAttributeSchema);
            expect(res.body.active).to.be.eq(payloadData.active);
            expect(res.body.name).to.be.eq(payloadData.name);
            expect(res.body.formatting).to.be.eq(formatting);
            expect(res.body.description).to.be.eq(payloadData.description);
        });

        it('Update Specific Attributes - Updating formatting from LowerCase to UpperCase for Short Text type', async function () {
            attId = FO.getValueFromFile(attributeDetailsFile, 'ShortTextUpper');
            endpoint = update_delete_SpecificAttributes(orgId, attId);
            payloadData = attributePayloads.createShortTextAttributePayload('ShortTextUpperUp');
            const formatting = 'Uppercase';
            payload = {
                active: payloadData.active,
                name: payloadData.name,
                description: payloadData.description,
                formatting: formatting
            }
            payloadJSON = JSON.stringify(payload);
            signed_headers = getSignedRequestHeaders("PATCH", baseUrl, endpoint, payloadJSON, {});
            headers = {
                'Content-type': 'application/json;charset=UTF-8',
                'x-ccl-param': signed_headers["headers"]["x-ccl-param"],
                'x-ccl-signature': signed_headers["headers"]["x-ccl-signature"],
                'Cookie': cookie
            };
            res = await request
                .patch(endpoint)
                .set(headers)
                .send(payloadJSON);
            expect(res.statusCode).to.be.eq(200);
            expect(res.body).to.be.jsonSchema(schemas.getShortTextAttributeSchema);
            expect(res.body.active).to.be.eq(payloadData.active);
            expect(res.body.name).to.be.eq(payloadData.name);
            expect(res.body.formatting).to.be.eq(formatting);
            expect(res.body.description).to.be.eq(payloadData.description);
        });

        it('Update Specific Attributes - Updating formatting from Lowercase to None for Short Text type', async function () {
            attId = FO.getValueFromFile(attributeDetailsFile, 'ShortTextLower');
            endpoint = update_delete_SpecificAttributes(orgId, attId);
            payloadData = attributePayloads.createShortTextAttributePayload('ShortTextLowerUp');
            const formatting = 'None';
            payload = {
                active: payloadData.active,
                name: payloadData.name,
                description: payloadData.description,
                formatting: formatting
            }
            payloadJSON = JSON.stringify(payload);
            signed_headers = getSignedRequestHeaders("PATCH", baseUrl, endpoint, payloadJSON, {});
            headers = {
                'Content-type': 'application/json;charset=UTF-8',
                'x-ccl-param': signed_headers["headers"]["x-ccl-param"],
                'x-ccl-signature': signed_headers["headers"]["x-ccl-signature"],
                'Cookie': cookie
            };
            res = await request
                .patch(endpoint)
                .set(headers)
                .send(payloadJSON);
            expect(res.statusCode).to.be.eq(200);
            expect(res.body).to.be.jsonSchema(schemas.getShortTextAttributeSchema);
            expect(res.body.active).to.be.eq(payloadData.active);
            expect(res.body.name).to.be.eq(payloadData.name);
            expect(res.body.formatting).to.be.eq(formatting);
            expect(res.body.description).to.be.eq(payloadData.description);
        });

        it('Update Specific Attributes - Updating formatting from LowerCase to UpperCase for Short Text type', async function () {
            attId = FO.getValueFromFile(attributeDetailsFile, 'ShortTextLower');
            endpoint = update_delete_SpecificAttributes(orgId, attId);
            payloadData = attributePayloads.createShortTextAttributePayload('ShortTextLowerUp');
            const formatting = 'Lowercase';
            payload = {
                active: payloadData.active,
                name: payloadData.name,
                description: payloadData.description,
                formatting: formatting
            }
            payloadJSON = JSON.stringify(payload);
            signed_headers = getSignedRequestHeaders("PATCH", baseUrl, endpoint, payloadJSON, {});
            headers = {
                'Content-type': 'application/json;charset=UTF-8',
                'x-ccl-param': signed_headers["headers"]["x-ccl-param"],
                'x-ccl-signature': signed_headers["headers"]["x-ccl-signature"],
                'Cookie': cookie
            };
            res = await request
                .patch(endpoint)
                .set(headers)
                .send(payloadJSON);
            expect(res.statusCode).to.be.eq(200);
            expect(res.body).to.be.jsonSchema(schemas.getShortTextAttributeSchema);
            expect(res.body.active).to.be.eq(payloadData.active);
            expect(res.body.name).to.be.eq(payloadData.name);
            expect(res.body.formatting).to.be.eq(formatting);
            expect(res.body.description).to.be.eq(payloadData.description);
        });

        it('Update Specific Attributes - Update Attribute Call fails when formatting is sent as random string for Short Text type', async function () {
            attId = FO.getValueFromFile(attributeDetailsFile, 'ShortTextRandom');
            endpoint = update_delete_SpecificAttributes(orgId, attId);
            payloadData = attributePayloads.createShortTextAttributePayload('ShortTextRandomUp');
            const invalid_formatting = faker.random.alpha(10);
            payload = {
                active: payloadData.active,
                name: payloadData.name,
                description: payloadData.description,
                formatting: invalid_formatting
            }
            payloadJSON = JSON.stringify(payload);
            signed_headers = getSignedRequestHeaders("PATCH", baseUrl, endpoint, payloadJSON, {});
            headers = {
                'Content-type': 'application/json;charset=UTF-8',
                'x-ccl-param': signed_headers["headers"]["x-ccl-param"],
                'x-ccl-signature': signed_headers["headers"]["x-ccl-signature"],
                'Cookie': cookie
            };
            res = await request
                .patch(endpoint)
                .set(headers)
                .send(payloadJSON);
            expect(res.statusCode).to.be.eq(400);
            expect(res.body.error).to.be.eq(`Validation failed: formatting: \`${invalid_formatting}\` is not a valid enum value for path \`formatting\`.`);
        });

        it('Update Specific Attributes - Update Attribute Call fails when formatting is sent as UpperCase for Short Text type', async function () {
            attId = FO.getValueFromFile(attributeDetailsFile, 'ShortTextRandom');
            endpoint = update_delete_SpecificAttributes(orgId, attId);
            payloadData = attributePayloads.createShortTextAttributePayload('ShortTextRandomUp');
            const invalid_formatting = `UpperCase`;
            payload = {
                active: payloadData.active,
                name: payloadData.name,
                description: payloadData.description,
                formatting: invalid_formatting
            }
            payloadJSON = JSON.stringify(payload);
            signed_headers = getSignedRequestHeaders("PATCH", baseUrl, endpoint, payloadJSON, {});
            headers = {
                'Content-type': 'application/json;charset=UTF-8',
                'x-ccl-param': signed_headers["headers"]["x-ccl-param"],
                'x-ccl-signature': signed_headers["headers"]["x-ccl-signature"],
                'Cookie': cookie
            };
            res = await request
                .patch(endpoint)
                .set(headers)
                .send(payloadJSON);
            expect(res.statusCode).to.be.eq(400);
            expect(res.body.error).to.be.eq(`Validation failed: formatting: \`${invalid_formatting}\` is not a valid enum value for path \`formatting\`.`);
        });

        it('Update Specific Attributes - Update Attribute Call fails when formatting is sent as LowerCase for Short Text type', async function () {
            attId = FO.getValueFromFile(attributeDetailsFile, 'ShortTextRandom');
            endpoint = update_delete_SpecificAttributes(orgId, attId);
            payloadData = attributePayloads.createShortTextAttributePayload('ShortTextRandomUp');
            const invalid_formatting = `LowerCase`;
            payload = {
                active: payloadData.active,
                name: payloadData.name,
                description: payloadData.description,
                formatting: invalid_formatting
            }
            payloadJSON = JSON.stringify(payload);
            signed_headers = getSignedRequestHeaders("PATCH", baseUrl, endpoint, payloadJSON, {});
            headers = {
                'Content-type': 'application/json;charset=UTF-8',
                'x-ccl-param': signed_headers["headers"]["x-ccl-param"],
                'x-ccl-signature': signed_headers["headers"]["x-ccl-signature"],
                'Cookie': cookie
            };
            res = await request
                .patch(endpoint)
                .set(headers)
                .send(payloadJSON);
            expect(res.statusCode).to.be.eq(400);
            expect(res.body.error).to.be.eq(`Validation failed: formatting: \`${invalid_formatting}\` is not a valid enum value for path \`formatting\`.`);
        });

        it('Update Specific Attributes - Update Attribute Call fails when formatting is sent as none for Short Text type', async function () {
            attId = FO.getValueFromFile(attributeDetailsFile, 'ShortTextRandom');
            endpoint = update_delete_SpecificAttributes(orgId, attId);
            payloadData = attributePayloads.createShortTextAttributePayload('ShortTextRandomUp');
            const invalid_formatting = `none`;
            payload = {
                active: payloadData.active,
                name: payloadData.name,
                description: payloadData.description,
                formatting: invalid_formatting
            }
            payloadJSON = JSON.stringify(payload);
            signed_headers = getSignedRequestHeaders("PATCH", baseUrl, endpoint, payloadJSON, {});
            headers = {
                'Content-type': 'application/json;charset=UTF-8',
                'x-ccl-param': signed_headers["headers"]["x-ccl-param"],
                'x-ccl-signature': signed_headers["headers"]["x-ccl-signature"],
                'Cookie': cookie
            };
            res = await request
                .patch(endpoint)
                .set(headers)
                .send(payloadJSON);
            expect(res.statusCode).to.be.eq(400);
            expect(res.body.error).to.be.eq(`Validation failed: formatting: \`${invalid_formatting}\` is not a valid enum value for path \`formatting\`.`);
        });

        it('Update Specific Attributes - Update Attribute Call fails when formatting is sent as number for Short Text type', async function () {
            attId = FO.getValueFromFile(attributeDetailsFile, 'ShortTextRandom');
            endpoint = update_delete_SpecificAttributes(orgId, attId);
            payloadData = attributePayloads.createShortTextAttributePayload('ShortTextRandomUp');
            const invalid_formatting = Number(faker.random.numeric(5));
            payload = {
                active: payloadData.active,
                name: payloadData.name,
                description: payloadData.description,
                formatting: invalid_formatting
            }
            payloadJSON = JSON.stringify(payload);
            signed_headers = getSignedRequestHeaders("PATCH", baseUrl, endpoint, payloadJSON, {});
            headers = {
                'Content-type': 'application/json;charset=UTF-8',
                'x-ccl-param': signed_headers["headers"]["x-ccl-param"],
                'x-ccl-signature': signed_headers["headers"]["x-ccl-signature"],
                'Cookie': cookie
            };
            res = await request
                .patch(endpoint)
                .set(headers)
                .send(payloadJSON);
            expect(res.statusCode).to.be.eq(400);
            expect(res.body.error).to.be.eq(`Validation failed: formatting: \`${invalid_formatting}\` is not a valid enum value for path \`formatting\`.`);
        });

        it('Update Specific Attributes - Update Attribute Call fails when random string is sent for vms_visible', async function () {
            attId = FO.getValueFromFile(attributeDetailsFile, 'ShortTextRandom');
            endpoint = update_delete_SpecificAttributes(orgId, attId);
            payloadData = attributePayloads.createShortTextAttributePayload('ShortTextRandomUp');
            const invalid_vms_visible = faker.random.alpha(7);
            payload = {
                active: payloadData.active,
                name: payloadData.name,
                description: payloadData.description,
                vms_visible: invalid_vms_visible
            }
            payloadJSON = JSON.stringify(payload);
            signed_headers = getSignedRequestHeaders("PATCH", baseUrl, endpoint, payloadJSON, {});
            headers = {
                'Content-type': 'application/json;charset=UTF-8',
                'x-ccl-param': signed_headers["headers"]["x-ccl-param"],
                'x-ccl-signature': signed_headers["headers"]["x-ccl-signature"],
                'Cookie': cookie
            };
            res = await request
                .patch(endpoint)
                .set(headers)
                .send(payloadJSON);
            expect(res.statusCode).to.be.eq(400);
            expect(res.body.error).to.be.eq(`Cast to Boolean failed for value \"${invalid_vms_visible}\" (type string) at path \"vms_visible\" because of \"CastError\"`);
        });

        it('Update Specific Attributes - Update Attribute Call fails when number is sent for vms_visible', async function () {
            attId = FO.getValueFromFile(attributeDetailsFile, 'ShortTextRandom');
            endpoint = update_delete_SpecificAttributes(orgId, attId);
            payloadData = attributePayloads.createShortTextAttributePayload('ShortTextRandomUp');
            const invalid_vms_visible = Number(faker.random.numeric(5));
            payload = {
                active: payloadData.active,
                name: payloadData.name,
                description: payloadData.description,
                vms_visible: invalid_vms_visible
            }
            payloadJSON = JSON.stringify(payload);
            signed_headers = getSignedRequestHeaders("PATCH", baseUrl, endpoint, payloadJSON, {});
            headers = {
                'Content-type': 'application/json;charset=UTF-8',
                'x-ccl-param': signed_headers["headers"]["x-ccl-param"],
                'x-ccl-signature': signed_headers["headers"]["x-ccl-signature"],
                'Cookie': cookie
            };
            res = await request
                .patch(endpoint)
                .set(headers)
                .send(payloadJSON);
            expect(res.statusCode).to.be.eq(400);
            expect(res.body.error).to.be.eq(`Cast to Boolean failed for value \"${invalid_vms_visible}\" (type number) at path \"vms_visible\" because of \"CastError\"`);
        });

        it('Update Specific Attributes - Update Attribute Call fails when random string is sent for vms_editable', async function () {
            attId = FO.getValueFromFile(attributeDetailsFile, 'ParagraphRandom');
            endpoint = update_delete_SpecificAttributes(orgId, attId);
            payloadData = attributePayloads.createParagraphAttributePayload('ParagraphRandomUp');
            const invalid_vms_editable = faker.random.alpha(7);
            payload = {
                active: payloadData.active,
                name: payloadData.name,
                description: payloadData.description,
                vms_editable: invalid_vms_editable
            }
            payloadJSON = JSON.stringify(payload);
            signed_headers = getSignedRequestHeaders("PATCH", baseUrl, endpoint, payloadJSON, {});
            headers = {
                'Content-type': 'application/json;charset=UTF-8',
                'x-ccl-param': signed_headers["headers"]["x-ccl-param"],
                'x-ccl-signature': signed_headers["headers"]["x-ccl-signature"],
                'Cookie': cookie
            };
            res = await request
                .patch(endpoint)
                .set(headers)
                .send(payloadJSON);
            expect(res.statusCode).to.be.eq(400);
            expect(res.body.error).to.be.eq(`Cast to Boolean failed for value \"${invalid_vms_editable}\" (type string) at path \"vms_editable\" because of \"CastError\"`);
        });

        it('Update Specific Attributes - Update Attribute Call fails when number is sent for vms_editable', async function () {
            attId = FO.getValueFromFile(attributeDetailsFile, 'ParagraphRandom');
            endpoint = update_delete_SpecificAttributes(orgId, attId);
            payloadData = attributePayloads.createParagraphAttributePayload('ParagraphRandomUp');
            const invalid_vms_editable = Number(faker.random.numeric(5));
            payload = {
                active: payloadData.active,
                name: payloadData.name,
                description: payloadData.description,
                vms_editable: invalid_vms_editable
            }
            payloadJSON = JSON.stringify(payload);
            signed_headers = getSignedRequestHeaders("PATCH", baseUrl, endpoint, payloadJSON, {});
            headers = {
                'Content-type': 'application/json;charset=UTF-8',
                'x-ccl-param': signed_headers["headers"]["x-ccl-param"],
                'x-ccl-signature': signed_headers["headers"]["x-ccl-signature"],
                'Cookie': cookie
            };
            res = await request
                .patch(endpoint)
                .set(headers)
                .send(payloadJSON);
            expect(res.statusCode).to.be.eq(400);
            expect(res.body.error).to.be.eq(`Cast to Boolean failed for value \"${invalid_vms_editable}\" (type number) at path \"vms_editable\" because of \"CastError\"`);
        });

        it('Update Specific Attributes - Update Attribute Call fails when random string is sent for store_filter', async function () {
            attId = FO.getValueFromFile(attributeDetailsFile, 'HTMLRandom');
            endpoint = update_delete_SpecificAttributes(orgId, attId);
            payloadData = attributePayloads.attributePayloadBasicType('HTMLRandomUp');
            const invalid_store_filter = faker.random.alpha(7);
            payload = {
                active: payloadData.active,
                name: payloadData.name,
                description: payloadData.description,
                store_filter: invalid_store_filter
            }
            payloadJSON = JSON.stringify(payload);
            signed_headers = getSignedRequestHeaders("PATCH", baseUrl, endpoint, payloadJSON, {});
            headers = {
                'Content-type': 'application/json;charset=UTF-8',
                'x-ccl-param': signed_headers["headers"]["x-ccl-param"],
                'x-ccl-signature': signed_headers["headers"]["x-ccl-signature"],
                'Cookie': cookie
            };
            res = await request
                .patch(endpoint)
                .set(headers)
                .send(payloadJSON);
            expect(res.statusCode).to.be.eq(400);
            expect(res.body.error).to.be.eq(`Cast to Boolean failed for value \"${invalid_store_filter}\" (type string) at path \"store_filter\" because of \"CastError\"`);
        });

        it('Update Specific Attributes - Update Attribute Call fails when number is sent for store_filter', async function () {
            attId = FO.getValueFromFile(attributeDetailsFile, 'HTMLRandom');
            endpoint = update_delete_SpecificAttributes(orgId, attId);
            payloadData = attributePayloads.attributePayloadBasicType('HTMLRandomUp');
            const invalid_store_filter = Number(faker.random.numeric(5));
            payload = {
                active: payloadData.active,
                name: payloadData.name,
                description: payloadData.description,
                store_filter: invalid_store_filter
            }
            payloadJSON = JSON.stringify(payload);
            signed_headers = getSignedRequestHeaders("PATCH", baseUrl, endpoint, payloadJSON, {});
            headers = {
                'Content-type': 'application/json;charset=UTF-8',
                'x-ccl-param': signed_headers["headers"]["x-ccl-param"],
                'x-ccl-signature': signed_headers["headers"]["x-ccl-signature"],
                'Cookie': cookie
            };
            res = await request
                .patch(endpoint)
                .set(headers)
                .send(payloadJSON);
            expect(res.statusCode).to.be.eq(400);
            expect(res.body.error).to.be.eq(`Cast to Boolean failed for value \"${invalid_store_filter}\" (type number) at path \"store_filter\" because of \"CastError\"`);
        });

        it('Update Specific Attributes - Update Attribute Call fails when random string is sent for store_display_plp', async function () {
            attId = FO.getValueFromFile(attributeDetailsFile, 'URLRandom');
            endpoint = update_delete_SpecificAttributes(orgId, attId);
            payloadData = attributePayloads.attributePayloadBasicType('URLRandomUp');
            const invalid_store_display_plp = faker.random.alpha(7);
            payload = {
                active: payloadData.active,
                name: payloadData.name,
                description: payloadData.description,
                store_display_plp: invalid_store_display_plp
            }
            payloadJSON = JSON.stringify(payload);
            signed_headers = getSignedRequestHeaders("PATCH", baseUrl, endpoint, payloadJSON, {});
            headers = {
                'Content-type': 'application/json;charset=UTF-8',
                'x-ccl-param': signed_headers["headers"]["x-ccl-param"],
                'x-ccl-signature': signed_headers["headers"]["x-ccl-signature"],
                'Cookie': cookie
            };
            res = await request
                .patch(endpoint)
                .set(headers)
                .send(payloadJSON);
            expect(res.statusCode).to.be.eq(400);
            expect(res.body.error).to.be.eq(`Cast to Boolean failed for value \"${invalid_store_display_plp}\" (type string) at path \"store_display_plp\" because of \"CastError\"`);
        });

        it('Update Specific Attributes - Update Attribute Call fails when number is sent for store_display_plp', async function () {
            attId = FO.getValueFromFile(attributeDetailsFile, 'URLRandom');
            endpoint = update_delete_SpecificAttributes(orgId, attId);
            payloadData = attributePayloads.attributePayloadBasicType('URLRandomUp');
            const invalid_store_display_plp = Number(faker.random.numeric(5));
            payload = {
                active: payloadData.active,
                name: payloadData.name,
                description: payloadData.description,
                store_display_plp: invalid_store_display_plp
            }
            payloadJSON = JSON.stringify(payload);
            signed_headers = getSignedRequestHeaders("PATCH", baseUrl, endpoint, payloadJSON, {});
            headers = {
                'Content-type': 'application/json;charset=UTF-8',
                'x-ccl-param': signed_headers["headers"]["x-ccl-param"],
                'x-ccl-signature': signed_headers["headers"]["x-ccl-signature"],
                'Cookie': cookie
            };
            res = await request
                .patch(endpoint)
                .set(headers)
                .send(payloadJSON);
            expect(res.statusCode).to.be.eq(400);
            expect(res.body.error).to.be.eq(`Cast to Boolean failed for value \"${invalid_store_display_plp}\" (type number) at path \"store_display_plp\" because of \"CastError\"`);
        });

        it('Update Specific Attributes - Update Attribute Call fails when random string is sent for store_display_pdp', async function () {
            attId = FO.getValueFromFile(attributeDetailsFile, 'DateRandom');
            endpoint = update_delete_SpecificAttributes(orgId, attId);
            payloadData = attributePayloads.attributePayloadBasicType('DateRandomUp');
            const invalid_store_display_pdp = faker.random.alpha(7);
            payload = {
                active: payloadData.active,
                name: payloadData.name,
                description: payloadData.description,
                store_display_pdp: invalid_store_display_pdp
            }
            payloadJSON = JSON.stringify(payload);
            signed_headers = getSignedRequestHeaders("PATCH", baseUrl, endpoint, payloadJSON, {});
            headers = {
                'Content-type': 'application/json;charset=UTF-8',
                'x-ccl-param': signed_headers["headers"]["x-ccl-param"],
                'x-ccl-signature': signed_headers["headers"]["x-ccl-signature"],
                'Cookie': cookie
            };
            res = await request
                .patch(endpoint)
                .set(headers)
                .send(payloadJSON);
            expect(res.statusCode).to.be.eq(400);
            expect(res.body.error).to.be.eq(`Cast to Boolean failed for value \"${invalid_store_display_pdp}\" (type string) at path \"store_display_pdp\" because of \"CastError\"`);
        });

        it('Update Specific Attributes - Update Attribute Call fails when number is sent for store_display_pdp', async function () {
            attId = FO.getValueFromFile(attributeDetailsFile, 'DateRandom');
            endpoint = update_delete_SpecificAttributes(orgId, attId);
            payloadData = attributePayloads.attributePayloadBasicType('DateRandomUp');
            const invalid_store_display_pdp = Number(faker.random.numeric(5));
            payload = {
                active: payloadData.active,
                name: payloadData.name,
                description: payloadData.description,
                store_display_pdp: invalid_store_display_pdp
            }
            payloadJSON = JSON.stringify(payload);
            signed_headers = getSignedRequestHeaders("PATCH", baseUrl, endpoint, payloadJSON, {});
            headers = {
                'Content-type': 'application/json;charset=UTF-8',
                'x-ccl-param': signed_headers["headers"]["x-ccl-param"],
                'x-ccl-signature': signed_headers["headers"]["x-ccl-signature"],
                'Cookie': cookie
            };
            res = await request
                .patch(endpoint)
                .set(headers)
                .send(payloadJSON);
            expect(res.statusCode).to.be.eq(400);
            expect(res.body.error).to.be.eq(`Cast to Boolean failed for value \"${invalid_store_display_pdp}\" (type number) at path \"store_display_pdp\" because of \"CastError\"`);
        });

        it('Update Specific Attributes - Update Attribute Call fails when random string is sent for store_search', async function () {
            attId = FO.getValueFromFile(attributeDetailsFile, 'BooleanRandom');
            endpoint = update_delete_SpecificAttributes(orgId, attId);
            payloadData = attributePayloads.attributePayloadBasicType('BooleanRandomUp');
            const invalid_store_search = faker.random.alpha(7);
            payload = {
                active: payloadData.active,
                name: payloadData.name,
                description: payloadData.description,
                store_search: invalid_store_search
            }
            payloadJSON = JSON.stringify(payload);
            signed_headers = getSignedRequestHeaders("PATCH", baseUrl, endpoint, payloadJSON, {});
            headers = {
                'Content-type': 'application/json;charset=UTF-8',
                'x-ccl-param': signed_headers["headers"]["x-ccl-param"],
                'x-ccl-signature': signed_headers["headers"]["x-ccl-signature"],
                'Cookie': cookie
            };
            res = await request
                .patch(endpoint)
                .set(headers)
                .send(payloadJSON);
            expect(res.statusCode).to.be.eq(400);
            expect(res.body.error).to.be.eq(`Cast to Boolean failed for value \"${invalid_store_search}\" (type string) at path \"store_search\" because of \"CastError\"`);
        });

        it('Update Specific Attributes - Update Attribute Call fails when number is sent for store_search', async function () {
            attId = FO.getValueFromFile(attributeDetailsFile, 'BooleanRandom');
            endpoint = update_delete_SpecificAttributes(orgId, attId);
            payloadData = attributePayloads.attributePayloadBasicType('BooleanRandomUp');
            const invalid_store_search = Number(faker.random.numeric(5));
            payload = {
                active: payloadData.active,
                name: payloadData.name,
                description: payloadData.description,
                store_search: invalid_store_search
            }
            payloadJSON = JSON.stringify(payload);
            signed_headers = getSignedRequestHeaders("PATCH", baseUrl, endpoint, payloadJSON, {});
            headers = {
                'Content-type': 'application/json;charset=UTF-8',
                'x-ccl-param': signed_headers["headers"]["x-ccl-param"],
                'x-ccl-signature': signed_headers["headers"]["x-ccl-signature"],
                'Cookie': cookie
            };
            res = await request
                .patch(endpoint)
                .set(headers)
                .send(payloadJSON);
            expect(res.statusCode).to.be.eq(400);
            expect(res.body.error).to.be.eq(`Cast to Boolean failed for value \"${invalid_store_search}\" (type number) at path \"store_search\" because of \"CastError\"`);
        });

        it('Update Specific Attributes - Update Attribute Call fails when random string is sent for store_compare', async function () {
            attId = FO.getValueFromFile(attributeDetailsFile, 'NumberRandom');
            endpoint = update_delete_SpecificAttributes(orgId, attId);
            payloadData = attributePayloads.createNumberAttributePayload('NumberRandomUp');
            const invalid_store_compare = faker.random.alpha(7);
            payload = {
                active: payloadData.active,
                name: payloadData.name,
                description: payloadData.description,
                store_compare: invalid_store_compare
            }
            payloadJSON = JSON.stringify(payload);
            signed_headers = getSignedRequestHeaders("PATCH", baseUrl, endpoint, payloadJSON, {});
            headers = {
                'Content-type': 'application/json;charset=UTF-8',
                'x-ccl-param': signed_headers["headers"]["x-ccl-param"],
                'x-ccl-signature': signed_headers["headers"]["x-ccl-signature"],
                'Cookie': cookie
            };
            res = await request
                .patch(endpoint)
                .set(headers)
                .send(payloadJSON);
            expect(res.statusCode).to.be.eq(400);
            expect(res.body.error).to.be.eq(`Cast to Boolean failed for value \"${invalid_store_compare}\" (type string) at path \"store_compare\" because of \"CastError\"`);
        });

        it('Update Specific Attributes - Update Attribute Call fails when number is sent for store_compare', async function () {
            attId = FO.getValueFromFile(attributeDetailsFile, 'NumberRandom');
            endpoint = update_delete_SpecificAttributes(orgId, attId);
            payloadData = attributePayloads.createNumberAttributePayload('NumberRandomUp');
            const invalid_store_compare = Number(faker.random.numeric(5));
            payload = {
                active: payloadData.active,
                name: payloadData.name,
                description: payloadData.description,
                store_compare: invalid_store_compare
            }
            payloadJSON = JSON.stringify(payload);
            signed_headers = getSignedRequestHeaders("PATCH", baseUrl, endpoint, payloadJSON, {});
            headers = {
                'Content-type': 'application/json;charset=UTF-8',
                'x-ccl-param': signed_headers["headers"]["x-ccl-param"],
                'x-ccl-signature': signed_headers["headers"]["x-ccl-signature"],
                'Cookie': cookie
            };
            res = await request
                .patch(endpoint)
                .set(headers)
                .send(payloadJSON);
            expect(res.statusCode).to.be.eq(400);
            expect(res.body.error).to.be.eq(`Cast to Boolean failed for value \"${invalid_store_compare}\" (type number) at path \"store_compare\" because of \"CastError\"`);
        });

        it('Update Specific Attributes - Update Attribute Call fails when random string is sent for active', async function () {
            attId = FO.getValueFromFile(attributeDetailsFile, 'DecimalRandom');
            endpoint = update_delete_SpecificAttributes(orgId, attId);
            payloadData = attributePayloads.createDecimalAttributePayload('DecimalRandomUp');
            const invalid_active = faker.random.alpha(7);
            payload = {
                name: payloadData.name,
                description: payloadData.description,
                active: invalid_active
            }
            payloadJSON = JSON.stringify(payload);
            signed_headers = getSignedRequestHeaders("PATCH", baseUrl, endpoint, payloadJSON, {});
            headers = {
                'Content-type': 'application/json;charset=UTF-8',
                'x-ccl-param': signed_headers["headers"]["x-ccl-param"],
                'x-ccl-signature': signed_headers["headers"]["x-ccl-signature"],
                'Cookie': cookie
            };
            res = await request
                .patch(endpoint)
                .set(headers)
                .send(payloadJSON);
            expect(res.statusCode).to.be.eq(400);
            expect(res.body.error).to.be.eq(`Cast to Boolean failed for value \"${invalid_active}\" (type string) at path \"active\" because of \"CastError\"`);
        });

        it('Update Specific Attributes - Update Attribute Call fails when number is sent for active', async function () {
            attId = FO.getValueFromFile(attributeDetailsFile, 'DecimalRandom');
            endpoint = update_delete_SpecificAttributes(orgId, attId);
            payloadData = attributePayloads.createDecimalAttributePayload('DecimalRandomUp');
            const invalid_active = Number(faker.random.numeric(5));
            payload = {
                name: payloadData.name,
                description: payloadData.description,
                active: invalid_active
            }
            payloadJSON = JSON.stringify(payload);
            signed_headers = getSignedRequestHeaders("PATCH", baseUrl, endpoint, payloadJSON, {});
            headers = {
                'Content-type': 'application/json;charset=UTF-8',
                'x-ccl-param': signed_headers["headers"]["x-ccl-param"],
                'x-ccl-signature': signed_headers["headers"]["x-ccl-signature"],
                'Cookie': cookie
            };
            res = await request
                .patch(endpoint)
                .set(headers)
                .send(payloadJSON);
            expect(res.statusCode).to.be.eq(400);
            expect(res.body.error).to.be.eq(`Cast to Boolean failed for value \"${invalid_active}\" (type number) at path \"active\" because of \"CastError\"`);
        });

        it('Update Specific Attributes - Update Attribute Call fails when random string is sent for mandatory', async function () {
            attId = FO.getValueFromFile(attributeDetailsFile, 'FileRandom');
            endpoint = update_delete_SpecificAttributes(orgId, attId);
            payloadData = attributePayloads.createFileAttributePayload('FileRandomUp');
            const invalid_mandatory = faker.random.alpha(7);
            payload = {
                active: payloadData.active,
                name: payloadData.name,
                description: payloadData.description,
                mandatory: invalid_mandatory
            }
            payloadJSON = JSON.stringify(payload);
            signed_headers = getSignedRequestHeaders("PATCH", baseUrl, endpoint, payloadJSON, {});
            headers = {
                'Content-type': 'application/json;charset=UTF-8',
                'x-ccl-param': signed_headers["headers"]["x-ccl-param"],
                'x-ccl-signature': signed_headers["headers"]["x-ccl-signature"],
                'Cookie': cookie
            };
            res = await request
                .patch(endpoint)
                .set(headers)
                .send(payloadJSON);
            expect(res.statusCode).to.be.eq(400);
            expect(res.body.error).to.be.eq(`Cast to Boolean failed for value \"${invalid_mandatory}\" (type string) at path \"mandatory\" because of \"CastError\"`);
        });

        it('Update Specific Attributes - Update Attribute Call fails when number is sent for mandatory', async function () {
            attId = FO.getValueFromFile(attributeDetailsFile, 'FileRandom');
            endpoint = update_delete_SpecificAttributes(orgId, attId);
            payloadData = attributePayloads.createFileAttributePayload('FileRandomUp');
            const invalid_mandatory = Number(faker.random.numeric(5));
            payload = {
                active: payloadData.active,
                name: payloadData.name,
                description: payloadData.description,
                mandatory: invalid_mandatory
            }
            payloadJSON = JSON.stringify(payload);
            signed_headers = getSignedRequestHeaders("PATCH", baseUrl, endpoint, payloadJSON, {});
            headers = {
                'Content-type': 'application/json;charset=UTF-8',
                'x-ccl-param': signed_headers["headers"]["x-ccl-param"],
                'x-ccl-signature': signed_headers["headers"]["x-ccl-signature"],
                'Cookie': cookie
            };
            res = await request
                .patch(endpoint)
                .set(headers)
                .send(payloadJSON);
            expect(res.statusCode).to.be.eq(400);
            expect(res.body.error).to.be.eq(`Cast to Boolean failed for value \"${invalid_mandatory}\" (type number) at path \"mandatory\" because of \"CastError\"`);
        });

        it('Update Specific Attributes - Update Attribute Call fails when random string is sent for auto_sync_to_prod', async function () {
            attId = FO.getValueFromFile(attributeDetailsFile, 'FileRandom');
            endpoint = update_delete_SpecificAttributes(orgId, attId);
            payloadData = attributePayloads.createFileAttributePayload('FileRandomUp');
            const invalid_auto_sync_to_prod = faker.random.alpha(7);
            payload = {
                active: payloadData.active,
                name: payloadData.name,
                description: payloadData.description,
                auto_sync_to_prod: invalid_auto_sync_to_prod
            }
            payloadJSON = JSON.stringify(payload);
            signed_headers = getSignedRequestHeaders("PATCH", baseUrl, endpoint, payloadJSON, {});
            headers = {
                'Content-type': 'application/json;charset=UTF-8',
                'x-ccl-param': signed_headers["headers"]["x-ccl-param"],
                'x-ccl-signature': signed_headers["headers"]["x-ccl-signature"],
                'Cookie': cookie
            };
            res = await request
                .patch(endpoint)
                .set(headers)
                .send(payloadJSON);
            expect(res.statusCode).to.be.eq(400);
            expect(res.body.error).to.be.eq(`Cast to Boolean failed for value \"${invalid_auto_sync_to_prod}\" (type string) at path \"auto_sync_to_prod\" because of \"CastError\"`);
        });

        it('Update Specific Attributes - Update Attribute Call fails when number is sent for auto_sync_to_prod', async function () {
            attId = FO.getValueFromFile(attributeDetailsFile, 'FileRandom');
            endpoint = update_delete_SpecificAttributes(orgId, attId);
            payloadData = attributePayloads.createFileAttributePayload('FileRandomUp');
            const invalid_auto_sync_to_prod = Number(faker.random.numeric(5));
            payload = {
                active: payloadData.active,
                name: payloadData.name,
                description: payloadData.description,
                auto_sync_to_prod: invalid_auto_sync_to_prod
            }
            payloadJSON = JSON.stringify(payload);
            signed_headers = getSignedRequestHeaders("PATCH", baseUrl, endpoint, payloadJSON, {});
            headers = {
                'Content-type': 'application/json;charset=UTF-8',
                'x-ccl-param': signed_headers["headers"]["x-ccl-param"],
                'x-ccl-signature': signed_headers["headers"]["x-ccl-signature"],
                'Cookie': cookie
            };
            res = await request
                .patch(endpoint)
                .set(headers)
                .send(payloadJSON);
            expect(res.statusCode).to.be.eq(400);
            expect(res.body.error).to.be.eq(`Cast to Boolean failed for value \"${invalid_auto_sync_to_prod}\" (type number) at path \"auto_sync_to_prod\" because of \"CastError\"`);
        });

    });

    describe('Delete Specific Attributes @cdm @attributes', async function () {

        it('Delete Specific attribute, user is not logged in', async function () {
            attId = FO.getValueFromFile(attributeDetailsFile, 'ShortTextRandom');
            endpoint = update_delete_SpecificAttributes(orgId, attId);
            payload = null;
            signed_headers = getSignedRequestHeaders("DELETE", baseUrl, endpoint, payload, {});
            headers = {
                'Content-type': 'application/json;charset=UTF-8',
                'x-ccl-param': signed_headers["headers"]["x-ccl-param"],
                'x-ccl-signature': signed_headers["headers"]["x-ccl-signature"]
            };
            res = await request
                .delete(endpoint)
                .set(headers);
            expect(res.statusCode).to.be.eq(403);
            expect(res.body.error).to.be.eq('Unauthorized');
        });

        it('Delete Specific Attributes - User is logged in but invalid orgId is provided', async function () {
            attId = FO.getValueFromFile(attributeDetailsFile, 'ShortTextRandom');
            endpoint = update_delete_SpecificAttributes(orgId.substring(0, orgId.length - 1), attId);
            payload = null;
            signed_headers = getSignedRequestHeaders("DELETE", baseUrl, endpoint, payload, {});
            headers = {
                'Content-type': 'application/json;charset=UTF-8',
                'x-ccl-param': signed_headers["headers"]["x-ccl-param"],
                'x-ccl-signature': signed_headers["headers"]["x-ccl-signature"],
                'Cookie': cookie
            };
            res = await request
                .delete(endpoint)
                .set(headers);
            expect(res.statusCode).to.be.eq(401);
            expect(res.body.error).to.be.eq('Invalid organisation');
        });

        it('Delete Specific Attributes - Invalid attribute id is sent', async function () {
            attId = FO.getValueFromFile(attributeDetailsFile, 'ShortTextRandom');
            endpoint = update_delete_SpecificAttributes(orgId, attId.substring(0, attId.length - 1));
            payload = null;
            signed_headers = getSignedRequestHeaders("DELETE", baseUrl, endpoint, payload, {});
            headers = {
                'Content-type': 'application/json;charset=UTF-8',
                'x-ccl-param': signed_headers["headers"]["x-ccl-param"],
                'x-ccl-signature': signed_headers["headers"]["x-ccl-signature"],
                'Cookie': cookie
            };
            res = await request
                .delete(endpoint)
                .set(headers);
            expect(res.statusCode).to.be.eq(404);
            expect(res.body.error).to.be.eq('Unable to find attribute with given ID.');
        });

        it('Delete Specific Attributes - Short Text Attribute is deleted successfully', async function () {
            attId = FO.getValueFromFile(attributeDetailsFile, 'ShortTextRandom');
            endpoint = update_delete_SpecificAttributes(orgId, attId);
            payload = null;
            signed_headers = getSignedRequestHeaders("DELETE", baseUrl, endpoint, payload, {});
            headers = {
                'Content-type': 'application/json;charset=UTF-8',
                'x-ccl-param': signed_headers["headers"]["x-ccl-param"],
                'x-ccl-signature': signed_headers["headers"]["x-ccl-signature"],
                'Cookie': cookie
            };
            res = await request
                .delete(endpoint)
                .set(headers);
            expect(res.statusCode).to.be.eq(200);
            expect(res.body.success).to.be.true;
        });

        it('Delete Specific Attributes - Paragraph Attribute is deleted successfully', async function () {
            attId = FO.getValueFromFile(attributeDetailsFile, 'ParagraphRandom');
            endpoint = update_delete_SpecificAttributes(orgId, attId);
            payload = null;
            signed_headers = getSignedRequestHeaders("DELETE", baseUrl, endpoint, payload, {});
            headers = {
                'Content-type': 'application/json;charset=UTF-8',
                'x-ccl-param': signed_headers["headers"]["x-ccl-param"],
                'x-ccl-signature': signed_headers["headers"]["x-ccl-signature"],
                'Cookie': cookie
            };
            res = await request
                .delete(endpoint)
                .set(headers);
            expect(res.statusCode).to.be.eq(200);
            expect(res.body.success).to.be.true;
        });

        it('Delete Specific Attributes - HTML Attribute is deleted successfully', async function () {
            attId = FO.getValueFromFile(attributeDetailsFile, 'HTMLRandom');
            endpoint = update_delete_SpecificAttributes(orgId, attId);
            payload = null;
            signed_headers = getSignedRequestHeaders("DELETE", baseUrl, endpoint, payload, {});
            headers = {
                'Content-type': 'application/json;charset=UTF-8',
                'x-ccl-param': signed_headers["headers"]["x-ccl-param"],
                'x-ccl-signature': signed_headers["headers"]["x-ccl-signature"],
                'Cookie': cookie
            };
            res = await request
                .delete(endpoint)
                .set(headers);
            expect(res.statusCode).to.be.eq(200);
            expect(res.body.success).to.be.true;
        });

        it('Delete Specific Attributes - URL Attribute is deleted successfully', async function () {
            attId = FO.getValueFromFile(attributeDetailsFile, 'URLRandom');
            endpoint = update_delete_SpecificAttributes(orgId, attId);
            payload = null;
            signed_headers = getSignedRequestHeaders("DELETE", baseUrl, endpoint, payload, {});
            headers = {
                'Content-type': 'application/json;charset=UTF-8',
                'x-ccl-param': signed_headers["headers"]["x-ccl-param"],
                'x-ccl-signature': signed_headers["headers"]["x-ccl-signature"],
                'Cookie': cookie
            };
            res = await request
                .delete(endpoint)
                .set(headers);
            expect(res.statusCode).to.be.eq(200);
            expect(res.body.success).to.be.true;
        });

        it('Delete Specific Attributes - Date Attribute is deleted successfully', async function () {
            attId = FO.getValueFromFile(attributeDetailsFile, 'DateRandom');
            endpoint = update_delete_SpecificAttributes(orgId, attId);
            payload = null;
            signed_headers = getSignedRequestHeaders("DELETE", baseUrl, endpoint, payload, {});
            headers = {
                'Content-type': 'application/json;charset=UTF-8',
                'x-ccl-param': signed_headers["headers"]["x-ccl-param"],
                'x-ccl-signature': signed_headers["headers"]["x-ccl-signature"],
                'Cookie': cookie
            };
            res = await request
                .delete(endpoint)
                .set(headers);
            expect(res.statusCode).to.be.eq(200);
            expect(res.body.success).to.be.true;
        });

        it('Delete Specific Attributes - Boolean Attribute is deleted successfully', async function () {
            attId = FO.getValueFromFile(attributeDetailsFile, 'BooleanRandom');
            endpoint = update_delete_SpecificAttributes(orgId, attId);
            payload = null;
            signed_headers = getSignedRequestHeaders("DELETE", baseUrl, endpoint, payload, {});
            headers = {
                'Content-type': 'application/json;charset=UTF-8',
                'x-ccl-param': signed_headers["headers"]["x-ccl-param"],
                'x-ccl-signature': signed_headers["headers"]["x-ccl-signature"],
                'Cookie': cookie
            };
            res = await request
                .delete(endpoint)
                .set(headers);
            expect(res.statusCode).to.be.eq(200);
            expect(res.body.success).to.be.true;
        });

        it('Delete Specific Attributes - Number Attribute is deleted successfully', async function () {
            attId = FO.getValueFromFile(attributeDetailsFile, 'NumberRandom');
            endpoint = update_delete_SpecificAttributes(orgId, attId);
            payload = null;
            signed_headers = getSignedRequestHeaders("DELETE", baseUrl, endpoint, payload, {});
            headers = {
                'Content-type': 'application/json;charset=UTF-8',
                'x-ccl-param': signed_headers["headers"]["x-ccl-param"],
                'x-ccl-signature': signed_headers["headers"]["x-ccl-signature"],
                'Cookie': cookie
            };
            res = await request
                .delete(endpoint)
                .set(headers);
            expect(res.statusCode).to.be.eq(200);
            expect(res.body.success).to.be.true;
        });

        it('Delete Specific Attributes - Decimal Attribute is deleted successfully', async function () {
            attId = FO.getValueFromFile(attributeDetailsFile, 'DecimalRandom');
            endpoint = update_delete_SpecificAttributes(orgId, attId);
            payload = null;
            signed_headers = getSignedRequestHeaders("DELETE", baseUrl, endpoint, payload, {});
            headers = {
                'Content-type': 'application/json;charset=UTF-8',
                'x-ccl-param': signed_headers["headers"]["x-ccl-param"],
                'x-ccl-signature': signed_headers["headers"]["x-ccl-signature"],
                'Cookie': cookie
            };
            res = await request
                .delete(endpoint)
                .set(headers);
            expect(res.statusCode).to.be.eq(200);
            expect(res.body.success).to.be.true;
        });

        it('Delete Specific Attributes - File Attribute is deleted successfully', async function () {
            attId = FO.getValueFromFile(attributeDetailsFile, 'FileRandom');
            endpoint = update_delete_SpecificAttributes(orgId, attId);
            payload = null;
            signed_headers = getSignedRequestHeaders("DELETE", baseUrl, endpoint, payload, {});
            headers = {
                'Content-type': 'application/json;charset=UTF-8',
                'x-ccl-param': signed_headers["headers"]["x-ccl-param"],
                'x-ccl-signature': signed_headers["headers"]["x-ccl-signature"],
                'Cookie': cookie
            };
            res = await request
                .delete(endpoint)
                .set(headers);
            expect(res.statusCode).to.be.eq(200);
            expect(res.body.success).to.be.true;
        });

        it('Delete Specific Attributes - Media Attribute is deleted successfully', async function () {
            attId = FO.getValueFromFile(attributeDetailsFile, 'MediaRandom');
            endpoint = update_delete_SpecificAttributes(orgId, attId);
            payload = null;
            signed_headers = getSignedRequestHeaders("DELETE", baseUrl, endpoint, payload, {});
            headers = {
                'Content-type': 'application/json;charset=UTF-8',
                'x-ccl-param': signed_headers["headers"]["x-ccl-param"],
                'x-ccl-signature': signed_headers["headers"]["x-ccl-signature"],
                'Cookie': cookie
            };
            res = await request
                .delete(endpoint)
                .set(headers);
            expect(res.statusCode).to.be.eq(200);
            expect(res.body.success).to.be.true;
        });

        it('Delete Specific Attributes - List Attribute is deleted successfully', async function () {
            attId = FO.getValueFromFile(attributeDetailsFile, 'ListRandom');
            endpoint = update_delete_SpecificAttributes(orgId, attId);
            payload = null;
            signed_headers = getSignedRequestHeaders("DELETE", baseUrl, endpoint, payload, {});
            headers = {
                'Content-type': 'application/json;charset=UTF-8',
                'x-ccl-param': signed_headers["headers"]["x-ccl-param"],
                'x-ccl-signature': signed_headers["headers"]["x-ccl-signature"],
                'Cookie': cookie
            };
            res = await request
                .delete(endpoint)
                .set(headers);
            expect(res.statusCode).to.be.eq(200);
            expect(res.body.success).to.be.true;
        });

    });
});

