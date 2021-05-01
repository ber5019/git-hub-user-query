import classes from './PaginationButtons.module.css';

const PaginationButtons = (props) => {
  return <button onClick={props.clicked}>{props.children}</button>;
};

export default PaginationButtons;
