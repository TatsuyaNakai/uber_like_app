### order.rb のトランザクションがロールバックになってしまいます。

注文画面にいき、注文を確定させるとロールバックされ何度も同じ画面をループします。

この時のエラーが以下になります。

NoMethodError (undefined method `update_attributes!'
そこから、updata_attributes に変更を行なったところ、以下になりました。
ArgumentError Exception: wrong number of arguments (given 1, expected 2)

まだエラーだったので、以下に書き換えました。
updata_columns(active: false, order_id: self.id)
で行った結果は処理が走ります。（このパターンは master に保存済み）

しかし、これだとトランザクションを行わないので、このままではダメなのですが、
update_columns に変更した上で！マークをつけたらロールバックされます。

save が例外処理を生んでいるのではなく、updata_attributes だと思うのですが、
どうしたら改善されるのかわかりませんでした。
