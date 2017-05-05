Fabricator(:github_account) do
  user
  uid { Faker::Number.unique.between(1, 100000).to_s }
  name { Faker::Internet.user_name(nil, %w(-)) }
end
