3.times do |n|
  restaurant= Restaurant.new(
    name: "testレストラン#{n}",
    fee: 100,
    time_required: 10
  )

  12.times do |m|
    restaurant.foods.build(
      name: "フード名_#{m}",
      price: 500,
      description: "フード_#{m}の説明文になります。"
    )
  end
  #  一つのレストランに対して12個の商品が存在してる。それが３店舗ある。

  restaurant.save!
  # このコマンドでDBに書き込むことができる。

end