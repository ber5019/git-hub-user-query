import { useState, useEffect, useRef } from 'react';

function App() {
  const [searchInput, setSearchInput] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasLoaded, setHasLoaded] = useState(true);
  const [resultsPerPage, setResultsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);

  const isInitialMount = useRef(true);

  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
    } else {
      fetchUsers();
    }
  }, [currentPage, resultsPerPage]);

  const inputChangedHandler = (event) => {
    setSearchInput(event.target.value);
  };

  const onSearchHandler = async () => {
    await fetchUsers();
  };

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
      console.log(data.items);
      setSearchResults(data.items);
    } catch (error) {
      console.log(error);
    }

    setHasLoaded(true);
    setIsLoading(false);
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

  if (!isLoading && hasLoaded) {
    userDataDisplay = searchResults.map((userEntry) => {
      return (
        <div key={userEntry.login}>
          <div>
            Username:{' '}
            <a href={userEntry.html_url} target="_blank" rel="noopener noreferrer">
              {userEntry.login}
            </a>
          </div>
          <img src={userEntry.avatar_url} alt={`Avatar`} />
        </div>
      );
    });
  }

  let resultsPerPageOptions = [1, 5, 10, 15, 20, 25];
  let resultsPerPageDisplay = resultsPerPageOptions.map((element) => (
    <button onClick={() => onChangeResultsPerPage(element)}>{element}</button>
  ));

  return (
    <div className="App">
      <input value={searchInput} onChange={inputChangedHandler} />
      <button onClick={onSearchHandler}>Search</button>
      <div>Search Result Count: {searchResults.length}</div>
      <button onClick={onNextPageHandler}>Next Page</button>
      <div>{currentPage}</div>
      <button onClick={onPreviousPageHandler}>Previous Page</button>
      <div>{resultsPerPageDisplay}</div>
      {userDataDisplay}
    </div>
  );
}

export default App;
