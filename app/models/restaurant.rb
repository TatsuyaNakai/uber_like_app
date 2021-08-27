class Restaurant < ApplicationRecord
  has_many :foods
  has_many :line_foods, through: :foods

  validates :name, :fee, :time_required, presence: true
  validates :name, length: { maximum: 30 }
  validates :fee, numericality: { greater_than: 0 }
  # 数値の制限をかけてる　入力する数値が0より大きい
end