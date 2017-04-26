# frozen_string_literal: true

class Auth::SessionsController < Devise::SessionsController
  layout 'auth'

  def destroy
    super
    flash[:notice] = nil
  end
end
