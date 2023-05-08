import { useState, useRef } from 'react';
import useOnClickOutside from './useClickOutside';

import './index.css';

function SettingDropdown(props) {
    const [select, setSelect] = useState(props.default || 0);
    const [show, setShow] = useState(false);

    const ref = useRef();
    useOnClickOutside(ref,()=>{setShow(false)})
  return (
        <div>
            <p className='text-black'>{props.label}</p>
            <div className='relative ' ref={ref}>
                <a className='cursor-pointer border border-gray-300 text-black flex justify-between p-2' onClick={()=>{setShow(!show)}} >
                    <span>{props.elements[select].name || "none"}</span> 
                    <span className='ml-8'>▼</span>
                </a>

                {
                    show && 
                    <div className='absolute left-0 top-12 w-full border border-gray-300  bg-white z-10' >
                        {props.elements.map((item, key) => (
                            <a className='block hover:bg-blue-500 hover:text-white px-4 mt-2' key={key} onClick={()=> {setSelect(key); setShow(false)}}>{item.name}</a>
                        ))}
                    </div>
                }
            </div>
        </div>
  );
}

export default SettingDropdown;

