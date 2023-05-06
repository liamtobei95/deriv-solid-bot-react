import React, {useRef} from 'react';
import useOnClickOutside from './useClickOutside';
import './index.css'

const Modal = (props)=>{
    const ref = useRef();
    useOnClickOutside(ref,props.close)
    return (
        <>
        
        {props.visible && 
            <div className="modal-back" >
            <div className={props.extend == true ? 'modal-custom-extend' :'modal-custom'} ref={ref}>
                {
                    !props.hideHeader &&
                    <div className="modal-header">
                        <div className='modal-title'>
                            {props.title}
                        </div>
                        <div>
                            <a onClick={props.close} className='cursor-pointer'> Закрыть</a>
                            
                        </div>
                    </div>
                }
                
                <div className='term-div' style={{overflowY : 'auto'}}>
                    {props.children}
                </div>
            </div>
        </div>
        }
        </>
        
    )
}

export default Modal;