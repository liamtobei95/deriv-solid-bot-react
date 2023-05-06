import { useState, useContext, useEffect } from 'react';
import {useHistory} from "react-router-dom"
import Button from '../../components/Button';
import Modal from '../../components/modal';
import {DerivAPIContext} from '../../context/DerivAPIContext';
import './index.css';

function Home() {
    const [logOutModal, setLogOutModal] = useState(false);
    const deriv = useContext(DerivAPIContext);
    const history = useHistory();
    useEffect(()=>{
        if(!deriv.info.isAuthorized)
            history.push('/login')
    },[deriv.info.isAuthorized])
  return (
    <div className="App flex ">
        <div className='w-1/5 flex-none text-center text-white h-screen  bg-customBlack'>
            
            
            <div className=' text-left flex items-center flex-col h-full'>
                <div>
                    <img src={require('../../assets/img/homelogo.png')} className=' my-8 mx-auto'/>
                    <p className='mt-24'>В Ы Б Р А Т Ь А К К А У Н Т</p>
                    <div className='my-2'><span className='px-2.5 bg-white mr-2'></span><span>VRTC7099432 - USD</span></div>
                    <div className='my-2'><span className='px-2.5 bg-white mr-2'></span><span>CR1123121 - USD</span></div>

                    <p className='mt-16'>В Ы Б Р А Т Ь Я З Ы К</p>
                    <div className='my-2'><img src={require('../../assets/img/russia_flag.png')} className=' inline mr-2'/><span>Русский</span></div>
                    <div className='my-2'><img src={require('../../assets/img/uzbekistan_flag.png')} className='inline mr-2'/><span>O’zbek</span></div>
                
                    <p className='mt-16'>П О Д Д Е Р Ж К А</p>
                    <div className='my-2'><img src={require('../../assets/img/telegram_grey.png')} className=' inline mr-2'/><span>Telegram</span></div>
                    <div className='my-2'><img src={require('../../assets/img/youtube_grey.png')} className='inline mr-2'/><span>Youtube</span></div>
                </div> 
                <div className='grow'></div>
                <div className='w-full px-24'>
                    <div className='my-2'>
                        <button onClick={()=>setLogOutModal(true)}>
                            <img src={require('../../assets/img/logout.png')} className=' inline mr-2'/><span>Выход</span>
                        </button>
                    </div>
                    <div className='my-2'><img src={require('../../assets/img/back.png')} className='inline mr-2'/><span>Скрыть</span></div>
                </div>
            </div>
        </div>
        <div className='grow bg-white p-24'>

            <div className='rounded-lg bg-customBlack flex justify-between text-white p-4 items-center'>
                <div>
                    <p>{deriv.info.loginid}<span className='rounded-lg bg-green-700 px-4 ml-2'>Реальный</span></p>
                    <p className='text-xl'>{deriv.info.balance} USD</p>
                </div>
                <div className=''>
                    {deriv.info.email}
                </div>
            </div>

            <a onClick={() => {history.push('/solid')}} className='rounded-lg bg-green-600 flex justify-between text-white p-8 items-center mt-16'>
                <p className='text-xl'>#1 БОТ НА БИНАРНЫЕ ОПЦИОНЫ, ВАЛЮТЫ И СЫРЬЁ</p>
                <span className='rounded-lg bg-red-600 px-4 ml-2'>ЗАПУСТИТЬ</span>
            </a>

            <div className='rounded-lg bg-gray-200 text-violet-600	 p-40 items-center mt-16 text-center'>
                <p className='text-xl'>Это блок для видео из Youtube.Здесь будет размещено видео “Как это работает....”</p>
            </div>

            <div className='rounded-lg bg-gray-200 text-violet-600	 p-12 items-center mt-16 text-center'>
                <p className='text-xl'>Это блок для следующего бота. Необходимо обеспечить возможность добавлять такие блоки далее вниз</p>
            </div>

            <div className='mt-12'>
                <p>Disclamer</p> Deriv предлагает сложные производные инструменты, такие как опционы и контракты на разницу («CFD»). Эти продукты могут подходить не для всех клиентов, и торговля ими подвергает вас риску. Пожалуйста, убедитесь, что вы понимаете следующие риски, прежде чем торговать продуктами Deriv: а) вы можете потерять часть или все деньги, которые вы вложили в сделку, б) если ваша сделка включает конвертацию валюты, обменные курсы повлияют на вашу прибыль или убыток. Вы никогда не должны торговать на заемные деньги или на деньги, которые вы не можете позволить себе потерять.

            </div>
        </div>
        <Modal visible = {logOutModal} close = {() => setLogOutModal(false)} >
            <p className='text-2xl'>Вы уверены, что хотите выйти?</p>
            <p className='my-4'>При этом будут удалены все настройки и токен, вы будете перенаправлены на страницу входа</p>
            
            <div className='flex justify-center mt-4'>
                <Button className='bg-red-900 w-2/5 mx-4' onClick ={()=>{
                    setLogOutModal(false);
                    deriv.logout();
                }}>ДА</Button>
                <Button className='bg-black w-2/5 mx-4' onClick ={()=>setLogOutModal(false)}>НЕТ</Button>
            </div>
        </Modal>
    </div>
  );
}

export default Home;

