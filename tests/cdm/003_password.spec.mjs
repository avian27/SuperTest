import supertest from "supertest";
import chai, { expect } from 'chai';
import dotenv from "dotenv";
import jsonSchema from 'chai-json-schema';
import { faker } from '@faker-js/faker';
import { getSignedRequestHeaders } from '../../helpers/cdm/signature.mjs';
import { getCookie } from "../../helpers/cdm/cookie.mjs";
import { forgotPasswordApiEndPoint, initializeEmailUpdateApiEndPoint, updatePasswordApiEndPoint } from "../../configs/constants/cdm/constants.mjs";
import { EnvironmentConfiguration } from "../../envs.config.mjs";

chai.use(jsonSchema);
dotenv.config();
let cookie = await getCookie(process.env.TEST_UNAME, process.env.TEST_PASS);
let payload, signed_headers, headers, res;
const updatePassword = `@${faker.internet.password(10)}1`;
const baseUrl = EnvironmentConfiguration.getURL(process.env.DOMAIN);
const request = supertest(`https://${baseUrl}`);

describe('Forgot Password @cc_regression @pwd', async function () {
    it('Forgot Password - empty string sent as email id', async function () {
        payload = JSON.stringify({
            "email": ""
        });
        signed_headers = getSignedRequestHeaders("POST", baseUrl, forgotPasswordApiEndPoint, payload, {});
        headers = {
            'Content-type': 'application/json;charset=UTF-8',
            'x-ccl-param': signed_headers["headers"]["x-ccl-param"],
            'x-ccl-signature': signed_headers["headers"]["x-ccl-signature"],
            'Cookie': cookie
        };
        res = await request
            .post(forgotPasswordApiEndPoint)
            .set(headers)
            .send(payload);
        expect(res.statusCode).to.be.eq(400);
        expect(res.body.message).to.be.equal('Invalid email');
    });

    it('Forgot Password - invalid email', async function () {
        payload = JSON.stringify({
            "email": `${faker.name.firstName()}${faker.name.lastName()}`
        });
        signed_headers = getSignedRequestHeaders("POST", baseUrl, forgotPasswordApiEndPoint, payload, {});
        headers = {
            'Content-type': 'application/json;charset=UTF-8',
            'x-ccl-param': signed_headers["headers"]["x-ccl-param"],
            'x-ccl-signature': signed_headers["headers"]["x-ccl-signature"],
            'Cookie': cookie
        };
        res = await request
            .post(forgotPasswordApiEndPoint)
            .set(headers)
            .send(payload);
        expect(res.statusCode).to.be.eq(400);
        expect(res.body.message).to.be.equal('Invalid email');
    });

    it('Forgot Password - valid email', async function () {
        payload = JSON.stringify({
            "email": `${process.env.TEST_UNAME}`
        });
        signed_headers = getSignedRequestHeaders("POST", baseUrl, forgotPasswordApiEndPoint, payload, {});
        headers = {
            'Content-type': 'application/json;charset=UTF-8',
            'x-ccl-param': signed_headers["headers"]["x-ccl-param"],
            'x-ccl-signature': signed_headers["headers"]["x-ccl-signature"],
            'Cookie': cookie
        };
        res = await request
            .post(forgotPasswordApiEndPoint)
            .set(headers)
            .send(payload);
        expect(res.statusCode).to.be.eq(200);
        expect(res.body.success).to.be.equal(true);
    });
});

describe('Initialize Email Update @cc_regression @pwd', async function () {
    it('Initialize Email Update - User not logged in', async function () {
        payload = JSON.stringify({
            "email": faker.internet.email()
        });
        signed_headers = getSignedRequestHeaders("POST", baseUrl, initializeEmailUpdateApiEndPoint, payload, {});
        headers = {
            'Content-type': 'application/json;charset=UTF-8',
            'x-ccl-param': signed_headers["headers"]["x-ccl-param"],
            'x-ccl-signature': signed_headers["headers"]["x-ccl-signature"]
        };
        res = await request
            .post(initializeEmailUpdateApiEndPoint)
            .set(headers)
            .send(payload);
        expect(res.statusCode).to.be.eq(401);
        expect(res.body.authenticated).to.be.equal(false);
    });

    it('Initialize Email Update - Invalid email sent', async function () {
        payload = JSON.stringify({
            "email": `${faker.name.firstName()}${faker.name.lastName()}@${faker.name.firstName()}`
        });
        signed_headers = getSignedRequestHeaders("POST", baseUrl, initializeEmailUpdateApiEndPoint, payload, {});
        headers = {
            'Content-type': 'application/json;charset=UTF-8',
            'x-ccl-param': signed_headers["headers"]["x-ccl-param"],
            'x-ccl-signature': signed_headers["headers"]["x-ccl-signature"],
            'Cookie': cookie
        };
        res = await request
            .post(initializeEmailUpdateApiEndPoint)
            .set(headers)
            .send(payload);
        expect(res.statusCode).to.be.eq(400);
        expect(res.body.message).to.be.equal("Invalid email");
    });

    it('Initialize Email Update - Email sent is already registerd', async function () {
        payload = JSON.stringify({
            "email": process.env.CDM_USERNAME
        });
        signed_headers = getSignedRequestHeaders("POST", baseUrl, initializeEmailUpdateApiEndPoint, payload, {});
        headers = {
            'Content-type': 'application/json;charset=UTF-8',
            'x-ccl-param': signed_headers["headers"]["x-ccl-param"],
            'x-ccl-signature': signed_headers["headers"]["x-ccl-signature"],
            'Cookie': cookie
        };
        res = await request
            .post(initializeEmailUpdateApiEndPoint)
            .set(headers)
            .send(payload);
        expect(res.statusCode).to.be.eq(400);
        expect(res.body.message).to.be.equal(`Another user with email: '${process.env.CDM_USERNAME}' already exists`);
    });

    it('Initialize Email Update - Unregistered email sent', async function () {
        const updateEmail = faker.internet.email();
        payload = JSON.stringify({
            "email": updateEmail
        });
        signed_headers = getSignedRequestHeaders("POST", baseUrl, initializeEmailUpdateApiEndPoint, payload, {});
        headers = {
            'Content-type': 'application/json;charset=UTF-8',
            'x-ccl-param': signed_headers["headers"]["x-ccl-param"],
            'x-ccl-signature': signed_headers["headers"]["x-ccl-signature"],
            'Cookie': cookie
        };
        res = await request
            .post(initializeEmailUpdateApiEndPoint)
            .set(headers)
            .send(payload);
        expect(res.statusCode).to.be.eq(200);
        expect(res.body.message).to.be.equal(`Link sent`);
        expect(res.body.success).to.be.equal(true);
        expect(res.body.email).to.be.equal(updateEmail);
    });
});

describe('Update Password @cc_regression @pwd', async function () {

    it('Update Password - User is not logged in', async function () {
        payload = JSON.stringify({
            "password": `${faker.internet.password()}`
        });
        signed_headers = getSignedRequestHeaders("POST", baseUrl, updatePasswordApiEndPoint, payload, {});
        headers = {
            'Content-type': 'application/json;charset=UTF-8',
            'x-ccl-param': signed_headers["headers"]["x-ccl-param"],
            'x-ccl-signature': signed_headers["headers"]["x-ccl-signature"]
        };
        res = await request
            .post(updatePasswordApiEndPoint)
            .set(headers)
            .send(payload);
        expect(res.statusCode).to.be.eq(401);
        expect(res.body.authenticated).to.be.equal(false);
    });

    it('Update Password - Empty string as password', async function () {
        payload = JSON.stringify({
            "password": ``
        });
        signed_headers = getSignedRequestHeaders("POST", baseUrl, updatePasswordApiEndPoint, payload, {});
        headers = {
            'Content-type': 'application/json;charset=UTF-8',
            'x-ccl-param': signed_headers["headers"]["x-ccl-param"],
            'x-ccl-signature': signed_headers["headers"]["x-ccl-signature"],
            'Cookie': cookie
        };
        res = await request
            .post(updatePasswordApiEndPoint)
            .set(headers)
            .send(payload);
        expect(res.statusCode).to.be.eq(400);
        expect(res.body.message).to.be.equal("Invalid password");
    });

    it('Update Password - Length of Password is 7', async function () {
        payload = JSON.stringify({
            "password": `${faker.internet.password(7)}`
        });
        signed_headers = getSignedRequestHeaders("POST", baseUrl, updatePasswordApiEndPoint, payload, {});
        headers = {
            'Content-type': 'application/json;charset=UTF-8',
            'x-ccl-param': signed_headers["headers"]["x-ccl-param"],
            'x-ccl-signature': signed_headers["headers"]["x-ccl-signature"],
            'Cookie': cookie
        };
        res = await request
            .post(updatePasswordApiEndPoint)
            .set(headers)
            .send(payload);
        expect(res.statusCode).to.be.eq(400);
        expect(res.body.message).to.be.equal("Invalid password");
    });

    it('Update Password - Existing Password is sent', async function () {
        payload = JSON.stringify({
            "password": `${process.env.TEST_PASS}`
        });
        signed_headers = getSignedRequestHeaders("POST", baseUrl, updatePasswordApiEndPoint, payload, {});
        headers = {
            'Content-type': 'application/json;charset=UTF-8',
            'x-ccl-param': signed_headers["headers"]["x-ccl-param"],
            'x-ccl-signature': signed_headers["headers"]["x-ccl-signature"],
            'Cookie': cookie
        };
        res = await request
            .post(updatePasswordApiEndPoint)
            .set(headers)
            .send(payload);
        expect(res.statusCode).to.be.eq(400);
        expect(res.body.message).to.be.equal("New password cannot be same as old password");
    });

    it('Update Password - Valid Password is sent', async function () {
        payload = JSON.stringify({
            "password": updatePassword
        });
        signed_headers = getSignedRequestHeaders("POST", baseUrl, updatePasswordApiEndPoint, payload, {});
        headers = {
            'Content-type': 'application/json;charset=UTF-8',
            'x-ccl-param': signed_headers["headers"]["x-ccl-param"],
            'x-ccl-signature': signed_headers["headers"]["x-ccl-signature"],
            'Cookie': cookie
        };
        res = await request
            .post(updatePasswordApiEndPoint)
            .set(headers)
            .send(payload);
        //console.log(updatePassword);
        expect(res.statusCode).to.be.eq(200);
        expect(res.body.success).to.be.equal(true);
    });

    it('Update Password - Resetting the password to original password', async function () {
        this.timeout(5000);
        payload = JSON.stringify({
            "password": process.env.TEST_PASS
        });
        cookie = await getCookie(process.env.TEST_UNAME, updatePassword);
        signed_headers = getSignedRequestHeaders("POST", baseUrl, updatePasswordApiEndPoint, payload, {});
        headers = {
            'Content-type': 'application/json;charset=UTF-8',
            'x-ccl-param': signed_headers["headers"]["x-ccl-param"],
            'x-ccl-signature': signed_headers["headers"]["x-ccl-signature"],
            'Cookie': cookie
        };
        res = await request
            .post(updatePasswordApiEndPoint)
            .set(headers)
            .send(payload);
        expect(res.statusCode).to.be.eq(200);
        expect(res.body.success).to.be.equal(true);
    });
});