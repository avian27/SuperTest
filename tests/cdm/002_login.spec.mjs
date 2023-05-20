import supertest from "supertest";
import chai, { expect } from 'chai';
import dotenv from "dotenv";
import jsonSchema from 'chai-json-schema';
import { faker } from '@faker-js/faker';
import { getSignedRequestHeaders } from '../../helpers/cdm/signature.mjs';
import { getCookie } from "../../helpers/cdm/cookie.mjs";
import { loginResSchema, currentSessionInfoSchema } from "../../configs/jsonschema/cdm/onboarding_json_schema.mjs";
import { currentSessionApiEndPoint, loginApiEndPoint, logoutApiEndPoint, profileDetailsEndPoint } from "../../configs/constants/cdm/constants.mjs";
import {EnvironmentConfiguration} from "../../envs.config.mjs";

chai.use(jsonSchema);
dotenv.config();
let invalidUserName, invalidPassword, payload, signed_headers, headers, res;
const cookie = await getCookie(process.env.CDM_USERNAME,process.env.CDM_PASSWORD);
const baseUrl = EnvironmentConfiguration.getURL(process.env.DOMAIN);
const request = supertest(`https://${baseUrl}`);



describe('Login Api Test Cases @cdm @login', async() =>{
    before(() => {
        invalidUserName = faker.internet.email();
        invalidPassword = faker.internet.password();
    });

    describe('Login @cdm @login', async () => {
        it('login success', async () => {
            payload = JSON.stringify({
                "username": process.env.CDM_USERNAME,
                "password": process.env.CDM_PASSWORD
            });
            signed_headers = getSignedRequestHeaders("POST", baseUrl, loginApiEndPoint, payload, {});
            headers = {
                'Content-type': 'application/json;charset=UTF-8',
                'x-ccl-param': signed_headers["headers"]["x-ccl-param"],
                'x-ccl-signature': signed_headers["headers"]["x-ccl-signature"]
            };
            res = await request
                .post(loginApiEndPoint)
                .set(headers)
                .send(payload);
            expect(res.statusCode).to.be.eq(200);
            expect(res.body).to.be.jsonSchema(loginResSchema);
            expect(res.body.user.email).to.be.equal(process.env.CDM_USERNAME);
            expect(res.body.user.meta.registrationMethod).to.be.equal('password');
            expect(res.body.user.active).to.be.true;
        });
    
        it('login failure invalid userName', async () => {
            payload = JSON.stringify({
                "username": invalidUserName,
                "password": process.env.CDM_PASSWORD
            });
            signed_headers = getSignedRequestHeaders("POST", baseUrl, loginApiEndPoint, payload, {});
            headers = {
                'Content-type': 'application/json;charset=UTF-8',
                'x-ccl-param': signed_headers["headers"]["x-ccl-param"],
                'x-ccl-signature': signed_headers["headers"]["x-ccl-signature"]
            };
            res = await request
                .post(loginApiEndPoint)
                .set(headers)
                .send(payload);
            expect(res.statusCode).to.be.eq(401);
            expect(res.body.message).to.be.eq("Invalid username/password");
        });
    
        it('login failure invalid password', async () => {
            payload = JSON.stringify({
                "username": process.env.CDM_USERNAME,
                "password": invalidPassword
            });
            signed_headers = getSignedRequestHeaders("POST", baseUrl, loginApiEndPoint, payload, {});
            headers = {
                'Content-type': 'application/json;charset=UTF-8',
                'x-ccl-param': signed_headers["headers"]["x-ccl-param"],
                'x-ccl-signature': signed_headers["headers"]["x-ccl-signature"]
            };
            res = await request
                .post(loginApiEndPoint)
                .set(headers)
                .send(payload);
            expect(res.statusCode).to.be.eq(401);
            expect(res.body.message).to.be.eq("Invalid username/password");
        });
    
        it('login failure', async () => {
            payload = JSON.stringify({
                "username": invalidUserName,
                "password": invalidPassword
            });
            signed_headers = getSignedRequestHeaders("POST", baseUrl, loginApiEndPoint, payload, {});
            headers = {
                'Content-type': 'application/json;charset=UTF-8',
                'x-ccl-param': signed_headers["headers"]["x-ccl-param"],
                'x-ccl-signature': signed_headers["headers"]["x-ccl-signature"]
            };
            res = await request
                .post(loginApiEndPoint)
                .set(headers)
                .send(payload);
            expect(res.statusCode).to.be.eq(401);
            expect(res.body.message).to.be.eq("Invalid username/password");
        });
    });
    
    describe('Current Session Info @cdm @login', async() =>{
    
        it('Current Session - User is not logged in', async() =>{
            signed_headers = getSignedRequestHeaders("GET", baseUrl, currentSessionApiEndPoint, "", {});
            headers = {
                'Content-type': 'application/json;charset=UTF-8',
                'x-ccl-param': signed_headers["headers"]["x-ccl-param"],
                'x-ccl-signature': signed_headers["headers"]["x-ccl-signature"]
            };
            res = await request
                .get(currentSessionApiEndPoint)
                .set(headers);
            expect(res.statusCode).to.be.eq(401);
            expect(res.body.authenticated).to.be.equal(false);
        });
    
        it('Current Session - User is logged in', async() =>{
            signed_headers = getSignedRequestHeaders("GET", baseUrl, currentSessionApiEndPoint, "", {});
            headers = {
                'Content-type': 'application/json;charset=UTF-8',
                'x-ccl-param': signed_headers["headers"]["x-ccl-param"],
                'x-ccl-signature': signed_headers["headers"]["x-ccl-signature"],
                'Cookie': cookie
            };
            res = await request
                .get(currentSessionApiEndPoint)
                .set(headers);
            expect(res.statusCode).to.be.eq(200);
            expect(res.body).to.be.jsonSchema(currentSessionInfoSchema);
            expect(res.body.session.cookie.domain).to.be.eq(baseUrl.split("api")[1]);
            expect(res.body.session.passport.user.email).to.be.eq(process.env.CDM_USERNAME);
            expect(res.body.session.passport.user.active).to.be.true;
            expect(res.body.session.passport.user.meta.registrationMethod).to.be.equal('password');
            expect(res.body.session.misc.headers.host).to.be.eq(baseUrl);
        });
    });
    
    describe('Profile Details @cdm @profile', async() =>{
        describe('Get Profile Details', async() =>{
            it('User is not logged in', async() =>{
                signed_headers = getSignedRequestHeaders("GET", baseUrl, profileDetailsEndPoint, "", {});
                headers = {
                    'Content-type': 'application/json;charset=UTF-8',
                    'x-ccl-param': signed_headers["headers"]["x-ccl-param"],
                    'x-ccl-signature': signed_headers["headers"]["x-ccl-signature"]
                };
                res = await request
                    .get(profileDetailsEndPoint)
                    .set(headers);
                expect(res.statusCode).to.be.eq(401);
                expect(res.body.authenticated).to.be.false;
            });
    
            it('User is logged in', async() =>{
                signed_headers = getSignedRequestHeaders("GET", baseUrl, profileDetailsEndPoint, "", {});
                headers = {
                    'Content-type': 'application/json;charset=UTF-8',
                    'x-ccl-param': signed_headers["headers"]["x-ccl-param"],
                    'x-ccl-signature': signed_headers["headers"]["x-ccl-signature"],
                    'Cookie': cookie
                };
                res = await request
                    .get(profileDetailsEndPoint)
                    .set(headers);
                expect(res.statusCode).to.be.eq(200);
                expect(res.body).to.be.jsonSchema(loginResSchema);
                expect(res.body.user.email).to.be.eq(process.env.CDM_USERNAME);
                expect(res.body.user.meta.registrationMethod).to.be.eq('password');
            });
        });
    
        describe('Update Profile Details', async() =>{
            let updatedFirstName = faker.name.firstName();
            let updatedLastName = faker.name.lastName();
            it('User is not logged in', async() =>{
                payload = JSON.stringify({
                    "firstName": updatedFirstName,
                    "lastName": updatedLastName
                });
                signed_headers = getSignedRequestHeaders("PATCH", baseUrl, profileDetailsEndPoint, payload, {});
                headers = {
                    'Content-type': 'application/json;charset=UTF-8',
                    'x-ccl-param': signed_headers["headers"]["x-ccl-param"],
                    'x-ccl-signature': signed_headers["headers"]["x-ccl-signature"]
                };
                res = await request
                    .patch(profileDetailsEndPoint)
                    .set(headers)
                    .send(payload);
                expect(res.statusCode).to.be.eq(401);
                expect(res.body.authenticated).to.be.false;
            });
    
            it('User is logged in and FirstName is updated as empty string', async() =>{
                payload = JSON.stringify({
                    "firstName": ``,
                    "lastName": updatedLastName
                });
                signed_headers = getSignedRequestHeaders("PATCH", baseUrl, profileDetailsEndPoint, payload, {});
                headers = {
                    'Content-type': 'application/json;charset=UTF-8',
                    'x-ccl-param': signed_headers["headers"]["x-ccl-param"],
                    'x-ccl-signature': signed_headers["headers"]["x-ccl-signature"],
                    'Cookie': cookie
                };
                res = await request
                    .patch(profileDetailsEndPoint)
                    .set(headers)
                    .send(payload);
                expect(res.statusCode).to.be.eq(400);
                expect(res.body.errors[0].msg).to.be.eq('firstName: should not be empty');
                expect(res.body.errors[0].param).to.be.eq('firstName')
            });
    
            it('User is logged in and LastName is updated as empty string', async() =>{
                payload = JSON.stringify({
                    "firstName": updatedFirstName,
                    "lastName": ``
                });
                signed_headers = getSignedRequestHeaders("PATCH", baseUrl, profileDetailsEndPoint, payload, {});
                headers = {
                    'Content-type': 'application/json;charset=UTF-8',
                    'x-ccl-param': signed_headers["headers"]["x-ccl-param"],
                    'x-ccl-signature': signed_headers["headers"]["x-ccl-signature"],
                    'Cookie': cookie
                };
                res = await request
                    .patch(profileDetailsEndPoint)
                    .set(headers)
                    .send(payload);
                expect(res.statusCode).to.be.eq(400);
                expect(res.body.errors[0].msg).to.be.eq('lastName: should not be empty');
                expect(res.body.errors[0].param).to.be.eq('lastName')
            });
    
            it('User is logged in and valid data is sent', async() =>{
                payload = JSON.stringify({
                    "firstName": updatedFirstName,
                    "lastName": updatedLastName
                });
                signed_headers = getSignedRequestHeaders("PATCH", baseUrl, profileDetailsEndPoint, payload, {});
                headers = {
                    'Content-type': 'application/json;charset=UTF-8',
                    'x-ccl-param': signed_headers["headers"]["x-ccl-param"],
                    'x-ccl-signature': signed_headers["headers"]["x-ccl-signature"],
                    'Cookie': cookie
                };
                res = await request
                    .patch(profileDetailsEndPoint)
                    .set(headers)
                    .send(payload);
                expect(res.statusCode).to.be.eq(200);
                expect(res.body).to.be.jsonSchema(loginResSchema);
                expect(res.body.user.firstName).to.be.eq(updatedFirstName);
                expect(res.body.user.lastName).to.be.eq(updatedLastName);
            });
    
            it('User is logged in and only FirstName is updated', async() =>{
                updatedFirstName = faker.name.firstName();
                payload = JSON.stringify({
                    "firstName": updatedFirstName
                });
                signed_headers = getSignedRequestHeaders("PATCH", baseUrl, profileDetailsEndPoint, payload, {});
                headers = {
                    'Content-type': 'application/json;charset=UTF-8',
                    'x-ccl-param': signed_headers["headers"]["x-ccl-param"],
                    'x-ccl-signature': signed_headers["headers"]["x-ccl-signature"],
                    'Cookie': cookie
                };
                res = await request
                    .patch(profileDetailsEndPoint)
                    .set(headers)
                    .send(payload);
                expect(res.statusCode).to.be.eq(200);
                expect(res.body).to.be.jsonSchema(loginResSchema);
                expect(res.body.user.firstName).to.be.eq(updatedFirstName);
            });
    
            it('User is logged in and only LastName is updated', async() =>{
                updatedLastName = faker.name.lastName();
                payload = JSON.stringify({
                    "lastName": updatedLastName
                });
                signed_headers = getSignedRequestHeaders("PATCH", baseUrl, profileDetailsEndPoint, payload, {});
                headers = {
                    'Content-type': 'application/json;charset=UTF-8',
                    'x-ccl-param': signed_headers["headers"]["x-ccl-param"],
                    'x-ccl-signature': signed_headers["headers"]["x-ccl-signature"],
                    'Cookie': cookie
                };
                res = await request
                    .patch(profileDetailsEndPoint)
                    .set(headers)
                    .send(payload);
                expect(res.statusCode).to.be.eq(200);
                expect(res.body).to.be.jsonSchema(loginResSchema);
                expect(res.body.user.lastName).to.be.eq(updatedLastName);
            });
    
        });
    });
    
    describe('Logout @cdm @login', async () => {
        it('Logout success', async () => {
            signed_headers = getSignedRequestHeaders("POST", baseUrl, logoutApiEndPoint, "", {});
            headers = {
                'Content-type': 'application/json;charset=UTF-8',
                'x-ccl-param': signed_headers["headers"]["x-ccl-param"],
                'x-ccl-signature': signed_headers["headers"]["x-ccl-signature"],
                'Cookie': cookie
            };
            res = await request
                .post(logoutApiEndPoint)
                .set(headers);
            expect(res.statusCode).to.be.eq(200);
            expect(res.body.success).to.be.equal(true);
        });
    
        it('Logout - no user is logged in', async () => {
            signed_headers = getSignedRequestHeaders("POST", baseUrl, logoutApiEndPoint, "", {});
            headers = {
                'Content-type': 'application/json;charset=UTF-8',
                'x-ccl-param': signed_headers["headers"]["x-ccl-param"],
                'x-ccl-signature': signed_headers["headers"]["x-ccl-signature"]
            };
            res = await request
                .post(logoutApiEndPoint)
                .set(headers);
            expect(res.statusCode).to.be.eq(401);
            expect(res.body.authenticated).to.be.equal(false);
        });
    });
});
