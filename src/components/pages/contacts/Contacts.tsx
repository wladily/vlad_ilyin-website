import { useState, useRef, useEffect, FormEvent, ChangeEvent } from 'react';
import './Contacts.css';
import { useTranslation } from 'react-i18next';
import emailjs from 'emailjs-com';
import paperPlane from './assets/paper-plane.png';
import instagram from './assets/instagram.png';
import telegram from './assets/telegram.png';
import github from './assets/github.png';
import Copyright from '../../copyright/Copyright';

interface FormData {
    name: string;
    email: string;
    message: string;
}

export default function Contacts(): JSX.Element {
    const { i18n, t } = useTranslation();
    const buttonsRef = useRef<HTMLDivElement>(null);
    const [visible, setIsVisible] = useState<boolean>(false);

    const word = i18n.language === 'ru' ? 'Контакты' : 'Contacts';

    useEffect(() => {
        const observer = new IntersectionObserver(([entry]) => {
            if (entry.isIntersecting) {
                setIsVisible(true);
                observer.unobserve(entry.target);
            }
        }, { threshold: .5 });

        if (buttonsRef.current) {
            observer.observe(buttonsRef.current);
        }

        return () => {
            if (buttonsRef.current) {
                observer.unobserve(buttonsRef.current);
            }
        };
    }, []);

    return (
        <div className='contacts'>
            <div className='myContacts'>
                {word.split('').map((letter, index) => (
                    <div key={index} style={
                        {
                            animation: 'symbolConShowUp .5s ease forwards',
                            animationDelay: `${.3 + index * .1}s`,
                            transform: `translateY(${index % 2 === 0 ? '50%' : '-50%'})`,
                            opacity: '0'
                        }
                    }>
                        {letter}
                    </div>
                ))}
            </div>
            <div className='contacts-content'>
                <Form />
                <div className='text-for-form'>
                    {t('contactsComponent.textForForm-1')} <span className='email-address' onClick={() => {window.location.href = 'mailto:vladjsx.it@gmail.com'}}>vladjsx.it@gmail.com</span>, {t('contactsComponent.textForForm-2')}
                </div>
            </div>
            <div ref={buttonsRef} className={`buttons-contacts ${visible ? 'visible' : ''}`}>
                <div onClick={() => {window.open('https://github.com/vladilyinoff/', '_blank')}}>
                    <img src={github} alt="github" />
                    <span>GitHub</span>
                </div>
                <div onClick={() => {window.open('https://t.me/worldhacker', '_blank')}}>
                    <img src={telegram} alt="telegram" />
                    <span>Telegram</span>
                </div>
                <div onClick={() => {window.open('https://www.instagram.com/vladilyinoff/')}}>
                    <img src={instagram} alt="instagram" />
                    <span>Instagram</span>
                </div>
            </div>
            <div style={{display: 'flex', justifyContent: 'center', width: '100%'}}>
                <Copyright disableClick={true} />
            </div>
        </div>
    );
}

function Form(): JSX.Element {
    const { t } = useTranslation();
    const [form, setForm] = useState<FormData>({ name: '', email: '', message: '' });

    const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>): void => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
        e.preventDefault();
        try {
            const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID;
            const templateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
            const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;
            if (!serviceId || !templateId || !publicKey) {
                throw new Error('EmailJS: missing env variables (VITE_EMAILJS_*)');
            }
            await emailjs.send(
                serviceId,
                templateId,
                {
                  form_name: form.name,
                  form_email: form.email,
                  form_message: form.message,
                },
                publicKey
            );
            alert(`${t('contactsComponent.alertOk')}`);
            setForm({ name: '', email: '', message: '' });
        } catch (err) {
            alert(`${t('contactsComponent.alertNo')}`);
            console.error(err);
        }
    };

    return (
        <form onSubmit={handleSubmit} className='mail-form'>
            <input name='name' value={form.name} onChange={handleChange} placeholder={t('contactsComponent.name')} required />
            <input name='email' type='email' value={form.email} onChange={handleChange} placeholder='Email' required />
            <textarea name='message' value={form.message} onChange={handleChange} placeholder={t('contactsComponent.message')} required />
            <button type='submit'>{t('contactsComponent.send')}<img src={paperPlane} className='paper-plane' alt="send" /></button>
        </form>
    );
}

