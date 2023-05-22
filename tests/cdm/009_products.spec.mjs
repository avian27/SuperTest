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
import {EnvironmentConfiguration} from "../../envs.config.mjs";
import * as FO from "../../helpers/cdm/readWrite_data_json.mjs";

chai.use(jsonSchema);
dotenv.config();
let payload, signed_headers, headers, endpoint, orgId, res, categoryCode, categoryName;
let categoryId;
const cookie = await getCookie(process.env.CDM_USERNAME,process.env.CDM_PASSWORD);
const baseUrl = EnvironmentConfiguration.getURL(process.env.DOMAIN);
const request = supertest(`https://${baseUrl}`);

/*before(async() => {
    orgId = await fetchBrandOrgId(baseUrl,cookie);
});*/