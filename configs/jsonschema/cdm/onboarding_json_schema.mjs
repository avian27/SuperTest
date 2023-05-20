
export const loginResSchema = {
    title: 'Successfull login response',
    type: 'object',
    required: ['user'],
    properties: {
        user: {
            type: 'object',
            required: ['_id', 'active', 'email', 'username', 'firstName', 'lastName', 'createdAt', 'updatedAt', 'profilePicUrl', 'meta'],
            properties: {
                _id: {
                    type: 'string'
                },
                active: {
                    type: 'boolean'
                },
                email: {
                    type: 'string'
                },
                username: {
                    type: 'string'
                },
                firstName: {
                    type: 'string'
                },
                lastName: {
                    type: 'string'
                },
                createdAt: {
                    type: 'string'
                },
                updatedAt: {
                    type: 'string'
                },
                meta: {
                    type: 'object',
                    required: ['registrationMethod'],
                            properties: {
                                registrationMethod: {
                                    type: 'string'
                                }
                            }
                }
            }
        }
    }
};


export const registerUserSchema = {
    title: 'Successfull user registration',
    type: 'object',
    required: ['success', 'message', 'email'],
    properties: {
        success: {
            type: 'boolean'
        },
        message: {
            type: 'string'
        },
        email: {
            type: 'string'
        }
    }
};

export const currentSessionInfoSchema = {
    title: 'Valid Session Info Schema',
    type: 'object',
    required: ['session'],
    properties: {
        session: {
            type: 'object',
            required: ['cookie','passport','misc'],
            properties: {
                cookie: {
                    type: 'object',
                    required: ['originalMaxAge','expires','secure','httpOnly','domain','path','sameSite'],
                    properties: {
                        secure: {
                            type: 'boolean'
                        },
                        httpOnly:{
                            type: 'boolean'
                        },
                        domain: {
                            type: 'string'
                        }
                    }
                },
                passport: {
                    type: 'object',
                    required: ['user'],
                    properties: {
                        user: {
                            type: 'object',
                            required: ['updatedAt','_id','email','username','firstName','lastName','profilePicUrl','active','createdAt','meta'],
                            properties: {
                                _id: {
                                    type: 'string'
                                },
                                email: {
                                    type: 'string'
                                },
                                username: {
                                    type: 'string'
                                },
                                firstName: {
                                    type: 'string'
                                },
                                lastName: {
                                    type: 'string'
                                },
                                active: {
                                    type: 'boolean'
                                },
                                meta:{
                                    type: 'object',
                                    required: ['registrationMethod'],
                                    properties: {
                                        registrationMethod: {
                                            type: 'string'
                                        }
                                    }
                                }
                            }
                        }
                    }
                },
                misc: {
                    type: 'object',
                    required: ['ip', 'headers'],
                    properties: {
                        headers: {
                            type: 'object',
                            required: ['uber-trace-id', 'host', 'x-request-id', 'x-real-ip', 'x-forwarded-for', 'x-forwarded-host', 'x-forwarded-port',
                            'x-forwarded-proto', 'x-forwarded-scheme', 'x-scheme', 'x-original-forwarded-for', 'content-length', 'x-ccl-param', 'x-ccl-signature',
                            'content-type', 'accept-encoding', 'x-cloud-trace-context', 'via', 'x-fynd-trace-id']
                        }
                    }
                }
            }
        }
    }
};