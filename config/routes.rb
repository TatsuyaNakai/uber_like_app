Rails.application.routes.draw do
  # For details on the DSL available within this file, see https://guides.rubyonrails.org/routing.html
  namespace :api do
    namespace :v1 do
      resources :restaurants do
        # /api/v1/restaurants　or restraunt/...のURI index, create, show, update, deleteアクション作成
        resources :foods, only: %i[index]
        # /api/v1/restaurants/food...になる。  indexアクションのみ作成
      end
      resources :line_foods, only: %i[index create]
      # /api/v1/line_foods...になる。　index, createアクションのみ作成
      put 'line_foods/replace', to:'line_foods#replace'
      # /api/v1/line_foods/repalce のURIで、line_food#replaceアクションにいくように設定　HTTPメソッドはPUT
      resources :orders, only: %i[create]
      # /api/v1/orders...になる。　　createアクションのみ作成
    end
  end
end
