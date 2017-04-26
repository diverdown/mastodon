class Users::OmniauthCallbacksController < Devise::OmniauthCallbacksController
  before_action :tie_to_current_user_if_signed_in

  def oauth_sign_in
    @user = User.find_or_create_by_oauth_authorization(**account)
    set_flash_message(:notice, :success, kind: auth.provider) if is_navigational_format?
    sign_in_and_redirect @user, event: :authentication
  rescue ActiveRecord::RecordInvalid => e
    redirect_to about_path, alert: e.message
  end

  alias twitter oauth_sign_in

  private

  def tie_to_current_user_if_signed_in
    return unless user_signed_in?
    OAuthAuthorization.find_or_initialize_by(account.slice(:type, :uid).merge(account_id: current_user.account_id)).update(name: account[:name])
    set_flash_message(:notice, :success, kind: account[:type]) if is_navigational_format?
    redirect_to root_path
  end

  def after_sign_in_path_for(resource)
    root_path
  end

  def auth
    request.env['omniauth.auth']
  end

  def account
    @account ||= {
      type: "#{auth.provider.camelcase}Account",
      uid: auth.uid,
      name: auth.info.nickname,
      display_name: auth.name || '',
    }
  end
end
