import './index.css';
import Button from '../../components/Button';
import Modal from '../../components/modal';
import {NotificationContainer, NotificationManager} from 'react-notifications';
import { useState } from 'react';

function Login() {
    const [OAuthModal, setOAuthModal] = useState(false);
    const createNotification = (type) => {
        return () => {
            
            switch (type) {
              case 'info':
                NotificationManager.info('Info message');
                break;
              case 'success':
                NotificationManager.success('Success message', 'Title here');
                break;
              case 'warning':
                NotificationManager.warning('Warning.', 'Please enter valid token', 3000);
                break;
              case 'error':
                NotificationManager.error('Error message', 'Click me!', 5000, () => {
                  alert('callback');
                });
                break;
            }
          };
    }
  return (
    <div className="App flex justify-center	items-center">
        <div className='w-1/2 bg-white rounded-lg'>
            <div className='flex'>
                <div className='w-1/2 p-8 text-center flex flex-col'>
                    <h1>Нажмите, чтобы начать автоматический трейдинг</h1>
                    <div className='grow flex items-center justify-center'>
                        <img src={require('../../assets/img/freelancer.png')} />
                    </div>
                    <p className='my-2'>Бесплатные автоматизированные торговые боты для Deriv.com Нажмите здесь, чтобы начать</p>
                    <Button className='bg-red-900 w-full'  >НЕТ ТОКЕНА? СОЗДАТЬ АККАУНТ</Button>
                </div>
                <div className='w-1/2 p-8 text-center'>
                    <img src={require('../../assets/img/Logo.png')} className='m-auto'/>
                    <div className='flex justify-center my-8'>
                        <img src={require('../../assets/img/youtube.png')}  className='m-2'/>
                        <img src={require('../../assets/img/telegram.png')} className='m-2'/>
                    </div>

                    <p>Авторизоваться через аккаунт</p>
                    <button className='rounded-lg bg-black  px-5 py-2 w-full' onClick = {()=>{setOAuthModal(true)}}>
                        <img src={require('../../assets/img/buttonlogo.png')}  className='m-2'/>
                    </button>

                    <p className='my-8'>ИЛИ</p>

                    <p className='text-left'>Ввести API токен</p>
                    <input className='bg-slate-200 w-full mb-2 hover:outline-0	focus:outline-0 border-b-2 border-black p-2'/>
                    <Button className='bg-black w-full' onClick ={createNotification('warning')}>ВОЙТИ</Button>
                
                </div>

            </div>

        </div>
        <NotificationContainer/>
        <Modal visible = {OAuthModal} close = {() => setOAuthModal(false)} >
            <p className='text-2xl'>Уже есть аккаунт?</p>
            <p className='my-4'>У вас имеется существующий аккаунт в Deriv.com?</p>
            <div className='flex items-center'>
                <input type='checkbox' className='mr-4'/>
                <span>Больше не показывать это сообщение</span>
            </div>
            <div className='flex justify-center mt-4'>
                <Button className='bg-red-900 w-2/5 mx-4' onClick ={createNotification('warning')}>НЕТ, СОЗДАТЬ АККАУНТ</Button>
                <Button className='bg-black w-2/5 mx-4' onClick ={createNotification('warning')}>ДА, АВТОРИЗОВАТЬСЯ</Button>
            </div>
        </Modal>
    </div>
  );
}

export default Login;
