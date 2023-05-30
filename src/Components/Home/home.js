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
  const [openModal, setOpenModal] = useState({ isOpenModal: false });
  const [page, setPage] = useState(1);
  const [loadMore, setLoadMore] = useState(true);

  const [searchList, setSearchList] = useState(null);

  const [keyword, setKeyword] = useState("");
  const [error, setError] = useState("");

  const handleSearch = (keyword) => {
    setKeyword(keyword);
  };

  useEffect(() => {
    getSearchList(keyword);
  }, [keyword]);

  useEffect(() => {
    getList(page);
    setLoadMore(false);
  }, [page]);

  const handleScroll = () => {
    if (
      window.innerHeight + document.documentElement.scrollTop + 1 >=
      document.documentElement.scrollHeight
    ) {
      setPage((page) => page + 1);
      setLoadMore(true);
    }
  };

  const getList = () => {
    axios
      .get(`${baseURL}&page=${page}`)
      .then((response) => {
        setList((prev) => [...prev, ...response?.data?.photos?.photo]);
      })
      .catch((error) => {
        setError(error);
      });
  };

  const getSearchList = () => {
    axios
      .get(`${searchUrl}&tags=${keyword}`)
      .then((response) => {
        setSearchList(response?.data?.photos?.photo);
      })
      .catch((error) => {
        setError(error);
      });
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const previewImage = (index) => {
    setOpenModal({ ...openModal, isOpenModal: true, imageIndex: index });
  };

  const handleClose = () => {
    setOpenModal({ ...openModal, isOpenModal: false });
  };

  if (error) return `Error: ${error.message}`;

  if (!list) return "No post!";

  return (
    <Container>
      <Header handleOnChange={handleSearch} />
      <Row className="home-row">
        {searchList?.length === 0 || searchList === undefined
          ? list?.map(({ server, secret, id }, index) => (
              <Col sm={4}>
                <Image
                  src={`${imageUrl}${server}/${id}_${secret}.jpg`}
                  fluid
                  onClick={() => previewImage(index)}
                  alt="no photo"
                  key={id}
                />
              </Col>
            ))
          : searchList?.map(({ server, secret, id }, index) => (
              <Col sm={4}>
                <Image
                  src={`${imageUrl}${server}/${id}_${secret}.jpg`}
                  fluid
                  onClick={() => previewImage(index)}
                  alt="no photo"
                  key={id}
                />
              </Col>
            ))}

        <PreviewModal
          show={openModal.isOpenModal}
          close={handleClose}
          item={list[openModal?.imageIndex]}
        />
      </Row>
      {loadMore && <p>loadmore data</p>}
    </Container>
  );
};

export default Home;
