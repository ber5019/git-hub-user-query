import { useState, useEffect, useRef, Fragment } from 'react';

import NavHeader from './Components/UI/NavHeader/NavHeader';
import UserCard from './Components/UI/UserCard/UserCard';
import PaginationButtons from './Components/UI/Pagination/PaginationButtons';
import ResultsPerPage from './Components/UI/ResultsPerPage/ResultsPerPage';
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
    setCurrentPage(1);
    setSearchInput(searchInputRef.current.value.trim()); // lazy input sanitization
  };

  const handleInputKeyUp = (event) => {
    if (event.key === 'Enter') {
      setCurrentPage(1);
      setSearchInput(searchInputRef.current.value.trim()); // lazy input sanitization
    }
  };

  const onNextPageHandler = () => {
    const maxPages = Math.ceil(totalResults / resultsPerPage);
    if (searchResults.length > 0 && currentPage < maxPages) {
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

  const searchArea =
    searchResults.length > 0 ? (
      <Fragment>
        <div className={classes.SearchDetails}>
          <div>Search Details:</div>
          <div>Total Results: {totalResults}</div>
          <div>
            Page: <em>{currentPage}</em> out of {Math.ceil(totalResults / resultsPerPage)}
          </div>
          <ResultsPerPage
            options={resultsPerPageOptions}
            clicked={onChangeResultsPerPage}
            currentActive={resultsPerPage}
          />
        </div>
        {userDataDisplay}
        <PaginationButtons nextPage={onNextPageHandler} prevPage={onPreviousPageHandler} />
      </Fragment>
    ) : null;
  return (
    <div className={classes.App}>
      <NavHeader />
      <input
        className={classes.SearchInput}
        placeholder="Enter User Search"
        type="text"
        id="search"
        ref={searchInputRef}
        onKeyUp={handleInputKeyUp}
      />
      <button onClick={onSearchHandler}>Search</button>
      {searchArea}
    </div>
  );
}

export default App;
