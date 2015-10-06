require 'dotenv'
Dotenv.load

require 'mysql'

class History
    # Initializes a new Merveilles history instance
    def initialize()
        @db = Mysql.new(
            ENV['MYSQL_HOST'],
            ENV['MYSQL_USER'],
            ENV['MYSQL_PASSWORD'],
            ENV['MYSQL_DATABASE']
        )
    end

    # Retrieves a list of Merveilles users
    def list_channels
        results = @db.query <<-SQL
            SELECT * FROM channels
        SQL

        to_hash_array(results)
    end

    # Retrieves a list of Merveilles channel names
    def list_channel_names
        results = @db.query <<-SQL
            SELECT name FROM channels
        SQL

        to_array(results)
    end

    # Retrieves a list of Merveilles users
    def list_users
        results = @db.query <<-SQL
            SELECT * FROM users
        SQL

        to_hash_array(results)
    end

    # Retrieves a list of Merveilles usernames
    def list_user_names
        results = @db.query <<-SQL
            SELECT name FROM users
        SQL

        to_array(results)
    end

    private

    # Converts a MySQL result set to an array of hashes
    def to_hash_array(result_set)
        array = []

        result_set.each_hash do |row|
            array.push(row)
        end

        array
    end

    # Converts a MySQL result set to an array of values
    def to_array(result_set)
        array = []

        result_set.each do |row|
            array.push(row)
        end

        array
    end
end
