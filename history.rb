require 'dotenv'
Dotenv.load

require 'mysql2'

class History

    # Initializes a new Merveilles history instance
    def initialize()
        Mysql2::Client.default_query_options.merge!(:symbolize_keys => true)

        @db = Mysql2::Client.new(
            :host => ENV['MYSQL_HOST'],
            :username => ENV['MYSQL_USER'],
            :password => ENV['MYSQL_PASSWORD'],
            :database => ENV['MYSQL_DATABASE']
        )
    end

    # Retrieves a list of Merveilles users
    def list_channels
        results = @db.query <<-SQL
            SELECT * FROM channels
        SQL

        results.to_a
    end

    # Retrieves a list of Merveilles channel names
    def list_channel_names
        results = @db.query <<-SQL
            SELECT name FROM channels
        SQL

        results.to_a
    end

    # Retrieves a channel with the specified Slack ID
    def get_channel_with_id(id)

    end

    # Retrieves a channel with the specified name
    def get_channel_with_name(name)
        statement = @db.prepare <<-SQL
            SELECT * FROM channels
            WHERE name = ?
        SQL

        results = statement.execute(name)

        results.to_a.first
    end

    # Retrieves a list of Merveilles users
    def list_users
        results = @db.query <<-SQL
            SELECT * FROM users
        SQL

        results.to_a
    end

    # Retrieves a list of Merveilles usernames
    def list_user_names
        results = @db.query <<-SQL
            SELECT name FROM users
        SQL

        results.to_a
    end

end
