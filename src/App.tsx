/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Leaf, 
  Tractor, 
  Droplets, 
  Sprout, 
  Wheat, 
  User as UserIcon, 
  Settings, 
  LogOut, 
  MessageCircle, 
  Calendar as CalendarIcon, 
  TrendingUp, 
  ShoppingBag, 
  ChevronRight, 
  MapPin, 
  Star, 
  Search, 
  Filter, 
  ArrowLeft, 
  Camera, 
  Globe, 
  Moon, 
  Sun, 
  Send,
  Clock,
  CheckCircle2,
  AlertCircle,
  AlertTriangle,
  X
} from 'lucide-react';
import { Role, Language, User, CropData, Task, Order, ChatMessage, Provider } from './types';
import { TRANSLATIONS, MOCK_PROVIDERS, MOCK_TASKS, MOCK_ORDERS } from './constants';
import { useAI } from './hooks/useAI';

// --- Components ---

const Button = ({ children, onClick, variant = 'primary', className = '', disabled = false }: any) => {
  const variants: any = {
    primary: 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-md',
    secondary: 'bg-amber-100 text-amber-900 hover:bg-amber-200',
    outline: 'border-2 border-emerald-600 text-emerald-600 hover:bg-emerald-50',
    ghost: 'text-gray-600 hover:bg-gray-100',
    danger: 'bg-rose-500 text-white hover:bg-rose-600',
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`px-6 py-3 rounded-2xl font-semibold transition-all active:scale-95 disabled:opacity-50 disabled:pointer-events-none flex items-center justify-center gap-2 ${variants[variant]} ${className}`}
    >
      {children}
    </button>
  );
};

const Input = ({ label, value, onChange, type = 'text', placeholder, icon: Icon, className = '' }: any) => (
  <div className={`flex flex-col gap-1.5 ${className}`}>
    {label && <label className="text-sm font-medium text-gray-700 ml-1">{label}</label>}
    <div className="relative">
      {Icon && <Icon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />}
      <input
        type={type}
        value={value || ''}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={`w-full px-4 py-3 ${Icon ? 'pl-12' : ''} bg-white border border-gray-200 rounded-2xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all shadow-sm`}
      />
    </div>
  </div>
);

const Card = ({ children, onClick, className = '', active = false }: any) => (
  <motion.div
    whileHover={{ y: -2 }}
    whileTap={{ scale: 0.98 }}
    onClick={onClick}
    className={`p-5 rounded-3xl bg-white border-2 transition-all cursor-pointer shadow-sm ${
      active ? 'border-emerald-500 bg-emerald-50/50' : 'border-gray-100 hover:border-emerald-200'
    } ${className}`}
  >
    {children}
  </motion.div>
);

// --- Main App ---

export default function App() {
  const [screen, setScreen] = useState<'auth' | 'role-selection' | 'onboarding' | 'field-setup' | 'dashboard' | 'marketplace' | 'growth' | 'profile' | 'chat'>('auth');
  const [language, setLanguage] = useState<Language>('en');
  const [darkMode, setDarkMode] = useState(false);
  const [role, setRole] = useState<Role | null>(null);
  const [user, setUser] = useState<Partial<User>>({});
  const [cropData, setCropData] = useState<Partial<CropData>>({});
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    { id: '1', sender: 'ai', text: 'Hello! How can I help you today with your farm?', timestamp: new Date().toLocaleTimeString() }
  ]);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const t = TRANSLATIONS[language];
  const { generateResponse, loading: aiLoading } = useAI();

  // --- Handlers ---

  const handleLogin = () => setScreen('role-selection');
  const handleRoleSelect = (selectedRole: Role) => {
    setRole(selectedRole);
    setUser({ ...user, role: selectedRole });
    setScreen('onboarding');
  };

  const handleOnboardingNext = () => {
    if (role === 'Farmer') {
      setScreen('field-setup');
    } else {
      setScreen('dashboard');
    }
  };

  const handleFieldSetupNext = () => setScreen('dashboard');

  const handleSendMessage = async (text: string) => {
    if (!text.trim()) return;
    const userMsg: ChatMessage = { id: Date.now().toString(), sender: 'user', text, timestamp: new Date().toLocaleTimeString() };
    setChatMessages(prev => [...prev, userMsg]);
    
    const aiResponse = await generateResponse(text);
    const aiMsg: ChatMessage = { id: (Date.now() + 1).toString(), sender: 'ai', text: aiResponse, timestamp: new Date().toLocaleTimeString() };
    setChatMessages(prev => [...prev, aiMsg]);
  };

  // --- Sub-Screens ---

  const AuthScreen = () => {
    const [isAuthenticating, setIsAuthenticating] = useState(false);

    const simulateAuth = (provider: string) => {
      setIsAuthenticating(true);
      setTimeout(() => {
        setIsAuthenticating(false);
        handleLogin();
      }, 1500);
    };

    return (
      <div className="flex flex-col h-full p-8 justify-between bg-emerald-50/30">
        <div className="mt-12 text-center">
          <motion.div 
            initial={{ scale: 0 }} 
            animate={{ scale: 1 }} 
            className="w-24 h-24 bg-emerald-600 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-xl shadow-emerald-200"
          >
            <Leaf className="w-12 h-12 text-white" />
          </motion.div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">AgriAI</h1>
          <p className="text-gray-500 font-medium">Smart Farming, Better Harvest</p>
        </div>

        <div className="flex flex-col gap-4">
          <Input placeholder={t.email} icon={UserIcon} />
          <Button onClick={handleLogin} className="w-full h-14 text-lg" disabled={isAuthenticating}>
            {isAuthenticating ? <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div> : t.login}
          </Button>
          
          <div className="relative my-4">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-200"></div></div>
            <div className="relative flex justify-center text-sm"><span className="px-2 bg-emerald-50/30 text-gray-400">OR</span></div>
          </div>

          <Button variant="outline" className="w-full h-14 bg-white" onClick={() => simulateAuth('Google')} disabled={isAuthenticating}>
            <img src="https://www.google.com/favicon.ico" className="w-5 h-5" alt="Google" />
            {t.continueGoogle}
          </Button>
          <Button variant="outline" className="w-full h-14 bg-white" onClick={() => simulateAuth('Apple')} disabled={isAuthenticating}>
            <img src="https://www.apple.com/favicon.ico" className="w-5 h-5" alt="Apple" />
            {t.continueApple}
          </Button>
          
          <p className="text-center text-sm text-gray-500 mt-4">
            Don't have an account? <span className="text-emerald-600 font-bold cursor-pointer">{t.register}</span>
          </p>
        </div>

        <div className="flex justify-center gap-4 mb-4">
          {['en', 'ru', 'uz'].map((lang) => (
            <button 
              key={lang} 
              onClick={() => setLanguage(lang as Language)}
              className={`text-sm font-bold px-3 py-1 rounded-lg ${language === lang ? 'bg-emerald-600 text-white' : 'text-gray-400'}`}
            >
              {lang.toUpperCase()}
            </button>
          ))}
        </div>
      </div>
    );
  };

  const RoleSelectionScreen = () => {
    const roles: { name: Role; icon: any; desc: string }[] = [
      { name: 'Farmer', icon: Sprout, desc: 'Manage your crops and fields' },
      { name: 'Tractor Driver', icon: Tractor, desc: 'Provide plowing and harvesting' },
      { name: 'Fertilizer Provider', icon: ShoppingBag, desc: 'Supply quality fertilizers' },
      { name: 'Agronomist', icon: UserIcon, desc: 'Expert advice for better yield' },
      { name: 'Water Supplier', icon: Droplets, desc: 'Ensure consistent irrigation' },
    ];

    return (
      <div className="p-6 overflow-y-auto h-full bg-white">
        <h2 className="text-2xl font-bold text-gray-900 mb-2 mt-8">{t.selectRole}</h2>
        <p className="text-gray-500 mb-8">Choose how you want to use AgriAI</p>
        
        <div className="flex flex-col gap-4 pb-12">
          {roles.map((r) => (
            <Card key={r.name} onClick={() => handleRoleSelect(r.name)}>
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-emerald-100 rounded-2xl flex items-center justify-center text-emerald-600">
                  <r.icon className="w-7 h-7" />
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-gray-900">{t[r.name.toLowerCase().replace(' ', '')] || r.name}</h3>
                  <p className="text-xs text-gray-500">{r.desc}</p>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-300" />
              </div>
            </Card>
          ))}
        </div>
      </div>
    );
  };

  const OnboardingScreen = () => (
    <div className="p-6 flex flex-col h-full bg-white">
      <div className="mt-8 mb-8">
        <h2 className="text-2xl font-bold text-gray-900">{t.onboarding}</h2>
        <div className="w-12 h-1.5 bg-emerald-500 rounded-full mt-2"></div>
      </div>

      <div className="flex flex-col gap-5 flex-1 overflow-y-auto">
        <Input label={t.name} placeholder="Enter your name" value={user.name} onChange={(v: string) => setUser({...user, name: v})} />
        <Input label={t.surname} placeholder="Enter your surname" value={user.surname} onChange={(v: string) => setUser({...user, surname: v})} />
        <Input label={t.age} type="number" placeholder="Enter your age" value={user.age} onChange={(v: string) => setUser({...user, age: parseInt(v)})} />
        <Input label={t.experience} type="number" placeholder="Years of experience" value={user.experience} onChange={(v: string) => setUser({...user, experience: parseInt(v)})} />
        
        <div className="bg-gray-50 p-4 rounded-2xl flex items-center gap-3 border border-gray-100">
          <MapPin className="w-6 h-6 text-emerald-600" />
          <div className="flex-1">
            <p className="text-xs text-gray-500 uppercase font-bold tracking-wider">Current Location</p>
            <p className="text-sm font-medium text-gray-900">Tashkent, Uzbekistan (Auto-detected)</p>
          </div>
        </div>

        {role !== 'Farmer' && (
          <>
            <Input label={t.serviceType} placeholder="e.g. Soil Analysis" value={user.serviceType} onChange={(v: string) => setUser({...user, serviceType: v})} />
            <Input label={t.price} placeholder="e.g. 100,000 UZS / hour" value={user.price} onChange={(v: string) => setUser({...user, price: parseInt(v)})} />
          </>
        )}
      </div>

      <Button onClick={handleOnboardingNext} className="w-full mb-8 h-14 text-lg mt-4">
        {t.next} <ChevronRight className="w-5 h-5" />
      </Button>
    </div>
  );

  const FieldSetupScreen = () => (
    <div className="p-6 flex flex-col h-full bg-white">
      <div className="mt-8 mb-8">
        <h2 className="text-2xl font-bold text-gray-900">{t.fieldSetup}</h2>
        <div className="w-12 h-1.5 bg-emerald-500 rounded-full mt-2"></div>
      </div>

      <div className="flex flex-col gap-5 flex-1 overflow-y-auto">
        <Input label={t.cropType} placeholder="e.g. Cotton, Wheat" value={cropData.type} onChange={(v: string) => setCropData({...cropData, type: v})} />
        <Input label={t.plantingDate} type="date" value={cropData.plantingDate} onChange={(v: string) => setCropData({...cropData, plantingDate: v})} />
        <Input label={t.landSize} type="number" placeholder="Area in m²" value={cropData.landSize} onChange={(v: string) => setCropData({...cropData, landSize: parseInt(v)})} />
        <Input label={t.soilType} placeholder="e.g. Sandy, Clay" value={cropData.soilType} onChange={(v: string) => setCropData({...cropData, soilType: v})} />
        <Input label={t.irrigationMethod} placeholder="e.g. Drip, Flood" value={cropData.irrigationMethod} onChange={(v: string) => setCropData({...cropData, irrigationMethod: v})} />
        <Input label={t.expectedAmount} type="number" placeholder="Target yield in kg" value={cropData.expectedAmount} onChange={(v: string) => setCropData({...cropData, expectedAmount: parseInt(v)})} />
      </div>

      <Button onClick={handleFieldSetupNext} className="w-full mb-8 h-14 text-lg mt-4">
        {t.next} <ChevronRight className="w-5 h-5" />
      </Button>
    </div>
  );

  const DashboardScreen = () => {
    const [selectedDate, setSelectedDate] = useState(6);
    const daysInMonth = Array.from({ length: 30 }, (_, i) => i + 1);
    
    const tasksForSelectedDay = MOCK_TASKS.filter(task => {
      const day = parseInt(task.date.split('-')[2]);
      return day === selectedDate;
    });

    const getEmoji = (type: string) => {
      switch (type) {
        case 'watering': return '💧';
        case 'plowing': return '🚜';
        case 'planting': return '🌱';
        case 'harvesting': return '🌿';
        default: return '📅';
      }
    };

    return (
      <div className="flex flex-col h-full bg-gray-50 dark:bg-emerald-950">
        {/* Header */}
        <div className="bg-emerald-600 p-6 pt-12 rounded-b-[3rem] shadow-lg shadow-emerald-100 dark:shadow-none">
          <div className="flex justify-between items-center mb-6">
            <div>
              <p className="text-emerald-100 text-sm font-medium">{t.welcomeBack},</p>
              <h2 className="text-2xl font-bold text-white">{user.name || 'Jasur'}!</h2>
            </div>
            <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-md">
              <UserIcon className="w-6 h-6 text-white" />
            </div>
          </div>
          
          <div className="bg-white/10 backdrop-blur-md p-4 rounded-3xl flex items-center gap-4">
            <div className="w-12 h-12 bg-amber-400 rounded-2xl flex items-center justify-center shadow-lg shadow-amber-400/30">
              <Sun className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-white font-bold text-lg">28°C</p>
              <p className="text-emerald-50 text-xs">{t.sunny} • Tashkent</p>
            </div>
            <div className="ml-auto text-right">
              <p className="text-emerald-50 text-xs font-medium">{t.humidity}</p>
              <p className="text-white font-bold">42%</p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 p-6 overflow-y-auto pb-24 no-scrollbar">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">{role === 'Farmer' ? t.calendar : t.orders}</h3>
            <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-bold text-sm">
              <CalendarIcon className="w-4 h-4" />
              April 2026
            </div>
          </div>

          {/* Full Month Calendar Grid */}
          <div className="bg-white dark:bg-emerald-900 p-4 rounded-[2.5rem] shadow-sm border border-gray-100 dark:border-emerald-800 mb-8">
            <div className="grid grid-cols-7 gap-2">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                <div key={day} className="text-center text-[10px] font-black text-gray-300 dark:text-emerald-700 py-2">{day}</div>
              ))}
              {daysInMonth.map((d) => {
                const dayTasks = MOCK_TASKS.filter(task => parseInt(task.date.split('-')[2]) === d);
                const hasTask = dayTasks.length > 0;
                return (
                  <div 
                    key={d} 
                    onClick={() => setSelectedDate(d)}
                    className={`aspect-square flex flex-col items-center justify-center rounded-2xl transition-all cursor-pointer relative ${
                      d === selectedDate ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-200 dark:shadow-none' : 
                      'bg-transparent text-gray-600 dark:text-emerald-100 hover:bg-gray-50 dark:hover:bg-emerald-800'
                    }`}
                  >
                    <span className={`text-sm font-bold ${d === selectedDate ? 'text-white' : 'text-gray-900 dark:text-white'}`}>{d}</span>
                    {hasTask && (
                      <div className="text-[12px] absolute -bottom-1">
                        {getEmoji(dayTasks[0].type)}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Selected Day Tasks */}
          <div className="flex flex-col gap-4">
            <h4 className="text-sm font-bold text-gray-400 dark:text-emerald-500 uppercase tracking-widest ml-2">
              {t.upcomingActions}
            </h4>
            {tasksForSelectedDay.length > 0 ? (
              tasksForSelectedDay.map((task) => (
                <Card key={task.id} onClick={() => setSelectedTask(task)} className="dark:bg-emerald-900 dark:border-emerald-800">
                  <div className="flex items-center gap-4">
                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-2xl ${
                      task.type === 'watering' ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600' : 
                      task.type === 'plowing' ? 'bg-amber-100 dark:bg-amber-900/30 text-amber-600' : 
                      'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600'
                    }`}>
                      {getEmoji(task.type)}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-bold text-gray-900 dark:text-white capitalize">{t[task.type]}</h4>
                      <div className="flex items-center gap-1 text-[10px] text-emerald-600 dark:text-emerald-400 font-bold">
                        <AlertCircle className="w-3 h-3" /> {t.importance}: {t[task.explanation].substring(0, 30)}...
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] font-bold text-gray-400 dark:text-emerald-500 uppercase">{t.status}</p>
                      <p className="text-xs font-bold text-amber-500">{t.pending}</p>
                    </div>
                  </div>
                </Card>
              ))
            ) : (
              <div className="text-center py-8 bg-white dark:bg-emerald-900 rounded-[2rem] border-2 border-dashed border-gray-100 dark:border-emerald-800">
                <p className="text-gray-400 dark:text-emerald-500 text-sm font-medium">{t.noTasks}</p>
              </div>
            )}
          </div>
        </div>

        {/* Task Detail Modal */}
        <AnimatePresence>
          {selectedTask && (
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[60] flex items-end"
              onClick={() => setSelectedTask(null)}
            >
              <motion.div 
                initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
                className="w-full bg-white dark:bg-emerald-900 rounded-t-[3rem] p-8 pb-12"
                onClick={e => e.stopPropagation()}
              >
                <div className="w-12 h-1.5 bg-gray-200 dark:bg-emerald-800 rounded-full mx-auto mb-8"></div>
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-800 rounded-3xl flex items-center justify-center text-3xl">
                    {getEmoji(selectedTask.type)}
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white capitalize">{t[selectedTask.type]}</h3>
                    <p className="text-emerald-600 dark:text-emerald-400 font-bold">{selectedTask.date}</p>
                  </div>
                </div>

                <div className="space-y-6">
                  <div>
                    <h4 className="text-sm font-bold text-gray-400 dark:text-emerald-500 uppercase tracking-widest mb-2">{t.importance}</h4>
                    <p className="text-gray-700 dark:text-emerald-100 leading-relaxed">{t[selectedTask.explanation]}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-emerald-50 dark:bg-emerald-800/50 p-4 rounded-2xl">
                      <h4 className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 uppercase mb-1">{t.growthStage}</h4>
                      <p className="font-bold text-gray-900 dark:text-white">{t[selectedTask.growthStage]}</p>
                    </div>
                    <div className="bg-amber-50 dark:bg-amber-900/30 p-4 rounded-2xl">
                      <h4 className="text-[10px] font-bold text-amber-600 dark:text-amber-400 uppercase mb-1">{t.weatherInfluence}</h4>
                      <p className="font-bold text-gray-900 dark:text-white">{t[selectedTask.weatherInfluence]}</p>
                    </div>
                  </div>
                  <div className="bg-rose-50 dark:bg-rose-900/30 p-4 rounded-2xl border border-rose-100 dark:border-rose-900/50">
                    <h4 className="text-[10px] font-bold text-rose-600 dark:text-rose-400 uppercase mb-1 flex items-center gap-1">
                      <AlertTriangle className="w-3 h-3" /> {t.riskIfSkipped}
                    </h4>
                    <p className="font-bold text-gray-900 dark:text-white">{t[selectedTask.riskIfSkipped]}</p>
                  </div>
                </div>

                <Button onClick={() => setSelectedTask(null)} className="w-full mt-8 h-14 rounded-2xl">
                  {t.gotIt}
                </Button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Order Detail Modal */}
        <AnimatePresence>
          {selectedOrder && (
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[60] flex items-end"
              onClick={() => setSelectedOrder(null)}
            >
              <motion.div 
                initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
                className="w-full bg-white rounded-t-[3rem] p-8 pb-12"
                onClick={e => e.stopPropagation()}
              >
                <div className="w-12 h-1.5 bg-gray-200 dark:bg-emerald-800 rounded-full mx-auto mb-8"></div>
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-800 rounded-3xl flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                    <Tractor className="w-8 h-8" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white">{t[selectedOrder.typeOfWork.toLowerCase()] || selectedOrder.typeOfWork}</h3>
                    <p className="text-emerald-600 dark:text-emerald-400 font-bold">{selectedOrder.date} • {selectedOrder.time}</p>
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="bg-gray-50 dark:bg-emerald-800/50 p-4 rounded-2xl">
                    <h4 className="text-[10px] font-bold text-gray-400 dark:text-emerald-500 uppercase mb-1">{t.farmerName}</h4>
                    <p className="font-bold text-gray-900 dark:text-white">{selectedOrder.farmerName}</p>
                  </div>
                  <div className="bg-gray-50 dark:bg-emerald-800/50 p-4 rounded-2xl">
                    <h4 className="text-[10px] font-bold text-gray-400 dark:text-emerald-500 uppercase mb-1">{t.location}</h4>
                    <p className="font-bold text-gray-900 dark:text-white">{selectedOrder.location}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-gray-50 dark:bg-emerald-800/50 p-4 rounded-2xl">
                      <h4 className="text-[10px] font-bold text-gray-400 dark:text-emerald-500 uppercase mb-1">{t.landSize}</h4>
                      <p className="font-bold text-gray-900 dark:text-white">{selectedOrder.landSize} m²</p>
                    </div>
                    <div className="bg-gray-50 dark:bg-emerald-800/50 p-4 rounded-2xl">
                      <h4 className="text-[10px] font-bold text-gray-400 dark:text-emerald-500 uppercase mb-1">{t.status}</h4>
                      <p className="font-bold text-emerald-600 dark:text-emerald-400 capitalize">{t[selectedOrder.status] || selectedOrder.status}</p>
                    </div>
                  </div>
                  {selectedOrder.notes && (
                    <div className="bg-amber-50 dark:bg-amber-900/30 p-4 rounded-2xl border border-amber-100 dark:border-amber-900/50">
                      <h4 className="text-[10px] font-bold text-amber-600 dark:text-amber-400 uppercase mb-1">{t.notes}</h4>
                      <p className="text-gray-700 dark:text-emerald-100">{selectedOrder.notes}</p>
                    </div>
                  )}
                </div>
                <div className="flex gap-4 mt-8">
                  <Button variant="outline" className="flex-1 h-14 dark:border-emerald-700 dark:text-white" onClick={() => setSelectedOrder(null)}>{t.decline}</Button>
                  <Button className="flex-1 h-14" onClick={() => setSelectedOrder(null)}>{t.acceptJob}</Button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  };

  const MarketplaceScreen = () => {
    const [search, setSearch] = useState('');
    const filtered = MOCK_PROVIDERS.filter(p => p.name.toLowerCase().includes(search.toLowerCase()) || p.role.toLowerCase().includes(search.toLowerCase()));

    return (
      <div className="flex flex-col h-full bg-gray-50">
        <div className="p-6 pt-12 bg-white rounded-b-[3rem] shadow-sm">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">{t.marketplace}</h2>
          <div className="flex gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input 
                type="text" 
                placeholder={t.askAi} 
                className="w-full h-12 pl-12 pr-4 bg-gray-50 rounded-2xl border-none focus:ring-2 focus:ring-emerald-500 font-medium"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <button className="w-12 h-12 bg-emerald-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-emerald-200">
              <Filter className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="flex-1 p-6 overflow-y-auto pb-24">
          <div className="flex gap-2 mb-6 overflow-x-auto pb-2 no-scrollbar">
            {['All', 'Agronomist', 'Tractor Driver', 'Water Supplier'].map(cat => (
              <button key={cat} className={`px-5 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all ${cat === 'All' ? 'bg-emerald-600 text-white shadow-md' : 'bg-white text-gray-400 border border-gray-100'}`}>
                {t[cat.toLowerCase().replace(' ', '')] || cat}
              </button>
            ))}
          </div>

          {filtered.map((p) => (
            <Card key={p.id} className="mb-4 overflow-hidden p-0">
              <div className="flex">
                <img src={p.photo} className="w-32 h-40 object-cover" alt={p.name} referrerPolicy="no-referrer" />
                <div className="flex-1 p-4 flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-start">
                      <h4 className="font-bold text-gray-900">{p.name}</h4>
                      <div className="flex items-center gap-1 text-amber-500">
                        <Star className="w-3 h-3 fill-current" />
                        <span className="text-xs font-bold">{p.rating}</span>
                      </div>
                    </div>
                    <p className="text-xs text-emerald-600 font-bold mb-1">{t[p.role.toLowerCase().replace(' ', '')] || p.role}</p>
                    <div className="flex items-center gap-1 text-gray-400 text-[10px] mb-2">
                      <MapPin className="w-3 h-3" />
                      {p.location}
                    </div>
                    <div className="flex flex-wrap gap-1 mb-3">
                      {p.services.map(s => <span key={s} className="text-[9px] bg-gray-100 px-2 py-0.5 rounded-full text-gray-600 font-medium">{s}</span>)}
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <p className="text-sm font-black text-gray-900">{p.price}</p>
                    <Button variant="secondary" className="px-4 py-1.5 text-xs rounded-xl">{t.book}</Button>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    );
  };

  const GrowthScreen = () => (
    <div className="flex flex-col h-full bg-emerald-900 overflow-hidden">
      <div className="p-6 pt-12 text-white">
        <h2 className="text-2xl font-bold mb-1">{t.growthTracking}</h2>
        <p className="text-emerald-300 text-sm">{t.cotton} • {t.growthStage}: {t.flowering}</p>
      </div>

      <div className="flex-1 relative flex items-center justify-center">
        {/* Visual Simulation */}
        <motion.div 
          animate={{ scale: [1, 1.05, 1] }} 
          transition={{ duration: 4, repeat: Infinity }}
          className="relative z-10"
        >
          <div className="w-64 h-64 bg-emerald-400/20 rounded-full blur-3xl absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"></div>
          <img 
            src="https://images.unsplash.com/photo-1592982537447-7440770cbfc9?q=80&w=1000&auto=format&fit=crop" 
            className="w-72 h-72 object-cover rounded-[3rem] border-8 border-white/10 shadow-2xl" 
            alt="Plant Simulation" 
            referrerPolicy="no-referrer"
          />
          <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 bg-emerald-500 text-white px-6 py-2 rounded-full font-black shadow-lg border-4 border-emerald-900">
            {t.flowering}
          </div>
        </motion.div>

        {/* Stats Overlay */}
        <div className="absolute bottom-12 left-6 right-6 grid grid-cols-2 gap-4">
          <div className="bg-white/10 backdrop-blur-xl p-5 rounded-[2rem] border border-white/10">
            <p className="text-emerald-300 text-[10px] font-bold uppercase mb-1">{t.growthStage}</p>
            <p className="text-white text-xl font-black">74%</p>
            <div className="w-full h-1.5 bg-white/10 rounded-full mt-2 overflow-hidden">
              <div className="w-[74%] h-full bg-emerald-400"></div>
            </div>
          </div>
          <div className="bg-white/10 backdrop-blur-xl p-5 rounded-[2rem] border border-white/10">
            <p className="text-emerald-300 text-[10px] font-bold uppercase mb-1">{t.daysLiving}</p>
            <p className="text-white text-xl font-black">42 {t.daysSincePlanting.split(' ')[0]}</p>
            <p className="text-emerald-300 text-[10px] mt-2">{t.target}: 120 {t.daysSincePlanting.split(' ')[0]}</p>
          </div>
        </div>
      </div>
    </div>
  );

  const ProfileScreen = () => {
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
        const url = URL.createObjectURL(file);
        setUser({ ...user, profilePhoto: url });
      }
    };

    return (
      <div className="flex flex-col h-full bg-gray-50">
        <div className="p-6 pt-12 bg-white rounded-b-[3rem] shadow-sm">
          <div className="flex flex-col items-center">
            <div className="relative">
              <div className="w-28 h-28 rounded-[2.5rem] bg-emerald-100 overflow-hidden border-4 border-white shadow-xl">
                <img 
                  src={user.profilePhoto || "https://picsum.photos/seed/jasur/200/200"} 
                  className="w-full h-full object-cover" 
                  alt="Profile" 
                  referrerPolicy="no-referrer" 
                />
              </div>
              <button 
                onClick={() => fileInputRef.current?.click()}
                className="absolute bottom-0 right-0 w-10 h-10 bg-emerald-600 rounded-2xl flex items-center justify-center text-white border-4 border-white shadow-lg"
              >
                <Camera className="w-5 h-5" />
              </button>
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handlePhotoUpload} 
                className="hidden" 
                accept="image/*" 
              />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mt-4">{user.name || 'Jasur'} {user.surname || 'Bek'}</h3>
            <p className="text-emerald-600 font-bold text-sm bg-emerald-50 px-4 py-1 rounded-full mt-1">{t[role.toLowerCase().replace(' ', '')] || role}</p>
          </div>

          <div className="grid grid-cols-3 gap-4 mt-8">
            <div className="text-center">
              <p className="text-xl font-black text-gray-900">{user.experience || 12}</p>
              <p className="text-[10px] text-gray-400 font-bold uppercase">{t.experience.split(' ')[0]}</p>
            </div>
            <div className="text-center border-x border-gray-100">
              <p className="text-xl font-black text-gray-900">4.9</p>
              <p className="text-[10px] text-gray-400 font-bold uppercase">{t.rating}</p>
            </div>
            <div className="text-center">
              <p className="text-xl font-black text-gray-900">#42</p>
              <p className="text-[10px] text-gray-400 font-bold uppercase">Rank</p>
            </div>
          </div>
        </div>

        <div className="flex-1 p-6 overflow-y-auto pb-24">
          <h4 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-4 ml-2">{t.settings}</h4>
          <div className="bg-white rounded-[2rem] p-2 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between p-4 hover:bg-gray-50 rounded-2xl transition-all cursor-pointer">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center"><Globe className="w-5 h-5" /></div>
                <span className="font-bold text-gray-700">{t.language}</span>
              </div>
              <div className="flex gap-2">
                {['en', 'ru', 'uz'].map(l => (
                  <button key={l} onClick={() => setLanguage(l as Language)} className={`text-[10px] font-bold px-2 py-1 rounded-lg ${language === l ? 'bg-emerald-600 text-white' : 'bg-gray-100 text-gray-400'}`}>
                    {l.toUpperCase()}
                  </button>
                ))}
              </div>
            </div>
            <div className="flex items-center justify-between p-4 hover:bg-gray-50 rounded-2xl transition-all cursor-pointer" onClick={() => setDarkMode(!darkMode)}>
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-purple-50 text-purple-600 rounded-xl flex items-center justify-center">
                  {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                </div>
                <span className="font-bold text-gray-700">{t.darkMode}</span>
              </div>
              <div className={`w-12 h-6 rounded-full transition-all relative ${darkMode ? 'bg-emerald-600' : 'bg-gray-200'}`}>
                <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${darkMode ? 'left-7' : 'left-1'}`}></div>
              </div>
            </div>
            <div className="flex items-center justify-between p-4 hover:bg-rose-50 rounded-2xl transition-all cursor-pointer text-rose-600" onClick={() => setScreen('auth')}>
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-rose-50 text-rose-600 rounded-xl flex items-center justify-center"><LogOut className="w-5 h-5" /></div>
                <span className="font-bold">{t.logout}</span>
              </div>
            </div>
          </div>

          <h4 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-4 mt-8 ml-2">{t.top100} {t[role.toLowerCase().replace(' ', '')] || role}s</h4>
          <div className="flex flex-col gap-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white p-4 rounded-2xl flex items-center gap-4 shadow-sm border border-gray-100">
                <span className={`text-lg font-black ${i === 1 ? 'text-amber-500' : i === 2 ? 'text-gray-400' : 'text-amber-700'}`}>#{i}</span>
                <img src={`https://picsum.photos/seed/rank${i}/100/100`} className="w-10 h-10 rounded-xl object-cover" alt="Rank" referrerPolicy="no-referrer" />
                <div className="flex-1">
                  <p className="font-bold text-gray-900">User {i}</p>
                  <p className="text-[10px] text-gray-400">{t.productivity}: 98%</p>
                </div>
                <div className="flex items-center gap-1 text-emerald-600">
                  <TrendingUp className="w-4 h-4" />
                  <span className="text-xs font-bold">+2</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };
  const ChatScreen = () => {
    const [input, setInput] = useState('');
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
      if (scrollRef.current) {
        scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
      }
    }, [chatMessages]);

    return (
      <div className="flex flex-col h-full bg-white">
        <div className="p-6 pt-12 flex items-center gap-4 border-b border-gray-100">
          <button onClick={() => setScreen('dashboard')} className="p-2 hover:bg-gray-100 rounded-xl transition-all"><ArrowLeft className="w-6 h-6" /></button>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-emerald-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-emerald-200">
              <MessageCircle className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-gray-900">AgriAI {t.aiHelp}</h3>
              <p className="text-[10px] text-emerald-600 font-bold uppercase tracking-widest">{t.online}</p>
            </div>
          </div>
        </div>

        <div ref={scrollRef} className="flex-1 p-6 overflow-y-auto flex flex-col gap-4 bg-gray-50/50">
          {chatMessages.map((msg) => (
            <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[80%] p-4 rounded-3xl shadow-sm ${
                msg.sender === 'user' ? 'bg-emerald-600 text-white rounded-tr-none' : 'bg-white text-gray-700 rounded-tl-none'
              }`}>
                <p className="text-sm leading-relaxed">{msg.text}</p>
                <p className={`text-[9px] mt-1 font-medium ${msg.sender === 'user' ? 'text-emerald-100' : 'text-gray-400'}`}>{msg.timestamp}</p>
              </div>
            </div>
          ))}
          {aiLoading && (
            <div className="flex justify-start">
              <div className="bg-white p-4 rounded-3xl rounded-tl-none shadow-sm flex gap-1">
                <div className="w-1.5 h-1.5 bg-gray-300 rounded-full animate-bounce"></div>
                <div className="w-1.5 h-1.5 bg-gray-300 rounded-full animate-bounce delay-75"></div>
                <div className="w-1.5 h-1.5 bg-gray-300 rounded-full animate-bounce delay-150"></div>
              </div>
            </div>
          )}
        </div>

        <div className="p-6 bg-white border-t border-gray-100 flex gap-3 items-center">
          <input 
            value={input} 
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && (handleSendMessage(input), setInput(''))}
            placeholder={t.askAi} 
            className="flex-1 px-4 py-3 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
          />
          <button 
            onClick={() => { handleSendMessage(input); setInput(''); }}
            className="w-12 h-12 bg-emerald-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-emerald-200 active:scale-90 transition-all"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>
    );
  };

  // --- Layout ---

  const renderScreen = () => {
    switch (screen) {
      case 'auth': return <AuthScreen />;
      case 'role-selection': return <RoleSelectionScreen />;
      case 'onboarding': return <OnboardingScreen />;
      case 'field-setup': return <FieldSetupScreen />;
      case 'dashboard': return <DashboardScreen />;
      case 'marketplace': return <MarketplaceScreen />;
      case 'growth': return <GrowthScreen />;
      case 'profile': return <ProfileScreen />;
      case 'chat': return <ChatScreen />;
      default: return <AuthScreen />;
    }
  };

  const showNav = ['dashboard', 'marketplace', 'growth', 'profile'].includes(screen);

  return (
    <div className={`h-screen w-full max-w-md mx-auto overflow-hidden flex flex-col relative font-sans ${darkMode ? 'dark' : ''}`}>
      <div className="flex-1 overflow-hidden relative">
        <AnimatePresence mode="wait">
          <motion.div
            key={screen}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="h-full w-full"
          >
            {renderScreen()}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Navigation Bar */}
      {showNav && (
        <div className="h-20 bg-white border-t border-gray-100 flex items-center justify-around px-4 pb-2 relative z-50">
          <button onClick={() => setScreen('dashboard')} className={`flex flex-col items-center gap-1 ${screen === 'dashboard' ? 'text-emerald-600' : 'text-gray-400'}`}>
            <div className={`p-2 rounded-xl transition-all ${screen === 'dashboard' ? 'bg-emerald-50' : ''}`}><CalendarIcon className="w-6 h-6" /></div>
            <span className="text-[10px] font-bold uppercase tracking-widest">{role === 'Farmer' ? t.calendar : t.orders}</span>
          </button>
          <button onClick={() => setScreen('marketplace')} className={`flex flex-col items-center gap-1 ${screen === 'marketplace' ? 'text-emerald-600' : 'text-gray-400'}`}>
            <div className={`p-2 rounded-xl transition-all ${screen === 'marketplace' ? 'bg-emerald-50' : ''}`}><ShoppingBag className="w-6 h-6" /></div>
            <span className="text-[10px] font-bold uppercase tracking-widest">{t.marketplace}</span>
          </button>
          {role === 'Farmer' && (
            <button onClick={() => setScreen('growth')} className={`flex flex-col items-center gap-1 ${screen === 'growth' ? 'text-emerald-600' : 'text-gray-400'}`}>
              <div className={`p-2 rounded-xl transition-all ${screen === 'growth' ? 'bg-emerald-50' : ''}`}><Sprout className="w-6 h-6" /></div>
              <span className="text-[10px] font-bold uppercase tracking-widest">{t.growthTracking.split(' ')[0]}</span>
            </button>
          )}
          <button onClick={() => setScreen('profile')} className={`flex flex-col items-center gap-1 ${screen === 'profile' ? 'text-emerald-600' : 'text-gray-400'}`}>
            <div className={`p-2 rounded-xl transition-all ${screen === 'profile' ? 'bg-emerald-50' : ''}`}><UserIcon className="w-6 h-6" /></div>
            <span className="text-[10px] font-bold uppercase tracking-widest">{t.profile}</span>
          </button>
        </div>
      )}

      {/* Floating AI Button */}
      {screen !== 'auth' && screen !== 'chat' && (
        <motion.button
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setScreen('chat')}
          className="fixed bottom-24 right-6 w-16 h-16 bg-emerald-600 rounded-full flex items-center justify-center text-white shadow-2xl shadow-emerald-300 z-[100] border-4 border-white"
        >
          <MessageCircle className="w-8 h-8" />
          <div className="absolute -top-1 -right-1 w-5 h-5 bg-amber-400 rounded-full border-2 border-white flex items-center justify-center">
            <div className="w-1.5 h-1.5 bg-white rounded-full animate-ping"></div>
          </div>
        </motion.button>
      )}

      {/* Global Styles for Dark Mode & Transitions */}
      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        
        .dark {
          background-color: #064e3b;
          color: white;
        }
        .dark .bg-white { background-color: #065f46; color: white; }
        .dark .bg-gray-50 { background-color: #064e3b; }
        .dark .text-gray-900 { color: white; }
        .dark .text-gray-800 { color: #ecfdf5; }
        .dark .text-gray-700 { color: #d1fae5; }
        .dark .text-gray-600 { color: #a7f3d0; }
        .dark .text-gray-500 { color: #6ee7b7; }
        .dark .text-gray-400 { color: #34d399; }
        .dark .border-gray-100, .dark .border-gray-200 { border-color: #047857; }
        .dark input { background-color: #047857; color: white; border-color: #065f46; }
        .dark .shadow-sm, .dark .shadow-md, .dark .shadow-lg, .dark .shadow-xl, .dark .shadow-2xl { box-shadow: none; }
        .dark .bg-emerald-50 { background-color: rgba(16, 185, 129, 0.2); }
        .dark .bg-amber-50 { background-color: rgba(245, 158, 11, 0.2); }
        .dark .bg-rose-50 { background-color: rgba(244, 63, 94, 0.2); }
        .dark .bg-blue-50 { background-color: rgba(59, 130, 246, 0.2); }
        .dark .bg-purple-50 { background-color: rgba(167, 139, 250, 0.2); }
        .dark .bg-blue-100 { background-color: rgba(59, 130, 246, 0.3); }
        .dark .bg-amber-100 { background-color: rgba(245, 158, 11, 0.3); }
        .dark .bg-emerald-100 { background-color: rgba(16, 185, 129, 0.3); }
        .dark .text-emerald-600 { color: #34d399; }
        .dark .text-amber-600 { color: #fbbf24; }
        .dark .text-blue-600 { color: #60a5fa; }
        .dark .text-rose-600 { color: #fb7185; }
        .dark .text-purple-600 { color: #a78bfa; }
        .dark .hover\:bg-gray-50:hover { background-color: #047857; }
        .dark .border-dashed { border-color: #047857; }
      `}</style>
    </div>
  );
}
