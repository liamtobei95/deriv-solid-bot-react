import './index.css';

function Button(props) {
  return (
    <button className={`rounded-full  text-white px-5 py-2 text-sm ${props.className}`} onClick={props.onClick}>
        {props.children}
    </button>
  );
}

export default Button;
