import React, { useEffect, useReducer } from 'react';
import styled from 'styled-components'
import { fetchRestaurants } from '../apis/restaurants';
import { initialState, restaurantsActionTypes, restaurantsReducer } from '../reducers/restaurants';
import { Link } from "react-router-dom";
import { REQUEST_STATE } from '../constants';
import Skeleton from '@material-ui/lab/Skeleton';

import MainLogo from '../images/logo.png';
import MainCoverImage from '../images/main-cover-image.png';
import RestaurantImage from '../images/restaurant-image.jpg';

const HeaderWrapper = styled.div`
  display: flex;
  justify-content: flex-start;
  padding: 8px 32px;
`;

const MainLogoImage = styled.img`
  height: 90px;
`

const MainCoverImageWrapper = styled.div`
  text-align: center;
`;

const MainCover = styled.img`
  height: 600px;
`;

const RestaurantsContentsList = styled.div`
  display: flex;
  justify-content: space-around;
  margin-bottom: 150px;
`;

const RestaurantsContentWrapper = styled.div`
  width: 450px;
  height: 300px;
  padding: 48px;
`;

const RestaurantsImageNode = styled.img`
  width: 100%;
`;

const MainText = styled.p`
  color: black;
  font-size: 18px;
`;

const SubText = styled.p`
  color: black;
  font-size: 12px;
`;

export const Restaurants = () => {
  const [state, dispatch] = useReducer(restaurantsReducer, initialState)
  // initialstateは、fetchState:INITIAL, RESTAURANTSLIST:[]で始まる。

  useEffect(()=>{
    dispatch({type: restaurantsActionTypes.FETCHING });
    // SWITCHでaction.typeで指定してるから、オブジェクトにしてる。
    // fetchStateをLOADINGにしてる。restaurantsListhは空欄のまま
    fetchRestaurants()
    .then((data)=>{
      dispatch({
        type: restaurantsActionTypes.FETCH_SUCCESS,
        payload: {
          restaurants: data.restaurants
        }
        // fetchStateはOKを返して、
        // restaurantsListはレストランのオブジェクトを持った配列を返してる。
      })
      // dispatchは引数を1つしか取れないから、オブジェクトにして2つキーを渡してる。
      // 中身の情報をどんなキーにするかで、payloadがコンテントの意味で慣習的に使われる。
    })
    .catch((e)=>{
      console.log(e)
    })
  }, [])

  return (
    <>
      <HeaderWrapper>
        <MainLogoImage src={MainLogo} alt="main logo" />
      </HeaderWrapper>
      <MainCoverImageWrapper>
        <MainCover src={MainCoverImage} alt="main cover" />
      </MainCoverImageWrapper>
      <RestaurantsContentsList>
        {
          state.fetchState === REQUEST_STATE.LOADING ?
            <>
              <Skeleton variant="rect" width={450} height={300} />
              <Skeleton variant="rect" width={450} height={300} />
              <Skeleton variant="rect" width={450} height={300} />
            </>
            // もし、fetchStateが、LOADINGだった場合は、上を表示する。
            // コンテンツの読み込み中にスケルトンを表示するような表現ができる！！
          :
            state.restaurantsList.map((item, index) =>
              <Link to={`/restaurants/${item.id}/foods`} 
                        key={index} style={{ textDecoration: 'none' }}>
                <RestaurantsContentWrapper>
                  <RestaurantsImageNode src={RestaurantImage} />
                  <MainText>{item.name}</MainText>
                  <SubText>{`配送料：${item.fee}円 ${item.time_required}分`}</SubText>
                </RestaurantsContentWrapper>
              </Link>
            )
            // fetchStateがLOADINGじゃなかった場合は、上を表示する。
            // 配列をそれぞれ1つずつに分割して、リンクタグをつける、その中には
            // イメージの写真と、レストランの名前、配達までの時間と配達料金を載せる。
        }
      </RestaurantsContentsList>
    </>
  )
}

