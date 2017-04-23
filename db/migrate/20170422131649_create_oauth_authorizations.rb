class CreateOAuthAuthorizations < ActiveRecord::Migration[5.0]
  def change
    create_table :oauth_authorizations do |t|
      t.belongs_to :account, null: false, index: false
      t.string :uid, null: false
      t.integer :type, null: false
      t.string :name, null: false
      t.timestamps
    end
    add_index :oauth_authorizations, %i[account_id type], unique: true
    add_index :oauth_authorizations, %i[type uid], unique: true
  end
end
