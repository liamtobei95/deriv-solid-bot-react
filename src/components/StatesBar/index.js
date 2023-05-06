import { useState } from 'react';
import './index.css';

function StatesBar(props) {
  return (
       <div className='flex justify-between text-center flex-wrap'>
            <div className='p-1 px-8 rounded-lg bg-blue-500 text-white w-1/6'>
                <p>${props.balance}</p>
                <p>Ваш баланс</p>
            </div>

            <div className='p-1 px-8 rounded-lg bg-amber-500 text-white w-1/6'>
                <p>{`$${props.profit} (${props.profitPercent}%)`}</p>
                <p>Прибыль / Убыток</p>
            </div>

            <div className='p-1 px-8 rounded-lg bg-gray-200 flex flex-wrap w-1/6'>
                <div className='w-1/2 text-green-700 px-4'>
                    <p>${props.target}</p>
                    <p>Цель(TP)</p>
                </div>
                <div className='w-1/2 text-red-700 px-4'>
                    <p>-${props.stop}</p>
                    <p>Стоп(SL)</p>
                </div>
            </div>

            <div className='p-1 px-8 rounded-lg bg-red-800 text-white w-1/6'>
                <p>$0.35</p>
                <p>Макс. колебания баланса</p>
            </div>
       </div>
  );
}

export default StatesBar;

