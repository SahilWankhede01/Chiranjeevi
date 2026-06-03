import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { Phone, MapPin, Clock } from 'lucide-react';
import Logo from './Logo';

const Footer = () => {
  const { t } = useLanguage();

  return (
    <footer className="bg-slate-900 text-slate-300 dark:bg-zinc-950 dark:text-zinc-400 border-t border-slate-800 dark:border-zinc-900 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-8">
          
          {/* Clinic Brand & Philosophy */}
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-3 group">
              <Logo className="w-10 h-10 transition-transform duration-300 group-hover:scale-105" />
              <div>
                <h3 className="font-extrabold text-lg text-white tracking-wide">{t('clinicName')}</h3>
                <p className="text-xs text-ayurveda-saffron-400 font-semibold tracking-wider -mt-1 uppercase">{t('clinicSub')}</p>
              </div>
            </div>
            <p className="text-sm leading-relaxed text-slate-400 dark:text-zinc-500 max-w-sm">
              {t('footerDesc')}
            </p>
            <div className="text-xs text-slate-400 mt-2">
              <span className="font-bold text-white block">{t('doctorName')}</span>
              <span className="text-[11px] text-ayurveda-green-400">{t('doctorDegrees')}</span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="flex flex-col gap-4">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">{t('quickLinks')}</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#hero" className="hover:text-ayurveda-green-400 transition-colors duration-200">{t('home')}</a>
              </li>
              <li>
                <a href="#about" className="hover:text-ayurveda-green-400 transition-colors duration-200">{t('aboutDoctor')}</a>
              </li>
              <li>
                <a href="#treatments" className="hover:text-ayurveda-green-400 transition-colors duration-200">{t('treatments')}</a>
              </li>
              <li>
                <a href="#contact" className="hover:text-ayurveda-green-400 transition-colors duration-200">{t('contact')}</a>
              </li>
            </ul>
          </div>

          {/* Direct Contact Details */}
          <div className="flex flex-col gap-4">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">{t('contact')}</h4>
            <ul className="space-y-3.5 text-sm text-slate-400 dark:text-zinc-500">
              <li className="flex items-start gap-3">
                <MapPin className="text-ayurveda-saffron-500 w-5 h-5 mt-0.5 shrink-0" />
                <span className="leading-snug">{t('addressVal')}</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="text-ayurveda-green-500 w-5 h-5 shrink-0" />
                <span className="font-semibold text-white">{t('phoneVal')}</span>
              </li>
              <li className="flex items-start gap-3">
                <Clock className="text-slate-400 w-5 h-5 mt-0.5 shrink-0" />
                <span className="leading-snug">{t('hoursVal')}</span>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom copyright block */}
        <div className="border-t border-slate-800 dark:border-zinc-900 mt-12 pt-8 text-center text-xs text-slate-500 dark:text-zinc-600 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="text-center sm:text-left">
            <p>© {new Date().getFullYear()} {t('clinicName')} {t('clinicSub')}. {t('allRightsReserved')}</p>
            <p className="text-[11px] text-slate-450 dark:text-zinc-500 mt-1">Designed by Sahil Wankhade</p>
          </div>
          <div className="flex items-center gap-1.5 text-[10px]">
            <span>Developed with</span>
            <div className="w-3.5 h-3.5 text-red-500 fill-current">❤️</div>
            <span>for authentic wellness</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
