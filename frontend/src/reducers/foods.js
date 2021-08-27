import { REQUEST_STATE } from "../constants";

export const initialState = {
	fetchState: REQUEST_STATE.INITIAL,
	foodsList: [],
};
// 初期状態を表してる。initialで、配列は空欄

export const foodsActionTypes = {
	FETCHING: "FETCHING",
	FETCH_SUCCESS: "FETCH_SUCCESS",
};
//

export const foodsReducer = (state, action) => {
	switch (action.type) {
		case foodsActionTypes.FETCHING:
			// これがdispatchでよばれた時！！
			return {
				...state,
				fetchState: REQUEST_STATE.LOADING,
				// fetchStateをloadingに変更だけ
			};
		case foodsActionTypes.FETCH_SUCCESS:
			// これがdispatchでよばれた時！！
			return {
				fetchState: REQUEST_STATE.OK,
				foodsList: action.payload.foods,
				// fetchStateをOKに変える。
				// foodListにdata.foods(これはオブジェクトのキーで名前がきまってる)を入れる。
			};
		default:
			throw new Error();
	}
};
