object @account
attribute :id

child(:oauth_authorizations, object_root: false) { attributes :name, :url, :provider }
