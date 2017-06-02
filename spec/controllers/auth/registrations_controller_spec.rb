require 'rails_helper'

RSpec.describe Auth::RegistrationsController, type: :controller do
  render_views

  describe 'GET #new' do
    before do
      Setting.open_registrations = true
      request.env["devise.mapping"] = Devise.mappings[:user]
    end

    it 'raises ActionController::UrlGenerationError' do
      expect {
        get :new
      }.to raise_error(ActionController::UrlGenerationError)
    end
  end

  describe 'POST #create' do
    let(:accept_language) { Rails.application.config.i18n.available_locales.sample.to_s }

    before do
      Setting.open_registrations = true
      request.env["devise.mapping"] = Devise.mappings[:user]
      request.headers["Accept-Language"] = accept_language
    end

    it 'raises ActionController::UrlGenerationError' do
      expect {
        post :create, params: { user: { account_attributes: { username: 'test' }, email: 'test@example.com', password: '12345678', password_confirmation: '12345678' } }
      }.to raise_error(ActionController::UrlGenerationError)
    end
  end

  describe 'DELETE #destroy' do
    let(:user) { Fabricate(:user) }

    before do
      request.env['devise.mapping'] = Devise.mappings[:user]
      sign_in(user, scope: :user)
    end

    it 'raises ActionController::UrlGenerationError' do
      expect {
        delete :destroy
      }.to raise_error(ActionController::UrlGenerationError)
    end
  end
end
