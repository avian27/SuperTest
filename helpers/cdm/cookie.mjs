"use strict";

import supertest from "supertest";
import { getSignedRequestHeaders } from "./signature.mjs";
import dotenv from "dotenv";
import { EnvironmentConfiguration } from "../../envs.config.mjs";

dotenv.config();
const baseUrl = EnvironmentConfiguration.getURL(process.env.DOMAIN);
const request = supertest(`https://${baseUrl}`);

export async function getCookie (username, password){
    const payload = JSON.stringify({
        "username": username,
        "password": password
    });
    const signed_headers = getSignedRequestHeaders("POST", baseUrl, "/service/panel/users/v1.0/authentication/login/password", payload, {});
    const headers = {
        'Content-type': 'application/json;charset=UTF-8',
        'x-ccl-param': signed_headers["headers"]["x-ccl-param"],
        'x-ccl-signature': signed_headers["headers"]["x-ccl-signature"]
    }
    const res = await request
        .post('/service/panel/users/v1.0/authentication/login/password')
        .set(headers)
        .send(payload);
    return res.headers['set-cookie'];
}