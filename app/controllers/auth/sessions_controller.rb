# frozen_string_literal: true

class Auth::SessionsController < Devise::SessionsController
  layout 'auth'

  skip_before_action :require_no_authentication, only: [:create]
  skip_before_action :check_suspension, only: [:destroy]

  def create
    super do |resource|
      flash.delete(:notice)
    end
  end

  def destroy
    super
    flash.delete(:notice)
  end

  protected

  def user_params
    params.require(:user).permit(:email, :password)
  end

  def after_sign_in_path_for(resource)
    last_url = stored_location_for(:user)

    if home_paths(resource).include?(last_url)
      root_path
    else
      last_url || root_path
    end
  end

  private

  def home_paths(resource)
    paths = [about_path]
    if single_user_mode? && resource.is_a?(User)
      paths << short_account_path(username: resource.account)
    end
    paths
  end
end
