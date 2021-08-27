class LineFood < ApplicationRecord
  belongs_to :food
  belongs_to :restaurant
  belongs_to :order, optional: true
  # nilでも大丈夫、エラーにならない。

  validates :count, numericality: { greater_than: 0 }
  # countが0より大きくないといけない。

  scope :active, -> { where(active: true) }
  # コントローラで、where(active:trueのものを取得する　
  # .activeメソッドが使えるようになった。
  scope :other_restaurant, -> (picked_restaurant_id) { where.not(restaurant_id: picked_restaurant_id) }
  # コントローラで、restraunt_idが引数値じゃないものを全て取得する 
  # .other_restrauntメソッドが使えるようになった。

  def total_amount
    food.price * count
  end
end