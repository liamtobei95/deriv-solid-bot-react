import { useState, useRef } from 'react';
import useOnClickOutside from './useClickOutside';

import './index.css';

function Dropdown(props) {
    const [select, setSelect] = useState(0);
    const [show, setShow] = useState(false);

    const ref = useRef();
    useOnClickOutside(ref,()=>{setShow(false)})

  return (
        <div>
            <p className='text-white'>{props.label}</p>
            <div className='relative ' ref={ref}>
                <a className='cursor-pointer border-b border-blue-300 text-white flex justify-between' onClick={()=>{setShow(!show)}} >
                    <span>{props.elements[select].name || "none"}</span> 
                    <span className='ml-8'>▼</span>
                </a>

                {
                    show && 
                    <div className='absolute left-0 top-8  bg-white ' >
                        {props.elements.map((item, key) => (
                            <a className='block hover:bg-blue-500 hover:text-white px-4 mt-2' key={key} onClick={()=> {setSelect(key); setShow(false); props.onChange(key)}}>{item.name}</a>
                        ))}
                    </div>
                }
            </div>
        </div>
  );
}

export default Dropdown;

