import { useContext, useEffect, useState } from 'react';
import SolidHeader from '../../components/SolidHeader';
import './index.css';
import StatesBar from '../../components/StatesBar';
import Dropdown from '../../components/Dropdown';
import Tab from '../../components/Tab';
import Modal from '../../components/modal';
import SettingDropdown from '../../components/SettingDropodown';
import { DerivAPIContext } from '../../context/DerivAPIContext';


const array1 = ["Only Rise1", "Only Rise2", "Only Rise3", "Only Rise4", "Only Rise5"];
const volatility = [
    {name: "Volatility 10 (1s) Index", value: "1HZ10V"},
    {name: "Volatility 25 (1s) Index", value: "1HZ25V"},
    {name: "Volatility 50 (1s) Index", value: "1HZ50V"},
    {name: "Volatility 75 (1s) Index", value: "1HZ75V"},
    {name: "Volatility 100 (1s) Index", value: "1HZ100V"},
    {name: "Jump 10 Index", value: "JD10"},
    {name: "Jump 25 Index", value: "JD25"},
    {name: "Jump 50 Index", value: "JD50"},
    {name: "Jump 75 Index", value: "JD75"},
    {name: "Jump 100 Index", value: "JD100"},
    {name: "Volatility 10 Index", value: "R_10"},
    {name: "Volatility 25 Index", value: "R_25"},
    {name: "Volatility 50 Index", value: "R_50"},
    {name: "Volatility 75 Index", value: "R_75"},
    {name: "Volatility 100 Index", value: "R_100"},
]

const mode = [
    {name: "Digit Over", value: "Digit Over"},
    {name: "Digit Under", value: "Digit Under"},
    {name: "Higher", value: "Higher"},
    {name: "Lower", value: "Lower"},
    {name: "Digit ODD", value: "Digit Odd"},
    {name: "Digit EVEN", value: "Digit Even"},
    {name: "Only Rise", value: "Rise"},
    {name: "Only Fall", value: "Fall"},
    {name: "Digit Differs", value: "Digit Differs"},

]

const tick = [
    {name: "1 Tick", value: "1"},
    {name: "2 Tick", value: "2"},
    {name: "3 Tick", value: "3"},
    {name: "4 Tick", value: "4"},
    {name: "5 Tick", value: "5"},
    {name: "6 Tick", value: "6"},
    {name: "7 Tick", value: "7"},
    {name: "8 Tick", value: "8"},
    {name: "9 Tick", value: "9"},
    {name: "10 Tick", value: "10"},

]
function Solid() {
    const [settingModal, setSettingModal] = useState(false);
    const [confirmModal, setConfirmModal] = useState(false);
    const [tempSetting, setTempSetting] = useState({
        paramTradeKind: "Digit Over",
        currentMarket: "R_25",
        paramTickKind: "1",
        currentModal: "0.35",
        currentTargetProfit: "35",
        currentStopLoss: "10"
    })
    const [setting, setSetting] = useState({
        paramTradeKind: "Digit Over",
        currentMarket: "R_25",
        paramTickKind: "1",
        currentModal: "0.35",
        currentTargetProfit: "35",
        currentStopLoss: "10"
    })
    const deriv = useContext(DerivAPIContext);


    useEffect(()=>{
        console.log(setting);
    }, [setting])
  return (
    <div className="App  px-16 flex flex-col">
        <div>
            <SolidHeader />
        </div>
        <div>
            <StatesBar balance = {deriv.info.balance} target = {setting.currentTargetProfit} stop = {setting.currentStopLoss} profit = {deriv.info.profit} profitPercent = {deriv.info.profitPercent} ModalTracking = {deriv.info.ModalTracking}  />
        </div>
        <div className='flex justify-between mt-16'>
            <div className='w-1/6 '>
                <Dropdown default = {8} onChange = {(idx) => {setSetting(prev => ({...prev, paramTradeKind: mode[idx].value}))}} label = "Режим торговли" elements = {mode} />
            </div>

            <div className='w-1/6 '>
                <Dropdown default = {11} onChange = {(idx) => {setSetting(prev => ({...prev, currentMarket: volatility[idx].value}))}} label = "Режим торговли" elements = {volatility} />
            </div>

            <div className='w-1/6 '>
                <Dropdown default = {0} onChange = {(idx) => {setSetting(prev => ({...prev, paramTickKind: tick[idx].value}))}} label = "Режим торговли" elements = {tick} />
            </div>

            <div className='w-1/6 '>
                <Dropdown label = "Режим торговли" elements = {array1} />
            </div>
        </div>

        <div className='flex justify-center mt-16'>
            <button onClick={()=>{setSettingModal(true)}} className='flex items-center rounded-lg bg-indigo-600 p-2 px-4 text-white mx-4'> <img src={require('../../assets/img/setting.png')} className='inline mr-2'/>НАСТРОЙКИ</button>
            {
                deriv.info.isStarted && 
                <button onClick={()=>{deriv.pauseTrade()}} className='flex items-center rounded-lg bg-red-400 p-2 px-4 text-white mx-4'>  <img src={require('../../assets/img/pause.png')} className='inline mr-2'/> ОСТАНОВИТЬ</button>
            }
            {
                !deriv.info.isStarted && 
                <button onClick={()=>{deriv.startTrade()}} className='flex items-center rounded-lg bg-green-400 p-2 px-4 text-white mx-4'>  <img src={require('../../assets/img/next.png')} className='inline mr-2'/> ЗАПУСТИТЬ</button>
            }
        
        </div>

        
        <Tab />
       
        <div className='text-white mt-4'>
            <p>Disclamer</p>
            Deriv предлагает сложные производные инструменты, такие как опционы и контракты на разницу («CFD»). Эти продукты могут подходить не для всех клиентов, и торговля ими подвергает вас риску. Пожалуйста, убедитесь, что вы понимаете следующие риски, прежде чем торговать продуктами Deriv: а) вы можете потерять часть или все деньги, которые вы вложили в сделку, б) если ваша сделка включает конвертацию валюты, обменные курсы повлияют на вашу прибыль или убыток. Вы никогда не должны торговать на заемные деньги или на деньги, которые вы не можете позволить себе потерять.
        </div>


        <Modal visible = {settingModal} close = {() => setSettingModal(false)} extend={true}>
            <div className='text-lg px-2'>
                <p>Начальная ставка ($) :</p>
                <input className='w-full border border-gray-500s p-2' type='number' value={tempSetting.currentModal} onChange={(e) => {setTempSetting(prev => ({...prev, currentModal: e.target.value}))}}/>
                <p className='mt-4'>Цель - Take Profit ($) :</p>
                <input className='w-full border border-gray-500s p-2'type='number' value={tempSetting.currentTargetProfit} onChange={(e) => {setTempSetting(prev => ({...prev, currentTargetProfit: e.target.value}))}}/>
                <p className='mt-4'>Стоп - Stop Loss ($) :</p>
                <input className='w-full border border-gray-500s p-2' type='number' value={tempSetting.currentStopLoss} onChange={(e) => {setTempSetting(prev => ({...prev, currentStopLoss: e.target.value}))}}/>
                <div className='mt-4'><SettingDropdown default = {11} onChange = {(idx) => {setTempSetting(prev => ({...prev, currentMarket: volatility[idx].value}))}}  label="Рынок :" elements = {volatility}/></div>
                <div className='mt-4'><SettingDropdown default = {8} onChange = {(idx) => {setTempSetting(prev => ({...prev, paramTradeKind: mode[idx].value}))}}  label="Режим торговли :" elements = {mode}/></div>
                <div className='mt-4'><SettingDropdown onChange = {(idx) => {setTempSetting(prev => ({...prev, paramTickKind: tick[idx].value}))}} label="Продолжительность :" elements = {tick}/></div>

                <button onClick={() => {
                    setSettingModal(false);
                    setSetting(tempSetting); 
                    setConfirmModal(true);
                    }} className='rounded-lg w-full text-white p-2 bg-blue-500 my-4'>СОХРАНИТЬ</button>
            </div> 
        </Modal>

        <Modal visible = {confirmModal} close = {() => setConfirmModal(false)} hideHeader = {true}>
            <div className='flex flex-col items-center flex-wrap'>
                <img src={require('../../assets/img/confirm.png')} className='m-4'/>
                <p className='text-3xl m-4'>Настройки</p>
                <p>Ваши настройки сохранены!</p>
                <button onClick={() => setConfirmModal(false)} className='text-white p-4 bg-blue-500 my-4 px-8 rounded-lg'>OK</button>
            </div>
        </Modal>
    </div>
  );
}

export default Solid;

