# frozen_string_literal: true

module Admin
  class ResetsController < BaseController
    before_action :set_account

    def create
      @account.user.update(password: nil)
      redirect_to admin_accounts_path
    end

    private

    def set_account
      @account = Account.find(params[:account_id])
    end
  end
end
