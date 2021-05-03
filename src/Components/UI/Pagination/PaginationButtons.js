import classes from './PaginationButtons.module.css';

const PaginationButtons = (props) => {
  return (
    <div className={classes.PaginationButtons}>
      <button className={classes.PageButton} onClick={props.prevPage}>
        Previous Page
      </button>
      <button className={classes.PageButton} onClick={props.nextPage}>
        Next Page
      </button>
    </div>
  );
};

export default PaginationButtons;
