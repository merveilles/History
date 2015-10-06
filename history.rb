require 'dotenv'
Dotenv.load

require 'json'
require 'mysql'

class History
    def initialize()
        @db = Mysql.new(
            ENV['MYSQL_HOST'],
            ENV['MYSQL_USER'],
            ENV['MYSQL_PASSWORD'],
            ENV['MYSQL_DATABASE']
        )
    end

    def list_channels
        results = @db.query <<-SQL
            SELECT * FROM channels
        SQL

        to_hash_array(results)
    end

    def list_channel_names
        results = @db.query <<-SQL
            SELECT name FROM channels
        SQL

        to_array(results)
    end

    def list_users
        results = @db.query <<-SQL
            SELECT * FROM users
        SQL

        to_hash_array(results)
    end

    def list_user_names
        results = @db.query <<-SQL
            SELECT name FROM users
        SQL

        to_array(results)
    end

    private

    def to_hash_array(result_set)
        array = []

        result_set.each_hash do |row|
            array.push(row)
        end

        array
    end

    def to_array(result_set)
        array = []

        result_set.each do |row|
            array.push(row)
        end

        array
    end
end
