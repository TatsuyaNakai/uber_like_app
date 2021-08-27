module Api
  module V1
    class LineFoodsController < ApplicationController
      before_action :set_food, only: %i[create replace]
    
      def index
        line_foods=LineFood.active
        # 仮注文のactiveになってるもの全て（全部出る。）
        if line_foods.exists?
          # 仮注文があるとき
          render json: {
            line_food_ids: line_foods.map { |line_food| line_food.id },
            # _idsは、配列をidだけの配列にして並び直させたもの。
            restaurant: line_foods[0].restaurant,
            # 一番初めの仮注文のレストラン名を格納する。
            count: line_foods.sum{|line_food| line_food[:count] },
            # それぞれの商品の合計個数を合わせたものをcountにいれる。
            amount: line_foods.sum{|line_food| line_food.total_amount},
            # food.price*countしたものを全て合わせたものを格納する。
            # =>それぞれの商品の値段と個数をかけたものを合計で合わせたもの
          }, status: :ok
        else
        # 仮注文がないとき
          render json: {}, status: :no_content
          # 何もないということを返す。
        end
      end
    
      def create
        if LineFood.active.other_restaurant(@ordered_food.restaurant_id).exists?
          # いま注文した商品のお店以外で、activeがtrueなものの配列がある場合は以下を実行する。
          return render json: {
            existing_restaurant: 
              LineFood.other_restaurant(@ordered_food.restaurant.id).first.restaurant.name,
              # existing_restaurantを、いま注文したお店以外の配列の先頭の名前にする。
            new_restaurant: 
              Food.find(params[:food_id]).restaurant.name,
              # new_restaurantは、food_idで取得した食べ物のレストランの名前にする。
          }, status: :not_acceptable
        end
        set_line_food(@ordered_food)
        if @line_food.save
          render json: {
            line_food: @line_food
          }, status: :created
        else
          render json: {}, status: :internal_server_error
        end
      end
    
      def replace
        LineFood.active.other_restaurant(@ordered_food.restaurant.id).each do |line_food|
          # 仮注文したお店以外のactiveになってる食べ物の配列を1つ1つ line_food に分割する
          line_food.update_attribute(:active, false)
          # activeを1つずつfalseに変更していく。
        end
        set_line_food(@ordered_food)
        if @line_food.save
          render json: {
            line_food: @line_food
          }, status: :created
        else
          render json: {}, status: :internal_server_error
        end
      end
    
    # ーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーーー
      private
        def set_food
          @ordered_food= Food.find(params[:food_id])
          # URIの:restaurant_idの部分から、番号を引っ張ってくる。
          # それをidにして、ordered_foodに格納する。
        end
      
        def set_line_food(ordered_food)
          if ordered_food.line_food.present?
            # 指定された番号のfoodのline_food（仮注文）が既にあれば、以下を行う
            @line_food = ordered_food.line_food
            # その仮注文をline_foodに格納する。
            @line_food.attributes = {
              count: ordered_food.line_food.count + params[:count],
              active: true
              # line_foodの数足す、パラメーターのカウントの数字で合わせる
              # activeをtrueにする。
            }
          else
            @line_food = ordered_food.build_line_food(
              # 仮注文がなかった場合は、ordered_foodのline_foodを作成する。
              count: params[:count],
              restaurant: ordered_food.restaurant,
              active: true
            )
          end
        end
    
    # １対１か、１対 多　で、関連づけ（レコード作成）の記述が変わる。
    # 1:1
    # @user= User.new(name:"Moe")
    # @card= @user.build_card
    
    # 1:多
    # @user= User.new("Moe")
    # @card= @user.cards.build
    
    end
  end
end