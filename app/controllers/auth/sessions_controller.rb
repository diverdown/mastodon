# frozen_string_literal: true

class Auth::SessionsController < Devise::SessionsController
  layout 'auth'

  skip_before_action :require_no_authentication, only: [:create]

  def create
    super do |resource|
      flash[:notice] = nil
    end
  end

  def destroy
    super
    flash[:notice] = nil
  end

  protected

  def user_params
    params.require(:user).permit(:email, :password)
  end

  def after_sign_in_path_for(_resource)
    last_url = stored_location_for(:user)

    if [about_path].include?(last_url)
      root_path
    else
      last_url || root_path
    end
  end
end
