'use strict';

const _ = require('lodash');
const knex = require('./database')('mysql').knex;
const schema = require('./schema');

function createTables() {
    var tables = [];
    var tableNames = _.keys(schema);

    tables = _.map(tableNames, (tableName) => {
        return createTable(tableName);
    });

    return Promise.all(tables);
}

function createTable(table) {
    return knex.schema.createTable(table, (t) => {
        var columnKeys = _.keys(schema[table]);

        _.each(columnKeys, function (column) {
            return addTableColumn(table, t, column);
        });
    });
}

function addTableColumn(tablename, table, columnName) {
    var column;
    var columnSpec = schema[tablename][columnName];

    if (columnSpec.type === 'text' && columnSpec.hasOwnProperty('fieldtype')) {
        column = table[columnSpec.type](columnName, columnSpec.fieldtype);
    } else if (columnSpec.type === 'string' && columnSpec.hasOwnProperty('maxlength')) {
        column = table[columnSpec.type](columnName, columnSpec.maxlength);
    } else {
        column = table[columnSpec.type](columnName);
    }

    if (columnSpec.hasOwnProperty('nullable') && columnSpec.nullable === true) {
        column.nullable();
    } else {
        column.notNullable();
    }

    if (columnSpec.hasOwnProperty('primary') && columnSpec.primary === true) {
        column.primary();
    }

    if (columnSpec.hasOwnProperty('unique') && columnSpec.unique) {
        column.unique();
    }

    if (columnSpec.hasOwnProperty('unsigned') && columnSpec.unsigned) {
        column.unsigned();
    }

    if (columnSpec.hasOwnProperty('references')) {
        column.references(columnSpec.references);
    }

    if (columnSpec.hasOwnProperty('defaultTo')) {
        column.defaultTo(columnSpec.defaultTo);
    }
}

createTables().then(() => {
    console.log('Tables created!');
}).catch((err) => {
    throw err;
});