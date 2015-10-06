'use strict';

const fs = require('fs');
const path = require('path');
const dir = require('node-dir');
const bookshelf = require('./database')('mysql').bookshelf;

const User = bookshelf.Model.extend({
    tableName: 'users',
    messages: function () {
        return this.hasMany(Message);
    }
});

const Channel = bookshelf.Model.extend({
    tableName: 'channels',
    messages: function () {
        return this.hasMany(Message);
    }
});

const Message = bookshelf.Model.extend({
    tableName: 'messages',
    channel: function () {
        return this.belongsTo(Channel, 'channel_id');
    },
    user: function () {
        return this.belongsTo(User, 'user_id');
    }
});

const dataDir = '../../data';

function populateUsers() {
    return new Promise((resolve, reject) => {
        const usersFile = path.join(dataDir, 'users.json');

        fs.readFile(usersFile, 'utf-8', (err, data) => {
            if (err) {
                throw err;
            }

            var users = JSON.parse(data);

            users.forEach((user) => {
                var userProperties = {
                    id: user.id,
                    name: user.name,
                    deleted: user.deleted,
                    color: user.color,
                    real_name: user.real_name,
                    tz: user.tz,
                    tz_label: user.tz_label,
                    tz_offset: user.tz_offset,
                    is_admin: user.is_admin,
                    is_owner: user.is_owner,
                    is_primary_owner: user.is_primary_owner,
                    is_restricted: user.is_restricted,
                    is_ultra_restricted: user.is_ultra_restricted,
                    is_bot: user.is_bot
                };

                User.forge(userProperties).save(null, {
                    method: 'insert'
                }).then((result) => {

                }).catch((err) => {
                    throw err;
                });
            });
        });
    });
}

function populateChannels() {
    return new Promise((resolve, reject) => {
        const channelsFile = path.join(dataDir, 'channels.json');

        fs.readFile(channelsFile, 'utf-8', (err, data) => {
            if (err) {
                throw err;
            }

            var channels = JSON.parse(data);

            channels.forEach((channel) => {
                var channelProperties = {
                    id: channel.id,
                    name: channel.name,
                    created: new Date(channel.created * 1000),
                    is_archived: channel.is_archived,
                    is_general: channel.is_general,
                    topic: channel.topic.value,
                    purpose: channel.purpose.value
                };

                Channel.forge(channelProperties).save(null, {
                    method: 'insert'
                }).then((result) => {

                }).catch((err) => {
                    throw err;
                });
            });
        });
    });
}

function populateMessages() {
    return new Promise((resolve, reject) => {
        dir.subdirs(dataDir, (err, subdirs) => {
            if (err) {
                throw err;
            }

            subdirs.forEach((subdir) => {
                var channelName = path.basename(subdir);

                var channel = Channel.forge({
                    name: channelName
                }).fetch().then((channel) => {
                    dir.readFiles(subdir, (err, data, next) => {
                        if (err) {
                            throw err;
                        }

                        var messages = JSON.parse(data);

                        messages.forEach((message) => {
                            var messageProperties = {
                                user_id: message.user,
                                channel_id: channel.id,
                                text: message.text,
                                timestamp: new Date(message.ts.split('.')[0] * 1000)
                            };

                            Message.forge(messageProperties).save().then((result) => {

                            }).catch((err) => {
                                throw err;
                            });
                        });

                        next();
                    });
                }).catch((err) => {
                    throw err;
                });
            });
        });
    });
}

// Will properly use promises eventually.
// Too lazy right now.
// For now, just uncomment the ones you want to run.

populateUsers();
populateChannels();
// populateMessages();

