import React, { useReducer, useEffect } from 'react';
import styled from 'styled-components';
import { Link } from "react-router-dom";

import { OrderDetailItem } from '../components/OrderDetailItem';
import { OrderButton } from '../components/Buttons/OrderButton';
import CircularProgress from '@material-ui/core/CircularProgress';

import { fetchLineFoods } from '../apis/line_foods';
import { postOrder } from '../apis/orders';

import {
  initialState,
  lineFoodsActionTypes,
  lineFoodsReducer,
} from '../reducers/lineFoods';
import MainLogo from '../images/logo.png';
import { REQUEST_STATE } from '../constants';

const HeaderWrapper = styled.div`
  display: flex;
  justify-content: flex-start;
  padding: 8px 32px;
`;

const MainLogoImage = styled.img`
  height: 90px;
`;

const OrderListWrapper = styled.div`
  display: flex;
  justify-content: center;
`;

const OrderItemWrapper = styled.div`
  margin-bottom: 50px;
`;

export const Orders = () => {

  const [state, dispatch] = useReducer(lineFoodsReducer, initialState);

  const postLineFoods = () => {
    dispatch({ type: lineFoodsActionTypes.POSTING });
    // postStateをLOADINGに更新する。
    postOrder({
      line_food_ids: state.lineFoodsSummary.line_food_ids,
      
    }).then(() => {
      dispatch({ type: lineFoodsActionTypes.POST_SUCCESS });
      // postStateをOKに更新する。
      window.location.reload();
      // 画面をもう一回読み込む処理を走らせる。
    });
  };

  useEffect(() => {
    dispatch({type: lineFoodsActionTypes.FETCHING});
    // fetchStateをLOADINGにオブジェクトを更新する。
    fetchLineFoods()
    // 実行すると、line_foods#indexがコントローラにいく。
      .then((data) =>
      // その受け取ったデータを使って、、、
        dispatch({
          type: lineFoodsActionTypes.FETCH_SUCCESS,
          payload: {
            lineFoodsSummary: data
          }
          // fetchStateは、OKになって、lineFoodsSummaryは、dataが入る。
        })
      )
      .catch((e) => console.error(e));
  }, []);

  const orderButtonLabel = () => {
    switch (state.postState) {
      // postStateが内容次第でボタンの中身が変更するようになってる。
      case REQUEST_STATE.LOADING:
        return '注文中...';
      case REQUEST_STATE.OK:
        return '注文が完了しました！';
      default:
        return '注文を確定する';
    }
  };

  return (
    <>
      <HeaderWrapper>
        <Link to="/restaurants">
          <MainLogoImage src={MainLogo} alt="main logo" />
        </Link>
      </HeaderWrapper>
      <OrderListWrapper>
        <div>
          <OrderItemWrapper>
            {
              // APIローディング中はくるくる回るローディングコンポーネントを表示
              state.fetchState === REQUEST_STATE.LOADING ?
                <CircularProgress />
              :
                state.lineFoodsSummary &&
                  <OrderDetailItem
                    restaurantFee={state.lineFoodsSummary.restaurant.fee}
                    restaurantName={state.lineFoodsSummary.restaurant.name}
                    restaurantId={state.lineFoodsSummary.restaurant.id}
                    timeRequired={state.lineFoodsSummary.restaurant.time_required}
                    foodCount={state.lineFoodsSummary.count}
                    price={state.lineFoodsSummary.amount}
                  />
            }
          </OrderItemWrapper>
          <div>
            {
              state.fetchState === REQUEST_STATE.OK && state.lineFoodsSummary &&
              // まずは等価性を確認する（REQUEST_STATEがOKかどうか。）次にlineFoodsSummaryがtrueかどうか。
                <OrderButton
                  onClick={() => postLineFoods()}
                  disabled={state.postState === REQUEST_STATE.LOADING || state.postState === REQUEST_STATE.OK}
                  // postStateがLOADINGかつ、postStateが、OKの時は、非活性にしておく。
                  // 注文中、注文が完了しましたの時は押せないようにしてる。
                >
                  {orderButtonLabel()}
                </OrderButton>
            }
            {
              state.fetchState === REQUEST_STATE.OK && !(state.lineFoodsSummary) &&
              // fetchStateの等価性はどうか。そして、lineFoodSummaryが　falseを期待（反転する）
              // 注文完了してるときか、仮注文の情報取れた時だけ、かfalseの時ってnullの時しかない。
              // 仮注文がない時か、仮注文の商品を頼み終わった時に表示される。
                <p>
                  注文予定の商品はありません。
                </p>
            }
          </div>
        </div>
      </OrderListWrapper>
    </>
  )
}