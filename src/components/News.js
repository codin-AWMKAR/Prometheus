import React, { useEffect, useState } from 'react';
import NewComponent from './NewComponent';
import PropTypes from 'prop-types';
import Loading from './Loading';
import InfiniteScroll from 'react-infinite-scroll-component';

const News = (props) => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalResults, setTotalResults] = useState(0);

  
  const updateNews = async () => {
    props.setProgress(10);
    const url = `https://newsapi.org/v2/top-headlines?country=${props.country}&category=${props.category}&apiKey=${props.apiKey}&page=${page}&pageSize=${props.pageSize}`;
    setLoading(true);
    const data = await fetch(url);
    props.setProgress(30);
    const parsedData = await data.json();
    props.setProgress(70);
    setArticles(parsedData.articles);
    setTotalResults(parsedData.totalResults);
    setLoading(false);
    props.setProgress(100);
  };
  useEffect(() => {
    updateNews();
   // eslint-disable-next-line
  }, []);


 

 
  const fetchMoreData = async () => {
    setPage(page + 1);
    const { country, category, pageSize } = props;
    const url = `https://newsapi.org/v2/top-headlines?country=${country}&category=${category}&apiKey=${
      props.apiKey
    }&page=${page + 1}&pageSize=${pageSize}`;
    setLoading(true);
    const data = await fetch(url);
    const parsedData = await data.json();
    setTotalResults(parsedData.totalResults);
    setArticles((prevArticles) => [...prevArticles, ...parsedData.articles]);
    setLoading(false);
  };

  const firstLetterCapitalizer = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  };

  const { category } = props;

  return (
    <>
      <h1 className="text-center" style={{ margin: '35px' , marginTop:"90px"}}>{`Prometheus - Top ${firstLetterCapitalizer(
        category
      )} Headlines`}</h1>
      {loading && <Loading />}
      <InfiniteScroll
        dataLength={articles.length}
        next={fetchMoreData}
        hasMore={articles.length !== totalResults}
        loader={<Loading />}
      >
        <div className="container">
          <div className="row">
            {articles.map((element) => (
              <div className="col-md-4" key={element.url}>
                <NewComponent
                  title={element.title ? element.title.slice(0, 45) : ''}
                  description={element.description ? element.description.slice(0, 80) : ''}
                  imageUrl={
                    element.urlToImage
                      ? element.urlToImage
                      : 'https://icon-library.com/images/no-picture-available-icon/no-picture-available-icon-1.jpg'
                  }
                  newsUrl={element.url}
                  author={element.author}
                  date={element.publishedAt}
                  source={element.source.name}
                />
              </div>
            ))}
          </div>
        </div>
      </InfiniteScroll>
    </>
  );
};

News.defaultProps = {
  country: 'in',
  pageSize: 6,
  category: 'general',
};

News.propTypes = {
  country: PropTypes.string,
  pageSize: PropTypes.number,
};

export default News;
