import { useState, useEffect, useRef, FC, MouseEvent, AnimationEvent } from 'react';
import './About.css';
import { useTranslation } from 'react-i18next';
import myPhoto from './assets/myPhoto.png';
import inf from './assets/infinity.png';
import code from './assets/code.png';
import diagram from './assets/diagram.png';
import { motion, AnimatePresence } from 'framer-motion';
import lamp from './assets/lamp.png';
import github from './assets/github.png';
import instagram from './assets/instagram.png';
import telegram from './assets/telegram.png';
import linkedin from './assets/linkedin.png';
import email from './assets/email.png';
import { useNavigate } from 'react-router-dom';
import Copyright from '../../copyright/Copyright';
import { PageProps, TiltState, CellProps } from '../../../types';

interface AboutProps extends PageProps {}

interface FactsProps {
    showDescriptions: boolean;
    t: (key: string) => string;
}

interface RoundButtonProps {
    img: string;
    tooltipText: string;
    element: string;
    href?: string;
}

export default function About({ media, theme }: AboutProps): JSX.Element {
    const { t, i18n } = useTranslation();
    const [tilt, setTilt] = useState<TiltState>({ x: 0, y: 0, scale: 1 });
    const [showDescriptions, setShowDescriptions] = useState<boolean>(false);
    const brieflyRef = useRef<HTMLDivElement>(null);
    const [isVisible, setIsVisible] = useState<boolean>(false);
    const buttonRef = useRef<HTMLButtonElement>(null);
    const [butIsVisible, setButIsVisible] = useState<boolean>(false);
    const [animEnd, setAnimEnd] = useState<boolean>(false);

    const handleAnimationEnd = (e: AnimationEvent<HTMLDivElement>): void => {
        e.currentTarget.style.transform = 'scale(1)';
        e.currentTarget.style.opacity = '1';

        setAnimEnd(true);
    };

    const handleMouseMove = (e: MouseEvent<HTMLDivElement>): void => {
        const { clientX, clientY } = e;
        const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
        const x = (clientX - left - width / 2) / width * -20;
        const y = (clientY - top - height / 2) / height * 20;

        setTilt({ x, y, scale: 1.05 });
    };

    const handleMouseLeave = (): void => {
        setTilt({ x: 0, y: 0, scale: 1 });
    };

    function handleClickForDescription(): void {
        setShowDescriptions(!showDescriptions);
    }

    useEffect(() => {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    if (entry.target === brieflyRef.current) {
                        setIsVisible(true);
                        observer.unobserve(entry.target);
                    }
                    if (entry.target === buttonRef.current) {
                        setButIsVisible(true);
                        observer.unobserve(entry.target);
                    }
                }
            });
        }, { threshold: 0.3 });

        if (brieflyRef.current) {
            observer.observe(brieflyRef.current);
        }
        if (buttonRef.current) {
            observer.observe(buttonRef.current);
        }

        return () => {
            if (brieflyRef.current) {
                observer.unobserve(brieflyRef.current);
            }
            if (buttonRef.current) {
                observer.unobserve(buttonRef.current);
            }
        };
    }, []);

    return (
        <div className={`about ${theme === 'light' ? 'light-theme' : ''}`}>
            <div className='about-left'>
                <div className='aboutMe'>{t('aboutMe')}</div>
                <div ref={brieflyRef} className={`aboutMe-briefly ${isVisible ? 'visible' : ''}`}>
                    {i18n.language === 'ru' ?
                        <>
                            Я инженер-программист. Занимаюсь <span>frontend разработкой</span>.
                            Двигаюсь в сторону <span>fullstack</span> разработки.
                        </>
                    :
                        <>
                            I'm a software engineer. I specialize in <span>frontend development</span>.
                            I'm moving towards <span>fullstack</span> development.
                        </>
                    }
                </div>
                <div className='aboutMe-facts'>
                    <Facts showDescriptions={showDescriptions} t={t} />
                </div>
                <button ref={buttonRef} className={`${butIsVisible ? 'visible' : ''}`} onClick={handleClickForDescription}>{showDescriptions ? t('aboutComponent.buttonHideFacts') : t('aboutComponent.buttonMoreFacts')}</button>
            </div>
            <div className='about-right' style={{transform: `${media === 'desktop' ? 'translateX(10%)' : 'translateX(0)'}`}}>
                <div className='photo-container' onAnimationEnd={handleAnimationEnd}>
                    <div className='photo'
                      onMouseMove={handleMouseMove}
                      onMouseLeave={handleMouseLeave}
                      style={animEnd ? 
                        {
                          transform: `perspective(500px) rotateX(${tilt.y}deg) rotateY(${tilt.x}deg) scale(${tilt.scale})`,
                          transition: 'transform .3s ease-out'
                        } :
                         undefined}>
                        <img src={myPhoto} alt="my photo" />
                    </div>
                </div>
                <div className='round-buttons'>
                    <RoundButton img={github} tooltipText='GitHub' element='el-1' href='https://github.com/vladilyinoff/' />
                    <RoundButton img={instagram} tooltipText='Instagram' element='el-2' href='https://www.instagram.com/vladilyinoff/' />
                    <RoundButton img={telegram} tooltipText='Telegram' element='el-3' href='https://t.me/worldhacker' />
                    <RoundButton img={linkedin} tooltipText='LinkedIn' element='el-4' />
                    <RoundButton img={email} tooltipText='Email' element='el-5' href='mailto:vladjsx.it@gmail.com' />
                </div>
                <Copyright />
            </div>
        </div>
    );
}


function Facts({ showDescriptions, t }: FactsProps): JSX.Element {
    return (
        <>
            <div className='line'>
                <Cell img={inf} label={t('aboutComponent.facts.cell-1lb')} description={t('aboutComponent.facts.cell-1dc')} showDescriptions={showDescriptions} pos="l" />
                <Cell img={code} label={t('aboutComponent.facts.cell-2lb')} description={t('aboutComponent.facts.cell-2dc')} showDescriptions={showDescriptions} pos="r" />
            </div>
            <div className='line'>
                <Cell img={lamp} label={t('aboutComponent.facts.cell-3lb')} description={t('aboutComponent.facts.cell-3dc')} showDescriptions={showDescriptions} pos="l" />
                <Cell img={diagram} label={t('aboutComponent.facts.cell-4lb')} description={t('aboutComponent.facts.cell-4dc')} showDescriptions={showDescriptions} pos="r" />
            </div>
        </>
    );
}


function Cell({ img, label, description, showDescriptions, pos }: CellProps): JSX.Element {
    const cellRef = useRef<HTMLDivElement>(null);
    const [isVisible, setIsVisible] = useState<boolean>(false);

    useEffect(() => {
        const observer = new IntersectionObserver(([entry]) => {
            if (entry.isIntersecting) {
                setIsVisible(true);
                observer.unobserve(entry.target);
            }
        }, {
            threshold: 0.3
        });

        if (cellRef.current) {
            observer.observe(cellRef.current);
        }

        return () => {
            if (cellRef.current) {
                observer.unobserve(cellRef.current);
            }
        };
    }, []);

    return (
        <div ref={cellRef} className={`cell ${pos === 'l' ? 'left' : 'right'} ${isVisible ? 'visible' : ''}`}>
            <img src={img} alt='inf' />
            <p className='cell-label'>
                {label}
            </p>
            <AnimatePresence initial={false}>
            {showDescriptions && (
                <motion.p
                    className='cell-description'
                    initial={{ height: 0}}
                    animate={{ height: 'auto'}}
                    exit={{ height: 0}}
                    transition={{ duration: 0.4 }}
                >
                    {description}
                </motion.p>)}
            </AnimatePresence>
        </div>
    );
}


function RoundButton({ img, tooltipText, element, href }: RoundButtonProps): JSX.Element {
    const navigate = useNavigate();

    function handleClick(): void {
        if (tooltipText === 'LinkedIn') {
            // Do nothing
        } else if (tooltipText === 'Email') {
            navigate('/contacts');
        } else if (href) {
            window.open(href, '_blank');
        }
    }

    return (
        <div className={`round-button ${element}`} onClick={handleClick}>
            <img src={img} alt={tooltipText} />
            <span className='tooltip'>{tooltipText}</span>
        </div>
    );
}

