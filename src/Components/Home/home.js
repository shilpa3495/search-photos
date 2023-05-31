import { useEffect, useState } from "react";
import axios from "axios";
import { baseURL, imageUrl, searchUrl } from "../../utils/constants";
import PreviewModal from "./previewModal";
import Image from "react-bootstrap/Image";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import "./home.css";
import Header from "../Header/header";

const Home = () => {
  const [list, setList] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [page, setPage] = useState(1);
  const [searchPage, setSearchPage] = useState(1);
  const [loadMore, setLoadMore] = useState(true);
  const [searchLoadMore, setSearchLoadMore] = useState(true);

  const [searchList, setSearchList] = useState([]);

  const [keyword, setKeyword] = useState("");

  const [previewObject, setPreviewObject] = useState({});

  const handleSearch = (keyword) => {
    setKeyword(keyword);
  };

  const getList = () => {
    axios
      .get(`${baseURL}&page=${page}`)
      .then((response) => {
        setList((prev) => [...prev, ...response?.data?.photos?.photo]);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const getSearchList = async () => {
    axios
      .get(`${searchUrl}&tags=${keyword}&page=${searchPage}`)
      .then((response) => {
        setSearchList((prev) => [...prev, ...response?.data?.photos?.photo]);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleScroll = () => {
    if (
      window.innerHeight + document.documentElement.scrollTop + 1 >=
      document.documentElement.scrollHeight
    ) {
      if (keyword) {
        setSearchPage((page) => page + 1);
        setSearchLoadMore(true);
      } else {
        setPage((page) => page + 1);
        setLoadMore(true);
      }
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [keyword]);

  useEffect(() => {
    getList(page);
    setLoadMore(false);
  }, [page]);

  useEffect(() => {
    if (keyword && searchPage >= 1) {
      getSearchList(keyword, searchPage);
      setSearchLoadMore(false);
      setPage(1);
      setLoadMore(true);
    }
    if (!keyword) {
      setSearchPage(1);
      setSearchList([]);
      setSearchLoadMore(true);
    }
  }, [keyword, searchPage]);

  const previewListImage = (index) => {
    setPreviewObject(list[index]);
    setOpenModal(true);
  };

  const previewSearchListImage = (index) => {
    setPreviewObject(searchList[index]);
    setOpenModal(true);
  };

  const handleClose = () => {
    setOpenModal(false);
  };

  if (!list && searchList?.length === 0) return <div>No Photo</div>;

  return (
    <Container>
      <Header handleOnChange={handleSearch} />
      <Row className="home-row">
        {keyword?.length === 0 ? (
          <>
            {list.length !== 0 ? (
              list?.map(({ server, secret, id }, index) => (
                <Col sm={4} key={index}>
                  <Image
                    src={
                      server
                        ? `${imageUrl}${server}/${id}_${secret}.jpg`
                        : "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRKFSgdhQvBlZO6I8s-jtKIYOED1NqEs4xEjA&usqp=CAU"
                    }
                    fluid
                    onClick={() => previewListImage(index)}
                    alt="no photo"
                  />
                </Col>
              ))
            ) : (
              <p>No photos</p>
            )}

            {loadMore && <p>Loading data</p>}
          </>
        ) : (
          <>
            {searchList.length !== 0 ? (
              searchList?.map(({ server, secret, id }, index) => {
                return (
                  <Col sm={4} key={index}>
                    <Image
                      src={
                        server
                          ? `${imageUrl}${server}/${id}_${secret}.jpg`
                          : "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRKFSgdhQvBlZO6I8s-jtKIYOED1NqEs4xEjA&usqp=CAU"
                      }
                      fluid
                      onClick={() => previewSearchListImage(index)}
                      alt="no photo"
                    />
                  </Col>
                );
              })
            ) : (
              <p>No search photos</p>
            )}
            {searchLoadMore && <p>Loading data</p>}
          </>
        )}

        <PreviewModal
          show={openModal}
          close={handleClose}
          item={previewObject}
        />
      </Row>
    </Container>
  );
};

export default Home;
