# frozen_string_literal: true

require 'rails_helper'

RSpec.describe Auth::SessionsController, type: :controller do
  render_views

  describe 'GET #new' do
    before do
      request.env['devise.mapping'] = Devise.mappings[:user]
    end

    it 'returns http success' do
      get :new
      expect(response).to have_http_status(:success)
    end
  end

  describe 'DELETE #destroy' do
    let(:user) { Fabricate(:user) }

    before do
      request.env['devise.mapping'] = Devise.mappings[:user]
    end

    context 'with a regular user' do
      it 'redirects to home after sign out' do
        sign_in(user, scope: :user)
        delete :destroy

        expect(response).to redirect_to(root_path)
      end
    end

    context 'with a suspended user' do
      it 'redirects to home after sign out' do
        Fabricate(:account, user: user, suspended: true)
        sign_in(user, scope: :user)
        delete :destroy

        expect(response).to redirect_to(root_path)
      end
    end
  end

  describe 'POST #create' do
    before do
      request.env['devise.mapping'] = Devise.mappings[:user]
    end

    context 'using password authentication' do
      let(:user) { Fabricate(:user, email: 'foo@bar.com', password: 'abcdefgh') }

      context 'using a valid password' do
        before do
          post :create, params: { user: { email: user.email, password: user.password } }
        end

        it 'redirects to home' do
          expect(response).to redirect_to(root_path)
        end

        it 'logs the user in' do
          expect(controller.current_user).to eq user
        end
      end

      context 'using an invalid password' do
        before do
          post :create, params: { user: { email: user.email, password: 'wrongpw' } }
        end

        it 'shows a login error' do
          expect(flash[:alert]).to match I18n.t('devise.failure.invalid', authentication_keys: 'Email')
        end

        it "doesn't log the user in" do
          expect(controller.current_user).to be_nil
        end
      end

      context "logging in from the user's page" do
        before do
          allow(controller).to receive(:single_user_mode?).and_return(single_user_mode)
          allow(controller).to receive(:stored_location_for).with(:user).and_return("/@#{user.account.username}")
          post :create, params: { user: { email: user.email, password: user.password } }
        end

        context "in single user mode" do
          let(:single_user_mode) { true }

          it 'redirects to home' do
            expect(response).to redirect_to(root_path)
          end
        end

        context "in non-single user mode" do
          let(:single_user_mode) { false }

          it "redirects back to the user's page" do
            expect(response).to redirect_to(short_account_path(username: user.account))
          end
        end
      end
    end
  end
end
