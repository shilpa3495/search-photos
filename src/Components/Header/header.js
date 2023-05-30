import { useEffect, useState } from "react";
import useDebounced from "../../utils/useDebounced";
import Card from "react-bootstrap/Card";
import "./header.css";
import Button from 'react-bootstrap/Button';
const Header = ({ handleOnChange }) => {
  const [inputValue, setInputValue] = useState("");

  const debouncedSearchTerm = useDebounced(inputValue, 500);
  const getLocalItems = () => {
    let list = localStorage.getItem("Search Values");
    if (list) {
      return JSON.parse(localStorage.getItem("Search Values"));
    } else return [];
  };

  const [items, setItems] = useState(getLocalItems());

  const getInputValue = (e) => {
    setInputValue(e.target.value);
    setItems([...items, inputValue]);
  };

  useEffect(() => {
    localStorage.setItem("Search Values", JSON.stringify(items));
  }, [items]);

  useEffect(() => {
    if (debouncedSearchTerm === "" || debouncedSearchTerm.length >= 2) {
      handleOnChange(debouncedSearchTerm);
    }
  }, [debouncedSearchTerm]);

  const removeLocalItems=()=>{
    localStorage.removeItem("Search Values");
    setItems([])
    setInputValue("")
  }

  return (
    <div className="header-searchbar-container">
      <h2 className="header-searchbar-title">Search Photos</h2>
      <div className="header-searchbar-input-main-container">
        <input
          type="text"
          onChange={getInputValue}
          placeholder={"Search Photos..."}
          value={inputValue}
          name="search"
          className="header-searchbar-input-container"
        />

        {inputValue.length !== 0 && (
          <Card className="header-card-container">
            <Card.Body>
              {items.map((item, index) => (
                <div key={index} onClick={() => setInputValue(item)}>
                  {item}
                </div>
              ))}
              <Button variant="danger" onClick={removeLocalItems}>Clear</Button>
            </Card.Body>

          </Card>
        )}
      </div>
    </div>
  );
};

export default Header;
