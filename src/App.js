import { useState, useEffect, useRef } from 'react';

import UserCard from './Components/UI/UserCard/UserCard';
import classes from './App.module.css';

function App() {
  const [searchInput, setSearchInput] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [resultsPerPage, setResultsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalResults, setTotalResults] = useState(0);
  const searchInputRef = useRef();
  const isInitialMount = useRef(true);

  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
    } else {
      const fetchUsers = async () => {
        setIsLoading(true);
        try {
          const response = await fetch(
            `https://api.github.com/search/users?q=${searchInput}&per_page=${resultsPerPage}&page=${currentPage}`
          );

          if (!response.ok) {
            throw new Error(`the fetch didn't work!`);
          }

          const data = await response.json();
          setTotalResults(data.total_count);
          setSearchResults(data.items);
        } catch (error) {
          console.log(error);
        }
        setIsLoading(false);
      };

      fetchUsers();
    }
  }, [currentPage, resultsPerPage, searchInput]);

  const onSearchHandler = async () => {
    setSearchInput(searchInputRef.current.value);
  };

  const onNextPageHandler = () => {
    if (searchResults.length > 0) {
      setCurrentPage(currentPage + 1);
    }
  };
  const onPreviousPageHandler = () => {
    if (searchResults.length > 0 && currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const onChangeResultsPerPage = (numResultsPerPage) => {
    setResultsPerPage(numResultsPerPage);
  };

  let userDataDisplay = <div>loading...</div>;

  if (!isLoading) {
    userDataDisplay = searchResults.map((userEntry) => {
      return (
        <UserCard
          key={userEntry.login}
          htmlURL={userEntry.html_url}
          userName={userEntry.login}
          avatarURL={userEntry.avatar_url}
        />
      );
    });
  }

  let resultsPerPageOptions = [1, 5, 10, 15, 20, 25];
  let resultsPerPageDisplay = resultsPerPageOptions.map((element) => (
    <button key={element} onClick={() => onChangeResultsPerPage(element)}>
      {element}
    </button>
  ));

  return (
    <div className={classes.App}>
      <input type="text" id="search" ref={searchInputRef} />
      <button onClick={onSearchHandler}>Search</button>
      <div>Search Result Count: {totalResults}</div>
      <button onClick={onNextPageHandler}>Next Page</button>
      <div>{currentPage}</div>
      <button onClick={onPreviousPageHandler}>Previous Page</button>
      <div>{resultsPerPageDisplay}</div>
      {userDataDisplay}
    </div>
  );
}

export default App;
