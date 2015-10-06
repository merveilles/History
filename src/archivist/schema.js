'use strict';

const Schema = {
    users: {
        id: {
            type: 'string',
            primary: true,
            unique: true,
            nullable: false
        },
        name: {
            type: 'string',
            unique: true,
            nullable: false
        },
        deleted: {
            type: 'boolean',
            nullable: false
        },
        color: {
            type: 'string',
            maxlength: 6,
            nullable: false
        },
        real_name: {
            type: 'string',
            nullable: false
        },
        tz: {
            type: 'string',
            nullable: true
        },
        tz_label: {
            type: 'string',
            nullable: false
        },
        tz_offset: {
            type: 'integer',
            nullable: false
        },
        is_admin: {
            type: 'boolean',
            nullable: false
        },
        is_owner: {
            type: 'boolean',
            nullable: false
        },
        is_primary_owner: {
            type: 'boolean',
            nullable: false
        },
        is_restricted: {
            type: 'boolean',
            nullable: false
        },
        is_ultra_restricted: {
            type: 'boolean',
            nullable: false
        },
        is_bot: {
            type: 'boolean',
            nullable: false
        }
    },
    channels: {
        id: {
            type: 'string',
            primary: true,
            unique: true,
            nullable: false
        },
        name: {
            type: 'string',
            unique: true,
            nullable: false
        },
        created: {
            type: 'dateTime',
            nullable: false
        },
        is_archived: {
            type: 'boolean',
            nullable: false
        },
        is_general: {
            type: 'boolean',
            nullable: false
        },
        topic: {
            type: 'string',
            nullable: false
        },
        purpose: {
            type: 'string',
            nullable: false
        }
    },
    messages: {
        id: {
            type: 'bigIncrements',
            primary: true,
            nullable: false
        },
        user_id: {
            type: 'string',
            nullable: false
        },
        channel_id: {
            type: 'string',
            nullable: false
        },
        text: {
            type: 'text',
            nullable: false
        },
        timestamp: {
            type: 'dateTime',
            nullable: false
        }
    }
};

module.exports = Schema;
