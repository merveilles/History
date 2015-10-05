'use strict';

const secrets = require('./secrets');
const knex = require('knex')({
    client: 'mysql',
    connection: {
        host: secrets.host,
        user: secrets.user,
        password: secrets.password,
        database: secrets.database,
        charset: 'utf8'
    }
});
const bookshelf = require('bookshelf')(knex);

const User = bookshelf.Model.extend({
    tableName: 'users',
    messages: () => this.hasMany(Message)
});

const Channel = bookshelf.Model.extend({
    tableName: 'channels',
    messages: () => this.hasMany(Message)
});

const Message = bookshelf.Model.extend({
    tableName: 'messages',
    channel: () => this.belongsTo(Channel),
    user: () => this.belongsTo(User)
});
