import supertest from "supertest";
import chai, { expect } from 'chai';
import dotenv from "dotenv";
import jsonSchema from 'chai-json-schema';
import { faker } from '@faker-js/faker';
import { getSignedRequestHeaders } from '../../helpers/cdm/signature.mjs';
import { getCookie } from "../../helpers/cdm/cookie.mjs";
import { EnvironmentConfiguration } from "../../envs.config.mjs";
import * as inviteMemberEndpoints from "../../configs/constants/cdm/constants.mjs";
import { fetchOrgId, inviteMembersPayload } from "../../helpers/cdm/organisation_payload.mjs";
import * as membersTeamScheam from "../../configs/jsonschema/cdm/members_teams_json_schema.mjs"
import * as FO from "../../helpers/cdm/readWrite_data_json.mjs";

/* for the below test cases we need to configured below mails and get the userId and configured here 
** as a pre setup test as completing the register user flow is not possible due to the unique registration code sent on the
** registration email id used in the process.
** The email in alreadyRegisteredMails[] and userIDs in alreadyRegisteredUserIds[] have same position for 1 single user.
*/

// below data will only work for z0
let alreadyRegisteredMails = ["subhomoychoudhury@gofynd.com","amritayanbanerjee@gofynd.com","nilakhesourabh@gmail.com","avinashchauhan@fynd.com","e5.avinash.chauhan@gmail.com"];
let alreadyRegisteredUserIds = ["736455c0f771aca226654700","bc24b0a6b543d77274c3ef3e","d8cabee9f85effd617b6aed8","3dd7307c8ab6d735335eb4aa","e3eba01c58727fd5eaa83953",];

chai.use(jsonSchema);
dotenv.config();
let cookie = await getCookie(process.env.TEST_UNAME, process.env.TEST_PASS);
let orgId, payload, payloadData, signed_headers, headers, res, endpoint;
let email = [];
const baseUrl = EnvironmentConfiguration.getURL(process.env.DOMAIN);
const request = supertest(`https://${baseUrl}`);

describe('Teams and User Test cases @cdm @inviteMember', async function(){
    before(async function() {
        orgId = await fetchOrgId(baseUrl,cookie);
    });

    describe('Invite Member @cdm @inviteMember', async function(){

        it('Get Invited Members by OrgId - User is logged in', async function(){
            endpoint = inviteMemberEndpoints.getInviteMemberByOrgId(orgId);
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
            expect(res.body.message).to.be.eq('No Invite ID Found.');
        });

        it('Invite Member - User is not logged in', async function(){
            endpoint = inviteMemberEndpoints.inviteMember(orgId);
            payloadData = inviteMembersPayload(faker.datatype.number({min:1,max:15}),faker.datatype.number({min:1,max:10}))
            payload = JSON.stringify({
                "emails": payloadData.email,
                "role": payloadData.role,
                "userGroups": payloadData.userGroups
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
    
        it('Invite Member - User is logged in but invalid orgId is sent', async function(){
            endpoint = inviteMemberEndpoints.inviteMember(orgId.substring(0, orgId.length-1));
            payloadData = inviteMembersPayload(faker.datatype.number({min:1,max:15}),faker.datatype.number({min:1,max:10}))
            payload = JSON.stringify({
                "emails": payloadData.email,
                "role": payloadData.role,
                "userGroups": payloadData.userGroups
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
    
        it('Invite Member - User is logged in', async function(){
            endpoint = inviteMemberEndpoints.inviteMember(orgId);
            payloadData = inviteMembersPayload(faker.datatype.number({min:1,max:15}),faker.datatype.number({min:1,max:10}))
            payload = JSON.stringify({
                "emails": payloadData.email,
                "role": payloadData.role,
                "userGroups": payloadData.userGroups
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
            expect(res.statusCode).to.be. eq(200);
            expect(res.body.message).to.be.eq('Mail sent Successfully!!');
        });
    
        it('Get Invite Member by OrgId - User is not logged in', async function(){
            endpoint = inviteMemberEndpoints.getInviteMemberByOrgId(orgId);
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
    
        it('Get Invite Member by OrgId - Invalid orgId is sent', async function(){
            endpoint = inviteMemberEndpoints.getInviteMemberByOrgId(orgId.substring(0, orgId.length-1));
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
    
        it('Get Invited Members by OrgId - User is logged in', async function(){
            endpoint = inviteMemberEndpoints.getInviteMemberByOrgId(orgId);
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
            expect(res.statusCode).to.be.eq(200)
            expect(res.body).to.be.jsonSchema(membersTeamScheam.invitedMembersSchema);
        });
    });
});

