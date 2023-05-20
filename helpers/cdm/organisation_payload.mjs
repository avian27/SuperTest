import { faker } from '@faker-js/faker';
import supertest from "supertest";
import { getSignedRequestHeaders } from '../../helpers/cdm/signature.mjs';
import { getAllOrgForLoggedInUserEndPoint } from "../../configs/constants/cdm/constants.mjs";

export function createOrgPayload(org) {
    const orgSizeAcceptableValues = ["0 - 50","50 - 100","100 - 200","200 - 500","500 - 1000","More than 1000"]
    const payloadObj = {
        orgName: org,
        email: faker.internet.email(org),
        categoriesCount: faker.datatype.number({min:1,max:20}),
        companySize:orgSizeAcceptableValues[Math.floor(Math.random() * orgSizeAcceptableValues.length)],
        address: {
            street : faker.address.street(),
            landmark: faker.address.street(),
            city: faker.address.cityName(),
            state: faker.address.state(),
            country: faker.address.country(),
            pincode: faker.random.numeric(6)
        }
    }
    return payloadObj;
} 

export async function fetchOrgId(baseURL, cookie){
    const request = supertest(`https://${baseURL}`);
    const payload = null;
    const signed_headers = getSignedRequestHeaders("GET", baseURL, getAllOrgForLoggedInUserEndPoint, payload, {});
    const headers = {
            'Content-type': 'application/json;charset=UTF-8',
            'x-ccl-param': signed_headers["headers"]["x-ccl-param"],
            'x-ccl-signature': signed_headers["headers"]["x-ccl-signature"],
            'Cookie': cookie
    };
    const res = await request
        .get(getAllOrgForLoggedInUserEndPoint)
        .set(headers);
    const randomOrgIndex = faker.datatype.number({min:0, max: res.body.length});
    return await res.body[randomOrgIndex]._id;
}

export async function fetchBrandOrgId(baseURL, cookie){
    const request = supertest(`https://${baseURL}`);
    const payload = null;
    const temp = [];
    const signed_headers = getSignedRequestHeaders("GET", baseURL, getAllOrgForLoggedInUserEndPoint, payload, {});
    const headers = {
            'Content-type': 'application/json;charset=UTF-8',
            'x-ccl-param': signed_headers["headers"]["x-ccl-param"],
            'x-ccl-signature': signed_headers["headers"]["x-ccl-signature"],
            'Cookie': cookie
    };
    const res = await request
            .get(getAllOrgForLoggedInUserEndPoint)
            .set(headers);
    for(let i=0; i< await res.body.length; i++) {
        if(res.body[i].type === `seller`) {
            temp.push(res.body[i]);
        }
    }
    const randomOrgIndex = faker.datatype.number({min:0, max: temp.length});
    return await temp[randomOrgIndex]._id;
}

export async function fetchVendorOrgId(baseURL, cookie){
    const request = supertest(`https://${baseURL}`);
    const payload = null;
    const temp = [];
    const signed_headers = getSignedRequestHeaders("GET", baseURL, getAllOrgForLoggedInUserEndPoint, payload, {});
    const headers = {
            'Content-type': 'application/json;charset=UTF-8',
            'x-ccl-param': signed_headers["headers"]["x-ccl-param"],
            'x-ccl-signature': signed_headers["headers"]["x-ccl-signature"],
            'Cookie': cookie
    };
    const res = await request
        .get(getAllOrgForLoggedInUserEndPoint)
        .set(headers);
    for(let i=0; i< await res.body.length; i++) {
        if(res.body[i].type === `vendor`) {
            temp.push(res.body[i]);
        }
    }
    const randomOrgIndex = faker.datatype.number({min:0, max: temp.length});
    return await temp[randomOrgIndex]._id;
}

export function inviteMembersPayload(emailArraySize, userGroupSize){
    const acceptableRoles = ["CA", "CE", "admin", "auditor", "supervisor"];
    let tempEmailArray = [];
    let userGroupArray = [];
    for(let i=0; i<emailArraySize; i++){
        tempEmailArray.push(faker.internet.email());
    }
    /*for(let i=0; i<userGroupSize; i++){
        userGroupArray.push(faker.random.alpha(15));
    }*/
    const payloadObj = {
        email: tempEmailArray,
        role: acceptableRoles[Math.floor(Math.random() * acceptableRoles.length)],
        userGroups: userGroupArray
    }
    return payloadObj;
}