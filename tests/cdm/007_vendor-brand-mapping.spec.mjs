import supertest from "supertest";
import chai, { expect } from 'chai';
import dotenv from "dotenv";
import jsonSchema from 'chai-json-schema';
import { faker } from '@faker-js/faker';
import { getSignedRequestHeaders } from '../../helpers/cdm/signature.mjs';
import { getCookie } from "../../helpers/cdm/cookie.mjs";
import { EnvironmentConfiguration } from "../../envs.config.mjs";
import { fetchBrandOrgId, fetchVendorOrgId } from "../../helpers/cdm/organisation_payload.mjs";
import { getVendorListEndpoint, getVendorMapListEndpoint, createVendorMappingEndpoint } from "../../configs/constants/cdm/constants.mjs";
import { getAllVendorsSchema, getVendorMapSchema } from "../../configs/jsonschema/cdm/organisation_json_schema.mjs";
import * as FO from "../../helpers/cdm/readWrite_data_json.mjs";

chai.use(jsonSchema);
dotenv.config();
const attributeDetailsFile = 'attributesDetails.json'
let cookie = await getCookie(process.env.TEST_UNAME, process.env.TEST_PASS);
let orgId, payload, payloadData, signed_headers, headers, res, endpoint;
let persistVendorArr = [];
let vendorList = [];
let invalidOrgId = "";
const baseUrl = EnvironmentConfiguration.getURL(process.env.DOMAIN);
const request = supertest(`https://${baseUrl}`);

describe('VendorMapping Api Test Cases @cc_regression @VendorMap', async function () {
    before(async function () {
        orgId = FO.getValueFromFile(attributeDetailsFile, 'OrgId');
    });

    describe('Get Vendor List @cc_regression @VendorMap', async function () {
        it('Get All Vendors - user is not logged in', async function () {
            payload = null;
            endpoint = getVendorListEndpoint(orgId);
            signed_headers = getSignedRequestHeaders("GET", baseUrl, endpoint, payload, {});
            headers = {
                'Content-type': 'application/json;charset=UTF-8',
                'x-ccl-param': signed_headers["headers"]["x-ccl-param"],
                'x-ccl-signature': signed_headers["headers"]["x-ccl-signature"],
            };
            res = await request
                .get(endpoint)
                .set(headers);
            expect(res.statusCode).to.be.eq(403);
            expect(res.body.error).to.be.eq('Unauthorized');
        });

        it('Get All Vendors - user is logged in', async function () {
            payload = null;
            endpoint = getVendorListEndpoint(orgId);
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
            for (let i = 0; i < res.body.data.length; i++) {
                vendorList.push(res.body.data[i]);
            }
            expect(res.statusCode).to.be.eq(200);
            expect(res.body).to.be.jsonSchema(getAllVendorsSchema);
        });

        it('Get All Vendors - user is logged in but invalid Vendor Id is sent', async function () {
            payload = null;
            invalidOrgId = orgId.substring(0, orgId.length - 1);
            endpoint = getVendorListEndpoint(invalidOrgId);
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

        it('Get All Vendors user is logged in but vendor Id is sent in request', async function () {
            payload = null;
            invalidOrgId = await fetchVendorOrgId(baseUrl, cookie);
            endpoint = getVendorListEndpoint(invalidOrgId);
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
            expect(res.statusCode).to.be.eq(400);
            expect(res.body.message).to.be.eq('Organization is not a seller');
        });
    });

    describe('Adding Vendors to Brand @cc_regression @VendorMap', async function () {
        it('Add vendors to brand - user is not logged in', async function () {
            endpoint = createVendorMappingEndpoint(orgId);
            const tempVendorArrSize = faker.number.int({ min: 0, max: vendorList.length });
            const tempVendorArr = [];
            for (let i = 0; i < tempVendorArrSize; i++) {
                tempVendorArr.push(vendorList[i]._id);
            }
            payload = JSON.stringify({
                vendorIds: tempVendorArr
            });
            signed_headers = getSignedRequestHeaders("POST", baseUrl, endpoint, payload, {});
            headers = {
                'Content-type': 'application/json;charset=UTF-8',
                'x-ccl-param': signed_headers["headers"]["x-ccl-param"],
                'x-ccl-signature': signed_headers["headers"]["x-ccl-signature"],
            };
            res = await request
                .post(endpoint)
                .set(headers)
                .send(payload);
            expect(res.statusCode).to.be.eq(403);
            expect(res.body.error).to.be.eq('Unauthorized');
        });

        it('Add vendors to brand - user is logged in', async function () {
            endpoint = createVendorMappingEndpoint(orgId);
            const tempVendorArrSize = faker.number.int({ min: 0, max: vendorList.length });
            const tempVendorArr = [];
            for (let i = 0; i < tempVendorArrSize; i++) {
                tempVendorArr.push(vendorList[i]._id);
            }
            persistVendorArr = [...tempVendorArr];
            payload = JSON.stringify({
                vendorIds: tempVendorArr
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
            expect(res.statusCode).to.be.eq(200);
            expect(res.body).to.be.jsonSchema(getVendorMapSchema);
            expect(res.body.data.length).to.be.eq(tempVendorArr.length);
        });

        it('Add vendors to brand - Vendors Id which are mapped already are sent', async function () {
            endpoint = createVendorMappingEndpoint(orgId);
            payload = JSON.stringify({
                vendorIds: persistVendorArr
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
            expect(res.body.message).to.be.eq('Mapping should be Unique');
        });

        it('Add vendors to brand - empty array is sent', async function () {
            endpoint = createVendorMappingEndpoint(orgId);
            payload = JSON.stringify({
                vendorIds: []
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
            expect(res.body.message).to.be.eq('vendorIds list must not be empty');
        });
    });

    describe('Get Vendor Mapping List @cc_regression @VendorMap', async function () {
        it('Get Vendors mapped to a particular Brand - User is not logged in', async function () {
            payload = null;
            endpoint = getVendorMapListEndpoint(orgId);
            signed_headers = getSignedRequestHeaders("GET", baseUrl, endpoint, payload, {});
            headers = {
                'Content-type': 'application/json;charset=UTF-8',
                'x-ccl-param': signed_headers["headers"]["x-ccl-param"],
                'x-ccl-signature': signed_headers["headers"]["x-ccl-signature"],
            };
            res = await request
                .get(endpoint)
                .set(headers);
            expect(res.statusCode).to.be.eq(403);
            expect(res.body.error).to.be.eq('Unauthorized');
        });

        it('Get Vendors mapped to a particular Brand - User is logged in', async function () {
            payload = null;
            endpoint = getVendorMapListEndpoint(orgId);
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
            expect(res.body).to.be.jsonSchema(getVendorMapSchema);
        });

        it('Get Vendors mapped to a particular Brand - User is logged in invalid orgId is provided', async function () {
            payload = null;
            invalidOrgId = orgId.substring(0, orgId.length - 1);
            endpoint = getVendorMapListEndpoint(invalidOrgId);
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

        it('Get Vendors mapped to a particular Brand - User is logged in but vendor Id is provided', async function () {
            payload = null;
            invalidOrgId = await fetchVendorOrgId(baseUrl, cookie);
            endpoint = getVendorMapListEndpoint(invalidOrgId);
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
            expect(res.statusCode).to.be.eq(400);
            expect(res.body.message).to.be.eq('Organization is not a seller');
        });
    })
});
