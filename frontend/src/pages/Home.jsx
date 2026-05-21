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
  BookOpen
} from 'lucide-react';
import { Link } from 'react-router-dom';

const Home = () => {
  const { t } = useLanguage();
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

  // Group Diseases for rendering
  const orthoDiseases = [
    { key: 'spondylosis', label: t('spondylosis') },
    { key: 'cordCompression', label: t('cordCompression') },
    { key: 'tinglingNumbness', label: t('tinglingNumbness') },
    { key: 'arthritisRheumatism', label: t('arthritisRheumatism') },
    { key: 'kneeDegeneration', label: t('kneeDegeneration') },
    { key: 'osteoporosis', label: t('osteoporosis') },
    { key: 'paralysis', label: t('paralysis') },
    { key: 'jointSwellingGout', label: t('jointSwellingGout') },
    { key: 'neckBackPain', label: t('neckBackPain') },
    { key: 'dizzinessBalance', label: t('dizzinessBalance') },
    { key: 'stomachDiseases', label: t('stomachDiseases') }
  ];

  const gastroDiseases = [
    { key: 'postOpComplications', label: t('postOpComplications') },
    { key: 'sciatica', label: t('sciatica') },
    { key: 'frozenShoulder', label: t('frozenShoulder') },
    { key: 'waistToLegsNervePain', label: t('waistToLegsNervePain') },
    { key: 'neckToLegsNervePain', label: t('neckToLegsNervePain') },
    { key: 'handLegTingling', label: t('handLegTingling') },
    { key: 'appetiteIndigestion', label: t('appetiteIndigestion') },
    { key: 'acidity', label: t('acidity') },
    { key: 'chestBurning', label: t('chestBurning') },
    { key: 'constipationBowel', label: t('constipationBowel') },
    { key: 'pilesFistula', label: t('pilesFistula') }
  ];

  const faqs = [
    { q: t('faqQ1'), a: t('faqA1') },
    { q: t('faqQ2'), a: t('faqA2') },
    { q: t('faqQ3'), a: t('faqA3') }
  ];

  return (
    <div className="flex flex-col min-h-screen">
      
      {/* 1. HERO SECTION */}
      <section id="hero" className="relative bg-gradient-to-b from-emerald-50/50 via-white to-white dark:from-zinc-900/20 dark:via-zinc-950 dark:to-zinc-950 pt-10 pb-20 md:py-32 overflow-hidden transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            
            {/* Hero Left Content */}
            <div className="flex flex-col gap-6 text-left max-w-xl animate-slide-up">
              <div className="inline-flex items-center gap-1.5 py-1 px-3.5 rounded-full bg-ayurveda-green-50 dark:bg-emerald-950/30 border border-ayurveda-green-100 dark:border-emerald-900/30 text-xs font-bold text-ayurveda-green-700 dark:text-ayurveda-green-400 uppercase tracking-wider self-start">
                <Activity size={14} />
                {t('heroTag')}
              </div>
              
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-slate-800 dark:text-zinc-50 leading-tight">
                {t('heroTitle')}
              </h1>
              
              <p className="text-base sm:text-lg text-slate-500 dark:text-zinc-400 leading-relaxed">
                {t('heroDesc')}
              </p>
              
              {/* Call to Actions */}
              <div className="flex flex-wrap items-center gap-4 mt-2">
                <Link
                  to="/patient-dashboard"
                  className="bg-ayurveda-green-600 hover:bg-ayurveda-green-700 text-white font-bold text-sm px-7 py-3.5 rounded-full shadow-lg shadow-emerald-700/20 hover:shadow-xl transition-all duration-200 uppercase tracking-wider"
                >
                  {t('heroCTA1')}
                </Link>
                <a
                  href="#treatments"
                  className="bg-white dark:bg-zinc-900 hover:bg-slate-50 dark:hover:bg-zinc-800/80 text-slate-800 dark:text-zinc-100 border border-slate-200 dark:border-zinc-800 font-bold text-sm px-7 py-3.5 rounded-full shadow-sm transition-all duration-200 uppercase tracking-wider"
                >
                  {t('heroCTA2')}
                </a>
              </div>

              {/* Badges/Trust Metrics */}
              <div className="grid grid-cols-3 gap-4 border-t border-slate-100 dark:border-zinc-800 mt-6 pt-6">
                <div>
                  <span className="block text-2xl font-extrabold text-ayurveda-green-600 dark:text-ayurveda-green-400">12+</span>
                  <span className="text-xs text-slate-400 dark:text-zinc-500">{t('yearsExp')}</span>
                </div>
                <div>
                  <span className="block text-2xl font-extrabold text-ayurveda-green-600 dark:text-ayurveda-green-400">10k+</span>
                  <span className="text-xs text-slate-400 dark:text-zinc-500">{t('satisfiedPatients')}</span>
                </div>
                <div>
                  <span className="block text-2xl font-extrabold text-ayurveda-green-600 dark:text-ayurveda-green-400">98%</span>
                  <span className="text-xs text-slate-400 dark:text-zinc-500">{t('successRate')}</span>
                </div>
              </div>

            </div>

            {/* Hero Right Avatar (Generated Image) */}
            <div className="relative flex justify-center lg:justify-end animate-fade-in">
              <div className="absolute inset-0 bg-gradient-to-tr from-ayurveda-green-200 to-ayurveda-saffron-100 dark:from-emerald-950/20 dark:to-orange-950/20 rounded-full blur-3xl opacity-70 -z-10 transform scale-95"></div>
              <div className="relative border-4 border-white dark:border-zinc-900 rounded-[2.5rem] shadow-2xl overflow-hidden max-w-sm w-full aspect-square">
                <img
                  src="/doctor_avatar.png"
                  alt={t('doctorName')}
                  className="w-full h-full object-cover"
                />
                
                {/* floating clinician card */}
                <div className="absolute bottom-6 left-6 right-6 glass-panel p-4 rounded-2xl shadow-xl flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-ayurveda-green-600 flex items-center justify-center text-white shrink-0">
                    <Award size={20} />
                  </div>
                  <div>
                    <h4 className="font-extrabold text-xs text-slate-800 dark:text-zinc-100">{t('doctorName')}</h4>
                    <p className="text-[10px] text-ayurveda-green-600 dark:text-ayurveda-green-400 font-semibold">{t('doctorDegrees')}</p>
                  </div>
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

      {/* 3. TREATMENTS SECTION (Diseases Grid) */}
      <section id="treatments" className="py-20 bg-white dark:bg-zinc-950 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          
          <div className="max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-800 dark:text-zinc-50">
              {t('treatmentTitle')}
            </h2>
            <p className="text-slate-500 dark:text-zinc-400 mt-3 leading-relaxed">
              {t('treatmentSubtitle')}
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            
            {/* Category 1: Orthopedic & Nerve */}
            <div className="flex flex-col gap-6 bg-slate-50/50 dark:bg-zinc-900/20 border border-slate-100 dark:border-zinc-800/40 p-8 rounded-3xl text-left">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-ayurveda-green-100 dark:bg-emerald-950/40 text-ayurveda-green-600 dark:text-ayurveda-green-400 rounded-xl flex items-center justify-center">
                  <Bone size={22} />
                </div>
                <div>
                  <h3 className="font-extrabold text-lg text-slate-800 dark:text-zinc-100">{t('orthoCategory')}</h3>
                  <p className="text-xs text-slate-400 dark:text-zinc-500 mt-0.5">{t('orthoDesc')}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 mt-4">
                {orthoDiseases.map((d) => (
                  <div key={d.key} className="flex items-start gap-2.5 bg-white dark:bg-zinc-900 p-3.5 rounded-2xl shadow-sm border border-slate-100/50 dark:border-zinc-850 transition-all hover:-translate-y-0.5 duration-200">
                    <Check size={14} className="text-ayurveda-green-500 mt-1 shrink-0 stroke-[3]" />
                    <span className="text-xs font-bold text-slate-700 dark:text-zinc-300 leading-tight">{d.label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Category 2: Digestive & Other */}
            <div className="flex flex-col gap-6 bg-slate-50/50 dark:bg-zinc-900/20 border border-slate-100 dark:border-zinc-800/40 p-8 rounded-3xl text-left">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-ayurveda-saffron-100 dark:bg-orange-950/30 text-ayurveda-saffron-500 dark:text-ayurveda-saffron-400 rounded-xl flex items-center justify-center">
                  <Activity size={22} />
                </div>
                <div>
                  <h3 className="font-extrabold text-lg text-slate-800 dark:text-zinc-100">{t('otherCategory')}</h3>
                  <p className="text-xs text-slate-400 dark:text-zinc-500 mt-0.5">{t('otherDesc')}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 mt-4">
                {gastroDiseases.map((d) => (
                  <div key={d.key} className="flex items-start gap-2.5 bg-white dark:bg-zinc-900 p-3.5 rounded-2xl shadow-sm border border-slate-100/50 dark:border-zinc-850 transition-all hover:-translate-y-0.5 duration-200">
                    <Check size={14} className="text-ayurveda-saffron-500 mt-1 shrink-0 stroke-[3]" />
                    <span className="text-xs font-bold text-slate-700 dark:text-zinc-300 leading-tight">{d.label}</span>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Quick link below grid */}
          <div className="mt-12 text-center">
            <Link
              to="/patient-dashboard"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-ayurveda-green-600 to-ayurveda-green-700 text-white font-bold text-xs uppercase tracking-wider px-6.5 py-3 rounded-full hover:scale-105 transition-transform"
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
                src="https://maps.google.com/maps?q=Pandurna%20Chowk,%20Karanja%20Maharashtra&t=&z=16&ie=UTF8&iwloc=&output=embed"
                width="100%"
                height="100%"
                style={{ border: 0, minHeight: '350px' }}
                allowFullScreen=""
                loading="lazy"
              ></iframe>
            </div>

          </div>

        </div>
      </section>

    </div>
  );
};

export default Home;
