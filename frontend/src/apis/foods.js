import axios from "axios";
import { foodsIndex } from "../urls/index";

export const fetchFoods = (restaurantId) => {
	return (
		axios
			.get(foodsIndex(restaurantId))
			// get(https://local--/api/v1/restaurants/restaurantId/foods)を実行してる
			// fetchFood関数の引数によって、上のrestaurantIdは変動する。
			.then((res) => {
				return res.data;
			})
			.catch((e) => {
				console.log(e);
			})
	);
};
