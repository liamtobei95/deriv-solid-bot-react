import { useState } from 'react';
import './index.css';

function SolidHeader() {
  return (
    <div className='flex justify-between p-8 px-32 text-white'>
        <a>На главную</a>
        <div>
            <a className='mx-8'>Инструкции</a>
            <a className='mx-8'>Создать токен</a>
        </div>
        <a className='bg-blue-300 rounded-full p-1 px-2'><img src={require('../../assets/img/vector.png')} className=' inline mr-2 '/>На главную</a>
    </div>
  );
}

export default SolidHeader;

