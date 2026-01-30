import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Heart, MapPin, Activity, Loader2, X, CheckCircle, User, Lock, Mail, Edit2, Save,
  Search, Bell, Menu, ChevronRight, Star, Clock, Target, Users, Gift, TrendingUp,
  Calendar, BookOpen, Phone, Globe, Award, Shield, Zap, ArrowRight, Play, 
  MessageCircle, Share2, Facebook, Twitter, Instagram, Linkedin, Send, Filter,
  DollarSign, Package, Truck, Check, AlertCircle, Info, ExternalLink, Home,
  Newspaper, HandHeart, UserPlus, Settings, LogOut, ChevronDown, Sparkles,
  BarChart3, PieChart, MapPinned, Building, Verified, Navigation
} from 'lucide-react';
import NGOFinder from './components/NGOFinder';

const API_URL = import.meta.env.VITE_API_URL || '';

// Animation Variants
const fadeInUp = {
  initial: { opacity: 0, y: 60 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 }
};

const staggerContainer = {
  animate: { transition: { staggerChildren: 0.1 } }
};

const scaleIn = {
  initial: { scale: 0.8, opacity: 0 },
  animate: { scale: 1, opacity: 1 },
  exit: { scale: 0.8, opacity: 0 }
};

const slideIn = {
  initial: { x: -100, opacity: 0 },
  animate: { x: 0, opacity: 1 },
  exit: { x: 100, opacity: 0 }
};

// Floating Particles Background
const FloatingParticles = () => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none">
    {[...Array(20)].map((_, i) => (
      <motion.div
        key={i}
        className="absolute w-2 h-2 bg-rose-300/30 rounded-full"
        initial={{ 
          x: Math.random() * window.innerWidth, 
          y: Math.random() * window.innerHeight 
        }}
        animate={{ 
          y: [null, Math.random() * -500],
          x: [null, Math.random() * 200 - 100]
        }}
        transition={{ 
          duration: Math.random() * 10 + 10, 
          repeat: Infinity, 
          ease: "linear" 
        }}
      />
    ))}
  </div>
);

// Animated Counter
const AnimatedCounter = ({ value, suffix = "", prefix = "" }) => {
  const [count, setCount] = useState(0);
  
  useEffect(() => {
    const duration = 2000;
    const steps = 60;
    const increment = value / steps;
    let current = 0;
    
    const timer = setInterval(() => {
      current += increment;
      if (current >= value) {
        setCount(value);
        clearInterval(timer);
      } else {
        setCount(Math.floor(current));
      }
    }, duration / steps);
    
    return () => clearInterval(timer);
  }, [value]);
  
  return <span>{prefix}{count.toLocaleString()}{suffix}</span>;
};

// Progress Bar
const ProgressBar = ({ current, target, color = "rose" }) => {
  const percentage = Math.min((current / target) * 100, 100);
  return (
    <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
      <motion.div
        className={`h-full bg-gradient-to-r from-${color}-500 to-${color}-600 rounded-full`}
        initial={{ width: 0 }}
        animate={{ width: `${percentage}%` }}
        transition={{ duration: 1, ease: "easeOut" }}
      />
    </div>
  );
};

// Toast Notification
const Toast = ({ message, type, onClose }) => (
  <motion.div
    initial={{ opacity: 0, y: 50, x: "-50%" }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: 50 }}
    className={`fixed bottom-6 left-1/2 transform -translate-x-1/2 px-6 py-3 rounded-xl shadow-2xl z-[100] flex items-center gap-3 ${
      type === 'success' ? 'bg-green-500' : type === 'error' ? 'bg-red-500' : 'bg-blue-500'
    } text-white`}
  >
    {type === 'success' ? <CheckCircle size={20} /> : type === 'error' ? <AlertCircle size={20} /> : <Info size={20} />}
    {message}
  </motion.div>
);

// Auth Modal
const AuthModal = ({ onClose, onLogin }) => {
  const [isRegister, setIsRegister] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', password: '', role: 'donor' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const endpoint = isRegister ? '/api/auth/register' : '/api/auth/login';
    try {
      const res = await fetch(`${API_URL}${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      if (res.ok) { 
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data));
        onLogin(data); 
        onClose(); 
      } else { 
        alert(data.message); 
      }
    } catch (err) { 
      alert("Server Error"); 
    }
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center px-4">
      <motion.div 
        initial={{ opacity: 0 }} 
        animate={{ opacity: 1 }} 
        className="absolute inset-0 bg-black/60 backdrop-blur-md" 
        onClick={onClose}
      />
      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }} 
        animate={{ scale: 1, opacity: 1 }}
        className="bg-white rounded-3xl p-8 max-w-md w-full relative z-10 shadow-2xl"
      >
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition">
          <X size={24}/>
        </button>
        
        <div className="text-center mb-6">
          <motion.div 
            initial={{ scale: 0 }} 
            animate={{ scale: 1 }} 
            className="w-16 h-16 bg-gradient-to-br from-rose-500 to-pink-600 rounded-2xl flex items-center justify-center mx-auto mb-4"
          >
            <Heart className="text-white" size={32} fill="white" />
          </motion.div>
          <h2 className="text-3xl font-bold text-gray-800">{isRegister ? 'Join Us' : 'Welcome Back'}</h2>
          <p className="text-gray-500 mt-2">{isRegister ? 'Create an account to start donating' : 'Sign in to continue your journey'}</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {isRegister && (
            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }}>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <input 
                  type="text" 
                  placeholder="Full Name" 
                  className="w-full border-2 border-gray-200 p-4 pl-12 rounded-xl focus:border-rose-500 focus:outline-none transition" 
                  value={formData.name} 
                  onChange={e => setFormData({...formData, name: e.target.value})} 
                />
              </div>
            </motion.div>
          )}
          
          <div className="relative">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input 
              type="email" 
              placeholder="Email Address" 
              className="w-full border-2 border-gray-200 p-4 pl-12 rounded-xl focus:border-rose-500 focus:outline-none transition" 
              value={formData.email} 
              onChange={e => setFormData({...formData, email: e.target.value})} 
            />
          </div>
          
          <div className="relative">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input 
              type="password" 
              placeholder="Password" 
              className="w-full border-2 border-gray-200 p-4 pl-12 rounded-xl focus:border-rose-500 focus:outline-none transition" 
              value={formData.password} 
              onChange={e => setFormData({...formData, password: e.target.value})} 
            />
          </div>

          {isRegister && (
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setFormData({...formData, role: 'donor'})}
                className={`flex-1 p-3 rounded-xl border-2 transition ${formData.role === 'donor' ? 'border-rose-500 bg-rose-50 text-rose-600' : 'border-gray-200'}`}
              >
                <Gift size={20} className="mx-auto mb-1" />
                <span className="text-sm font-medium">Donor</span>
              </button>
              <button
                type="button"
                onClick={() => setFormData({...formData, role: 'ngo'})}
                className={`flex-1 p-3 rounded-xl border-2 transition ${formData.role === 'ngo' ? 'border-rose-500 bg-rose-50 text-rose-600' : 'border-gray-200'}`}
              >
                <Building size={20} className="mx-auto mb-1" />
                <span className="text-sm font-medium">NGO</span>
              </button>
            </div>
          )}
          
          <motion.button 
            whileHover={{ scale: 1.02 }} 
            whileTap={{ scale: 0.98 }}
            className="w-full bg-gradient-to-r from-rose-500 to-pink-600 text-white py-4 rounded-xl font-bold shadow-lg shadow-rose-500/30 flex items-center justify-center gap-2"
          >
            {loading ? <Loader2 className="animate-spin" size={20} /> : null}
            {loading ? "Processing..." : isRegister ? "Create Account" : "Sign In"}
          </motion.button>
        </form>
        
        <div className="mt-6 text-center">
          <p className="text-gray-500">
            {isRegister ? "Already have an account?" : "Don't have an account?"}
            <button 
              className="text-rose-600 font-semibold ml-2 hover:underline" 
              onClick={() => setIsRegister(!isRegister)}
            >
              {isRegister ? "Sign In" : "Sign Up"}
            </button>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

// Donation Modal
const DonationModal = ({ ngo, onClose, user, onSuccess }) => {
  const [step, setStep] = useState(1);
  const [donationType, setDonationType] = useState('products');
  const [items, setItems] = useState([]);
  const [amount, setAmount] = useState('');
  const [message, setMessage] = useState('');
  const [anonymous, setAnonymous] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleItemChange = (itemName, quantity) => {
    const existing = items.find(i => i.item === itemName);
    if (existing) {
      setItems(items.map(i => i.item === itemName ? { ...i, quantity: parseInt(quantity) } : i));
    } else {
      setItems([...items, { item: itemName, quantity: parseInt(quantity) }]);
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/donations`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          ngoId: ngo._id,
          items: items.filter(i => i.quantity > 0),
          amount: parseFloat(amount) || 0,
          type: donationType,
          message,
          anonymous
        })
      });
      const data = await res.json();
      if (res.ok) {
        onSuccess(data.data);
        setStep(3);
      }
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center px-4">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="absolute inset-0 bg-black/60 backdrop-blur-md" onClick={onClose} />
      <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-white rounded-3xl p-8 max-w-lg w-full relative z-10 shadow-2xl max-h-[90vh] overflow-y-auto">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"><X size={24}/></button>
        
        {step === 1 && (
          <motion.div {...fadeInUp}>
            <h2 className="text-2xl font-bold mb-2">Donate to {ngo.name}</h2>
            <p className="text-gray-500 mb-6">Choose how you'd like to contribute</p>
            
            <div className="grid grid-cols-2 gap-4 mb-6">
              {['products', 'money'].map(type => (
                <motion.button
                  key={type}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => setDonationType(type)}
                  className={`p-6 rounded-2xl border-2 transition ${donationType === type ? 'border-rose-500 bg-rose-50' : 'border-gray-200'}`}
                >
                  {type === 'products' ? <Package size={32} className="mx-auto mb-2 text-rose-500" /> : <DollarSign size={32} className="mx-auto mb-2 text-rose-500" />}
                  <span className="font-semibold capitalize">{type}</span>
                </motion.button>
              ))}
            </div>
            
            <motion.button 
              whileHover={{ scale: 1.02 }} 
              whileTap={{ scale: 0.98 }}
              onClick={() => setStep(2)}
              className="w-full bg-gradient-to-r from-rose-500 to-pink-600 text-white py-4 rounded-xl font-bold"
            >
              Continue <ArrowRight className="inline ml-2" size={20} />
            </motion.button>
          </motion.div>
        )}

        {step === 2 && (
          <motion.div {...fadeInUp}>
            <h2 className="text-2xl font-bold mb-6">
              {donationType === 'products' ? 'Select Products' : 'Enter Amount'}
            </h2>
            
            {donationType === 'products' ? (
              <div className="space-y-4 mb-6">
                {ngo.inventory?.map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                    <span className="font-medium">{item.item}</span>
                    <input
                      type="number"
                      min="0"
                      placeholder="Qty"
                      className="w-24 p-2 border-2 border-gray-200 rounded-lg text-center"
                      onChange={(e) => handleItemChange(item.item, e.target.value)}
                    />
                  </div>
                ))}
              </div>
            ) : (
              <div className="mb-6">
                <div className="grid grid-cols-3 gap-3 mb-4">
                  {[100, 500, 1000].map(val => (
                    <button
                      key={val}
                      onClick={() => setAmount(val.toString())}
                      className={`p-3 rounded-xl border-2 font-semibold transition ${amount === val.toString() ? 'border-rose-500 bg-rose-50 text-rose-600' : 'border-gray-200'}`}
                    >
                      ₹{val}
                    </button>
                  ))}
                </div>
                <input
                  type="number"
                  placeholder="Or enter custom amount"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full p-4 border-2 border-gray-200 rounded-xl"
                />
              </div>
            )}

            <textarea
              placeholder="Add a message (optional)"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full p-4 border-2 border-gray-200 rounded-xl mb-4 resize-none"
              rows={3}
            />

            <label className="flex items-center gap-3 mb-6 cursor-pointer">
              <input type="checkbox" checked={anonymous} onChange={(e) => setAnonymous(e.target.checked)} className="w-5 h-5 accent-rose-500" />
              <span>Donate anonymously</span>
            </label>

            <div className="flex gap-3">
              <button onClick={() => setStep(1)} className="flex-1 py-4 rounded-xl border-2 border-gray-200 font-semibold">Back</button>
              <motion.button 
                whileHover={{ scale: 1.02 }} 
                whileTap={{ scale: 0.98 }}
                onClick={handleSubmit}
                disabled={loading}
                className="flex-1 bg-gradient-to-r from-rose-500 to-pink-600 text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2"
              >
                {loading ? <Loader2 className="animate-spin" size={20} /> : <Heart size={20} />}
                {loading ? 'Processing...' : 'Donate Now'}
              </motion.button>
            </div>
          </motion.div>
        )}

        {step === 3 && (
          <motion.div {...scaleIn} className="text-center py-8">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", damping: 10 }}
              className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6"
            >
              <CheckCircle className="text-green-500" size={48} />
            </motion.div>
            <h2 className="text-2xl font-bold mb-2">Thank You!</h2>
            <p className="text-gray-500 mb-6">Your donation has been received successfully.</p>
            <motion.button 
              whileHover={{ scale: 1.02 }}
              onClick={onClose}
              className="bg-gray-900 text-white px-8 py-3 rounded-xl font-semibold"
            >
              Close
            </motion.button>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};

// Volunteer Modal
const VolunteerModal = ({ onClose, user }) => {
  const [formData, setFormData] = useState({
    skills: [],
    availability: 'flexible',
    ngo: ''
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const skillOptions = ['Teaching', 'Healthcare', 'Logistics', 'Marketing', 'Event Planning', 'Counseling'];

  const toggleSkill = (skill) => {
    if (formData.skills.includes(skill)) {
      setFormData({ ...formData, skills: formData.skills.filter(s => s !== skill) });
    } else {
      setFormData({ ...formData, skills: [...formData.skills, skill] });
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/volunteers`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(formData)
      });
      if (res.ok) setSuccess(true);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center px-4">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="absolute inset-0 bg-black/60 backdrop-blur-md" onClick={onClose} />
      <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-white rounded-3xl p-8 max-w-lg w-full relative z-10 shadow-2xl">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400"><X size={24}/></button>
        
        {!success ? (
          <>
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <HandHeart className="text-white" size={32} />
              </div>
              <h2 className="text-2xl font-bold">Become a Volunteer</h2>
              <p className="text-gray-500">Join our mission to make a difference</p>
            </div>

            <div className="mb-6">
              <label className="font-semibold block mb-3">Select Your Skills</label>
              <div className="flex flex-wrap gap-2">
                {skillOptions.map(skill => (
                  <button
                    key={skill}
                    onClick={() => toggleSkill(skill)}
                    className={`px-4 py-2 rounded-full text-sm transition ${formData.skills.includes(skill) ? 'bg-purple-500 text-white' : 'bg-gray-100 hover:bg-gray-200'}`}
                  >
                    {skill}
                  </button>
                ))}
              </div>
            </div>

            <div className="mb-6">
              <label className="font-semibold block mb-3">Availability</label>
              <div className="grid grid-cols-2 gap-3">
                {['weekdays', 'weekends', 'both', 'flexible'].map(opt => (
                  <button
                    key={opt}
                    onClick={() => setFormData({ ...formData, availability: opt })}
                    className={`p-3 rounded-xl border-2 capitalize transition ${formData.availability === opt ? 'border-purple-500 bg-purple-50' : 'border-gray-200'}`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>

            <motion.button 
              whileHover={{ scale: 1.02 }} 
              whileTap={{ scale: 0.98 }}
              onClick={handleSubmit}
              disabled={loading}
              className="w-full bg-gradient-to-r from-purple-500 to-indigo-600 text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2"
            >
              {loading ? <Loader2 className="animate-spin" /> : <Send />}
              {loading ? 'Submitting...' : 'Submit Application'}
            </motion.button>
          </>
        ) : (
          <motion.div {...scaleIn} className="text-center py-8">
            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="text-green-500" size={48} />
            </motion.div>
            <h2 className="text-2xl font-bold mb-2">Application Submitted!</h2>
            <p className="text-gray-500 mb-6">We'll review your application and get back to you soon.</p>
            <button onClick={onClose} className="bg-gray-900 text-white px-8 py-3 rounded-xl font-semibold">Close</button>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};

// NGO Card
const NGOCard = ({ ngo, onDonate, user }) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5 }}
      className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100"
    >
      <div className="relative h-48 bg-gradient-to-br from-rose-400 to-pink-500">
        {ngo.image && <img src={ngo.image} alt={ngo.name} className="w-full h-full object-cover" />}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        {ngo.verified && (
          <div className="absolute top-4 right-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full flex items-center gap-1 text-sm font-medium text-green-600">
            <Verified size={16} /> Verified
          </div>
        )}
        <div className="absolute bottom-4 left-4 right-4">
          <h3 className="font-bold text-xl text-white">{ngo.name}</h3>
          <div className="flex items-center gap-2 text-white/80 text-sm mt-1">
            <MapPin size={14} />
            <span>{ngo.location?.city || 'Location'}, {ngo.location?.state || ''}</span>
          </div>
        </div>
      </div>

      <div className="p-6">
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">{ngo.description}</p>

        <div className="grid grid-cols-3 gap-4 mb-4">
          <div className="text-center p-3 bg-rose-50 rounded-xl">
            <div className="text-rose-600 font-bold text-lg">{ngo.totalDonations?.toLocaleString() || 0}</div>
            <div className="text-xs text-gray-500">Donations</div>
          </div>
          <div className="text-center p-3 bg-blue-50 rounded-xl">
            <div className="text-blue-600 font-bold text-lg">{ngo.beneficiariesServed?.toLocaleString() || 0}</div>
            <div className="text-xs text-gray-500">Helped</div>
          </div>
          <div className="text-center p-3 bg-amber-50 rounded-xl">
            <div className="text-amber-600 font-bold text-lg flex items-center justify-center gap-1">
              <Star size={14} fill="currentColor" /> {ngo.rating || 0}
            </div>
            <div className="text-xs text-gray-500">Rating</div>
          </div>
        </div>

        <AnimatePresence>
          {expanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <div className="border-t pt-4 mb-4">
                <h4 className="font-semibold mb-3 flex items-center gap-2">
                  <Package size={16} /> Current Inventory
                </h4>
                <div className="space-y-3">
                  {ngo.inventory?.map((item, idx) => (
                    <div key={idx}>
                      <div className="flex justify-between text-sm mb-1">
                        <span>{item.item}</span>
                        <span className="font-medium">{item.quantity} / {item.minRequired * 10}</span>
                      </div>
                      <ProgressBar current={item.quantity} target={item.minRequired * 10} />
                    </div>
                  ))}
                </div>
              </div>

              {ngo.email && (
                <div className="flex items-center gap-2 text-gray-600 text-sm mb-2">
                  <Mail size={14} /> {ngo.email}
                </div>
              )}
              {ngo.phone && (
                <div className="flex items-center gap-2 text-gray-600 text-sm">
                  <Phone size={14} /> {ngo.phone}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        <div className="flex gap-3 mt-4">
          <button
            onClick={() => setExpanded(!expanded)}
            className="flex-1 py-3 rounded-xl border-2 border-gray-200 font-semibold hover:bg-gray-50 transition flex items-center justify-center gap-2"
          >
            {expanded ? 'Show Less' : 'View Details'}
            <ChevronDown className={`transition ${expanded ? 'rotate-180' : ''}`} size={18} />
          </button>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onDonate(ngo)}
            className="flex-1 bg-gradient-to-r from-rose-500 to-pink-600 text-white py-3 rounded-xl font-semibold flex items-center justify-center gap-2 shadow-lg shadow-rose-500/30"
          >
            <Heart size={18} /> Donate
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

// Campaign Card
const CampaignCard = ({ campaign }) => {
  const progress = (campaign.raisedAmount / campaign.targetAmount) * 100;
  const daysLeft = Math.ceil((new Date(campaign.endDate) - new Date()) / (1000 * 60 * 60 * 24));

  const urgencyColors = {
    low: 'bg-green-100 text-green-600',
    medium: 'bg-yellow-100 text-yellow-600',
    high: 'bg-orange-100 text-orange-600',
    critical: 'bg-red-100 text-red-600'
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5 }}
      className="bg-white rounded-3xl shadow-xl overflow-hidden"
    >
      <div className="relative h-48">
        <img src={campaign.image} alt={campaign.title} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
        <span className={`absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-bold uppercase ${urgencyColors[campaign.urgency]}`}>
          {campaign.urgency}
        </span>
        <div className="absolute bottom-4 left-4 right-4">
          <h3 className="font-bold text-xl text-white">{campaign.title}</h3>
        </div>
      </div>

      <div className="p-6">
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">{campaign.description}</p>

        <div className="mb-4">
          <div className="flex justify-between text-sm mb-2">
            <span className="font-semibold">₹{campaign.raisedAmount.toLocaleString()}</span>
            <span className="text-gray-500">of ₹{campaign.targetAmount.toLocaleString()}</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 1 }}
              className="h-full bg-gradient-to-r from-rose-500 to-pink-600 rounded-full"
            />
          </div>
        </div>

        <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
          <div className="flex items-center gap-1">
            <Users size={16} />
            <span>{campaign.donors?.length || 0} donors</span>
          </div>
          <div className="flex items-center gap-1">
            <Clock size={16} />
            <span>{daysLeft > 0 ? `${daysLeft} days left` : 'Ended'}</span>
          </div>
        </div>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="w-full bg-gradient-to-r from-rose-500 to-pink-600 text-white py-3 rounded-xl font-semibold"
        >
          Contribute Now
        </motion.button>
      </div>
    </motion.div>
  );
};

// Blog Card
const BlogCard = ({ blog }) => (
  <motion.article
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    whileHover={{ y: -5 }}
    className="bg-white rounded-3xl shadow-xl overflow-hidden cursor-pointer group"
  >
    <div className="relative h-48 overflow-hidden">
      <img 
        src={blog.image} 
        alt={blog.title} 
        className="w-full h-full object-cover transition group-hover:scale-110" 
      />
      <div className="absolute top-4 left-4">
        <span className="bg-white/90 backdrop-blur px-3 py-1 rounded-full text-xs font-semibold capitalize">
          {blog.category}
        </span>
      </div>
    </div>
    <div className="p-6">
      <h3 className="font-bold text-lg mb-2 line-clamp-2 group-hover:text-rose-600 transition">
        {blog.title}
      </h3>
      <p className="text-gray-600 text-sm line-clamp-2 mb-4">{blog.excerpt}</p>
      <div className="flex items-center justify-between text-sm text-gray-500">
        <span className="flex items-center gap-1">
          <BookOpen size={14} /> {blog.views || 0} views
        </span>
        <span className="text-rose-600 font-semibold flex items-center gap-1 group-hover:gap-2 transition-all">
          Read More <ArrowRight size={14} />
        </span>
      </div>
    </div>
  </motion.article>
);

// Stats Section
const StatsSection = () => {
  const stats = [
    { icon: Heart, value: 50000, label: "Products Donated", suffix: "+" },
    { icon: Users, value: 15000, label: "Women Helped", suffix: "+" },
    { icon: Building, value: 120, label: "Partner NGOs", suffix: "" },
    { icon: MapPinned, value: 28, label: "States Covered", suffix: "" }
  ];

  return (
    <section className="py-20 bg-gradient-to-br from-rose-600 to-pink-700 text-white relative overflow-hidden">
      <FloatingParticles />
      <div className="container mx-auto px-6 relative z-10">
        <motion.div 
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
          variants={staggerContainer}
          className="grid md:grid-cols-4 gap-8"
        >
          {stats.map((stat, idx) => (
            <motion.div 
              key={idx}
              variants={fadeInUp}
              className="text-center"
            >
              <div className="w-16 h-16 bg-white/20 backdrop-blur rounded-2xl flex items-center justify-center mx-auto mb-4">
                <stat.icon size={32} />
              </div>
              <div className="text-4xl font-bold mb-2">
                <AnimatedCounter value={stat.value} suffix={stat.suffix} />
              </div>
              <div className="text-white/80">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

// Features Section
const FeaturesSection = () => {
  const features = [
    { icon: Zap, title: "Instant Donations", desc: "Donate products or money instantly to verified NGOs" },
    { icon: Truck, title: "Track Delivery", desc: "Real-time tracking of your donated products" },
    { icon: Shield, title: "Verified NGOs", desc: "All partner organizations are thoroughly verified" },
    { icon: BarChart3, title: "Impact Reports", desc: "See exactly how your donations make a difference" },
    { icon: MessageCircle, title: "Direct Chat", desc: "Connect directly with NGOs for queries" },
    { icon: Award, title: "Rewards", desc: "Earn badges and recognition for your contributions" }
  ];

  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-6">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <span className="bg-rose-100 text-rose-600 px-4 py-2 rounded-full text-sm font-semibold">Features</span>
          <h2 className="text-4xl font-bold mt-4 mb-4">Why Choose DonatePeriod?</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">We make it easy to contribute to menstrual health causes with transparency and impact</p>
        </motion.div>

        <motion.div 
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
          variants={staggerContainer}
          className="grid md:grid-cols-3 gap-8"
        >
          {features.map((feature, idx) => (
            <motion.div
              key={idx}
              variants={fadeInUp}
              whileHover={{ y: -5 }}
              className="bg-white p-8 rounded-3xl shadow-lg hover:shadow-xl transition"
            >
              <div className="w-14 h-14 bg-gradient-to-br from-rose-500 to-pink-600 rounded-2xl flex items-center justify-center mb-4">
                <feature.icon className="text-white" size={28} />
              </div>
              <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
              <p className="text-gray-600">{feature.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

// How It Works Section
const HowItWorksSection = () => {
  const steps = [
    { num: 1, title: "Find an NGO", desc: "Browse verified NGOs near you or filter by needs" },
    { num: 2, title: "Choose Products", desc: "Select products to donate or contribute funds" },
    { num: 3, title: "Make Donation", desc: "Complete your donation securely" },
    { num: 4, title: "Track Impact", desc: "See real-time updates on your contribution" }
  ];

  return (
    <section className="py-20">
      <div className="container mx-auto px-6">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <span className="bg-blue-100 text-blue-600 px-4 py-2 rounded-full text-sm font-semibold">Process</span>
          <h2 className="text-4xl font-bold mt-4">How It Works</h2>
        </motion.div>

        <div className="relative">
          <div className="hidden md:block absolute top-1/2 left-0 right-0 h-1 bg-gray-200 -translate-y-1/2" />
          <motion.div 
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="grid md:grid-cols-4 gap-8 relative"
          >
            {steps.map((step, idx) => (
              <motion.div
                key={idx}
                variants={fadeInUp}
                className="text-center relative"
              >
                <motion.div 
                  whileHover={{ scale: 1.1 }}
                  className="w-16 h-16 bg-gradient-to-br from-rose-500 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-4 text-white font-bold text-xl relative z-10"
                >
                  {step.num}
                </motion.div>
                <h3 className="font-bold text-lg mb-2">{step.title}</h3>
                <p className="text-gray-600 text-sm">{step.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

// Testimonials
const TestimonialsSection = () => {
  const testimonials = [
    { name: "Priya S.", role: "Regular Donor", text: "DonatePeriod made it so easy to contribute. I can see exactly where my donations go!", avatar: "https://i.pravatar.cc/100?img=1" },
    { name: "Anjali M.", role: "NGO Partner", text: "This platform has transformed how we receive donations. Highly recommended!", avatar: "https://i.pravatar.cc/100?img=5" },
    { name: "Ravi K.", role: "Volunteer", text: "Being part of this mission has been incredibly rewarding. The team is amazing!", avatar: "https://i.pravatar.cc/100?img=8" }
  ];

  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-6">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <span className="bg-purple-100 text-purple-600 px-4 py-2 rounded-full text-sm font-semibold">Testimonials</span>
          <h2 className="text-4xl font-bold mt-4">What People Say</h2>
        </motion.div>

        <motion.div 
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
          variants={staggerContainer}
          className="grid md:grid-cols-3 gap-8"
        >
          {testimonials.map((t, idx) => (
            <motion.div
              key={idx}
              variants={fadeInUp}
              className="bg-white p-8 rounded-3xl shadow-lg"
            >
              <div className="flex items-center gap-4 mb-4">
                <img src={t.avatar} alt={t.name} className="w-14 h-14 rounded-full" />
                <div>
                  <h4 className="font-bold">{t.name}</h4>
                  <span className="text-gray-500 text-sm">{t.role}</span>
                </div>
              </div>
              <p className="text-gray-600 italic">"{t.text}"</p>
              <div className="flex gap-1 mt-4 text-amber-400">
                {[...Array(5)].map((_, i) => <Star key={i} size={16} fill="currentColor" />)}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

// Footer
const Footer = () => (
  <footer className="bg-gray-900 text-white pt-16 pb-8">
    <div className="container mx-auto px-6">
      <div className="grid md:grid-cols-4 gap-12 mb-12">
        <div>
          <div className="flex items-center gap-2 text-2xl font-bold mb-4">
            <Heart fill="currentColor" className="text-rose-500" /> DonatePeriod.
          </div>
          <p className="text-gray-400 mb-4">Making menstrual health accessible for every woman through community support.</p>
          <div className="flex gap-4">
            {[Facebook, Twitter, Instagram, Linkedin].map((Icon, idx) => (
              <motion.a 
                key={idx}
                whileHover={{ scale: 1.2 }}
                className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-rose-500 transition cursor-pointer"
              >
                <Icon size={18} />
              </motion.a>
            ))}
          </div>
        </div>

        <div>
          <h4 className="font-bold mb-4">Quick Links</h4>
          <ul className="space-y-2 text-gray-400">
            {['About Us', 'Our Mission', 'Partner NGOs', 'Volunteer'].map((link, idx) => (
              <li key={idx}>
                <a href="#" className="hover:text-white transition">{link}</a>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="font-bold mb-4">Resources</h4>
          <ul className="space-y-2 text-gray-400">
            {['Blog', 'FAQs', 'Privacy Policy', 'Terms of Service'].map((link, idx) => (
              <li key={idx}>
                <a href="#" className="hover:text-white transition">{link}</a>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="font-bold mb-4">Newsletter</h4>
          <p className="text-gray-400 mb-4">Subscribe for updates on our impact and campaigns.</p>
          <div className="flex gap-2">
            <input 
              type="email" 
              placeholder="Your email" 
              className="flex-1 bg-gray-800 px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500"
            />
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-rose-500 p-3 rounded-xl"
            >
              <Send size={20} />
            </motion.button>
          </div>
        </div>
      </div>

      <div className="border-t border-gray-800 pt-8 text-center text-gray-400">
        <p>© 2025 DonatePeriod. Made with ❤️ for women everywhere.</p>
      </div>
    </div>
  </footer>
);

// Main App
function App() {
  const [user, setUser] = useState(null);
  const [showAuth, setShowAuth] = useState(false);
  const [showVolunteer, setShowVolunteer] = useState(false);
  const [ngos, setNgos] = useState([]);
  const [campaigns, setCampaigns] = useState([]);
  const [blogs, setBlogs] = useState([]);
  const [selectedNGO, setSelectedNGO] = useState(null);
  const [activeSection, setActiveSection] = useState('home');
  const [loading, setLoading] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [toast, setToast] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) setUser(JSON.parse(savedUser));
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [ngosRes, campaignsRes, blogsRes] = await Promise.all([
        fetch(`${API_URL}/api/ngos`),
        fetch(`${API_URL}/api/campaigns`),
        fetch(`${API_URL}/api/blogs`)
      ]);
      
      const ngosData = await ngosRes.json();
      const campaignsData = await campaignsRes.json();
      const blogsData = await blogsRes.json();
      
      setNgos(ngosData.data || []);
      setCampaigns(campaignsData.data || []);
      setBlogs(blogsData.data || []);
    } catch (err) {
      console.error('Fetch error:', err);
    }
    setLoading(false);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    showToast('Logged out successfully', 'success');
  };

  const showToast = (message, type = 'info') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleDonate = (ngo) => {
    if (!user) {
      setShowAuth(true);
      return;
    }
    setSelectedNGO(ngo);
  };

  const filteredNGOs = ngos.filter(ngo => 
    ngo.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    ngo.location?.city?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="bg-slate-50 min-h-screen font-sans text-gray-900">
      {/* Navbar */}
      <motion.nav 
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className="fixed w-full z-50 bg-white/90 backdrop-blur-lg shadow-sm"
      >
        <div className="container mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <motion.div 
              whileHover={{ scale: 1.05 }}
              className="flex items-center gap-2 text-rose-600 font-bold text-2xl cursor-pointer"
              onClick={() => setActiveSection('home')}
            >
              <Heart fill="currentColor" /> <span>DonatePeriod.</span>
            </motion.div>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center gap-8">
              {['home', 'ngos', 'campaigns', 'blog'].map((item) => (
                <button
                  key={item}
                  onClick={() => setActiveSection(item)}
                  className={`font-medium capitalize transition ${activeSection === item ? 'text-rose-600' : 'text-gray-600 hover:text-gray-900'}`}
                >
                  {item}
                </button>
              ))}
            </div>

            <div className="hidden md:flex items-center gap-4">
              {user ? (
                <div className="flex items-center gap-4">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    onClick={() => setShowVolunteer(true)}
                    className="bg-purple-100 text-purple-600 px-4 py-2 rounded-full font-medium flex items-center gap-2"
                  >
                    <HandHeart size={18} /> Volunteer
                  </motion.button>
                  <div className="relative group">
                    <button className="flex items-center gap-2 bg-gray-100 px-4 py-2 rounded-full">
                      <div className="w-8 h-8 bg-gradient-to-br from-rose-500 to-pink-600 rounded-full flex items-center justify-center text-white font-bold">
                        {user.name?.charAt(0).toUpperCase()}
                      </div>
                      <span className="font-medium">{user.name}</span>
                      <ChevronDown size={16} />
                    </button>
                    <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-xl shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition">
                      <button className="w-full px-4 py-3 text-left hover:bg-gray-50 flex items-center gap-2">
                        <User size={16} /> Profile
                      </button>
                      <button className="w-full px-4 py-3 text-left hover:bg-gray-50 flex items-center gap-2">
                        <Gift size={16} /> My Donations
                      </button>
                      <button 
                        onClick={handleLogout}
                        className="w-full px-4 py-3 text-left hover:bg-gray-50 flex items-center gap-2 text-red-500"
                      >
                        <LogOut size={16} /> Logout
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <motion.button 
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowAuth(true)} 
                  className="bg-gradient-to-r from-rose-500 to-pink-600 text-white px-6 py-2 rounded-full font-medium shadow-lg shadow-rose-500/30"
                >
                  Get Started
                </motion.button>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button className="md:hidden" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
              <Menu size={24} />
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="md:hidden bg-white border-t"
            >
              <div className="container mx-auto px-6 py-4 space-y-4">
                {['home', 'ngos', 'campaigns', 'blog'].map((item) => (
                  <button
                    key={item}
                    onClick={() => { setActiveSection(item); setMobileMenuOpen(false); }}
                    className="block w-full text-left py-2 font-medium capitalize"
                  >
                    {item}
                  </button>
                ))}
                {!user && (
                  <button 
                    onClick={() => { setShowAuth(true); setMobileMenuOpen(false); }}
                    className="w-full bg-rose-500 text-white py-3 rounded-xl font-medium"
                  >
                    Get Started
                  </button>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>

      {/* Modals */}
      <AnimatePresence>
        {showAuth && <AuthModal onClose={() => setShowAuth(false)} onLogin={setUser} />}
        {selectedNGO && (
          <DonationModal 
            ngo={selectedNGO} 
            onClose={() => setSelectedNGO(null)} 
            user={user}
            onSuccess={() => { fetchData(); showToast('Donation successful!', 'success'); }}
          />
        )}
        {showVolunteer && <VolunteerModal onClose={() => setShowVolunteer(false)} user={user} />}
        {toast && <Toast {...toast} onClose={() => setToast(null)} />}
      </AnimatePresence>

      {/* Hero Section */}
      {activeSection === 'home' && (
        <>
          <section className="relative min-h-screen flex items-center pt-20 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-rose-50 via-pink-50 to-white" />
            <FloatingParticles />
            
            <div className="container mx-auto px-6 relative z-10">
              <div className="grid lg:grid-cols-2 gap-12 items-center">
                <motion.div
                  initial={{ opacity: 0, x: -50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.8 }}
                >
                  <motion.span 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="inline-flex items-center gap-2 bg-rose-100 text-rose-600 px-4 py-2 rounded-full text-sm font-semibold mb-6"
                  >
                    <Sparkles size={16} /> Making a Difference Together
                  </motion.span>
                  
                  <h1 className="text-5xl lg:text-7xl font-extrabold leading-tight mb-6">
                    Every Period 
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-500 to-pink-600"> Matters.</span>
                  </h1>
                  
                  <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                    Join thousands of donors helping women access menstrual hygiene products. 
                    Your contribution brings dignity and education to those in need.
                  </p>

                  <div className="flex flex-wrap gap-4">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setActiveSection('ngos')}
                      className="bg-gradient-to-r from-rose-500 to-pink-600 text-white px-8 py-4 rounded-full text-lg font-semibold shadow-xl shadow-rose-500/30 flex items-center gap-2"
                    >
                      Start Donating <ArrowRight size={20} />
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="bg-white text-gray-900 px-8 py-4 rounded-full text-lg font-semibold shadow-xl flex items-center gap-2 border-2 border-gray-200"
                    >
                      <Play size={20} /> Watch Story
                    </motion.button>
                  </div>

                  <div className="flex items-center gap-6 mt-10">
                    <div className="flex -space-x-3">
                      {[1, 5, 8, 12].map((img) => (
                        <img key={img} src={`https://i.pravatar.cc/40?img=${img}`} className="w-10 h-10 rounded-full border-2 border-white" alt="" />
                      ))}
                    </div>
                    <div>
                      <div className="font-bold">15,000+ Donors</div>
                      <div className="text-gray-500 text-sm">Making impact daily</div>
                    </div>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                  className="relative hidden lg:block"
                >
                  <div className="relative w-full aspect-square">
                    <div className="absolute inset-0 bg-gradient-to-br from-rose-400 to-pink-500 rounded-[3rem] transform rotate-6" />
                    <img 
                      src="https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=600" 
                      alt="Hero" 
                      className="absolute inset-0 w-full h-full object-cover rounded-[3rem] shadow-2xl"
                    />
                    
                    {/* Floating Cards */}
                    <motion.div
                      animate={{ y: [0, -10, 0] }}
                      transition={{ duration: 3, repeat: Infinity }}
                      className="absolute -left-10 top-1/4 bg-white p-4 rounded-2xl shadow-xl"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                          <TrendingUp className="text-green-600" />
                        </div>
                        <div>
                          <div className="font-bold">+247%</div>
                          <div className="text-gray-500 text-sm">Impact Growth</div>
                        </div>
                      </div>
                    </motion.div>

                    <motion.div
                      animate={{ y: [0, 10, 0] }}
                      transition={{ duration: 4, repeat: Infinity }}
                      className="absolute -right-10 bottom-1/4 bg-white p-4 rounded-2xl shadow-xl"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-rose-100 rounded-xl flex items-center justify-center">
                          <Heart className="text-rose-600" fill="currentColor" />
                        </div>
                        <div>
                          <div className="font-bold">50K+</div>
                          <div className="text-gray-500 text-sm">Products Donated</div>
                        </div>
                      </div>
                    </motion.div>
                  </div>
                </motion.div>
              </div>
            </div>
          </section>

          <StatsSection />
          <FeaturesSection />
          <HowItWorksSection />

          {/* Campaigns Preview */}
          <section className="py-20">
            <div className="container mx-auto px-6">
              <div className="flex justify-between items-center mb-12">
                <div>
                  <span className="bg-orange-100 text-orange-600 px-4 py-2 rounded-full text-sm font-semibold">Campaigns</span>
                  <h2 className="text-4xl font-bold mt-4">Active Campaigns</h2>
                </div>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  onClick={() => setActiveSection('campaigns')}
                  className="text-rose-600 font-semibold flex items-center gap-2"
                >
                  View All <ArrowRight size={18} />
                </motion.button>
              </div>

              {loading ? (
                <div className="flex justify-center py-20">
                  <Loader2 className="animate-spin text-rose-500" size={48} />
                </div>
              ) : (
                <div className="grid md:grid-cols-3 gap-8">
                  {campaigns.slice(0, 3).map((campaign, idx) => (
                    <CampaignCard key={idx} campaign={campaign} />
                  ))}
                </div>
              )}
            </div>
          </section>

          <TestimonialsSection />

          {/* CTA Section */}
          <section className="py-20">
            <div className="container mx-auto px-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="bg-gradient-to-br from-rose-500 to-pink-600 rounded-[3rem] p-12 md:p-16 text-center text-white relative overflow-hidden"
              >
                <FloatingParticles />
                <h2 className="text-4xl md:text-5xl font-bold mb-6 relative z-10">Ready to Make a Difference?</h2>
                <p className="text-xl text-white/80 mb-8 max-w-2xl mx-auto relative z-10">
                  Join our community of donors and help us ensure every woman has access to menstrual hygiene products.
                </p>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => user ? setActiveSection('ngos') : setShowAuth(true)}
                  className="bg-white text-rose-600 px-10 py-4 rounded-full text-lg font-bold shadow-xl relative z-10"
                >
                  {user ? 'Start Donating Now' : 'Join Now — It\'s Free'}
                </motion.button>
              </motion.div>
            </div>
          </section>
        </>
      )}

      {/* NGOs Section - Using NGOFinder Component */}
      {activeSection === 'ngos' && (
        <NGOFinder onDonate={handleDonate} user={user} />
      )}

      {/* Campaigns Section */}
      {activeSection === 'campaigns' && (
        <section className="pt-28 pb-20">
          <div className="container mx-auto px-6">
            <motion.div {...fadeInUp} className="text-center mb-12">
              <h1 className="text-4xl font-bold mb-4">Active Campaigns</h1>
              <p className="text-gray-600 max-w-2xl mx-auto">Support urgent causes and see your impact in real-time</p>
            </motion.div>

            {loading ? (
              <div className="flex justify-center py-20">
                <Loader2 className="animate-spin text-rose-500" size={48} />
              </div>
            ) : (
              <motion.div 
                initial="initial"
                animate="animate"
                variants={staggerContainer}
                className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
              >
                {campaigns.map((campaign, idx) => (
                  <CampaignCard key={idx} campaign={campaign} />
                ))}
              </motion.div>
            )}
          </div>
        </section>
      )}

      {/* Blog Section */}
      {activeSection === 'blog' && (
        <section className="pt-28 pb-20">
          <div className="container mx-auto px-6">
            <motion.div {...fadeInUp} className="text-center mb-12">
              <h1 className="text-4xl font-bold mb-4">Blog & Stories</h1>
              <p className="text-gray-600 max-w-2xl mx-auto">Read inspiring stories, news, and educational content about menstrual health</p>
            </motion.div>

            {loading ? (
              <div className="flex justify-center py-20">
                <Loader2 className="animate-spin text-rose-500" size={48} />
              </div>
            ) : (
              <motion.div 
                initial="initial"
                animate="animate"
                variants={staggerContainer}
                className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
              >
                {blogs.map((blog, idx) => (
                  <BlogCard key={idx} blog={blog} />
                ))}
              </motion.div>
            )}
          </div>
        </section>
      )}

      <Footer />
    </div>
  );
}

export default App;
