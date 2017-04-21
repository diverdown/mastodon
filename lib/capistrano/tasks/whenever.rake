namespace :whenever do
  desc "Upload config/schedule.rb"
  task :upload_schedule do
    on roles fetch(:whenever_roles) do
      within release_path do
        upload! 'config/schedule.rb', "#{release_path}/config/schedule.rb"
      end
    end
  end
end
