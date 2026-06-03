import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useToast } from '../context/ToastContext';
import { 
  Bone, 
  Activity, 
  FileText, 
  MapPin, 
  Phone, 
  Clock, 
  ChevronDown, 
  Check, 
  Users, 
  Calendar, 
  Award,
  BookOpen,
  Sparkles
} from 'lucide-react';
import { Link } from 'react-router-dom';

const Home = () => {
  const { t, language } = useLanguage();
  const { showToast } = useToast();
  
  // FAQs Accordion State
  const [openFaq, setOpenFaq] = useState(null);
  
  // Contact Form State
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [formSending, setFormSending] = useState(false);

  const handleContactSubmit = (e) => {
    e.preventDefault();
    if (!email || !message) {
      showToast(t('fillAll'), 'error');
      return;
    }
    setFormSending(true);
    setTimeout(() => {
      showToast('Your message has been sent successfully!', 'success');
      setEmail('');
      setMessage('');
      setFormSending(false);
    }, 1500);
  };

  const toggleFaq = (index) => {
    setOpenFaq(openFaq === index ? null : index);
  };


  const faqs = [
    { q: t('faqQ1'), a: t('faqA1') },
    { q: t('faqQ2'), a: t('faqA2') },
    { q: t('faqQ3'), a: t('faqA3') }
  ];

  return (
    <div className="flex flex-col min-h-screen">
      
      {/* 1. HERO SECTION */}
      <section id="hero" className="relative bg-[#faf7e6] dark:bg-zinc-950 pt-16 pb-24 md:py-32 overflow-hidden transition-all duration-300">
        
        {/* Localized Floating Leaf Animations (Ayurveda theme) */}
        <style>{`
          @keyframes leaf-float-up {
            0% {
              transform: translateY(105vh) rotate(0deg);
              opacity: 0;
            }
            10% {
              opacity: 0.15;
            }
            90% {
              opacity: 0.15;
            }
            100% {
              transform: translateY(-10vh) rotate(360deg);
              opacity: 0;
            }
          }
          @keyframes leaf-sway {
            0%, 100% {
              transform: translateX(0);
            }
            50% {
              transform: translateX(35px);
            }
          }
          .floating-leaf {
            position: absolute;
            bottom: -50px;
            color: #15803d; /* Forest Green */
            pointer-events: none;
            z-index: 1;
            opacity: 0;
            animation: leaf-float-up linear infinite;
          }
          .floating-leaf svg {
            animation: leaf-sway ease-in-out infinite;
          }
          .dark .floating-leaf {
            color: #34d399; /* Emerald 400 */
          }
        `}</style>

        {/* Floating Leaves Background Layer */}
        <div className="absolute inset-0 pointer-events-none select-none overflow-hidden">
          {/* Leaf 1 */}
          <div className="floating-leaf" style={{ left: '6%', width: '26px', height: '26px', animationDuration: '18s', animationDelay: '0s' }}>
            <svg viewBox="0 0 30 30" className="w-full h-full fill-current" style={{ animationDuration: '4s' }} xmlns="http://www.w3.org/2000/svg">
              <path d="M15 3 C13 3, 8 7, 8 13 C8 18, 11 21, 15 25 C19 21, 22 18, 22 13 C22 7, 17 3, 15 3 Z M15 3 L15 25" stroke="currentColor" strokeWidth="0.8" />
            </svg>
          </div>
          {/* Leaf 2 */}
          <div className="floating-leaf" style={{ left: '20%', width: '34px', height: '34px', animationDuration: '24s', animationDelay: '3s' }}>
            <svg viewBox="0 0 30 30" className="w-full h-full fill-current" style={{ animationDuration: '5.5s' }} xmlns="http://www.w3.org/2000/svg">
              <path d="M15 3 C13 3, 8 7, 8 13 C8 18, 11 21, 15 25 C19 21, 22 18, 22 13 C22 7, 17 3, 15 3 Z M15 3 L15 25" stroke="currentColor" strokeWidth="0.8" />
            </svg>
          </div>
          {/* Leaf 3 */}
          <div className="floating-leaf" style={{ left: '35%', width: '22px', height: '22px', animationDuration: '15s', animationDelay: '6s' }}>
            <svg viewBox="0 0 30 30" className="w-full h-full fill-current" style={{ animationDuration: '3.5s' }} xmlns="http://www.w3.org/2000/svg">
              <path d="M15 3 C13 3, 8 7, 8 13 C8 18, 11 21, 15 25 C19 21, 22 18, 22 13 C22 7, 17 3, 15 3 Z M15 3 L15 25" stroke="currentColor" strokeWidth="0.8" />
            </svg>
          </div>
          {/* Leaf 4 */}
          <div className="floating-leaf" style={{ left: '50%', width: '30px', height: '30px', animationDuration: '20s', animationDelay: '1.5s' }}>
            <svg viewBox="0 0 30 30" className="w-full h-full fill-current" style={{ animationDuration: '4.8s' }} xmlns="http://www.w3.org/2000/svg">
              <path d="M15 3 C13 3, 8 7, 8 13 C8 18, 11 21, 15 25 C19 21, 22 18, 22 13 C22 7, 17 3, 15 3 Z M15 3 L15 25" stroke="currentColor" strokeWidth="0.8" />
            </svg>
          </div>
          {/* Leaf 5 */}
          <div className="floating-leaf" style={{ left: '68%', width: '24px', height: '24px', animationDuration: '17s', animationDelay: '9s' }}>
            <svg viewBox="0 0 30 30" className="w-full h-full fill-current" style={{ animationDuration: '4.2s' }} xmlns="http://www.w3.org/2000/svg">
              <path d="M15 3 C13 3, 8 7, 8 13 C8 18, 11 21, 15 25 C19 21, 22 18, 22 13 C22 7, 17 3, 15 3 Z M15 3 L15 25" stroke="currentColor" strokeWidth="0.8" />
            </svg>
          </div>
          {/* Leaf 6 */}
          <div className="floating-leaf" style={{ left: '82%', width: '32px', height: '32px', animationDuration: '22s', animationDelay: '4.5s' }}>
            <svg viewBox="0 0 30 30" className="w-full h-full fill-current" style={{ animationDuration: '5s' }} xmlns="http://www.w3.org/2000/svg">
              <path d="M15 3 C13 3, 8 7, 8 13 C8 18, 11 21, 15 25 C19 21, 22 18, 22 13 C22 7, 17 3, 15 3 Z M15 3 L15 25" stroke="currentColor" strokeWidth="0.8" />
            </svg>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            
            {/* Hero Left Content */}
            <div className="flex flex-col gap-6 text-left max-w-xl animate-slide-up">
              <div className="inline-flex items-center gap-1.5 py-1 text-xs font-bold text-ayurveda-green-700 dark:text-ayurveda-green-400 uppercase tracking-widest self-start">
                <span>🍃</span>
                <span>{language === 'en' ? 'AYURVEDIC WELLNESS' : t('heroTag')}</span>
              </div>
              
              <h1 className="text-5xl sm:text-6xl md:text-7xl font-serif text-slate-800 dark:text-zinc-50 leading-[1.15] tracking-tight">
                {language === 'en' ? (
                  <>
                    Heal naturally,<br />
                    <span className="italic font-serif text-ayurveda-green-700 dark:text-ayurveda-green-400">live in balance.</span>
                  </>
                ) : (
                  t('heroTitle')
                )}
              </h1>
              
              <p className="text-base sm:text-lg text-slate-650 dark:text-zinc-400 leading-relaxed">
                {t('heroDesc')}
              </p>
              
              {/* Call to Actions */}
              <div className="flex flex-wrap items-center gap-4 mt-2">
                <Link
                  to="/patient-dashboard"
                  className="bg-[#1c452d] hover:bg-[#132f1f] text-white font-bold text-sm px-8 py-3.5 rounded-full shadow-lg shadow-emerald-900/10 hover:shadow-xl transition-all duration-200 inline-flex items-center gap-2"
                >
                  <span>{t('heroCTA1')}</span>
                  <span className="text-lg">→</span>
                </Link>
                <a
                  href="#treatments"
                  className="bg-transparent hover:bg-black/5 text-[#1c452d] dark:text-[#faf7e6] border border-[#1c452d] dark:border-[#faf7e6]/50 font-bold text-sm px-8 py-3.5 rounded-full transition-all duration-200"
                >
                  {t('heroCTA2')}
                </a>
              </div>

              {/* Badges/Trust Metrics */}
              <div className="grid grid-cols-3 gap-4 border-t border-slate-200/50 dark:border-zinc-800 mt-6 pt-6">
                <div>
                  <span className="block text-2xl font-extrabold text-[#1c452d] dark:text-ayurveda-green-450">5+</span>
                  <span className="text-xs text-slate-400 dark:text-zinc-500">{t('yearsExp')}</span>
                </div>
                <div>
                  <span className="block text-2xl font-extrabold text-[#1c452d] dark:text-ayurveda-green-450">5k+</span>
                  <span className="text-xs text-slate-400 dark:text-zinc-500">{t('satisfiedPatients')}</span>
                </div>
                <div>
                  <span className="block text-2xl font-extrabold text-[#1c452d] dark:text-ayurveda-green-450">98%</span>
                  <span className="text-xs text-slate-400 dark:text-zinc-500">{t('successRate')}</span>
                </div>
              </div>

            </div>

            {/* Hero Right Avatar (Generated Image) */}
            <div className="relative flex justify-center lg:justify-end animate-fade-in px-4 sm:px-0">
              <div className="absolute inset-0 bg-gradient-to-tr from-ayurveda-green-200 to-ayurveda-saffron-100 dark:from-emerald-950/20 dark:to-orange-950/20 rounded-full blur-3xl opacity-70 -z-10 transform scale-95"></div>
              
              <div className="relative max-w-sm w-full aspect-[2/3] sm:aspect-[3/4]">
                {/* Inner image container */}
                <div className="relative w-full h-full border-4 border-white dark:border-zinc-900 rounded-[2.5rem] shadow-2xl overflow-hidden">
                  <img
                    src="/doctor_avatar.jpg"
                    alt={t('doctorName')}
                    className="w-full h-full object-cover object-center"
                  />
                </div>
                
                {/* Floating stats bubble */}
                <div className="absolute -bottom-6 -left-6 bg-white dark:bg-zinc-900 border border-slate-100 dark:border-zinc-850 p-4.5 px-6.5 rounded-3xl shadow-2xl z-20">
                  <span className="block text-xl font-extrabold text-[#1c452d] dark:text-[#46ca96] leading-none">5,000+</span>
                  <span className="text-[9px] text-slate-400 dark:text-zinc-500 font-extrabold tracking-widest uppercase mt-1 block">
                    {language === 'mr' ? 'रुग्ण बरे झाले' : language === 'hi' ? 'मरीज ठीक हुए' : 'Patients Healed'}
                  </span>
                </div>



              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 2. ABOUT DOCTOR SECTION */}
      <section id="about" className="py-20 bg-slate-50 dark:bg-zinc-900/30 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            
            {/* Left Box (Text Info) */}
            <div className="flex flex-col gap-6 text-left">
              <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-800 dark:text-zinc-100 relative">
                {t('aboutTitle')}
                <span className="block h-1 w-16 bg-ayurveda-saffron-500 mt-2.5 rounded-full"></span>
              </h2>
              
              <div className="space-y-4 text-slate-500 dark:text-zinc-400">
                <p className="leading-relaxed font-medium text-slate-700 dark:text-zinc-300">
                  {t('aboutDesc1')}
                </p>
                <p className="leading-relaxed">
                  {t('aboutDesc2')}
                </p>
              </div>

              <div className="mt-2">
                <h4 className="font-bold text-slate-850 dark:text-zinc-200 text-sm mb-3 uppercase tracking-wider">{t('specialties')}</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  {[1, 2, 3, 4].map((idx) => (
                    <div key={idx} className="flex items-center gap-2.5">
                      <div className="w-5 h-5 rounded-full bg-ayurveda-green-100 dark:bg-emerald-950/40 flex items-center justify-center text-ayurveda-green-600 dark:text-ayurveda-green-400">
                        <Check size={12} className="stroke-[3]" />
                      </div>
                      <span className="text-xs font-semibold text-slate-700 dark:text-zinc-300">{t(`specialty${idx}`)}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Box (Clinical features) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              
              <div className="bg-white dark:bg-zinc-900 border border-slate-100 dark:border-zinc-800/80 p-6 rounded-2xl shadow-sm text-left hover:shadow-md transition-all">
                <div className="w-12 h-12 rounded-xl bg-emerald-50 dark:bg-emerald-950/20 text-ayurveda-green-600 flex items-center justify-center mb-4">
                  <Bone size={24} />
                </div>
                <h4 className="font-bold text-sm text-slate-800 dark:text-zinc-100 mb-1">{t('specialty1')}</h4>
                <p className="text-xs text-slate-400 dark:text-zinc-500 leading-normal">Deep herbal basti heat treatments targeting joint lubrication.</p>
              </div>

              <div className="bg-white dark:bg-zinc-900 border border-slate-100 dark:border-zinc-800/80 p-6 rounded-2xl shadow-sm text-left hover:shadow-md transition-all">
                <div className="w-12 h-12 rounded-xl bg-orange-50 dark:bg-orange-950/20 text-ayurveda-saffron-500 flex items-center justify-center mb-4">
                  <Activity size={24} />
                </div>
                <h4 className="font-bold text-sm text-slate-800 dark:text-zinc-100 mb-1">{t('specialty2')}</h4>
                <p className="text-xs text-slate-400 dark:text-zinc-500 leading-normal">Full detoxification using natural herbs to reset blood circulation.</p>
              </div>

              <div className="bg-white dark:bg-zinc-900 border border-slate-100 dark:border-zinc-800/80 p-6 rounded-2xl shadow-sm text-left hover:shadow-md transition-all">
                <div className="w-12 h-12 rounded-xl bg-purple-50 dark:bg-purple-950/20 text-purple-500 flex items-center justify-center mb-4">
                  <BookOpen size={24} />
                </div>
                <h4 className="font-bold text-sm text-slate-800 dark:text-zinc-100 mb-1">Authentic Sastras</h4>
                <p className="text-xs text-slate-400 dark:text-zinc-500 leading-normal">Blending scriptural insights with modern diagnostics.</p>
              </div>

              <div className="bg-white dark:bg-zinc-900 border border-slate-100 dark:border-zinc-800/80 p-6 rounded-2xl shadow-sm text-left hover:shadow-md transition-all">
                <div className="w-12 h-12 rounded-xl bg-amber-50 dark:bg-amber-950/20 text-amber-500 flex items-center justify-center mb-4">
                  <Users size={24} />
                </div>
                <h4 className="font-bold text-sm text-slate-800 dark:text-zinc-100 mb-1">Caring Environment</h4>
                <p className="text-xs text-slate-400 dark:text-zinc-500 leading-normal">Friendly post-consultation assistance for life changes.</p>
              </div>

            </div>

          </div>
        </div>
      </section>

      {/* 3. TREATMENTS SECTION (Services Grid) */}
      <section id="treatments" className="py-20 bg-[#faf7e6] dark:bg-zinc-950 border-t border-slate-200/30 dark:border-zinc-900 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="max-w-3xl mx-auto mb-16 text-center">
            <h2 className="text-4xl font-serif text-slate-800 dark:text-zinc-50 leading-tight">
              {t('treatmentTitle')}
            </h2>
            <p className="text-slate-500 dark:text-zinc-400 mt-3 leading-relaxed">
              {t('treatmentSubtitle')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {(Array.isArray(t('servicesData')) ? t('servicesData') : []).map((s) => (
              <div 
                key={s.id} 
                className="bg-[#fbfbf6] dark:bg-zinc-900 border border-slate-200/60 dark:border-zinc-800 rounded-[2.2rem] overflow-hidden flex flex-col p-4 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1"
              >
                {/* Card Top Inset Image */}
                <div className="rounded-2xl overflow-hidden aspect-[4/3] w-full mb-5 relative bg-slate-100 dark:bg-zinc-800">
                  <img 
                    src={s.image} 
                    alt={s.title} 
                    className="w-full h-full object-cover" 
                    onError={(e) => {
                      // Fallback in case of image loading failure
                      e.target.style.display = 'none';
                    }}
                  />
                </div>
                
                {/* Card Body */}
                <div className="px-2 flex-grow flex flex-col justify-between">
                  <div>
                    <h3 className="font-serif text-2xl font-medium text-slate-800 dark:text-zinc-100 mb-2.5">
                      {s.title}
                    </h3>
                    <p className="text-slate-500 dark:text-zinc-400 text-xs leading-relaxed mb-4">
                      {s.desc}
                    </p>
                  </div>
                  
                  <div>
                    <hr className="border-slate-200/50 dark:border-zinc-800/80 my-4" />
                    
                    <div className="mb-2">
                      <span className="text-[10px] font-extrabold tracking-wider text-[#b45309] dark:text-amber-500 uppercase block mb-3">
                        {t('keyBenefits')}
                      </span>
                      <ul className="space-y-2">
                        {s.benefits && s.benefits.map((b, idx) => (
                          <li key={idx} className="flex items-start gap-2.5 text-slate-650 dark:text-zinc-350 text-xs font-semibold">
                            <span className="text-[#1c452d] dark:text-emerald-450 shrink-0">✓</span>
                            <span>{b}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                </div>
              </div>
            ))}
          </div>

          {/* Quick link below grid */}
          <div className="mt-16 text-center">
            <Link
              to="/patient-dashboard"
              className="inline-flex items-center gap-2 bg-[#1c452d] hover:bg-[#132f1f] text-white font-bold text-xs uppercase tracking-wider px-8 py-3.5 rounded-full shadow-lg shadow-emerald-900/10 hover:shadow-xl transition-all duration-200"
            >
              <Calendar size={14} />
              {t('bookNow')}
            </Link>
          </div>

        </div>
      </section>

      {/* 4. TESTIMONIALS SECTION */}
      <section className="py-20 bg-slate-50 dark:bg-zinc-900/30 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          
          <div className="max-w-3xl mx-auto mb-16 animate-slide-up">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-800 dark:text-zinc-50">{t('testiTitle')}</h2>
            <p className="text-slate-500 dark:text-zinc-400 mt-2">{t('testiSubtitle')}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[1, 2, 3].map((num) => (
              <div key={num} className="bg-white dark:bg-zinc-900 border border-slate-100 dark:border-zinc-800/80 p-8 rounded-2xl shadow-sm text-left hover:shadow-md transition-all flex flex-col justify-between">
                <p className="text-sm italic leading-relaxed text-slate-500 dark:text-zinc-400 mb-6">
                  "{t(`testiText${num}`)}"
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-ayurveda-green-100 dark:bg-zinc-800 flex items-center justify-center text-ayurveda-green-700 dark:text-zinc-200 font-extrabold text-xs">
                    {t(`testiName${num}`).split(' ')[0][0]}{t(`testiName${num}`).split(' ')[1][0]}
                  </div>
                  <div>
                    <h4 className="font-bold text-xs text-slate-800 dark:text-zinc-100">{t(`testiName${num}`)}</h4>
                    <span className="text-[10px] text-slate-400 dark:text-zinc-500 font-semibold">{t(`testiRole${num}`)}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* 5. FAQs SECTION */}
      <section className="py-20 bg-white dark:bg-zinc-950 transition-colors duration-300">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-800 dark:text-zinc-50">{t('faqTitle')}</h2>
            <p className="text-slate-500 dark:text-zinc-400 mt-2">{t('faqSubtitle')}</p>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className="border border-slate-100 dark:border-zinc-800/60 rounded-2xl overflow-hidden bg-slate-50/30 dark:bg-zinc-900/20"
              >
                <button
                  onClick={() => toggleFaq(index)}
                  className="w-full flex justify-between items-center p-5 text-left font-bold text-sm text-slate-700 dark:text-zinc-200 hover:bg-slate-50 dark:hover:bg-zinc-900/60 transition-colors duration-200"
                >
                  <span>{faq.q}</span>
                  <ChevronDown
                    size={16}
                    className={`text-slate-400 transition-transform duration-300 ${openFaq === index ? 'rotate-180' : ''}`}
                  />
                </button>
                {openFaq === index && (
                  <div className="px-5 pb-5 pt-1 text-xs leading-relaxed text-slate-500 dark:text-zinc-400 border-t border-slate-100/50 dark:border-zinc-800/50 animate-fade-in bg-white dark:bg-zinc-900/30">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* 6. CONTACT SECTION & MAPS */}
      <section id="contact" className="py-20 bg-slate-50 dark:bg-zinc-900/30 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-800 dark:text-zinc-50">{t('contactTitle')}</h2>
            <p className="text-slate-500 dark:text-zinc-400 mt-2">{t('contactSubtitle')}</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-stretch">
            
            {/* Contact details box */}
            <div className="flex flex-col gap-8 bg-white dark:bg-zinc-900 border border-slate-100 dark:border-zinc-800/80 p-8 rounded-3xl shadow-sm text-left justify-between">
              
              <div className="space-y-6">
                <div>
                  <h4 className="font-extrabold text-base text-slate-800 dark:text-zinc-100">{t('clinicName')}</h4>
                  <p className="text-xs text-ayurveda-saffron-600 dark:text-ayurveda-saffron-400 font-bold uppercase tracking-widest">{t('clinicSub')}</p>
                </div>

                <div className="space-y-4">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl bg-orange-50 dark:bg-orange-950/20 text-ayurveda-saffron-500 flex items-center justify-center shrink-0">
                      <MapPin size={20} />
                    </div>
                    <div>
                      <span className="block text-xs font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-wider">{t('addressLabel')}</span>
                      <span className="text-xs font-bold text-slate-700 dark:text-zinc-300 leading-snug">{t('addressVal')}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/20 text-ayurveda-green-500 flex items-center justify-center shrink-0">
                      <Phone size={20} />
                    </div>
                    <div>
                      <span className="block text-xs font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-wider">{t('phoneLabel')}</span>
                      <span className="text-xs font-extrabold text-slate-750 dark:text-zinc-200">{t('phoneVal')}</span>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-zinc-850 text-slate-500 flex items-center justify-center shrink-0">
                      <Clock size={20} />
                    </div>
                    <div>
                      <span className="block text-xs font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-wider">{t('hoursLabel')}</span>
                      <span className="text-xs font-bold text-slate-700 dark:text-zinc-300 leading-snug">{t('hoursVal')}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Direct email messaging form */}
              <form onSubmit={handleContactSubmit} className="border-t border-slate-100 dark:border-zinc-800/80 pt-6 mt-6 space-y-4">
                <div>
                  <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">{t('yourEmail')}</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@email.com"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-zinc-800 dark:bg-zinc-950 text-xs focus:ring-2 focus:ring-ayurveda-green-500 focus:outline-none dark:text-zinc-100 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">{t('yourMessage')}</label>
                  <textarea
                    rows="3"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Write your questions here..."
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-zinc-800 dark:bg-zinc-950 text-xs focus:ring-2 focus:ring-ayurveda-green-500 focus:outline-none dark:text-zinc-100 transition-all resize-none"
                  ></textarea>
                </div>
                <button
                  type="submit"
                  disabled={formSending}
                  className="w-full bg-slate-800 hover:bg-slate-900 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-white font-bold text-xs uppercase tracking-wider py-3 rounded-xl transition-all"
                >
                  {formSending ? t('loading') : t('sendMessage')}
                </button>
              </form>

            </div>

            {/* Google Map iframe */}
            <div className="rounded-3xl overflow-hidden shadow-sm border border-slate-100 dark:border-zinc-800/80 min-h-[350px] relative">
              <iframe
                title={t('mapEmbedTitle')}
                src="https://www.google.com/maps/embed?pb=!1m2!2m1!1sF7G9%2BJPF%2C+Warud%2C+Maharashtra+444906"
                width="100%"
                height="100%"
                style={{ border: 0, minHeight: '350px' }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>
            </div>

          </div>

        </div>
      </section>

    </div>
  );
};

export default Home;
