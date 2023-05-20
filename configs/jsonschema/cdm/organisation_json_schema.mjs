export const createOrgSuccess = {
    title: 'Successfull Org Creation',
    type: 'object',
    required: ['detail'],
    properties: {
        detail: {
            type: 'object',
            required: ['name', 'display_name', 'email', 'type', 'company_size', 'address', 'ownerId', '_id', 'slug', 'status', 'createdAt', 
            'updatedAt', 'categories'],
            properties: {
                name: {
                    type: 'string'
                },
                display_name: {
                    type: 'string'
                },
                email: {
                    type: 'string'
                },
                company_size: {
                    type: 'string'
                },
                ownerId: {
                    type: 'string'
                },
                _id: {
                    type: 'string'
                },
                slug: {
                    type: 'string'
                },
                status: {
                    type: 'string'
                },
                createdAt: {
                    type: 'string'
                },
                updatedAt: {
                    type: 'string'
                },
                categories: {
                    type: 'array'
                },
                type: {
                    type: 'string',
                    enum: ["seller", "vendor"]
                },
                address: {
                    type: 'object'
                }
            }
        }
    }
};

export const successUpdateOrgSchema = {
    title: 'Successfull Org Creation',
    type: 'object',
    required: ['data'],
    properties: {
        detail: {
            type: 'object',
            required: ['name', 'display_name', 'email', 'type', 'company_size', 'address', 'ownerId', '_id', 'slug', 'status', 'createdAt', 
            'updatedAt', 'categories'],
            properties: {
                name: {
                    type: 'string'
                },
                display_name: {
                    type: 'string'
                },
                email: {
                    type: 'string'
                },
                company_size: {
                    type: 'string'
                },
                ownerId: {
                    type: 'string'
                },
                _id: {
                    type: 'string'
                },
                slug: {
                    type: 'string'
                },
                status: {
                    type: 'string'
                },
                createdAt: {
                    type: 'string'
                },
                updatedAt: {
                    type: 'string'
                },
                categories: {
                    type: 'array'
                },
                type: {
                    type: 'string',
                    enum: ["seller", "vendor"]
                },
                address: {
                    type: 'object'
                }
            }
        }
    }
};

export const getAllOrgSchema = {
    title: 'Get All Organisation Schema',
    type: 'array',
    uniqueItems: true,
    items: {
        type: 'object',
        required: ['name', 'display_name', 'email', 'type', 'company_size', 'address', 'ownerId', '_id', 'slug', 'status', 'createdAt', 
            'updatedAt', 'categories'],
        properties: {
            name: {
                type: 'string'
            },
            display_name: {
                type: 'string'
            },
            email: {
                type: ['string','null']
            },
            company_size: {
                type: 'string'
            },
            ownerId: {
                type: 'string'
            },
            _id: {
                type: 'string'
            },
            slug: {
                type: 'string'
            },
            status: {
                type: 'string'
            },
            createdAt: {
                type: 'string'
            },
            updatedAt: {
                type: 'string'
            },
            categories: {
                type: 'array'
            },
            type: {
                type: 'string',
                enum: ["seller", "vendor"]
            },
            address: {
                type: ['object','null']
            }
        }
    }
};

export const getAllVendorsSchema = {
    title: 'Get All Organisation Schema',
    type: 'object',
    required: ['data'],
    uniqueItems: true,
    items: {
        type: 'array',
        items: {
            required: ['name', 'display_name', 'email', 'type', 'company_size', 'address', 'ownerId', '_id', 'slug', 'status', 'createdAt', 
            'updatedAt', 'categories'],
            properties: {
                name: {
                    type: 'string'
                },
                display_name: {
                    type: 'string'
                },
                email: {
                    type: ['string','null']
                },
                company_size: {
                    type: 'string'
                },
                ownerId: {
                    type: 'string'
                },
                _id: {
                    type: 'string'
                },
                slug: {
                    type: 'string'
                },
                status: {
                    type: 'string'
                },
                createdAt: {
                    type: 'string'
                },
                updatedAt: {
                    type: 'string'
                },
                categories: {
                    type: 'array'
                },
                type: {
                    type: 'string',
                    enum: ["vendor"]
                },
                address: {
                    type: ['object','null']
                }
            }
        }
    }
};

export const getVendorMapSchema = {
    title: 'Get All Organisation Schema',
    type: 'object',
    required: ['data'],
    uniqueItems: true,
    items: {
        type: 'array',
        items: {
            required: ['_id', 'vendorId', 'sellerId', 'active', 'createdAt', 'updatedAt', 'vendor_details'],
            properties: {
                _id: {
                    type: 'string'
                },
                vendorId: {
                    type: 'string'
                },
                sellerId: {
                    type: 'string'
                },
                createdAt: {
                    type: 'string'
                },
                updatedAt: {
                    type: 'string'
                },
                active: {
                    type: 'boolean'
                },
                vendor_details: {
                    type: 'object',
                    required: ['_id', 'categories', 'email', 'type', 'display_name', 'slug', 'ownerId', 'name', 'company_size', 'address', 
                    'createdAt', 'updatedAt', 'status'],
                    properties: {
                        name: {
                            type: 'string'
                        },
                        display_name: {
                            type: 'string'
                        },
                        email: {
                            type: ['string','null']
                        },
                        company_size: {
                            type: 'string'
                        },
                        ownerId: {
                            type: 'string'
                        },
                        _id: {
                            type: 'string'
                        },
                        slug: {
                            type: 'string'
                        },
                        status: {
                            type: 'string'
                        },
                        createdAt: {
                            type: 'string'
                        },
                        updatedAt: {
                            type: 'string'
                        },
                        categories: {
                            type: 'array'
                        },
                        type: {
                            type: 'string',
                            enum: ["vendor"]
                        },
                        address: {
                            type: ['object','null']
                        }
                    }
                }
            }
        }
    }
};
