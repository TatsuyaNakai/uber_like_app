import axios from "axios";
import { orders } from "../urls/index";

export const postOrder = (params) => {
	return axios
		.post(orders, {
			// orders#createのアクションを回す。
			line_food_ids: params.line_food_ids,
		})
		.then((res) => {
			return res.data;
		})
		.catch((e) => console.error(e));
};
