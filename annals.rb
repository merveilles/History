require 'json'

class Annals
    def initialize(dir = 'data')
        @dir = dir
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

    def search(query)

    end
end
