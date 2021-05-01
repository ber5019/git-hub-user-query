import classes from './ResultsPerPage.module.css';

const ResultsPerPage = (props) => {
  let resultsPerPageOptions = props.options;
  let resultsPerPageDisplay = resultsPerPageOptions.map((element) => {
    let buttonClasses = [classes.ResultsPerPageButton];

    if (props.currentActive === element) {
      buttonClasses.push(classes.Active);
    }
    return (
      <button key={element} className={buttonClasses.join(' ')} onClick={() => props.clicked(element)}>
        {element}
      </button>
    );
  });
  return <div>{resultsPerPageDisplay}</div>;
};

export default ResultsPerPage;
