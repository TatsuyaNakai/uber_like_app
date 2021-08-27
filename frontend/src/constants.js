// プロジェクトの中で共通で参照される定数や、画像を配置してる。
// 複数のコンポーネント、もしくは関数、モジュールから参照される場合は。別ファイルに定義しておくのがいい。

export const REQUEST_STATE = {
	INITIAL: "INITIAL",
	LOADING: "LOADING",
	OK: "OK",
};

export const HTTP_STATUS_CODE = {
	NOT_ACCEPTABLE: 406,
};
