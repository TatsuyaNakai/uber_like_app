class Food < ApplicationRecord
  belongs_to :restaurant
  belongs_to :order, optional: true
  # 外部キーがなくても問題ないことを示すoptional:true
  has_one :line_food
end