import { useState } from 'react';
import { DerivAPIContext } from '../../context/DerivAPIContext';
import { useContext } from 'react';
function Tab() {
    const [tab, setTab] = useState(0);
    const deriv = useContext(DerivAPIContext);
  return (

    <div className='rounded-lg bg-white mt-16 grow flex flex-col'>
        <p className='p-4 bg-gray-200 rounded-t-lg'>Торговая активность</p>
        <div className='p-4 flex flex-col grow'>
            <div className='flex '>
                <a onClick={()=>{setTab(0)}}  className={`cursor-pointer p-4 ${tab == 0? 'border-t-2 rounded-t-lg border-l-2 border-r-2' : 'border-b-2'}  border-gray-200 inline-block grow-none`}>Действия</a>
                <a onClick={()=>{setTab(1)}} className={`cursor-pointer	p-4 ${tab == 1? 'border-t-2 rounded-t-lg border-l-2 border-r-2' : 'border-b-2'}  border-gray-200 inline-block grow-none`}>История P/L</a>
                <div className='p-4 border-b-2 border-gray-200 inline-block grow'></div>
            </div>
            {
                tab == 0 &&
                <div className='overflow-y-scroll grow'>
                    {deriv.notifications.map((elem, idx) => (
                        <div key={idx} dangerouslySetInnerHTML={{__html: elem}}></div>
                    ))}
                </div>
            }

            {
                tab == 1 &&
                <div className='overflow-y-scroll grow'>
                    <div className='bg-black flex justify-around text-white text-center mt-4'>
                        <div className='w-1/6'>Date Time</div>
                        <div className='w-1/6'>Profit</div>
                        <div className='w-1/6'>Return</div>
                        <div className='w-1/6'>Profit(%)</div>
                        <div className='w-1/6'>Modal</div>
                        <div className='w-1/6'>Locking</div>
                    </div>
                    {deriv.table.map((elem, idx) => (
                        <div className='flex justify-around  text-center mt-4'>
                            <div className='w-1/6'>{elem.timestamp}</div>
                            <div className='w-1/6'>{elem.profit}</div>
                            <div className='w-1/6'>{elem.result}</div>
                            <div className='w-1/6'>{elem.pftPercentDisply}(%)</div>
                            <div className='w-1/6'>{elem.crrnmdlxxx}</div>
                            <div className='w-1/6'>{elem.lockingDigit}</div>
                        </div>
                    ))}
                </div>
            }
        </div>
    </div>
  );
}

export default Tab;

