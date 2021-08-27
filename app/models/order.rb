class Order < ApplicationRecord
  has_many :line_foods

  validates :total_price, numericality: { greater_than: 0 }
  # 0より大きくないといけない。

  def save_with_update_line_foods!(line_foods)
    # トランザクションを行いたいから、破壊的メソッドにする必要がある。
    ActiveRecord::Base.transaction do
      line_foods.each do |line_food|
        line_food.update_columns(active: false, order_id: self.id)
        # line_foodsの個々をactive:falseに、order: 今回の番号にしていく。
        # !マークをつけるとロールバックするようになってしまう。
      end

      self.save!
      
      # selfのsaveが失敗するか、それぞれのカラムの更新に失敗した場合は全部の処理を無かったことにする。
    end
  end
  
end