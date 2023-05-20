export const successCategoryschema = {
    title: 'Successful Category Creation',
    type: 'object',
    required: ['name', 'code', 'archive', 'x_org_id', 'created_by', 'modified_by', 'created_by_email', 'modified_by_email', 
    'settings', 'created_at', 'updated_at', '_id'],
    properties: {
        name: {
            type: 'string'
        },
        code: {
            type: 'string'
        },
        archive: {
            type: 'boolean'
        },
        x_org_id: {
            type: 'string'
        },
        created_by: {
            type: 'string'
        },
        modified_by: {
            type: 'string'
        },
        created_by_email: {
            type: 'string'
        },
        modified_by_email: {
            type: 'string'
        },
        settings: {
            type: 'array'
        },
        created_at: {
            type: 'string'
        },
        updated_at: {
            type: 'string'
        },
        _id: {
            type: 'number'
        }
    }
}

export const getAllCategorySchema = {
    type: 'object',
    required: ['resources', 'item_total', 'currPage', 'documentsInCurrPage'],
    properties: {
        item_total: {
            type: 'integer'
        },
        currPage: {
            type: 'integer'
        },
        documentsInCurrPage: {
            type: 'integer'
        },
        resources: {
            type: 'array',
            items: {
                type: 'object',
                required: ['_id', 'name', 'code', 'archive', 'x_org_id', 'created_by', 'modified_by', 'created_by_email', 'modified_by_email',
                    'settings', 'created_at','updated_at',],
                properties: {
                    _id: { 
                        type: 'number' 
                    },
                    name: { 
                        type: 'string' 
                    },
                    code: { 
                        type: 'string' 
                    },
                    archive: {
                        type: 'boolean' 
                    },
                    x_org_id: { 
                        type: 'string' 
                    },
                    created_by: { 
                        type: 'string' 
                    },
                    modified_by: { 
                        type: 'string' 
                    },
                    created_by_email: { 
                        type: 'string' 
                    },
                    modified_by_email: { 
                        type: 'string'
                    },
                    settings: { 
                        type: 'array' 
                    },
                    created_at: { 
                        type: 'string' 
                    },
                    updated_at: { 
                        type: 'string'
                    }    
                }
            }
        }
    }
}