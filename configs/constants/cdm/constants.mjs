export const loginApiEndPoint = `/service/panel/users/v1.0/authentication/login/password`;
export const logoutApiEndPoint = `/service/panel/users/v1.0/authentication/logout`;
export const registerUserApiEndPoint = `/service/panel/users/v1.0/authentication/register`;
export const completeRegisterUserApiEndPoint = `/service/panel/users/v1.0/authentication/register/complete`;
export const forgotPasswordApiEndPoint = `/service/panel/users/v1.0/authentication/forgot-password`;
export const updatePasswordApiEndPoint = `/service/panel/users/v1.0/profile/update-password`;
export const initializeEmailUpdateApiEndPoint = `/service/panel/users/v1.0/profile/update-email-init`;
export const currentSessionApiEndPoint = `/service/panel/users/v1.0/session`;
export const profileDetailsEndPoint = `/service/panel/users/v1.0/profile/detail`;
export const createOrgEndPoint = `/service/panel/organization/v1.0/`;
export const getAllOrgForLoggedInUserEndPoint = `/service/panel/organization/v1.0/all`;

export function getOrgbyIdEndpoint(orgId) {
    return `/service/panel/organization/v1.0/org/${orgId}/detail`;
}

export function updateOrgEndpoint(orgId) {
    return `/service/panel/organization/v1.0/org/${orgId}`;
}

export function inviteMember(orgId) {
    return `/service/panel/organization/v1.0/org/${orgId}/invite/send`;
}

export function getInviteMemberByOrgId(orgId) {
    return `/service/panel/organization/v1.0/org/${orgId}/invite/members`;
}

export function creatAttribute(orgId) {
    return `/service/panel/templates/v1.0/org/${orgId}/attribute`;
}

export function getAllAttributes(orgId) {
    return `/service/panel/templates/v1.0/org/${orgId}/attribute?page=1`;
}

export function getSpecificAttributes(orgId, attributeId) {
    return `/service/panel/templates/v1.0/org/${orgId}/attribute/${attributeId}`;
}

export function update_delete_SpecificAttributes(orgId, attributeId) {
    return `/service/panel/templates/v1.0/org/${orgId}/attribute/${attributeId}`;
}

export function getVendorListEndpoint(orgId) {
    return `/service/panel/organization/v1.0/org/${orgId}/list`;
}

export function getVendorMapListEndpoint(orgId) {
    return `/service/panel/organization/v1.0/org/${orgId}/vender-seller-map/list`;
}

export function createVendorMappingEndpoint(orgId) {
    return `/service/panel/organization/v1.0/org/${orgId}/vender-seller-map`;
}

export function createCategoryEndpoint(orgId) {
    return `/service/panel/templates/v1.0/org/${orgId}/category`;
}

export function getAllCategoryEndpoint(orgId, pageNo, limit, name, archiveflag) {
    if ((!name || name.length === 0) && (!limit || limit.length === 0) && (!archiveflag || archiveflag.length === 0)) {
        return `/service/panel/templates/v1.0/org/${orgId}/category/?page=${pageNo}&limit=10&name=&archive=false`;
    }
    else if (name.length !== 0 && limit.length !== 0 && archiveflag.length !== 0) {
        return `/service/panel/templates/v1.0/org/${orgId}/category/?page=${pageNo}&limit=${limit}&name=${name}&archive=${archiveflag}`;
    }
    else if (name.length !== 0 && limit.length !== 0) {
        return `/service/panel/templates/v1.0/org/${orgId}/category/?page=${pageNo}&limit=${limit}&name=${name}&archive=false`;
    }
    else if (limit.length !== 0 && archiveflag.length !== 0) {
        return `/service/panel/templates/v1.0/org/${orgId}/category/?page=${pageNo}&limit=${limit}&name=&archive=false`;
    }
    else if (name.length !== 0 && archiveflag.length !== 0) {
        return `/service/panel/templates/v1.0/org/${orgId}/category/?page=${pageNo}&limit=10&name=${name}&archive=${archiveflag}`;
    }
    else if (name.length !== 0) {
        return `/service/panel/templates/v1.0/org/${orgId}/category/?page=${pageNo}&limit=10&name=${name}&archive=false`;
    }
    else if (archiveflag.length !== 0) {
        return `/service/panel/templates/v1.0/org/${orgId}/category/?page=${pageNo}&limit=10&name=&archive=${archiveflag}`;
    }
    else if (limit.length !== 0) {
        return `/service/panel/templates/v1.0/org/${orgId}/category/?page=${pageNo}&limit=${limit}&name=&archive=false`;
    }
}