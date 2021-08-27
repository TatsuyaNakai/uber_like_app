import React, {useState, useEffect, useReducer} from 'react';
import { useHistory, Link } from 'react-router-dom';

import { NewOrderConfirmDialog } from '../components/NewOrderConfirmDialog';

import { postLineFoods, replaceLineFoods } from '../apis/line_foods';

import { HTTP_STATUS_CODE } from '../constants';

import {fetchFoods} from '../apis/foods';

import {initialState as foodsInitialState,
        foodsActionTypes,
        foodsReducer } from '../reducers/foods';
        
import styled from 'styled-components'
import Skeleton from '@material-ui/lab/Skeleton';
import { FoodOrderDialog } from '../components/FoodOrderDialog';
        
import {REQUEST_STATE} from '../constants';
import { FoodWrapper } from '../components/FoodWrapper';
import { COLORS } from '../style_constants';
import { LocalMallIcon } from '../components/Icons';

import MainLogo from '../images/logo.png';
import FoodImage from '../images/food-image.jpg';

const HeaderWrapper= styled.div`
  display:flex;
  justify-content: space-between;
  padding: 8px 32px;
`

const BagIconWrapper = styled.div`
  padding-top: 24px;
`;

const ColoredBagIcon = styled(LocalMallIcon)`
  color: ${COLORS.MAIN};
`;

const MainLogoImage = styled.img`
  height: 90px;
`

const FoodsList = styled.div`
  display: flex;
  justify-content: space-around;
  flex-wrap: wrap;
  margin-bottom: 50px;
`;

const ItemWrapper = styled.div`
  margin: 16px;
`;

export const Foods = ({ match }) => {
  const [foodsState, dispatch] = useReducer(foodsReducer, foodsInitialState);
  // foodsStateの初期値は、foods.jsに記載してるけど、以下になります。
  // const initialState = {
  // 	  fetchState: REQUEST_STATE.INITIAL,
  // 	  foodsList: [],
  // };
  // これが、foodsReducerのdispatchでどんどん更新されていくイメージ

  const history= useHistory();

  const initialState={
    isOpenOrderDialog: false,
    // 個別ページのモーダルを表示させるかどうかの分岐
    selectedFood: null,
    // なんの食べ物が選ばれてるかどうかのナンバリング
    selectedFoodCount: 1,
    // 食べ物の注文個数
    isOpenNewOrderDialog: false,
    // 違うお店の仮注文が入ってるけど大丈夫ですか？のモーダル
    existingRestaurantName:'',
    // いま仮注文に入ってる食べ物を提供してるお店の名前
    newRestaurantName: ''
    // 新しく仮注文に入れた食べ物を提供してるお店の名前
  }

  const [state, setState]= useState(initialState)

  const submitOrder = () => {
    postLineFoods({
      foodId: state.selectedFood.id,
      count: state.selectedFoodCount,
      // rails routesで確認して、line_foods#createアクションに移る。
    }).then(() => history.push('/orders'))
    // /ordersに移る=>postなので、orders#createアクションにいく。
    // 仮注文を消して、注文のテーブルに追加を行った。
      .catch((e) => {
        if (e.response.status === HTTP_STATUS_CODE.NOT_ACCEPTABLE) {
          setState({
            ...state,
            isOpenOrderDialog: false,
            isOpenNewOrderDialog: true,
            existingRestaurantName: e.response.data.existing_restaurant,
            newRestaurantName: e.response.data.new_restaurant,
          })
        } else {
          throw e;
        }
      })
  };

  const replaceOrder = () => {
    replaceLineFoods({
      foodId: state.selectedFood.id,
      count: state.selectedFoodCount,
    }).then(() => history.push('/orders'))
  };


  useEffect(() => {
    dispatch({ type: foodsActionTypes.FETCHING });
    // foodReducerを上記の条件で実行する。
    fetchFoods(match.params.restaurantsId)
    // 引数はURLから取得して関数を実行してる。
      .then((data) => {
        dispatch({
          type: foodsActionTypes.FETCH_SUCCESS,
          payload: {
            foods: data.foods
          }
          // foodReducerを上記の条件で実行する。
        });
      })
  }, [])

  return (
    <>
      <HeaderWrapper>
        <Link to="/restaurants">
          <MainLogoImage src={MainLogo} alt="main logo" />
        </Link>
        <BagIconWrapper>
          <Link to="/orders">
            <ColoredBagIcon fontSize="large" />
          </Link>
        </BagIconWrapper>
      </HeaderWrapper>
      <FoodsList>
        {
          foodsState.fetchState === REQUEST_STATE.LOADING ?
            <>
              {
                [...Array(12).keys()].map(i =>
                  // 12個の配列を並べてる。それをキーだけにしてる。っていう配列を一つ一つ取り出す。
                  <ItemWrapper key={i}>
                    <Skeleton key={i} variant="rect" width={450} height={180} />
                  </ItemWrapper>
                )
              }
            </>
          :
            foodsState.foodsList.map(food =>
              <ItemWrapper key={food.id}>
                <FoodWrapper
                  food={food}
                  onClickFoodWrapper={
                    (food) => setState({
                      ...state,
                      isOpenOrderDialog: true,
                      selectedFood:food
                    })
                  }
                  imageUrl={FoodImage}
                    //子コンポーネントを作成してるから、FoodWrapperに渡す。
                  />
              </ItemWrapper>
            )
        }
      </FoodsList>
      {
        state.isOpenOrderDialog &&
          <FoodOrderDialog
            isOpen={state.isOpenOrderDialog}
            food={state.selectedFood}
            // onclickされた時に渡ってくる。
            countNumber={state.selectedFoodCount}
            onClickCountUp={() => setState({
              ...state,
              selectedFoodCount: state.selectedFoodCount + 1,
              // このボタンが押された時は、selectedFoodCountだけを1プラスする。
            })}
            onClickCountDown={() => setState({
              ...state,
              selectedFoodCount: state.selectedFoodCount - 1,
              // このボタンが押された時は、selectedFoodCountだけを1マイナスする。
            })}
            // 先ほど作った関数を渡します
            onClickOrder={() => submitOrder()}
            // モーダルを閉じる時はすべてのstateを初期化する
            onClose={() => setState({
              ...state,
              isOpenOrderDialog: false,
              selectedFood: null,
              selectedFoodCount: 1,
            })}
          />
      }
      {
      state.isOpenNewOrderDialog &&
      <NewOrderConfirmDialog
        isOpen={state.isOpenNewOrderDialog}
        onClose={() => setState({ ...state, isOpenNewOrderDialog: false })}
        existingRestaurantName={state.existingRestaurantName}
        newRestaurantName={state.newRestaurantName}
        onClickSubmit={() => replaceOrder()}
      />
    }
    </>
  )
}

