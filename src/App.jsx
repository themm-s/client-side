import React, { useEffect, useState } from 'react';
import './public/background.css';
import { animateStars, clearStars, initStars } from "./public/background.js";
import avatarImage from './assets/avatar.png';
import './index.css';
import githubIcon from './assets/github.png';
import telegramIcon from './assets/telegram.png';

function App() {
    const [loading, setLoading] = useState(true);
    const [dots, setDots] = useState('');
    const [randomText, setRandomText] = useState('');

    useEffect(() => {
        const texts = [
            'Всем привет! ',
            'Как дела? ',
            'Я крутой? ',
            'aqua.coder? Не, не слышал ',
            'Вы знали, что мы живем в матрице? ',
            'Как называют араба в гробу? - бумбокс ',
        ];
        const randomIndex = Math.floor(Math.random() * texts.length);
        setRandomText(texts[randomIndex]);

        const timer = setTimeout(() => {
            setLoading(false);
            initStars();
            animateStars();
        }, 3000);

        const dotsTimer = setInterval(() => {
            setDots(prevDots => (prevDots.length >= 3 ? '' : prevDots + '.'));
        }, 750);

        return () => {
            clearTimeout(timer);
            clearInterval(dotsTimer);
            clearStars();
        };
    }, []);

    const typeWriter = (element, text) => {
        let currentIndex = 0;
        const speed = 50;
        const interval = setInterval(() => {
            if (currentIndex >= text.length) {
                clearInterval(interval);
            } else {
                element.innerHTML = text.substring(0, currentIndex) + '|';
                currentIndex++;
            }
        }, speed);
    };

    useEffect(() => {
        if (loading) {
            const demoElement = document.getElementById('demo');
            demoElement.innerHTML = '';
            typeWriter(demoElement, randomText);
        }
    }, [randomText, loading]);

    const openGitHubProfile = () => {
        window.location.href = 'https://github.com/ariocp';
    };

    const openTelegramProfile = () => {
        window.location.href = 'https://t.me/ariocp';
    };

    return (
        <div className={`app-container ${loading ? 'loading' : ''}`}>
            <canvas id="canvas"></canvas>
            {loading ? (
                <div className="loading-container">
                    <h1>Loading{dots}</h1>
                    <p id="demo" className="transparent-text"></p>
                </div>
            ) : (
                <div className="avatar-container">
                    <img src={avatarImage} alt="Avatar" className="avatar" />
                    <h1 style={{ fontFamily: 'Arial', fontSize: '32px', color: '#fff', marginTop: '20px' }}>
                        ariocp
                    </h1>
                    <img
                        src={githubIcon}
                        alt="GitHub"
                        className="github-icon github-hover"
                        onClick={openGitHubProfile}
                    />
                    <img
                        src={telegramIcon}
                        alt="Telegram"
                        className="telegram-icon telegram-hover"
                        onClick={openTelegramProfile}
                    />
                </div>
            )}
        </div>
    );
}

export default App;