import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useToast } from '../context/ToastContext';
import { 
  Bone, 
  Activity, 
  MapPin, 
  Phone, 
  Clock, 
  ChevronDown, 
  Check, 
  Users, 
  Calendar, 
  BookOpen,
  Sparkles,
  Search,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Plus,
  Minus
} from 'lucide-react';
import { Link } from 'react-router-dom';

/* FIX 3: Image shimmer loading skeleton component */
const ImageWithSkeleton = ({ src, alt, className }) => {
  const [loaded, setLoaded] = useState(false);
  return (
    <div className="relative w-full h-full shimmer-placeholder overflow-hidden">
      <img
        src={src}
        alt={alt}
        className={`${className} transition-opacity duration-500 ${loaded ? 'opacity-100' : 'opacity-0'}`}
        onLoad={() => setLoaded(true)}
      />
    </div>
  );
};

const Home = () => {
  const { t, language } = useLanguage();
  const { showToast } = useToast();
  
  // FAQs Accordion & Search State
  const [openFaq, setOpenFaq] = useState(null);
  const [faqSearch, setFaqSearch] = useState('');
  
  // Testimonials Carousel State
  const [activeTesti, setActiveTesti] = useState(0);

  // Selected Condition Filter State
  const [selectedCondition, setSelectedCondition] = useState('all');

  const conditionFilters = [
    { id: 'all', label: language === 'mr' ? 'सर्व सेवा' : language === 'hi' ? 'सभी सेवाएं' : 'All Services' },
    { id: 'joint_pain', label: language === 'mr' ? 'सांधेदुखी' : language === 'hi' ? 'जोड़ों का दर्द' : 'Joint Pain' },
    { id: 'digestion', label: language === 'mr' ? 'पचन क्रिया' : language === 'hi' ? 'पाचन तंत्र' : 'Digestion' },
    { id: 'skin', label: language === 'mr' ? 'त्वचा विकार' : language === 'hi' ? 'त्वचा' : 'Skin' },
    { id: 'stress', label: language === 'mr' ? 'तणाव मुक्ती' : language === 'hi' ? 'तनाव' : 'Stress' },
    { id: 'womens_health', label: language === 'mr' ? 'स्त्री रोग व काळजी' : language === 'hi' ? 'महिला स्वास्थ्य' : "Women's Health" }
  ];

  const serviceConditionMapping = {
    consultation: ['joint_pain', 'digestion', 'skin', 'stress', 'womens_health'],
    panchakarma: ['joint_pain', 'digestion', 'skin'],
    agnikarma: ['joint_pain'],
    joint_spine: ['joint_pain'],
    shirodhara: ['stress'],
    lifestyle: ['digestion', 'womens_health'],
    respiratory: [],
    skin_hair: ['skin'],
    garbhasanskar: ['womens_health']
  };

  // Contact Form State
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [formSending, setFormSending] = useState(false);

  /* FIX 4: Scroll Micro-interaction - Intersection Observer hook */
  React.useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
          }
        });
      },
      { threshold: 0.1 }
    );
    const elements = document.querySelectorAll('.scroll-fade-up');
    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const handleContactSubmit = (e) => {
    e.preventDefault();
    if (!email || !message) {
      showToast(t('fillAll'), 'error');
      return;
    }
    setFormSending(true);
    setTimeout(() => {
      /* FIX 4: Form Submit Toast feedback - auto-dismisses after 3 seconds */
      showToast('✓ Message sent!', 'success');
      setEmail('');
      setMessage('');
      setFormSending(false);
    }, 1500);
  };

  const toggleFaq = (index) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  /* PROBLEM 1 FIX: Load 6 clinical FAQ items from translations context */
  const faqs = [
    { q: t('faqQ1'), a: t('faqA1') },
    { q: t('faqQ2'), a: t('faqA2') },
    { q: t('faqQ3'), a: t('faqA3') },
    { q: t('faqQ4'), a: t('faqA4') },
    { q: t('faqQ5'), a: t('faqA5') },
    { q: t('faqQ6'), a: t('faqA6') }
  ];

  const filteredFaqs = faqs.filter(
    faq => faq.q.toLowerCase().includes(faqSearch.toLowerCase()) || 
           faq.a.toLowerCase().includes(faqSearch.toLowerCase())
  );

  const nextTesti = () => {
    setActiveTesti((prev) => (prev + 1) % 3);
  };

  const prevTesti = () => {
    setActiveTesti((prev) => (prev - 1 + 3) % 3);
  };

  return (
    <div className="flex flex-col min-h-screen">
      
      {/* 1. HERO SECTION */}
      <section id="hero" className="relative bg-gradient-to-b from-ayurveda-cream/50 via-white to-white dark:from-zinc-950 dark:via-zinc-950 dark:to-zinc-900 pt-20 pb-28 md:py-36 overflow-hidden transition-all duration-300">
        
        {/* Decorative Floating Leaves Keyframe & Sway Styles */}
        <style>{`
          @keyframes leaf-float-up {
            0% {
              transform: translateY(110vh) rotate(0deg);
              opacity: 0;
            }
            15% {
              opacity: 0.22;
            }
            85% {
              opacity: 0.22;
            }
            100% {
              transform: translateY(-15vh) rotate(360deg);
              opacity: 0;
            }
          }
          @keyframes leaf-sway {
            0%, 100% {
              transform: translateX(0);
            }
            50% {
              transform: translateX(40px);
            }
          }
          .floating-leaf {
            position: absolute;
            bottom: -60px;
            color: #1b9d67;
            pointer-events: none;
            z-index: 1;
            opacity: 0;
            animation: leaf-float-up linear infinite;
          }
          .floating-leaf svg {
            animation: leaf-sway ease-in-out infinite;
          }
          .dark .floating-leaf {
            color: #46ca96;
          }
        `}</style>

        {/* Floating Leaves Anim Layer */}
        <div className="absolute inset-0 pointer-events-none select-none overflow-hidden">
          {/* Leaf 1 */}
          <div className="floating-leaf" style={{ left: '5%', width: '28px', height: '28px', animationDuration: '16s', animationDelay: '0s' }}>
            <svg viewBox="0 0 30 30" className="w-full h-full fill-current animate-pulse-slow" style={{ animationDuration: '4s' }} xmlns="http://www.w3.org/2000/svg">
              <path d="M15 3 C13 3, 8 7, 8 13 C8 18, 11 21, 15 25 C19 21, 22 18, 22 13 C22 7, 17 3, 15 3 Z M15 3 L15 25" stroke="currentColor" strokeWidth="0.8" />
            </svg>
          </div>
          {/* Leaf 2 */}
          <div className="floating-leaf" style={{ left: '22%', width: '36px', height: '36px', animationDuration: '22s', animationDelay: '3s' }}>
            <svg viewBox="0 0 30 30" className="w-full h-full fill-current" style={{ animationDuration: '6s' }} xmlns="http://www.w3.org/2000/svg">
              <path d="M15 3 C13 3, 8 7, 8 13 C8 18, 11 21, 15 25 C19 21, 22 18, 22 13 C22 7, 17 3, 15 3 Z M15 3 L15 25" stroke="currentColor" strokeWidth="0.8" />
            </svg>
          </div>
          {/* Leaf 3 */}
          <div className="floating-leaf" style={{ left: '40%', width: '20px', height: '20px', animationDuration: '14s', animationDelay: '6s' }}>
            <svg viewBox="0 0 30 30" className="w-full h-full fill-current" style={{ animationDuration: '3.5s' }} xmlns="http://www.w3.org/2000/svg">
              <path d="M15 3 C13 3, 8 7, 8 13 C8 18, 11 21, 15 25 C19 21, 22 18, 22 13 C22 7, 17 3, 15 3 Z M15 3 L15 25" stroke="currentColor" strokeWidth="0.8" />
            </svg>
          </div>
          {/* Leaf 4 */}
          <div className="floating-leaf" style={{ left: '60%', width: '32px', height: '32px', animationDuration: '18s', animationDelay: '1.5s' }}>
            <svg viewBox="0 0 30 30" className="w-full h-full fill-current" style={{ animationDuration: '5s' }} xmlns="http://www.w3.org/2000/svg">
              <path d="M15 3 C13 3, 8 7, 8 13 C8 18, 11 21, 15 25 C19 21, 22 18, 22 13 C22 7, 17 3, 15 3 Z M15 3 L15 25" stroke="currentColor" strokeWidth="0.8" />
            </svg>
          </div>
          {/* Leaf 5 */}
          <div className="floating-leaf" style={{ left: '78%', width: '25px', height: '25px', animationDuration: '20s', animationDelay: '8s' }}>
            <svg viewBox="0 0 30 30" className="w-full h-full fill-current" style={{ animationDuration: '4.5s' }} xmlns="http://www.w3.org/2000/svg">
              <path d="M15 3 C13 3, 8 7, 8 13 C8 18, 11 21, 15 25 C19 21, 22 18, 22 13 C22 7, 17 3, 15 3 Z M15 3 L15 25" stroke="currentColor" strokeWidth="0.8" />
            </svg>
          </div>
          {/* Leaf 6 */}
          <div className="floating-leaf" style={{ left: '90%', width: '34px', height: '34px', animationDuration: '25s', animationDelay: '4s' }}>
            <svg viewBox="0 0 30 30" className="w-full h-full fill-current" style={{ animationDuration: '5.2s' }} xmlns="http://www.w3.org/2000/svg">
              <path d="M15 3 C13 3, 8 7, 8 13 C8 18, 11 21, 15 25 C19 21, 22 18, 22 13 C22 7, 17 3, 15 3 Z M15 3 L15 25" stroke="currentColor" strokeWidth="0.8" />
            </svg>
          </div>
        </div>

        {/* FIX 4: Scroll Micro-interaction - scroll-fade-up class adds animation */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 scroll-fade-up">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            
            {/* Ambient Background Glow Orb behind left column */}
            <div className="absolute -top-20 -left-20 w-96 h-96 bg-emerald-500/10 dark:bg-emerald-500/5 rounded-full blur-3xl -z-10 animate-pulse-slow"></div>

            {/* Hero Left Info */}
            <div className="flex flex-col gap-7 text-left max-w-xl animate-slide-up">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-100/50 dark:border-emerald-900/30 rounded-full text-xs font-bold text-ayurveda-green-700 dark:text-ayurveda-green-400 uppercase tracking-widest self-start shadow-sm">
                <Sparkles size={12} className="animate-spin" style={{ animationDuration: '4s' }} />
                <span>{language === 'en' ? 'AYURVEDIC WELLNESS' : t('heroTag')}</span>
              </div>
              
              {/* FIX 2: Typography Hierarchy - H1 responsive sizes */}
              <h1 className="text-2xl xs:text-3xl sm:text-4xl lg:text-5xl font-bold font-serif text-slate-800 dark:text-zinc-50 leading-tight tracking-tight">
                {language === 'en' ? (
                  <>
                    Restore Your <span className="bg-gradient-to-r from-emerald-600 to-teal-500 bg-clip-text text-transparent italic font-semibold dark:from-emerald-400 dark:to-teal-300">Natural Balance</span> & Inner Health
                  </>
                ) : language === 'mr' ? (
                  <>
                    तुमचे <span className="bg-gradient-to-r from-emerald-600 to-teal-500 bg-clip-text text-transparent italic font-semibold dark:from-emerald-400 dark:to-teal-300">नैसर्गिक संतुलन</span> आणि स्वास्थ्य मिळवा
                  </>
                ) : (
                  <>
                    अपने <span className="bg-gradient-to-r from-emerald-600 to-teal-500 bg-clip-text text-transparent italic font-semibold dark:from-emerald-400 dark:to-teal-300">प्राकृतिक संतुलन</span> और स्वास्थ्य को पाएं
                  </>
                )}
              </h1>
              
              {/* FIX 2: Typography Hierarchy - Body 16px, regular */}
              <p className="text-sm sm:text-base font-normal text-slate-500 dark:text-zinc-400 leading-relaxed font-medium">
                {t('heroDesc')}
              </p>
              
              {/* Call to Actions */}
              <div className="flex flex-col xs:flex-row items-center gap-4 mt-6 w-full">
                {/* Book Appointment CTA */}
                <Link
                  to="/patient-dashboard"
                  className="btn-premium-base appointment-pulse bg-gradient-to-r from-[#2c5e2e] to-[#1b3b1c] text-white font-extrabold text-xs uppercase tracking-widest px-8 rounded-full shadow-lg hover:shadow-emerald-800/30 hover:-translate-y-0.5 active:scale-95 transition-all duration-300 inline-flex items-center justify-center gap-2.5 h-[54px] w-full xs:w-auto min-w-0 xs:min-w-[220px] whitespace-nowrap border border-emerald-700/20"
                >
                  <span>{t('heroCTA1')}</span>
                  <ArrowRight size={14} className="stroke-[2.5]" />
                </Link>
                {/* WhatsApp Contact CTA */}
                <a
                  href="https://wa.me/919145331731"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-premium-base whatsapp-pulse bg-gradient-to-r from-[#20ba59] to-[#25D366] text-white font-extrabold text-xs uppercase tracking-widest px-8 rounded-full shadow-lg hover:shadow-green-500/35 hover:-translate-y-0.5 active:scale-95 transition-all duration-300 inline-flex items-center justify-center gap-2.5 h-[54px] w-full xs:w-auto min-w-0 xs:min-w-[220px] whitespace-nowrap border border-green-500/20"
                >
                  <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.731-1.456L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.825 1.451 5.436 0 9.86-4.42 9.863-9.864.001-2.637-1.03-5.114-2.905-6.989-1.874-1.875-4.352-2.907-6.99-2.908-5.442 0-9.869 4.42-9.873 9.863-.001 1.79.47 3.537 1.366 5.09L1.933 22.007l6.196-1.625c1.472.802 2.871 1.202 4.518 1.202zm11.233-7.618c-.3-.15-1.771-.875-2.071-.985-.3-.11-.52-.16-.74.16-.22.32-.85 1.075-1.04 1.29-.19.22-.38.25-.68.1-.3-.15-1.265-.467-2.41-1.485-.89-.79-1.49-1.77-1.66-2.07-.19-.3-.02-.47.13-.62.14-.13.3-.35.45-.53.15-.17.2-.3.3-.5.1-.2.05-.38-.02-.53-.07-.15-.74-1.785-1.01-2.435-.26-.63-.53-.54-.74-.55-.19-.01-.41-.01-.63-.01-.22 0-.58.08-.88.41-.3.33-1.15 1.13-1.15 2.75 0 1.62 1.18 3.19 1.34 3.4 1.57 2.19 3.01 3.22 4.41 3.72.63.22 1.12.27 1.54.2.47-.07 1.45-.59 1.65-1.17.2-.58.2-1.08.14-1.18-.06-.1-.22-.15-.52-.3z"/>
                  </svg>
                  <span>{language === 'mr' ? 'व्हॉट्सॲप संपर्क' : language === 'hi' ? 'व्हाट्सएप संपर्क' : 'WhatsApp Us'}</span>
                </a>
              </div>

              {/* Glass Trust Metrics Card */}
              <div className="grid grid-cols-3 gap-2 sm:gap-4 border border-slate-200/50 dark:border-zinc-800/80 bg-white/40 dark:bg-zinc-900/10 backdrop-blur-md p-3 sm:p-5.5 rounded-3xl mt-6 shadow-md shadow-slate-100/5 animate-slide-up" style={{ animationDelay: '0.2s' }}>
                <div className="text-center">
                  {/* FIX 2: Typography Hierarchy - Important numbers 20px, semi-bold with accent color */}
                  <span className="block text-base sm:text-[20px] font-semibold text-ayurveda-green-700 dark:text-ayurveda-green-400">5+</span>
                  <span className="text-[8px] sm:text-[9px] font-extrabold tracking-wider uppercase text-slate-400 dark:text-zinc-500 mt-1 sm:mt-1.5 block">{t('yearsExp')}</span>
                </div>
                <div className="text-center border-x border-slate-200/40 dark:border-zinc-800/65">
                  {/* FIX 2: Typography Hierarchy - Important numbers 20px, semi-bold with accent color */}
                  <span className="block text-base sm:text-[20px] font-semibold text-ayurveda-green-700 dark:text-ayurveda-green-400">5k+</span>
                  <span className="text-[8px] sm:text-[9px] font-extrabold tracking-wider uppercase text-slate-400 dark:text-zinc-500 mt-1 sm:mt-1.5 block">{t('satisfiedPatients')}</span>
                </div>
                <div className="text-center">
                  {/* FIX 2: Typography Hierarchy - Important numbers 20px, semi-bold with accent color */}
                  <span className="block text-base sm:text-[20px] font-semibold text-ayurveda-green-700 dark:text-ayurveda-green-400">98%</span>
                  <span className="text-[8px] sm:text-[9px] font-extrabold tracking-wider uppercase text-slate-400 dark:text-zinc-500 mt-1 sm:mt-1.5 block">{t('successRate')}</span>
                </div>
              </div>

            </div>

            {/* Hero Right image frame */}
            <div className="relative flex justify-center lg:justify-end animate-fade-in px-4 sm:px-0">
              <div className="absolute inset-0 bg-gradient-to-tr from-ayurveda-green-200 to-ayurveda-saffron-100 dark:from-emerald-950/20 dark:to-orange-950/10 rounded-full blur-3xl opacity-60 -z-10 transform scale-95"></div>
              
              {/* Rotating balance ring background */}
              <div className="absolute -inset-4 border border-dashed border-emerald-500/35 dark:border-emerald-500/10 rounded-[3.5rem] animate-spin pointer-events-none" style={{ animationDuration: '80s' }}></div>

              <div className="relative max-w-sm w-full aspect-[3/4]">
                
                {/* Doctor Avatar Framing with glow effect */}
                {/* FIX 1: Subtle card scale transform + shadow on hover (hover-card-feedback) */}
                <div className="relative w-full h-full border-8 border-white dark:border-zinc-900 rounded-[3rem] shadow-2xl overflow-hidden glow-border z-10 hover-card-feedback">
                  {/* FIX 2: Descriptive alt text on doctor image */}
                  <ImageWithSkeleton
                    src="/doctor_avatar.jpg"
                    alt={t('doctorPortraitAlt')}
                    className="w-full h-full object-cover object-center transform hover:scale-105 duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent"></div>
                </div>

                {/* Upper Floating Badge */}
                <div className="absolute -top-5 -right-2 sm:-right-5 bg-gradient-to-r from-amber-500 to-orange-500 text-white p-3 py-2.5 sm:p-3.5 sm:px-5 rounded-[1.8rem] shadow-2xl z-20 hover:scale-105 transition-all select-none border border-amber-400/20">
                  <div className="flex items-center gap-1.5 sm:gap-2">
                    <Sparkles size={13} className="animate-spin text-amber-200" style={{ animationDuration: '6s' }} />
                    <div className="text-left leading-none">
                      <span className="block text-[8px] font-extrabold tracking-widest uppercase text-amber-100 mb-0.5">{language === 'mr' ? 'तज्ञ वैद्य' : language === 'hi' ? 'विशेषज्ञ चिकित्सक' : 'Expert Physician'}</span>
                      <span className="block text-[10px] sm:text-xs font-extrabold">{t('doctorDegrees')}</span>
                    </div>
                  </div>
                </div>
                
                {/* Floating stats card */}
                {/* FIX 1: Subtle card scale transform + shadow on hover (hover-card-feedback) */}
                <div className="absolute -bottom-4 -left-2 sm:-bottom-6 sm:-left-6 bg-white/95 dark:bg-zinc-900/95 backdrop-blur-md border border-slate-100 dark:border-zinc-800 p-4 px-5 sm:p-5 sm:px-7 rounded-[2rem] shadow-2xl z-20 hover-card-feedback select-none">
                  {/* FIX 2: Typography Hierarchy - Important numbers 20px, semi-bold with accent color */}
                  <span className="block text-base sm:text-[20px] font-semibold text-[#1c452d] dark:text-[#46ca96] leading-none">5,000+</span>
                  <span className="text-[8px] sm:text-[9px] text-slate-400 dark:text-zinc-500 font-extrabold tracking-wider uppercase mt-1.5 block">
                    {language === 'mr' ? 'रुग्ण बरे झाले' : language === 'hi' ? 'मरीज ठीक हुए' : 'Patients Healed'}
                  </span>
                </div>

              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 2. ABOUT DOCTOR SECTION */}
      {/* FIX 4: Scroll Micro-interaction - scroll-fade-up class adds animation */}
      <section id="about" className="py-24 bg-slate-50 dark:bg-zinc-900/30 transition-colors duration-300 scroll-fade-up">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            
            {/* Left Box (Text Info) */}
            <div className="flex flex-col gap-6 text-left">
              <div>
                {/* FIX 2: Typography Hierarchy - H2 24px, semi-bold */}
                <h2 className="text-[24px] font-semibold text-slate-800 dark:text-zinc-100 font-serif leading-tight">
                  {t('aboutTitle')}
                </h2>
                <span className="block h-1 w-20 bg-gradient-to-r from-ayurveda-green-50 to-ayurveda-saffron-50 mt-4 rounded-full"></span>
              </div>
              
              <div className="space-y-5 text-slate-550 dark:text-zinc-400">
                {/* FIX 2: Typography Hierarchy - Body 16px, regular */}
                <p className="leading-relaxed text-[16px] font-normal text-slate-700 dark:text-zinc-300">
                  {t('aboutDesc1')}
                </p>
                {/* FIX 2: Typography Hierarchy - Body 16px, regular */}
                <p className="leading-relaxed text-[16px] font-normal">
                  {t('aboutDesc2')}
                </p>
              </div>

              <div className="mt-4">
                {/* FIX 2: Typography Hierarchy - H4 (subheading) 18px, semi-bold */}
                <h4 className="font-semibold text-slate-800 dark:text-zinc-205 text-[18px] mb-4.5 uppercase tracking-widest">{t('specialties')}</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {[1, 2, 3, 4].map((idx) => (
                    <div key={idx} className="flex items-center gap-3">
                      <div className="w-6 h-6 rounded-full bg-emerald-50 dark:bg-emerald-950/40 flex items-center justify-center text-ayurveda-green-600 dark:text-ayurveda-green-400">
                        <Check size={13} className="stroke-[3.5]" />
                      </div>
                      {/* FIX 2: Typography Hierarchy - Body 16px, regular */}
                      <span className="text-[16px] font-normal text-slate-700 dark:text-zinc-300">{t(`specialty${idx}`)}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Box (Clinical features) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              
              {/* FIX 5: Semantic landmark - specialty card 1 changed to article */}
              <article className="bg-white dark:bg-zinc-900 border border-slate-100 dark:border-zinc-800/80 p-7 rounded-[2rem] shadow-sm text-left hover-card-feedback transition-all duration-300 group">
                <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-950/30 text-ayurveda-green-600 dark:text-ayurveda-green-400 flex items-center justify-center mb-5 group-hover:scale-105 duration-350">
                  <Bone size={22} className="stroke-[2.2]" />
                </div>
                {/* FIX 2: Typography Hierarchy - H4 18px, semi-bold */}
                <h4 className="font-semibold text-[18px] text-slate-800 dark:text-zinc-100 mb-1.5">{t('specialty1')}</h4>
                {/* FIX 2: Typography Hierarchy - Body 16px, regular */}
                <p className="text-[16px] font-normal text-slate-400 dark:text-zinc-400 leading-relaxed">Deep herbal basti heat treatments targeting joint lubrication.</p>
              </article>

              {/* FIX 5: Semantic landmark - specialty card 2 changed to article */}
              <article className="bg-white dark:bg-zinc-900 border border-slate-100 dark:border-zinc-800/80 p-7 rounded-[2rem] shadow-sm text-left hover-card-feedback transition-all duration-300 group">
                <div className="w-12 h-12 rounded-2xl bg-orange-50 dark:bg-orange-950/30 text-ayurveda-saffron-500 dark:text-ayurveda-saffron-400 flex items-center justify-center mb-5 group-hover:scale-105 duration-350">
                  <Activity size={22} className="stroke-[2.2]" />
                </div>
                {/* FIX 2: Typography Hierarchy - H4 18px, semi-bold */}
                <h4 className="font-semibold text-[18px] text-slate-800 dark:text-zinc-100 mb-1.5">{t('specialty2')}</h4>
                {/* FIX 2: Typography Hierarchy - Body 16px, regular */}
                <p className="text-[16px] font-normal text-slate-400 dark:text-zinc-400 leading-relaxed">Full detoxification using natural herbs to reset blood circulation.</p>
              </article>

              {/* FIX 5: Semantic landmark - specialty card 3 changed to article */}
              <article className="bg-white dark:bg-zinc-900 border border-slate-100 dark:border-zinc-800/80 p-7 rounded-[2rem] shadow-sm text-left hover-card-feedback transition-all duration-300 group">
                <div className="w-12 h-12 rounded-2xl bg-purple-50 dark:bg-purple-950/30 text-purple-600 dark:text-purple-400 flex items-center justify-center mb-5 group-hover:scale-105 duration-350">
                  <BookOpen size={22} className="stroke-[2.2]" />
                </div>
                {/* FIX 2: Typography Hierarchy - H4 18px, semi-bold */}
                <h4 className="font-semibold text-[18px] text-slate-800 dark:text-zinc-100 mb-1.5">Authentic Sastras</h4>
                {/* FIX 2: Typography Hierarchy - Body 16px, regular */}
                <p className="text-[16px] font-normal text-slate-400 dark:text-zinc-400 leading-relaxed">Blending scriptural insights with modern diagnostics.</p>
              </article>

              {/* FIX 5: Semantic landmark - specialty card 4 changed to article */}
              <article className="bg-white dark:bg-zinc-900 border border-slate-100 dark:border-zinc-800/80 p-7 rounded-[2rem] shadow-sm text-left hover-card-feedback transition-all duration-300 group">
                <div className="w-12 h-12 rounded-2xl bg-amber-50 dark:bg-amber-950/30 text-amber-500 flex items-center justify-center mb-5 group-hover:scale-105 duration-350">
                  <Users size={22} className="stroke-[2.2]" />
                </div>
                {/* FIX 2: Typography Hierarchy - H4 18px, semi-bold */}
                <h4 className="font-semibold text-[18px] text-slate-800 dark:text-zinc-100 mb-1.5">{t('specialty4')}</h4>
                {/* FIX 2: Typography Hierarchy - Body 16px, regular */}
                <p className="text-[16px] font-normal text-slate-400 dark:text-zinc-400 leading-relaxed">Empathetic care plans centered around patient recovery.</p>
              </article>
            </div>
          </div>
        </div>
      </section>

      {/* 3. TREATMENTS SECTION (Services Grid) */}
      {/* FIX 4: Scroll Micro-interaction - scroll-fade-up class adds animation */}
      <section id="treatments" className="py-24 bg-[#faf7e6]/60 dark:bg-zinc-950/40 border-t border-slate-200/20 dark:border-zinc-900 transition-colors duration-300 scroll-fade-up">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="max-w-3xl mx-auto mb-16 text-center">
            {/* FIX 2: Typography Hierarchy - H2 24px, semi-bold */}
            <h2 className="text-[24px] font-semibold text-slate-800 dark:text-zinc-50 leading-tight font-serif">
              {t('treatmentTitle')}
            </h2>
            {/* FIX 2: Typography Hierarchy - Body 16px, regular */}
            <p className="text-slate-500 dark:text-zinc-400 mt-4 text-[16px] font-normal leading-relaxed">
              {t('treatmentSubtitle')}
            </p>
          </div>

          {/* Condition Filter Bar */}
          <div className="flex flex-col items-center gap-3.5 mb-14 animate-slide-up">
            <span className="text-xs font-extrabold uppercase tracking-widest text-ayurveda-green-700 dark:text-ayurveda-green-400 flex items-center gap-1.5">
              <Sparkles size={12} className="animate-pulse" />
              <span>{language === 'mr' ? 'तुमच्या लक्षणानुसार उपचार निवडा:' : language === 'hi' ? 'अपने लक्षणों के अनुसार उपचार चुनें:' : 'Filter by Condition / Symptom:'}</span>
            </span>
            <div className="flex flex-wrap justify-center gap-2.5 max-w-4xl px-4">
              {conditionFilters.map((filter) => (
                <button
                  key={filter.id}
                  onClick={() => setSelectedCondition(filter.id)}
                  /* FIX 5: Tap target size - min-h-[48px] ensures >48x48px hit area */
                  className={`px-5 py-2.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider transition-all duration-300 border min-h-[48px] ${
                    selectedCondition === filter.id
                      ? 'bg-[#1c452d] text-white border-[#1c452d] dark:bg-emerald-500 dark:border-emerald-500 dark:text-zinc-950 shadow-md scale-105'
                      : 'bg-white hover:bg-slate-50 dark:bg-zinc-900 dark:hover:bg-zinc-800 text-slate-600 dark:text-zinc-400 border-slate-200/80 dark:border-zinc-800/85 hover:scale-[1.01]'
                  }`}
                >
                  {filter.label}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {(Array.isArray(t('servicesData')) ? t('servicesData') : []).map((s) => {
              const isMatching = selectedCondition === 'all' || 
                                 (serviceConditionMapping[s.id] && serviceConditionMapping[s.id].includes(selectedCondition));
              return (
                /* FIX 5: Semantic landmark - changed service card to article */
                <article 
                  key={s.id} 
                  /* FIX 1: Subtle card scale transform + shadow on hover (hover-card-feedback) */
                  className={`bg-white dark:bg-zinc-900 border rounded-[2.5rem] overflow-hidden flex flex-col p-4 shadow-sm transition-all duration-500 group relative hover-card-feedback ${
                    selectedCondition !== 'all' && isMatching 
                      ? 'ring-2 ring-emerald-500/40 dark:ring-emerald-500/30 border-emerald-400 dark:border-emerald-500 shadow-xl shadow-emerald-950/5 scale-[1.01] z-10' 
                      : selectedCondition !== 'all' 
                        ? 'opacity-30 saturate-[0.15] scale-[0.97] pointer-events-none' 
                        : 'border-slate-200/40 dark:border-zinc-800/60 hover:shadow-xl hover:-translate-y-1.5'
                  }`}
                >
                  {/* Recommended Badge */}
                  {selectedCondition !== 'all' && isMatching && (
                    <div className="absolute top-6 right-6 z-10 bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-extrabold text-[8px] uppercase tracking-widest px-3 py-1 rounded-full shadow-md shadow-emerald-950/15">
                      {language === 'mr' ? 'शिफारस केलेले' : language === 'hi' ? 'अनुशंसित' : 'Recommended'}
                    </div>
                  )}

                  {/* Card Top Inset Image */}
                  <div className="rounded-3xl overflow-hidden aspect-[4/3] w-full mb-6 relative bg-slate-100 dark:bg-zinc-800">
                    {/* FIX 3: Image Shimmer skeleton applied via ImageWithSkeleton component */}
                    <ImageWithSkeleton 
                      src={s.image} 
                      alt={s.title} 
                      className="w-full h-full object-cover transform group-hover:scale-105 duration-700" 
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 duration-500"></div>
                  </div>
                  
                  {/* Card Body */}
                  <div className="px-2.5 flex-grow flex flex-col justify-between">
                    <div>
                      {/* FIX 2: Typography Hierarchy - H3 18px, semi-bold */}
                      <h3 className="font-serif text-[18px] font-semibold text-slate-805 dark:text-zinc-100 mb-3 group-hover:text-ayurveda-green-700 dark:group-hover:text-ayurveda-green-400 transition-colors">
                        {s.title}
                      </h3>
                      {/* FIX 2: Typography Hierarchy - Body 16px, regular */}
                      <p className="text-slate-500 dark:text-zinc-400 text-[16px] font-normal leading-relaxed mb-6">
                        {s.desc}
                      </p>
                    </div>
                    
                    <div>
                      <hr className="border-slate-200/50 dark:border-zinc-800/80 my-5" />
                      
                      <div className="mb-2">
                        <span className="text-[10px] font-extrabold tracking-widest text-[#b45309] dark:text-amber-500 uppercase block mb-3.5">
                          {t('keyBenefits')}
                        </span>
                        <ul className="space-y-2.5">
                          {s.benefits && s.benefits.map((b, idx) => (
                            /* FIX 2: Typography Hierarchy - Body 16px, regular */
                            <li key={idx} className="flex items-start gap-3 text-slate-605 dark:text-zinc-300 text-[16px] font-normal group-hover:translate-x-0.5 transition-transform">
                              <span className="text-ayurveda-green-605 dark:text-ayurveda-green-400 shrink-0 font-extrabold">✓</span>
                              <span>{b}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                  </div>
                </article>
              );
            })}
          </div>

          <div className="mt-20 text-center">
            <Link
              to="/patient-dashboard"
              className="btn-premium-base appointment-pulse bg-gradient-to-r from-[#2c5e2e] to-[#1b3b1c] text-white font-extrabold text-xs uppercase tracking-widest px-8 rounded-full shadow-lg hover:shadow-emerald-800/30 hover:-translate-y-0.5 active:scale-95 transition-all duration-300 inline-flex items-center justify-center gap-2.5 h-[54px] min-w-[220px] whitespace-nowrap border border-emerald-700/20"
            >
              <Calendar size={14} />
              <span>{t('bookNow')}</span>
            </Link>
          </div>

        </div>
      </section>

      {/* 4. PREMIUM TESTIMONIALS INTERACTIVE CAROUSEL SLIDER */}
      {/* FIX 4: Scroll Micro-interaction - scroll-fade-up class adds animation */}
      <section className="py-24 bg-gradient-to-b from-slate-50 to-white dark:from-zinc-900/30 dark:to-zinc-950 transition-colors duration-300 relative overflow-hidden scroll-fade-up">
        
        {/* Background ambient gold/green glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[300px] bg-gradient-to-tr from-emerald-500/5 to-amber-500/5 rounded-full blur-3xl pointer-events-none"></div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          
          <div className="max-w-2xl mx-auto mb-16 animate-slide-up">
            <div className="inline-flex items-center gap-1 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-100/50 dark:border-emerald-900/40 rounded-full px-3 py-1 text-[10px] font-extrabold uppercase tracking-widest text-ayurveda-green-650 dark:text-ayurveda-green-400 mb-4">
              <span>★ ★ ★ ★ ★ Testimonials</span>
            </div>
            {/* FIX 2: Typography Hierarchy - H2 24px, semi-bold */}
            <h2 className="text-[24px] font-semibold text-slate-805 dark:text-zinc-50 font-serif leading-tight">{t('testiTitle')}</h2>
            {/* FIX 2: Typography Hierarchy - Body 16px, regular */}
            <p className="text-slate-500 dark:text-zinc-400 mt-3.5 text-[16px] font-normal leading-relaxed">{t('testiSubtitle')}</p>
          </div>

          {/* Testimonial Active Slide Container */}
          <div className="relative">
            
            {/* Nav Arrows */}
            {/* FIX 5: Tap target size - w-12 h-12 ensures >48x48px hit area */}
            <div className="absolute -left-4 sm:-left-16 top-1/2 -translate-y-1/2 z-20">
              <button 
                onClick={prevTesti}
                className="w-12 h-12 rounded-full border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-slate-600 dark:text-zinc-400 hover:bg-slate-50 dark:hover:bg-zinc-800 hover:scale-105 active:scale-95 transition-all shadow-md flex items-center justify-center min-h-[48px] min-w-[48px]"
                title="Previous Testimonial"
              >
                <ChevronLeft size={20} className="stroke-[2.5]" />
              </button>
            </div>
            
            {/* FIX 5: Tap target size - w-12 h-12 ensures >48x48px hit area */}
            <div className="absolute -right-4 sm:-right-16 top-1/2 -translate-y-1/2 z-20">
              <button 
                onClick={nextTesti}
                className="w-12 h-12 rounded-full border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-slate-600 dark:text-zinc-355 hover:bg-slate-50 dark:hover:bg-zinc-800 hover:scale-105 active:scale-95 transition-all shadow-md flex items-center justify-center min-h-[48px] min-w-[48px]"
                title="Next Testimonial"
              >
                <ChevronRight size={20} className="stroke-[2.5]" />
              </button>
            </div>

            {/* Testimonial Card */}
            {/* FIX 5: Semantic landmark - changed testimonial card to article */}
            {/* FIX 1: Subtle card scale transform + shadow on hover (hover-card-feedback) */}
            <article className="bg-white/80 dark:bg-zinc-900/80 backdrop-blur-xl border border-slate-100 dark:border-zinc-800 p-8 sm:p-12 rounded-[2.5rem] shadow-xl text-left relative min-h-[250px] flex flex-col justify-between hover-card-feedback transition-all duration-300 transform">
              
              {/* Star Rating & Quote Mark Overlay */}
              <div className="flex justify-between items-center mb-6">
                <div className="flex text-amber-500 gap-0.5 text-sm">
                  <span>★</span><span>★</span><span>★</span><span>★</span><span>★</span>
                </div>
                <span className="text-ayurveda-green-100 dark:text-zinc-800 text-7xl font-serif leading-none select-none absolute right-10 top-6 opacity-30">“</span>
              </div>

              {/* Message text */}
              <p className="text-base sm:text-lg italic font-serif leading-relaxed text-slate-700 dark:text-zinc-300 relative z-10 mb-8 pl-1.5 border-l-2 border-ayurveda-green-500">
                "{t(`testiText${activeTesti + 1}`)}"
              </p>

              {/* Reviewer Details */}
              <div className="flex flex-wrap sm:flex-nowrap items-center justify-between gap-4 border-t border-slate-100 dark:border-zinc-800 pt-6">
                <div className="flex items-center gap-3.5">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-ayurveda-green-600 to-ayurveda-green-700 text-white flex items-center justify-center font-extrabold text-sm shadow-md">
                    {t(`testiName${activeTesti + 1}`).split(' ')[0][0]}{t(`testiName${activeTesti + 1}`).split(' ')[1][0]}
                  </div>
                  <div>
                    <h4 className="font-extrabold text-sm text-slate-800 dark:text-zinc-100 flex items-center gap-1.5">
                      <span>{t(`testiName${activeTesti + 1}`)}</span>
                    </h4>
                    <span className="text-[10px] text-slate-400 dark:text-zinc-500 font-bold uppercase tracking-wider block mt-0.5">{t(`testiRole${activeTesti + 1}`)}</span>
                  </div>
                </div>
                
                {/* Verified Badge */}
                <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-100/50 dark:border-emerald-900/30 text-[9px] font-extrabold text-ayurveda-green-700 dark:text-ayurveda-green-400 uppercase tracking-widest shrink-0 self-end sm:self-center">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block animate-pulse"></span>
                  <span>Verified Patient</span>
                </div>
              </div>

            </article>

          </div>

          {/* Slider indicator dots */}
          <div className="flex justify-center items-center gap-2 mt-8">
            {[0, 1, 2].map((idx) => (
              /* FIX 5: Tap target size - min-h-[48px] trigger area check */
              <button
                key={idx}
                onClick={() => setActiveTesti(idx)}
                className={`h-2 rounded-full transition-all duration-300 min-h-[48px] py-5 px-1.5 flex items-center ${activeTesti === idx ? 'w-6' : 'w-2'}`}
                title={`Go to testimonial ${idx + 1}`}
              >
                <span className={`h-2 rounded-full w-full transition-all duration-300 ${activeTesti === idx ? 'bg-ayurveda-green-600' : 'bg-slate-200 dark:bg-zinc-800'}`}></span>
              </button>
            ))}
          </div>

        </div>
      </section>

      {/* PROBLEM 3 FIX: Visual separator between Testimonials and FAQs (gradient line with sparkle badge) */}
      <div className="max-w-xl mx-auto px-4 mt-12 mb-4 opacity-40">
        <div className="flex items-center gap-4">
          <div className="h-[1px] bg-gradient-to-r from-transparent to-emerald-600 dark:to-emerald-400 flex-grow"></div>
          <Sparkles size={16} className="text-emerald-600 dark:text-emerald-400" />
          <div className="h-[1px] bg-gradient-to-l from-transparent to-emerald-600 dark:to-emerald-400 flex-grow"></div>
        </div>
      </div>

      {/* 5. FAQs SECTION WITH DYNAMIC SEARCH */}
      {/* PROBLEM 3 FIX: Distinct background color gradient + border top for clear demarcation */}
      <section className="py-24 bg-gradient-to-b from-emerald-50/10 to-slate-50/20 dark:from-zinc-950 dark:to-zinc-900/10 border-t border-slate-100 dark:border-zinc-900/50 transition-colors duration-300 scroll-fade-up">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center mb-16">
            {/* PROBLEM 3 FIX: Visual entry point badge icon */}
            <span className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-emerald-100/70 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 mb-4.5 shadow-sm">
              <BookOpen size={20} className="stroke-[2.5]" />
            </span>
            {/* FIX 2: Typography Hierarchy - H2 24px, semi-bold */}
            <h2 className="text-[24px] font-semibold text-slate-800 dark:text-zinc-50 font-serif leading-tight">{t('faqTitle')}</h2>
            {/* FIX 2: Typography Hierarchy - Body 16px, regular */}
            <p className="text-slate-500 dark:text-zinc-400 mt-3 text-[16px] font-normal leading-relaxed">{t('faqSubtitle')}</p>
            
            {/* PROBLEM 2 FIX: Working real-time search input box with clear (✕) button */}
            <div className="max-w-md mx-auto mt-8 relative">
              <input
                type="text"
                value={faqSearch}
                onChange={(e) => setFaqSearch(e.target.value)}
                placeholder="Search clinic FAQs..."
                className="w-full pl-11 pr-12 py-3 rounded-full border border-slate-200 dark:border-zinc-800 dark:bg-zinc-900 text-xs focus:ring-2 focus:ring-ayurveda-green-500 focus:outline-none dark:text-zinc-200 shadow-sm min-h-[48px]"
              />
              <span className="absolute inset-y-0 left-0 pl-4 flex items-center text-slate-400 pointer-events-none">
                <Search size={14} />
              </span>
              {faqSearch && (
                <button
                  onClick={() => setFaqSearch('')}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-slate-600 dark:hover:text-zinc-300 min-w-[48px] justify-center transition-colors"
                  aria-label="Clear search"
                  type="button"
                >
                  ✕
                </button>
              )}
            </div>
          </div>

          <div className="space-y-4">
            {filteredFaqs.length === 0 ? (
              /* PROBLEM 2 FIX: Fallback for zero matching results */
              <p className="text-center text-xs text-slate-400 font-bold py-10">No matching FAQs found.</p>
            ) : (
              filteredFaqs.map((faq, index) => (
                /* PROBLEM 1 FIX: Fully functional FAQ accordion with smooth animations and plus/minus icons */
                <div
                  key={index}
                  className="border border-slate-100 dark:border-zinc-800 rounded-[1.8rem] overflow-hidden bg-slate-50/20 dark:bg-zinc-900/10 hover:border-slate-200 dark:hover:border-zinc-800 duration-300 shadow-sm"
                >
                  <button
                    onClick={() => toggleFaq(index)}
                    className="w-full flex justify-between items-center p-5.5 text-left font-bold text-sm text-slate-700 dark:text-zinc-200 hover:bg-slate-50 dark:hover:bg-zinc-900/60 transition-colors duration-200 min-h-[48px]"
                    aria-expanded={openFaq === index}
                  >
                    <span>{faq.q}</span>
                    <span className="ml-4 shrink-0">
                      {openFaq === index ? (
                        <Minus size={16} className="text-ayurveda-green-600 dark:text-ayurveda-green-400 transition-all duration-300 scale-110" />
                      ) : (
                        <Plus size={16} className="text-slate-400 hover:text-slate-600 dark:text-zinc-500 dark:hover:text-zinc-400 transition-all duration-300" />
                      )}
                    </span>
                  </button>
                  {/* PROBLEM 1 FIX: Smooth transition height animation using modern grid-template-rows transition */}
                  <div className={`grid transition-[grid-template-rows] duration-300 ease-in-out ${openFaq === index ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}`}>
                    <div className="overflow-hidden">
                      <div className="px-5.5 pb-5.5 pt-1.5 text-xs leading-relaxed text-slate-500 dark:text-zinc-400 border-t border-slate-100/50 dark:border-zinc-800 bg-white dark:bg-zinc-900/20">
                        {faq.a}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

        </div>
      </section>

      {/* 6. CONTACT SECTION & MAPS */}
      {/* FIX 4: Scroll Micro-interaction - scroll-fade-up class adds animation */}
      <section id="contact" className="py-24 bg-slate-50 dark:bg-zinc-900/30 transition-colors duration-300 scroll-fade-up">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center mb-20">
            {/* FIX 2: Typography Hierarchy - H2 24px, semi-bold */}
            <h2 className="text-[24px] font-semibold text-slate-800 dark:text-zinc-50 font-serif leading-tight">{t('contactTitle')}</h2>
            {/* FIX 2: Typography Hierarchy - Body 16px, regular */}
            <p className="text-slate-500 dark:text-zinc-400 mt-3 text-[16px] font-normal leading-relaxed">{t('contactSubtitle')}</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-stretch">
            
            {/* Contact details box */}
            {/* FIX 5: Semantic landmark - changed contact container box to article */}
            <article className="flex flex-col gap-8 bg-white dark:bg-zinc-900 border border-slate-100 dark:border-zinc-800/80 p-8 sm:p-10 rounded-[2.5rem] shadow-sm text-left justify-between hover-card-feedback transition-all duration-300">
              
              <div className="space-y-6">
                <div>
                  <h4 className="font-extrabold text-lg text-slate-800 dark:text-zinc-100 leading-tight">{t('clinicName')}</h4>
                  <p className="text-[10px] text-ayurveda-saffron-600 dark:text-ayurveda-saffron-400 font-extrabold uppercase tracking-widest mt-1">{t('clinicSub')}</p>
                </div>

                <div className="space-y-5">
                  {/* FIX 5: Tap target size - Map link min-h-[48px] with clear hit area */}
                  <a 
                    href="https://maps.google.com/?q=Shree+Chiranjeevi+Ayurveda+Clinic+Warud" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="flex items-start gap-4 min-h-[48px] p-2.5 -m-2.5 rounded-2xl hover:bg-slate-50 dark:hover:bg-zinc-800/40 transition-colors"
                  >
                    <div className="w-11 h-11 rounded-2xl bg-orange-50/70 dark:bg-orange-950/20 text-ayurveda-saffron-500 flex items-center justify-center shrink-0">
                      <MapPin size={18} className="stroke-[2.2]" />
                    </div>
                    <div>
                      <span className="block text-[9px] font-extrabold text-slate-400 dark:text-zinc-400 uppercase tracking-widest">{t('addressLabel')}</span>
                      <span className="text-xs font-bold text-slate-700 dark:text-zinc-300 leading-snug mt-0.5 block">{t('addressVal')}</span>
                    </div>
                  </a>

                  {/* FIX 5: Tap target size - Phone link min-h-[48px] with clear hit area */}
                  <a 
                    href={`tel:${t('phoneVal')}`} 
                    className="flex items-center gap-4 min-h-[48px] p-2.5 -m-2.5 rounded-2xl hover:bg-slate-50 dark:hover:bg-zinc-800/40 transition-colors"
                  >
                    <div className="w-11 h-11 rounded-2xl bg-emerald-50/70 dark:bg-emerald-950/20 text-ayurveda-green-600 flex items-center justify-center shrink-0">
                      <Phone size={18} className="stroke-[2.2]" />
                    </div>
                    <div>
                      <span className="block text-[9px] font-extrabold text-slate-400 dark:text-zinc-400 uppercase tracking-widest">{t('phoneLabel')}</span>
                      <span className="text-xs font-extrabold text-slate-800 dark:text-zinc-200 mt-0.5 block">{t('phoneVal')}</span>
                    </div>
                  </a>

                  <div className="flex items-start gap-4 p-2.5 -m-2.5">
                    <div className="w-11 h-11 rounded-2xl bg-slate-50 dark:bg-zinc-800/80 text-slate-500 flex items-center justify-center shrink-0">
                      <Clock size={18} className="stroke-[2.2]" />
                    </div>
                    <div>
                      <span className="block text-[9px] font-extrabold text-slate-400 dark:text-zinc-400 uppercase tracking-widest">{t('hoursLabel')}</span>
                      <span className="text-xs font-bold text-slate-700 dark:text-zinc-300 leading-snug mt-0.5 block">{t('hoursVal')}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Direct email messaging form */}
              <form onSubmit={handleContactSubmit} className="border-t border-slate-100 dark:border-zinc-800/80 pt-7 space-y-4">
                <div>
                  <label className="block text-[10px] font-extrabold text-slate-400 dark:text-zinc-500 uppercase tracking-widest mb-2">{t('yourEmail')}</label>
                  {/* FIX 5: Tap target size - min-h-[48px] input field */}
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@email.com"
                    className="w-full px-4 py-3 rounded-2xl border border-slate-200 dark:border-zinc-800 dark:bg-zinc-955 text-xs focus:ring-2 focus:ring-ayurveda-green-500 focus:outline-none dark:text-zinc-100 font-semibold min-h-[48px]"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-extrabold text-slate-400 dark:text-zinc-500 uppercase tracking-widest mb-2">{t('yourMessage')}</label>
                  <textarea
                    rows="3"
                    required
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Write your questions here..."
                    className="w-full px-4 py-3 rounded-2xl border border-slate-200 dark:border-zinc-800 dark:bg-zinc-950 text-xs focus:ring-2 focus:ring-ayurveda-green-500 focus:outline-none dark:text-zinc-100 resize-none font-semibold"
                  ></textarea>
                </div>
                {/* FIX 5: Tap target size - min-h-[48px] form submit button */}
                {/* FIX 1: Color transition on hover */}
                <button
                  type="submit"
                  disabled={formSending}
                  className="w-full bg-[#1c452d] hover:bg-[#132f1f] text-white font-bold text-xs uppercase tracking-widest py-3.5 rounded-2xl transition-all duration-300 shadow-md shadow-emerald-700/10 min-h-[48px]"
                >
                  {formSending ? t('loading') : t('sendMessage')}
                </button>
              </form>

            </article>

            {/* Google Map iframe */}
            <div className="rounded-[2.5rem] overflow-hidden shadow-sm border border-slate-100 dark:border-zinc-800/80 min-h-[400px] relative">
              <iframe
                title={t('mapEmbedTitle')}
                src="https://www.google.com/maps/embed?pb=!1m2!2m1!1sF7G9%2BJPF%2C+Warud%2C+Maharashtra+444906"
                width="100%"
                height="100%"
                style={{ border: 0, minHeight: '400px' }}
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
