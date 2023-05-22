import supertest from "supertest";
import chai, { expect } from 'chai';
import dotenv from "dotenv";
import jsonSchema from 'chai-json-schema';
import { faker } from '@faker-js/faker';
import { getSignedRequestHeaders } from '../../helpers/cdm/signature.mjs';
import { registerUserSchema } from "../../configs/jsonschema/cdm/onboarding_json_schema.mjs";
import { completeRegisterUserApiEndPoint, registerUserApiEndPoint } from "../../configs/constants/cdm/constants.mjs";
import {EnvironmentConfiguration} from "../../envs.config.mjs";

chai.use(jsonSchema);
dotenv.config();
let firstName, lastName, email, password, payload, signed_headers, headers, res, invalidPassword, invalidUserName;
const symbols = "!@#$%^&*(){}[]=<>/.";
const baseUrl = EnvironmentConfiguration.getURL(process.env.DOMAIN);
const request = supertest(`https://${baseUrl}`);

before(() => {
    firstName = faker.name.firstName();
    lastName = faker.name.lastName();
    email = faker.internet.email(firstName, lastName);
    password = `1A${faker.internet.password(8)}b${symbols.charAt(Math.floor(Math.random()*symbols.length))}`;
    invalidUserName = email.split(".com")[0];
});

describe('User Registration @cdm @reg', async function() {

    it('User Registration - Successful', async function() {
        payload = JSON.stringify({
            "username": email,
            "password": password,
            "firstName": firstName,
            "lastName": lastName
        });
        signed_headers = getSignedRequestHeaders("POST", baseUrl, registerUserApiEndPoint, payload, {});
        headers = {
            'Content-type': 'application/json;charset=UTF-8',
            'x-ccl-param': signed_headers["headers"]["x-ccl-param"],
            'x-ccl-signature': signed_headers["headers"]["x-ccl-signature"]
        };
        res = await request
            .post(registerUserApiEndPoint)
            .set(headers)
            .send(payload);
        expect(res.statusCode).to.be.eq(200);
        expect(res.body).to.be.jsonSchema(registerUserSchema);
        expect(res.body.success).to.be.eq(true);
        expect(res.body.message).to.be.eq('Link sent');
        expect(res.body.email).to.be.eq(email.toLowerCase());
    })

    it('User Registration - Password only contain alphabets', async function() {
        invalidPassword = faker.random.alpha(10);
        payload = JSON.stringify({
            "username": email,
            "password": invalidPassword,
            "firstName": firstName,
            "lastName": lastName
        });
        signed_headers = getSignedRequestHeaders("POST", baseUrl, registerUserApiEndPoint, payload, {});
        headers = {
            'Content-type': 'application/json;charset=UTF-8',
            'x-ccl-param': signed_headers["headers"]["x-ccl-param"],
            'x-ccl-signature': signed_headers["headers"]["x-ccl-signature"]
        };
        res = await request
            .post(registerUserApiEndPoint)
            .set(headers)
            .send(payload);
        expect(res.statusCode).to.be.eq(400);
        expect(res.body.errors[0].msg).to.be.eq('Password must contain at least one letter, one number, and one special character');
        expect(res.body.errors[0].param).to.be.eq('password')
    })

    it('User Registration - Password only contain numbers', async function() {
        invalidPassword = faker.random.numeric(10);
        payload = JSON.stringify({
            "username": email,
            "password": invalidPassword,
            "firstName": firstName,
            "lastName": lastName
        });
        signed_headers = getSignedRequestHeaders("POST", baseUrl, registerUserApiEndPoint, payload, {});
        headers = {
            'Content-type': 'application/json;charset=UTF-8',
            'x-ccl-param': signed_headers["headers"]["x-ccl-param"],
            'x-ccl-signature': signed_headers["headers"]["x-ccl-signature"]
        };
        res = await request
            .post(registerUserApiEndPoint)
            .set(headers)
            .send(payload);
        expect(res.statusCode).to.be.eq(400);
        expect(res.body.errors[0].msg).to.be.eq('Password must contain at least one letter, one number, and one special character');
        expect(res.body.errors[0].param).to.be.eq('password')
    })

    it('User Registration - Password length is less than 8', async function() {
        invalidPassword = `${faker.random.alpha(3)}${faker.random.numeric(3)}${symbols.charAt(Math.floor(Math.random()*symbols.length))}`
        payload = JSON.stringify({
            "username": email,
            "password": invalidPassword,
            "firstName": firstName,
            "lastName": lastName
        });
        signed_headers = getSignedRequestHeaders("POST", baseUrl, registerUserApiEndPoint, payload, {});
        headers = {
            'Content-type': 'application/json;charset=UTF-8',
            'x-ccl-param': signed_headers["headers"]["x-ccl-param"],
            'x-ccl-signature': signed_headers["headers"]["x-ccl-signature"]
        };
        res = await request
            .post(registerUserApiEndPoint)
            .set(headers)
            .send(payload);
        expect(res.statusCode).to.be.eq(400);
        expect(res.body.errors[0].msg).to.be.eq('Password must be at least 8 characters long');
        expect(res.body.errors[0].param).to.be.eq('password')
    })

    it('User Registration - FirstName not sent', async function() {
        payload = JSON.stringify({
            "username": email,
            "password": password,
            "firstName": "",
            "lastName": lastName
        });

        signed_headers = getSignedRequestHeaders("POST", baseUrl, registerUserApiEndPoint, payload, {});
        headers = {
            'Content-type': 'application/json;charset=UTF-8',
            'x-ccl-param': signed_headers["headers"]["x-ccl-param"],
            'x-ccl-signature': signed_headers["headers"]["x-ccl-signature"]
        };
        res = await request
            .post(registerUserApiEndPoint)
            .set(headers)
            .send(payload);
        expect(res.statusCode).to.be.eq(400);
        expect(res.body.errors[0].msg).to.be.eq('firstName: should not be empty');
    })

    it('User Registration - LastName not sent', async function() {
        payload = JSON.stringify({
            "username": email,
            "password": password,
            "firstName": firstName
        });

        signed_headers = getSignedRequestHeaders("POST", baseUrl, registerUserApiEndPoint, payload, {});
        headers = {
            'Content-type': 'application/json;charset=UTF-8',
            'x-ccl-param': signed_headers["headers"]["x-ccl-param"],
            'x-ccl-signature': signed_headers["headers"]["x-ccl-signature"]
        };
        res = await request
            .post(registerUserApiEndPoint)
            .set(headers)
            .send(payload);
        expect(res.statusCode).to.be.eq(400);
        expect(res.body.errors[0].msg).to.be.eq('lastName: should not be empty');
    })

    it('User Registration - Invalid email sent', async function() {
        payload = JSON.stringify({
            "username": invalidUserName,
            "password": password,
            "firstName": firstName,
            "lastName": lastName
        });

        signed_headers = getSignedRequestHeaders("POST", baseUrl, registerUserApiEndPoint, payload, {});
        headers = {
            'Content-type': 'application/json;charset=UTF-8',
            'x-ccl-param': signed_headers["headers"]["x-ccl-param"],
            'x-ccl-signature': signed_headers["headers"]["x-ccl-signature"]
        };
        res = await request
            .post(registerUserApiEndPoint)
            .set(headers)
            .send(payload);
        expect(res.statusCode).to.be.eq(400);
        expect(res.body.errors[0].msg).to.be.eq('username is not valid');
        expect(res.body.errors[0].value).to.be.eq(invalidUserName);
        expect(res.body.errors[0].param).to.be.eq('username');
    })

    it('User Registration - User already registered', async function() {
        payload = JSON.stringify({
            "username": process.env.CDM_USERNAME,
            "password": password,
            "firstName": firstName,
            "lastName": lastName
        });

        signed_headers = getSignedRequestHeaders("POST", baseUrl, registerUserApiEndPoint, payload, {});
        headers = {
            'Content-type': 'application/json;charset=UTF-8',
            'x-ccl-param': signed_headers["headers"]["x-ccl-param"],
            'x-ccl-signature': signed_headers["headers"]["x-ccl-signature"]
        };
        res = await request
            .post(registerUserApiEndPoint)
            .set(headers)
            .send(payload);
        expect(res.statusCode).to.be.eq(400);
        expect(res.body.message).to.be.eq(`User with email ${process.env.CDM_USERNAME} is already registered`);
    })
});

describe('Complete User Registration @cdm @reg', async()=>{
    
    it('Complete User Registration - empty string sent as code', async function() {
        payload = JSON.stringify({
            "code":""
        });
        signed_headers = getSignedRequestHeaders("POST", baseUrl, completeRegisterUserApiEndPoint, payload, {});
        headers = {
            'Content-type': 'application/json;charset=UTF-8',
            'x-ccl-param': signed_headers["headers"]["x-ccl-param"],
            'x-ccl-signature': signed_headers["headers"]["x-ccl-signature"]
        };
        res = await request
            .post(completeRegisterUserApiEndPoint)
            .set(headers)
            .send(payload);
        expect(res.statusCode).to.be.eq(400);
        expect(res.body.message).to.be.eq('Invalid request params');
    })
});


