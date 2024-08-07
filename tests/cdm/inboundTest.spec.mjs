import supertest from "supertest";
import chai, { expect } from 'chai';
import dotenv from "dotenv";
import jsonSchema from 'chai-json-schema';
import { ploadGen } from "./payloadIn.mjs";
import { EnvironmentConfiguration } from "../../envs.config.mjs";


chai.use(jsonSchema);
dotenv.config();
const baseUrl = EnvironmentConfiguration.getURL(process.env.DOMAIN);
const request = supertest(`https://${baseUrl}`);
const inboundEndPoint = "/public/catalog/v1.0/product/import";

describe('Inbound @inb', function () {
    for (let c = 0; c < 3; c++) {
        it.only('Inbound Registration', async function () {
            let payload = ploadGen();
            const authToken = 'NGNmZmI3MzQtNWE2Yi00ZDExLTlkOTktOTQ3YTFkMmE1YzE5';
            let res = await request
                .post(inboundEndPoint)
                .set('Authorization', `Bearer ${authToken}`)
                .send(payload);
            expect(res.statusCode).to.be.eq(200);
        });
    }
});