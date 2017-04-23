class OAuthAuthorization < ApplicationRecord
  enum type: {
    GithubAccount: 0,
    TwitterAccount: 1,
  }

  belongs_to :user, primary_key: :account_id, foreign_key: :account_id

  def self.provider
    name.slice(/\A(.+)Account/, 1).underscore
  end

  def self.providers
    types.keys.map(&:constantize).map(&:provider)
  end

  delegate :provider, to: :class

  def url
    "https://#{provider}.com/#{name}"
  end
end
