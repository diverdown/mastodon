namespace :newrelic do
  desc "Upload config/newrelic.yml"
  task :upload do
    on roles [:db, :app, :sidekiq] do
      within release_path do
        upload! 'config/newrelic.yml', "#{release_path}/config/newrelic.yml"
      end
    end
  end
end
