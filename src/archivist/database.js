'use strict';

module.exports = (client) => {
    const secrets = require('./secrets');
    const knex = require('knex')({
        client: client,
        connection: {
            host: secrets[client].host,
            user: secrets[client].user,
            password: secrets[client].password,
            database: secrets[client].database,
            charset: 'utf8'
        }
    });
    const bookshelf = require('bookshelf')(knex);

    return {
        knex: knex,
        bookshelf: bookshelf
    };
};
