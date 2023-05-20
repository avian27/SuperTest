export const successBasicAttributeSchema = {
    title : 'Successful Attribute Creation',
    type: 'object',
    required: ['attribute'],
    properties: {
        attribute: {
            type: 'object',
            required: [ '_id', 'name', 'active', 'code', 'auto_sync_to_prod', 'vms_visible', 'vms_editable', 
            'store_filter', 'store_search', 'store_compare', 'tags', 'type', 'mandatory', 'x_org_id', 'created_by', 
            'modified_by', 'created_by_email', 'modified_by_email', 'created_at', 'updated_at'],
            properties: {
                _id: {
                    type: 'string'
                },
                name: {
                    type: 'string'
                },
                code: {
                    type: 'string'
                },
                x_org_id: {
                    type: 'string'
                },
                type: {
                    type: 'string'
                },
                createdAt: {
                    type: 'string'
                },
                updatedAt: {
                    type: 'string'
                },
                tags: {
                    type: 'array'
                },
                active: {
                    type: 'boolean'
                },
                auto_sync_to_prod: {
                    type: 'boolean'
                },
                mandatory: {
                    type: 'boolean'
                },
                vms_visible: {
                    type: 'boolean'
                },
                vms_editable: {
                    type: 'boolean'
                },
                store_filter: {
                    type: 'boolean'
                },
                store_display_pdp: {
                    type: 'boolean'
                },
                store_display_plp: {
                    type: 'boolean'
                },
                store_search: {
                    type: 'boolean'
                },
                store_compare: {
                    type: 'boolean'
                }
            }
        }
    }
}

export const getBasicAttributeSchema = {
    title : 'Successful Attribute Creation',
    type: 'object',
    required: [ '_id', 'name', 'active', 'code', 'auto_sync_to_prod', 'vms_visible', 'vms_editable', 
    'store_filter',  'store_search', 'store_compare', 'tags', 'type', 'mandatory', 'x_org_id', 'created_by', 
    'modified_by', 'created_by_email', 'modified_by_email', 'created_at', 'updated_at'],
    properties: {
        _id: {
            type: 'string'
        },
        name: {
            type: 'string'
        },
        code: {
            type: 'string'
        },
        x_org_id: {
            type: 'string'
        },
        type: {
            type: 'string'
        },
        createdAt: {
            type: 'string'
        },
        updatedAt: {
            type: 'string'
        },
        tags: {
            type: 'array'
        },
        active: {
            type: 'boolean'
        },
        auto_sync_to_prod: {
            type: 'boolean'
        },
        mandatory: {
            type: 'boolean'
        },
        vms_visible: {
            type: 'boolean'
        },
        vms_editable: {
            type: 'boolean'
        },
        store_filter: {
            type: 'boolean'
        },
        store_display_pdp: {
            type: 'boolean'
        },
        store_display_plp: {
            type: 'boolean'
        },
        store_search: {
            type: 'boolean'
        },
        store_compare: {
            type: 'boolean'
        }
    }
}

export const successFileMedAttributeSchema = {
    title : 'Successful File Attribute Creation',
    type: 'object',
    required: ['attribute'],
    properties: {
        attribute: {
            type: 'object',
            required: [ '_id', 'name', 'active', 'code', 'auto_sync_to_prod', 'vms_visible', 'vms_editable', 
            'store_filter', 'store_search', 'store_compare', 'tags', 'type', 'mandatory', 'x_org_id', 'created_by', 
            'modified_by', 'created_by_email', 'modified_by_email', 'created_at', 'updated_at', 'allow_multiple', 'allowed_extensions'],
            properties: {
                _id: {
                    type: 'string'
                },
                name: {
                    type: 'string'
                },
                code: {
                    type: 'string'
                },
                x_org_id: {
                    type: 'string'
                },
                type: {
                    type: 'string'
                },
                createdAt: {
                    type: 'string'
                },
                updatedAt: {
                    type: 'string'
                },
                tags: {
                    type: 'array'
                },
                active: {
                    type: 'boolean'
                },
                auto_sync_to_prod: {
                    type: 'boolean'
                },
                mandatory: {
                    type: 'boolean'
                },
                vms_visible: {
                    type: 'boolean'
                },
                vms_editable: {
                    type: 'boolean'
                },
                store_filter: {
                    type: 'boolean'
                },
                store_display_plp: {
                    type: 'boolean'
                },
                store_display_pdp: {
                    type: 'boolean'
                },
                store_search: {
                    type: 'boolean'
                },
                store_compare: {
                    type: 'boolean'
                },
                allowed_extensions: {
                    type: 'array'
                },
                allow_multiple: {
                    type: 'boolean'
                }
            }
        }
    }
}

export const getFileMedAttributeSchema = {
    title : 'Successful File Attribute Creation',
    type: 'object',
    required: [ '_id', 'name', 'active', 'code', 'auto_sync_to_prod', 'vms_visible', 'vms_editable', 
    'store_filter', 'store_search', 'store_compare', 'tags', 'type', 'mandatory', 'x_org_id', 'created_by', 
    'modified_by', 'created_by_email', 'modified_by_email', 'created_at', 'updated_at', 'allow_multiple', 'allowed_extensions'],
    properties: {
        _id: {
            type: 'string'
        },
        name: {
            type: 'string'
        },
        code: {
            type: 'string'
        },
        x_org_id: {
            type: 'string'
        },
        type: {
            type: 'string'
        },
        createdAt: {
            type: 'string'
        },
        updatedAt: {
            type: 'string'
        },
        tags: {
            type: 'array'
        },
        active: {
            type: 'boolean'
        },
        auto_sync_to_prod: {
            type: 'boolean'
        },
        mandatory: {
            type: 'boolean'
        },
        vms_visible: {
            type: 'boolean'
        },
        vms_editable: {
            type: 'boolean'
        },
        store_filter: {
            type: 'boolean'
        },
        store_display_plp: {
            type: 'boolean'
        },
        store_display_pdp: {
            type: 'boolean'
        },
        store_search: {
            type: 'boolean'
        },
        store_compare: {
            type: 'boolean'
        },
        allowed_extensions: {
            type: 'array'
        },
        allow_multiple: {
            type: 'boolean'
        }        
    }
}

export const successShortTextAttributeSchema = {
    title : 'Successful Short Text Attribute Creation',
    type: 'object',
    required: ['attribute'],
    properties: {
        attribute: {
            type: 'object',
            required: ['formatting', '_id', 'name', 'active', 'code', 'auto_sync_to_prod', 'vms_visible', 'vms_editable', 
            'store_filter', 'store_search', 'store_compare', 'tags', 'type',  'x_org_id', 'created_by', 
            'modified_by', 'created_by_email', 'modified_by_email', 'mandatory', 'created_at', 'updated_at'],
            properties: {
                formatting: {
                    type: 'string'
                },
                _id: {
                    type: 'string'
                },
                name: {
                    type: 'string'
                },
                code: {
                    type: 'string'
                },
                x_org_id: {
                    type: 'string'
                },
                type: {
                    type: 'string'
                },
                createdAt: {
                    type: 'string'
                },
                updatedAt: {
                    type: 'string'
                },
                tags: {
                    type: 'array'
                },
                active: {
                    type: 'boolean'
                },
                auto_sync_to_prod: {
                    type: 'boolean'
                },
                mandatory: {
                    type: 'boolean'
                },
                vms_visible: {
                    type: 'boolean'
                },
                vms_editable: {
                    type: 'boolean'
                },
                store_filter: {
                    type: 'boolean'
                },
                store_display_pdp: {
                    type: 'boolean'
                },
                store_display_plp: {
                    type: 'boolean'
                },
                store_search: {
                    type: 'boolean'
                },
                store_compare: {
                    type: 'boolean'
                }
            }
        }
    }
}

export const getShortTextAttributeSchema = {
    title : 'Get Short Text Attribute Creation',
    type: 'object',
    required: ['formatting', '_id', 'name', 'active', 'code', 'auto_sync_to_prod', 'vms_visible', 'vms_editable', 
    'store_filter', 'store_search', 'store_compare', 'tags', 'type', 'mandatory', 'x_org_id', 'created_by', 
    'modified_by', 'created_by_email', 'modified_by_email', 'created_at', 'updated_at'],
    properties: {
        formatting: {
            type: 'string'
        },
        _id: {
            type: 'string'
        },
        name: {
            type: 'string'
        },
        code: {
            type: 'string'
        },
        x_org_id: {
            type: 'string'
        },
        type: {
            type: 'string'
        },
        createdAt: {
            type: 'string'
        },
        updatedAt: {
            type: 'string'
        },
        tags: {
            type: 'array'
        },
        active: {
            type: 'boolean'
        },
        auto_sync_to_prod: {
            type: 'boolean'
        },
        mandatory: {
            type: 'boolean'
        },
        vms_visible: {
            type: 'boolean'
        },
        vms_editable: {
            type: 'boolean'
        },
        store_filter: {
            type: 'boolean'
        },
        store_display_plp: {
            type: 'boolean'
        },
        store_display_pdp: {
            type: 'boolean'
        },
        store_search: {
            type: 'boolean'
        },
        store_compare: {
            type: 'boolean'
        }
    }
}

export const successParagraphAttributeSchema = {
    title : 'Successful Paragraph Attribute Creation',
    type: 'object',
    required: ['attribute'],
    properties: {
        attribute: {
            type: 'object',
            required: [ '_id', 'name', 'active', 'code', 'auto_sync_to_prod', 'vms_visible', 'vms_editable',
            'store_filter', 'store_search', 'store_compare', 'tags', 'type', 'mandatory', 'x_org_id', 'created_by', 
            'modified_by', 'created_by_email', 'modified_by_email', 'created_at', 'updated_at'],
            properties: {
                _id: {
                    type: 'string'
                },
                name: {
                    type: 'string'
                },
                code: {
                    type: 'string'
                },
                x_org_id: {
                    type: 'string'
                },
                type: {
                    type: 'string'
                },
                createdAt: {
                    type: 'string'
                },
                updatedAt: {
                    type: 'string'
                },
                tags: {
                    type: 'array'
                },
                active: {
                    type: 'boolean'
                },
                auto_sync_to_prod: {
                    type: 'boolean'
                },
                mandatory: {
                    type: 'boolean'
                },
                vms_visible: {
                    type: 'boolean'
                },
                vms_editable: {
                    type: 'boolean'
                },
                store_filter: {
                    type: 'boolean'
                },
                store_display_pdp: {
                    type: 'boolean'
                },
                store_display_plp: {
                    type: 'boolean'
                },
                store_search: {
                    type: 'boolean'
                },
                store_compare: {
                    type: 'boolean'
                }
            }
        }
    }
}

export const getParagraphAttributeSchema = {
    title : 'Successful Paragraph Attribute Creation',
    type: 'object',
    required: [ '_id', 'name', 'active', 'code', 'auto_sync_to_prod', 'vms_visible', 'vms_editable',
        'store_filter', 'store_search', 'store_compare', 'tags', 'type', 'mandatory', 'x_org_id', 'created_by', 
        'modified_by', 'created_by_email', 'modified_by_email', 'created_at', 'updated_at'],
    properties: {
        _id: {
            type: 'string'
        },
        name: {
            type: 'string'
        },
        code: {
            type: 'string'
        },
        x_org_id: {
            type: 'string'
        },
        type: {
            type: 'string'
        },
        createdAt: {
            type: 'string'
        },
        updatedAt: {
            type: 'string'
        },
        tags: {
            type: 'array'
        },
        active: {
            type: 'boolean'
        },
        auto_sync_to_prod: {
            type: 'boolean'
        },
        mandatory: {
            type: 'boolean'
        },
        vms_visible: {
            type: 'boolean'
        },
        vms_editable: {
            type: 'boolean'
        },
        store_filter: {
            type: 'boolean'
        },
        store_display_pdp: {
            type: 'boolean'
        },
        store_display_plp: {
            type: 'boolean'
        },
        store_search: {
            type: 'boolean'
        },
        store_compare: {
            type: 'boolean'
        }
    }
}

export const successListAttributeSchema = {
    title : 'Successful List Attribute Creation',
    type: 'object',
    required: ['attribute'],
    properties: {
        attribute: {
            type: 'object',
            required: ['formatting', 'allowed_values', 'allow_multiple', '_id', 'name', 'active', 'code', 'auto_sync_to_prod', 'vms_visible',  
            'vms_editable', 'store_filter', 'store_search', 'store_compare', 'tags', 'type', 'mandatory', 'x_org_id', 
            'created_by', 'modified_by', 'created_by_email', 'modified_by_email', 'created_at', 'updated_at'],
            properties: {
                formatting: {
                    type: 'string'
                },
                _id: {
                    type: 'string'
                },
                name: {
                    type: 'string'
                },
                code: {
                    type: 'string'
                },
                x_org_id: {
                    type: 'string'
                },
                type: {
                    type: 'string'
                },
                createdAt: {
                    type: 'string'
                },
                updatedAt: {
                    type: 'string'
                },
                allowed_values: {
                    type: 'array'
                },
                allow_multiple: {
                    type: 'boolean'
                },
                tags: {
                    type: 'array'
                },
                active: {
                    type: 'boolean'
                },
                auto_sync_to_prod: {
                    type: 'boolean'
                },
                mandatory: {
                    type: 'boolean'
                },
                vms_visible: {
                    type: 'boolean'
                },
                vms_editable: {
                    type: 'boolean'
                },
                store_filter: {
                    type: 'boolean'
                },
                store_display_plp: {
                    type: 'boolean'
                },
                store_display_pdp: {
                    type: 'boolean'
                },
                store_search: {
                    type: 'boolean'
                },
                store_compare: {
                    type: 'boolean'
                }
            }
        }
    }
}

export const getListAttributeSchema = {
    title : 'Successful List Attribute Creation',
    type: 'object',
    required: ['formatting', 'allowed_values', 'allow_multiple', '_id', 'name', 'active', 'code', 'auto_sync_to_prod', 'vms_visible',  
    'vms_editable', 'store_filter', 'store_search', 'store_compare', 'tags', 'type', 'mandatory', 'x_org_id', 
    'created_by', 'modified_by', 'created_by_email', 'modified_by_email', 'created_at', 'updated_at'],
    properties: {
        formatting: {
            type: 'string'
        },
        _id: {
            type: 'string'
        },
        name: {
            type: 'string'
        },
        code: {
            type: 'string'
        },
        x_org_id: {
            type: 'string'
        },
        type: {
            type: 'string'
        },
        createdAt: {
            type: 'string'
        },
        updatedAt: {
            type: 'string'
        },
        allowed_values: {
            type: 'array'
        },
        allow_multiple: {
            type: 'boolean'
        },
        tags: {
            type: 'array'
        },
        active: {
            type: 'boolean'
        },
        auto_sync_to_prod: {
            type: 'boolean'
        },
        mandatory: {
            type: 'boolean'
        },
        vms_visible: {
            type: 'boolean'
        },
        vms_editable: {
            type: 'boolean'
        },
        store_filter: {
            type: 'boolean'
        },
        store_display_plp: {
            type: 'boolean'
        },
        store_display_pdp: {
            type: 'boolean'
        },
        store_search: {
            type: 'boolean'
        },
        store_compare: {
            type: 'boolean'
        }        
    }
}

export const successNumDecAttributeSchema = {
    title : 'Successful Number Attribute Creation',
    type: 'object',
    required: ['attribute'],
    properties: {
        attribute: {
            type: 'object',
            required: [ '_id', 'name', 'active', 'code', 'auto_sync_to_prod', 'vms_visible', 'vms_editable',
            'store_filter', 'store_search', 'store_compare', 'tags', 'type', 'mandatory', 'x_org_id', 'created_by', 
            'modified_by', 'created_by_email', 'modified_by_email', 'created_at', 'updated_at', 'max', 'min'],
            properties: {
                _id: {
                    type: 'string'
                },
                name: {
                    type: 'string'
                },
                code: {
                    type: 'string'
                },
                x_org_id: {
                    type: 'string'
                },
                type: {
                    type: 'string'
                },
                createdAt: {
                    type: 'string'
                },
                updatedAt: {
                    type: 'string'
                },
                tags: {
                    type: 'array'
                },
                active: {
                    type: 'boolean'
                },
                auto_sync_to_prod: {
                    type: 'boolean'
                },
                mandatory: {
                    type: 'boolean'
                },
                vms_visible: {
                    type: 'boolean'
                },
                vms_editable: {
                    type: 'boolean'
                },
                store_filter: {
                    type: 'boolean'
                },
                store_display_pdp: {
                    type: 'boolean'
                },
                store_display_plp: {
                    type: 'boolean'
                },
                store_search: {
                    type: 'boolean'
                },
                store_compare: {
                    type: 'boolean'
                },
                max: {
                    type: ['number','null']
                },
                min: {
                    type: ['number','null']
                }
            }
        }
    }
}

export const getNumDecAttributeSchema = {
    title : 'Successful Number Attribute Creation',
    type: 'object',
    required: [ '_id', 'name', 'active', 'code', 'auto_sync_to_prod', 'vms_visible', 'vms_editable', 
        'store_filter', 'store_search', 'store_compare', 'tags', 'type', 'mandatory', 'x_org_id', 'created_by', 
        'modified_by', 'created_by_email', 'modified_by_email', 'created_at', 'updated_at', 'max', 'min'],
    properties: {
        _id: {
            type: 'string'
          },
          name: {
            type: 'string'
          },
          code: {
            type: 'string'
          },
          x_org_id: {
            type: 'string'
          },
          type: {
            type: 'string'
          },
          createdAt: {
            type: 'string'
          },
          updatedAt: {
            type: 'string'
          },
          tags: {
            type: 'array'
          },
          active: {
            type: 'boolean'
          },
          auto_sync_to_prod: {
            type: 'boolean'
          },
          mandatory: {
            type: 'boolean'
          },
          vms_visible: {
            type: 'boolean'
          },
          vms_editable: {
            type: 'boolean'
          },
          store_filter: {
            type: 'boolean'
          },
          store_display_plp: {
            type: 'boolean'
          },
          store_display_pdp: {
            type: 'boolean'
          },
          store_search: {
            type: 'boolean'
          },
          store_compare: {
            type: 'boolean'
          },
          max: {
            type: ['number', 'null']
          },
          min: {
            type: ['number', 'null']
          }          
    }
}

export const getAllAttributesSchema = {
    title : 'Get All Attribute Successful call',
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
                required: ['_id', 'name', 'active', 'code', 'auto_sync_to_prod', 'vms_visible', 'x_org_id',
                    'vms_editable', 'store_filter', 'store_search', 'store_compare', 'tags', 'type', 'mandatory',
                    'created_by', 'modified_by', 'created_by_email', 'modified_by_email', 'created_at', 'updated_at','templateCount',
                    'skuCount'],
                properties: {
                    _id: {
                        type: 'string'
                    },
                    name: {
                        type: 'string'
                    },
                    active: {
                        type: 'boolean'
                    },
                    code: {
                        type: 'string'
                    },
                    auto_sync_to_prod: {
                        type: 'boolean'
                    },
                    description: {
                        type: 'string'
                    },
                    vms_visible: {
                        type: 'boolean'
                    },
                    vms_editable: {
                        type: 'boolean'
                    },
                    store_filter: {
                        type: 'boolean'
                    },
                    store_display_plp: {
                        type: 'boolean'
                    },
                    store_display_pdp: {
                        type: 'boolean'
                    },
                    store_search: {
                        type: 'boolean'
                    },
                    store_compare: {
                        type: 'boolean'
                    },
                    tags: {
                        type: 'array',
                        items: {
                            type: 'string'
                        }
                    },
                    type: {
                        type: 'string'
                    },
                    mandatory: {
                        type: 'boolean'
                    },
                    jsonata: {
                        type: 'string'
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
                    created_at: {
                        type: 'string',
                        format: 'date-time'
                    },
                    updated_at: {
                        type: 'string',
                        format: 'date-time'
                    },
                    templateCount: {
                        type: 'integer'
                    },
                    skuCount: {
                        type: 'integer'
                    }
                }
            }
        }
    }
}