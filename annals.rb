require 'json'
require 'sqlite3'

class Annals
    def initialize(database = 'annals.db')
        @db = SQLite3::Database.new(database)
    end

    def import(dir = 'data')
        @db.execute <<-SQL
            DROP TABLE IF EXISTS users;
        SQL

        @db.execute <<-SQL
            CREATE TABLE users (
                id TEXT PRIMARY KEY,
                name TEXT
            );
        SQL

        @db.execute <<-SQL
            DROP TABLE IF EXISTS channels;
        SQL

        @db.execute <<-SQL
            CREATE TABLE channels (
                id TEXT PRIMARY KEY,
                name TEXT,
                topic TEXT,
                purpose TEXT,
                archived BOOLEAN
            );
        SQL

        @db.execute <<-SQL
            DROP TABLE IF EXISTS logs;
        SQL

        @db.execute <<-SQL
            CREATE TABLE logs (
                id INTEGER PRIMARY KEY,
                channel TEXT,
                user TEXT,
                message TEXT,
                timestamp TEXT,
                FOREIGN KEY(channel) REFERENCES channels(id)
                FOREIGN KEY(user) REFERENCES users(id)
            );
        SQL

        users_file = File.read(File.join(dir, 'users.json'))

        users = JSON.load(users_file)

        users.each do |user|
            statement = @db.prepare <<-SQL
                INSERT INTO users (id, name)
                VALUES (?, ?)
            SQL

            statement.execute(user['id'], user['name'])
        end

        channels_file = File.read(File.join(dir, 'channels.json'))

        channels = JSON.load(channels_file)

        channels.each do |channel|
            statement = @db.prepare <<-SQL
                INSERT INTO channels (id, name, topic, purpose, archived)
                VALUES (?, ?, ?, ?, ?)
            SQL

            statement.execute(channel['id'], channel['name'], channel['topic']['value'], channel['purpose']['value'], channel['is_archived'] ? 1 : 0)
        end

        channel_dirs = Dir[File.join(dir, '*')]

        channel_dirs.each do |channel_dir|
            channel = channels.find { |channel| channel['name'] == File.basename(channel_dir) }

            log_files = Dir[File.join(channel_dir, '*')]

            log_files.each do |log_file|
                logs = JSON.load(File.read(log_file))

                logs.each do |log|
                    if not log.has_key? 'subtype'
                        statement = @db.prepare <<-SQL
                            INSERT INTO logs (channel, user, message, timestamp)
                            VALUES (?, ?, ?, ?)
                        SQL

                        statement.execute(channel['id'], log['user'], log['text'], log['ts'])
                    end
                end
            end
        end
    end

    def list_channels
        file = File.read(File.join(@dir, 'channels.json'))

        JSON.load(file)
    end

    def list_channel_names
        list_channels.collect { |channel| channel['name'] }
    end

    def list_users
        file = File.read(File.join(@dir, 'users.json'))

        JSON.load(file)
    end

    def list_user_names
        list_users.collect { |user| user['name'] }
    end

    def search_channel(channel, query)
        channel_logs = File.join(@dir, channel, '*')

        Dir[channel_logs].each do |path|
            file = File.read(path)
            puts JSON.load(file)
        end
    end
end
