export const invitedMembersSchema = {
    title: 'Successful get invited members api call response',
    type: 'object',
    required: ['invitedMembers'],
    properties: {
        invitedMembers: {
            type: 'array',
            items: {
                type: 'object',
                required: ['_id', 'orgId', 'email', 'role', 'userGroups', 'createdAt', 'updatedAt', 'status'],
                properties: {
                    _id: {
                        type: 'string'
                    },
                    orgId: {
                        type: 'string'
                    },
                    email: {
                        type: 'string'
                    },
                    role: {
                        type: 'string',
                        enum: ['CA', 'CE', 'admin', 'auditor', 'supervisor']
                    },
                    userGroups: {
                        type: 'array',
                        items: {
                            type: 'string'
                        }
                    },
                    createdAt: {
                        type: 'string'
                    },
                    updatedAt: {
                        type: 'string'
                    },
                    status: {
                        type: 'string'
                    }
                }
            }
        }
    }
}
