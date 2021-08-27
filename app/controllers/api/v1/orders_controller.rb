class Api::V1::OrdersController < ApplicationController
  def create
    posted_line_foods = LineFood.where(id: params[:line_food_ids])
    # line_foodのidを格納してる配列をもとにLineFoodsテーブルに入ってるものを格納
    order = Order.new(
      total_price: total_price(posted_line_foods),
    )
    # それぞれの食事の値段と数の積　とお店の手数料
    # をtotal_priceカラムにいれたOrderを新しく作る。
    if order.save_with_update_line_foods!(posted_line_foods)
      # それぞれのカラムを更新して、orderクラスをdbに保存できるかどうか。
      # できなかったら、エラーを吐く。トランザクションの効果で全部をなしにする。
      render json: {}, status: :no_content
      # 通信は成功してるけど、特に渡すものがないから、no_content
    else
      render json: {}, status: :internal_server_error
    end
  end

  private

  def total_price(posted_line_foods)
    posted_line_foods.sum {|line_food| line_food.total_amount } 
                    + posted_line_foods.first.restaurant.fee
    # 配列できたものの一つずつに分けて、それぞれの食事の値段と数の積。（弁当４つ！とか）と
    # そのお店の手数料を足してあげる。
  end

end