import supertest from "supertest";
import chai, { expect } from 'chai';
import dotenv from "dotenv";
import jsonSchema from 'chai-json-schema';
import { faker } from '@faker-js/faker';
import { getSignedRequestHeaders } from '../../helpers/cdm/signature.mjs';
import { getCookie } from "../../helpers/cdm/cookie.mjs";
import { fetchBrandOrgId } from "../../helpers/cdm/organisation_payload.mjs";
import * as categoriesSchema from "../../configs/jsonschema/cdm/categories_json_schema.mjs";
import * as categories from "../../configs/constants/cdm/constants.mjs";
import { EnvironmentConfiguration } from "../../envs.config.mjs";
import * as FO from "../../helpers/cdm/readWrite_data_json.mjs";

const dataJsonFile = 'dataFile.json';

chai.use(jsonSchema);
dotenv.config();
const attributeDetailsFile = 'attributesDetails.json'
let payload, signed_headers, headers, endpoint, orgId, res, categoryCode, categoryName;
let totalCategoryCount, categoryId;
const cookie = await getCookie(process.env.TEST_UNAME, process.env.TEST_PASS);
const baseUrl = EnvironmentConfiguration.getURL(process.env.DOMAIN);
const request = supertest(`https://${baseUrl}`);


describe('Categories and Category Mapping Api Test Cases @cc_regression @category', async function () {
    before(async function () {
        orgId = FO.getValueFromFile(attributeDetailsFile, 'OrgId');
    });
    describe('Category Api Test Cases @cc_regression @category', async function () {
        describe('Create Category Api test cases', async function () {
            it('Create Category calls failed - User is not logged in', async function () {
                const categoryCode = `${faker.string.alpha(5)}-${faker.number.int(5)}`;
                const categoryName = `${faker.string.alpha(5)}-${faker.number.int(5)}`;
                endpoint = categories.createCategoryEndpoint(orgId);
                payload = JSON.stringify({
                    "code": categoryCode,
                    "name": categoryName
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
                expect(res.statusCode).to.be.equal(403);
                expect(res.body.error).to.be.equal('Unauthorized');
            });

            it('Create Category calls failed - User is logged in but invalid orgId is sent', async function () {
                const categoryCode = `${faker.string.alpha(5)}-${faker.number.int(5)}`;
                const categoryName = `${faker.string.alpha(5)}-${faker.number.int(5)}`;
                endpoint = categories.createCategoryEndpoint(orgId.substring(0, orgId.length - 1));
                payload = JSON.stringify({
                    "code": categoryCode,
                    "name": categoryName
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
                expect(res.statusCode).to.be.equal(401);
                expect(res.body.error).to.be.equal('Invalid organisation');
            });

            it('Create Category call is successful- User is logged and proper data is sent', async function () {
                categoryCode = `${faker.string.alpha(5)}-${faker.number.int(5)}`;
                categoryName = `${faker.string.alpha(5)}-${faker.number.int(5)}`;
                endpoint = categories.createCategoryEndpoint(orgId);
                payload = JSON.stringify({
                    "code": categoryCode,
                    "name": categoryName
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
                categoryId = res.body._id;
                expect(res.statusCode).to.be.equal(200);
                expect(res.body).to.be.jsonSchema(categoriesSchema.successCategoryschema);
                expect(res.body.name).to.be.equal(categoryName);
                expect(res.body.code).to.be.equal(categoryCode);
                expect(res.body.archive).to.be.false;
                expect(res.body.x_org_id).to.be.equal(orgId);
            });

            it('Create Category call is successful- Already existing Name is sent', async function () {
                categoryCode = `${faker.string.alpha(5)}-${faker.number.int(5)}`;
                endpoint = categories.createCategoryEndpoint(orgId);
                payload = JSON.stringify({
                    "code": categoryCode,
                    "name": categoryName
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
                categoryId = res.body._id;
                expect(res.statusCode).to.be.equal(200);
                expect(res.body).to.be.jsonSchema(categoriesSchema.successCategoryschema);
                expect(res.body.name).to.be.equal(categoryName);
                expect(res.body.code).to.be.equal(categoryCode);
                expect(res.body.archive).to.be.false;
                expect(res.body.x_org_id).to.be.equal(orgId);
            });

            it('Create Category call fails - Already existing code is sent', async function () {
                categoryName = `${faker.string.alpha(5)}-${faker.number.int(5)}`;
                endpoint = categories.createCategoryEndpoint(orgId);
                payload = JSON.stringify({
                    "code": categoryCode,
                    "name": categoryName
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
                expect(res.statusCode).to.be.equal(400);
                expect(res.body.error).to.be.equal('Category code already exists');
            });

            it('Create Category call fails - Only Name is sent', async function () {
                categoryName = `${faker.string.alpha(5)}-${faker.number.int(5)}`;
                endpoint = categories.createCategoryEndpoint(orgId);
                payload = JSON.stringify({
                    "name": categoryName
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
                categoryId = res.body._id;
                expect(res.statusCode).to.be.equal(400);
                expect(res.body.error).to.be.equal('ValidationError: code: Path `code` is required.');
            });

            it('Create Category call fails - Only Code is sent', async function () {
                categoryCode = `${faker.string.alpha(5)}-${faker.number.int(5)}`;
                endpoint = categories.createCategoryEndpoint(orgId);
                payload = JSON.stringify({
                    "code": categoryCode
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
                categoryId = res.body._id;
                expect(res.statusCode).to.be.equal(400);
                expect(res.body.error).to.be.equal('ValidationError: name: Path `name` is required.');
            });
        });

        describe('Get Category Api Test Cases', async function () {

            it('Get All Category Call fails - user is not logged in', async function () {
                endpoint = categories.getAllCategoryEndpoint(orgId, 1);
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
                expect(res.statusCode).to.be.equal(403);
                expect(res.body.error).to.be.equal('Unauthorized');
            });

            it('Get All Category Call is successfull - User is logged in', async function () {
                endpoint = categories.getAllCategoryEndpoint(orgId, 1);
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
                let expectedDocumentsInCurrPage;
                totalCategoryCount = res.body.item_total;
                if (totalCategoryCount > 10) {
                    expectedDocumentsInCurrPage = 10
                }
                else {
                    expectedDocumentsInCurrPage = totalCategoryCount;
                }
                expect(res.statusCode).to.be.equal(200);
                expect(res.body).to.be.jsonSchema(categoriesSchema.getAllCategorySchema);
                expect(res.body.currPage).to.be.equal(1);
                expect(res.body.documentsInCurrPage).to.be.equal(expectedDocumentsInCurrPage);
            });
        });
    });
});


