import React, { Fragment, useCallback, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Loading } from "../components/common";
import { MovieCard, MainBanner } from "../components/movieList";
import { GridWrapper } from "../components/movieList/MovieCard.style";
import { getLikeList } from "../store/modules/like";
import { getMovieList, getMainBanner } from "../store/modules/movie";
import useLoading from "../hooks/useLoading";
import { Row } from "antd";

const listType = {
  trend: "trending/movie/week",
  latest: "movie/now_playing",
  rated: "movie/top_rated",
};

function Home({ match }) {
  const dispatch = useDispatch();
  let type = match.params.type;
  type = type ? type : "trend";
  const { moviesSuccess, result: movieList } = useSelector((state) => state.movie.movies);
  const { bannerSuccess, result: mainMovie } = useSelector((state) => state.movie.mainBanner);
  const isLoading = useSelector((state) => state.loading.isLoading);
  const likeList = useSelector((state) => state.like.likeList.result);
  const likeMovieIdList = likeList.map((movie) => movie.id);

  const loadHomeData = useCallback(async () => {
    dispatch(await getMovieList(listType[type]));
    dispatch(await getMainBanner(listType[type]));
  }, [type]);

  useLoading(loadHomeData);

  useEffect(() => {
    return () => {
      dispatch(getLikeList());
    };
  }, []);

  return (
    <Fragment>
      {!isLoading && moviesSuccess && bannerSuccess ? (
        <Fragment>
          <MainBanner mainMovie={mainMovie} />
          <GridWrapper>
            <Row gutter={[20, 30]}>
              {movieList.map((movie) => (
                <MovieCard //
                  key={movie.id}
                  movieId={movie.id}
                  title={movie.title}
                  rate={movie.vote_average}
                  poster={movie.poster_path ? movie.poster_path : null}
                  liked={likeMovieIdList.includes(movie.id)}
                />
              ))}
            </Row>
          </GridWrapper>
        </Fragment>
      ) : (
        <Loading />
      )}
    </Fragment>
  );
}

export default React.memo(Home);
