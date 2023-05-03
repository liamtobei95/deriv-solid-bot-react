import './index.css';

function Home() {

  return (
    <div className="App flex">
        <div className='w-1/4 text-center text-white'>
            
            
            <div className='text-left flex items-center flex-col'>
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
                <div className='grow'>a</div>
                <div>
                    <div className='my-2'><img src={require('../../assets/img/logout.png')} className=' inline mr-2'/><span>Выход</span></div>
                    <div className='my-2'><img src={require('../../assets/img/back.png')} className='inline mr-2'/><span>Скрыть</span></div>
                </div>
            </div>
        </div>
        <div className='grow bg-white'></div>
    </div>
  );
}

export default Home;
