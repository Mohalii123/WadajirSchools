import React, { useState, useEffect, useMemo } from 'react';
import { 
  GoogleAuthProvider,
  signInWithPopup,
  onAuthStateChanged, 
  User as FirebaseUser,
  signOut
} from 'firebase/auth';
import { 
  collection, 
  query, 
  where, 
  onSnapshot, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  serverTimestamp,
  orderBy,
  getDoc,
  setDoc,
  limit,
  Timestamp
} from 'firebase/firestore';
import { auth, db } from './firebase';
import { 
  Users, 
  GraduationCap, 
  ClipboardList, 
  CreditCard, 
  Trophy, 
  Megaphone, 
  LayoutDashboard,
  LogOut,
  Plus,
  Trash2,
  CheckCircle2,
  XCircle,
  Search,
  Calendar,
  User as UserIcon,
  Loader2,
  AlertCircle,
  LogIn,
  ChevronRight,
  ChevronLeft,
  Menu,
  X,
  Image as ImageIcon,
  Upload,
  Settings,
  Bell,
  BookOpen,
  School,
  Clock,
  CheckSquare,
  BarChart3
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { format } from 'date-fns';

// --- Utility ---
function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

type UserRole = 'admin' | 'teacher' | 'student';

interface UserProfile {
  uid: string;
  displayName: string;
  email: string;
  role: UserRole;
  photoURL?: string;
  createdAt: any;
}

interface StudentRecord {
  id: string;
  userId: string;
  studentId: string;
  dob: string;
  class: string;
  parentName: string;
  parentPhone: string;
  address: string;
  feeStatus: 'paid' | 'unpaid';
  examResultsLocked: boolean;
}

// --- Components ---

const ErrorBoundary = ({ children }: { children: React.ReactNode }) => {
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const handleError = (e: ErrorEvent) => {
      try {
        const parsed = JSON.parse(e.message);
        setError(parsed.error || 'A database error occurred.');
      } catch {
        setError(e.message);
      }
    };
    window.addEventListener('error', handleError);
    return () => window.removeEventListener('error', handleError);
  }, []);

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-blue-50 p-4">
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-red-100 max-w-md w-full text-center">
          <AlertCircle className="w-12 h-12 text-red-600 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-blue-900 mb-2">Something went wrong</h2>
          <p className="text-stone-500 mb-6">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="px-6 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

const Login = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async () => {
    setLoading(true);
    setError(null);
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      
      const userDocRef = doc(db, 'users', result.user.uid);
      const userDoc = await getDoc(userDocRef);
      
      if (!userDoc.exists()) {
        const role: UserRole = result.user.email === "wadajirtuition6@gmail.com" ? 'admin' : 'student';
        await setDoc(userDocRef, {
          uid: result.user.uid,
          displayName: result.user.displayName || 'User',
          email: result.user.email,
          role: role,
          photoURL: result.user.photoURL,
          createdAt: serverTimestamp()
        });
      }
    } catch (err: any) {
      setError(err.message || "Failed to sign in.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-blue-900 p-4 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(239,68,68,0.1),transparent_50%)]" />
      
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white p-10 rounded-[32px] shadow-2xl max-w-md w-full relative z-10 border-t-8 border-red-600"
      >
        <div className="text-center mb-8">
          <div className="w-24 h-24 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg shadow-blue-600/20 overflow-hidden border-4 border-blue-50">
            <img 
              src="https://picsum.photos/seed/wadajir/200/200" 
              alt="Wadajir Logo" 
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </div>
          <h1 className="text-3xl font-bold text-blue-900 mb-2">Wadajir Tuition</h1>
          <p className="text-stone-500 font-medium">Management System</p>
        </div>
        
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-xl text-red-600 text-sm flex items-start gap-2">
            <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <button
          onClick={handleLogin}
          disabled={loading}
          className="w-full py-4 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-all disabled:opacity-50 flex items-center justify-center gap-3 shadow-lg shadow-blue-600/20"
        >
          {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <><LogIn className="w-5 h-5" /> Sign in with Google</>}
        </button>
        
        <div className="mt-8 pt-8 border-t border-stone-100 text-center">
          <p className="text-xs text-stone-400 uppercase tracking-widest font-bold">
            Represented by Quality Education
          </p>
        </div>
      </motion.div>
    </div>
  );
};

// --- Dashboard Components ---

const Sidebar = ({ role, activeTab, setActiveTab, onLogout, profile, isOpen, setIsOpen }: { 
  role: UserRole, 
  activeTab: string, 
  setActiveTab: (tab: any) => void,
  onLogout: () => void,
  profile: UserProfile,
  isOpen: boolean,
  setIsOpen: (open: boolean) => void
}) => {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, roles: ['admin', 'teacher', 'student'] },
    { id: 'students', label: 'Students', icon: Users, roles: ['admin', 'teacher'] },
    { id: 'teachers', label: 'Teachers', icon: GraduationCap, roles: ['admin'] },
    { id: 'subjects', label: 'Subjects', icon: BookOpen, roles: ['admin'] },
    { id: 'classes', label: 'Classes', icon: School, roles: ['admin', 'teacher'] },
    { id: 'attendance', label: 'Attendance', icon: ClipboardList, roles: ['admin', 'teacher', 'student'] },
    { id: 'fees', label: 'Fees', icon: CreditCard, roles: ['admin', 'student'] },
    { id: 'exams', label: 'Exams', icon: Trophy, roles: ['admin', 'teacher', 'student'] },
    { id: 'gallery', label: 'Gallery', icon: ImageIcon, roles: ['admin', 'teacher', 'student'] },
    { id: 'announcements', label: 'Announcements', icon: Megaphone, roles: ['admin', 'teacher', 'student'] },
    { id: 'profile', label: 'My Profile', icon: UserIcon, roles: ['admin', 'teacher', 'student'] },
  ].filter(item => item.roles.includes(role));

  const handleTabClick = (id: string) => {
    setActiveTab(id);
    setIsOpen(false);
  };

  return (
    <>
      {/* Mobile Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 bg-blue-900/60 backdrop-blur-sm z-30 lg:hidden"
          />
        )}
      </AnimatePresence>

      <div className={cn(
        "fixed lg:sticky top-0 left-0 w-64 bg-blue-900 text-white flex flex-col h-screen shadow-xl z-40 transition-transform duration-300 lg:translate-x-0",
        isOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="p-6 border-b border-blue-800 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center overflow-hidden">
              <img 
                src="https://picsum.photos/seed/wadajir/100/100" 
                alt="Logo" 
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
            <span className="font-bold text-lg leading-tight">Wadajir<br/><span className="text-red-500">Tuition</span></span>
          </div>
          <button onClick={() => setIsOpen(false)} className="lg:hidden p-1 text-blue-200 hover:text-white">
            <X className="w-6 h-6" />
          </button>
        </div>
        
        <div className="p-6 border-b border-blue-800 bg-blue-950/30">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-blue-700 flex items-center justify-center overflow-hidden border-2 border-blue-500">
              {profile.photoURL ? (
                <img src={profile.photoURL} alt="Avatar" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
              ) : (
                <UserIcon className="w-6 h-6 text-blue-200" />
              )}
            </div>
            <div className="overflow-hidden">
              <p className="font-bold text-sm truncate">{profile.displayName}</p>
              <p className="text-[10px] uppercase tracking-wider text-blue-400 font-bold">{profile.role}</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-1 overflow-y-auto custom-scrollbar">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleTabClick(item.id)}
              className={cn(
                "w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium text-sm",
                activeTab === item.id 
                  ? "bg-red-600 text-white shadow-lg shadow-red-600/20" 
                  : "text-blue-200 hover:bg-blue-800 hover:text-white"
              )}
            >
              <item.icon className="w-5 h-5" />
              {item.label}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-blue-800">
          <button 
            onClick={onLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-400 hover:bg-red-900/30 hover:text-red-300 transition-all font-medium text-sm"
          >
            <LogOut className="w-5 h-5" />
            Logout
          </button>
        </div>
      </div>
    </>
  );
};

const DashboardHome = ({ profile, setActiveTab }: { profile: UserProfile, setActiveTab: (tab: string) => void }) => {
  const [stats, setStats] = useState({
    students: 0, 
    teachers: 0, 
    classes: 0, 
    feesCollected: 0, 
    feesPending: 0,
    announcements: 0 
  });

  useEffect(() => {
    const unsubStudents = onSnapshot(collection(db, 'students'), (s) => setStats(prev => ({ ...prev, students: s.size })));
    const unsubTeachers = onSnapshot(collection(db, 'teachers'), (s) => setStats(prev => ({ ...prev, teachers: s.size })));
    const unsubClasses = onSnapshot(collection(db, 'classes'), (s) => setStats(prev => ({ ...prev, classes: s.size })));
    const unsubFees = onSnapshot(collection(db, 'fees'), (s) => {
      let collected = 0;
      let pending = 0;
      s.docs.forEach(doc => {
        const data = doc.data();
        if (data.status === 'paid') collected += data.amount;
        else pending += data.amount;
      });
      setStats(prev => ({ ...prev, feesCollected: collected, feesPending: pending }));
    });
    const unsubAnn = onSnapshot(collection(db, 'announcements'), (s) => setStats(prev => ({ ...prev, announcements: s.size })));
    
    return () => { 
      unsubStudents(); unsubTeachers(); unsubClasses(); unsubFees(); unsubAnn(); 
    };
  }, []);

  const chartData = [
    { name: 'Mon', attendance: 85 },
    { name: 'Tue', attendance: 92 },
    { name: 'Wed', attendance: 88 },
    { name: 'Thu', attendance: 95 },
    { name: 'Fri', attendance: 90 },
    { name: 'Sat', attendance: 70 },
  ];

  const feeData = [
    { name: 'Collected', value: stats.feesCollected },
    { name: 'Pending', value: stats.feesPending },
  ];

  const COLORS = ['#2563eb', '#ef4444'];

  const statCards = [
    { label: 'Total Students', value: stats.students, icon: Users, color: 'bg-blue-600', tab: 'students' },
    { label: 'Total Teachers', value: stats.teachers, icon: GraduationCap, color: 'bg-red-600', tab: 'teachers' },
    { label: 'Total Classes', value: stats.classes, icon: School, color: 'bg-amber-500', tab: 'classes' },
    { label: 'Announcements', value: stats.announcements, icon: Megaphone, color: 'bg-emerald-500', tab: 'announcements' },
  ];

  return (
    <div className="space-y-8 pb-12">
      <header className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold text-blue-900">Dashboard Overview</h1>
          <p className="text-stone-500">Welcome to Wadajir Tuition Center Management Portal.</p>
        </div>
        <div className="flex gap-3">
          <div className="bg-white p-2 rounded-xl shadow-sm border border-stone-100 flex items-center gap-2">
            <Calendar className="w-5 h-5 text-blue-600" />
            <span className="text-sm font-bold text-blue-900">{format(new Date(), 'MMMM dd, yyyy')}</span>
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, i) => (
          <motion.div 
            key={i} 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            onClick={() => setActiveTab(stat.tab)}
            className="bg-white p-6 rounded-3xl shadow-sm border border-stone-100 flex items-center gap-4 hover:shadow-md transition-all cursor-pointer group"
          >
            <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform", stat.color)}>
              <stat.icon className="w-7 h-7" />
            </div>
            <div>
              <p className="text-stone-500 text-xs font-bold uppercase tracking-wider">{stat.label}</p>
              <p className="text-2xl font-bold text-blue-900">{stat.value}</p>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white p-8 rounded-[32px] shadow-sm border border-stone-100">
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-xl font-bold text-blue-900 flex items-center gap-2">
              <BarChart3 className="w-6 h-6 text-blue-600" />
              Attendance Overview (%)
            </h3>
            <select className="text-sm border-none bg-stone-50 rounded-lg px-3 py-1 font-bold text-blue-900">
              <option>This Week</option>
              <option>Last Week</option>
            </select>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
                <Tooltip 
                  cursor={{ fill: '#f8fafc' }}
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                />
                <Bar dataKey="attendance" fill="#2563eb" radius={[6, 6, 0, 0]} barSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-8 rounded-[32px] shadow-sm border border-stone-100">
          <h3 className="text-xl font-bold text-blue-900 mb-8 flex items-center gap-2">
            <CreditCard className="w-6 h-6 text-red-600" />
            Fee Status
          </h3>
          <div className="h-[250px] w-full relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={feeData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {feeData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <p className="text-xs text-stone-400 font-bold uppercase">Total</p>
              <p className="text-xl font-bold text-blue-900">${stats.feesCollected + stats.feesPending}</p>
            </div>
          </div>
          <div className="mt-6 space-y-3">
            <div className="flex justify-between items-center p-3 rounded-xl bg-blue-50">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-blue-600" />
                <span className="text-sm font-medium text-blue-900">Collected</span>
              </div>
              <span className="font-bold text-blue-900">${stats.feesCollected}</span>
            </div>
            <div className="flex justify-between items-center p-3 rounded-xl bg-red-50">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-red-600" />
                <span className="text-sm font-medium text-red-900">Pending</span>
              </div>
              <span className="font-bold text-red-900">${stats.feesPending}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-8 rounded-[32px] shadow-sm border border-stone-100">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-bold text-blue-900 flex items-center gap-2">
              <Megaphone className="w-5 h-5 text-red-600" />
              Recent Announcements
            </h3>
            <button className="text-blue-600 text-sm font-bold hover:underline">View All</button>
          </div>
          <AnnouncementsList limitCount={3} />
        </div>
        <div className="bg-white p-8 rounded-[32px] shadow-sm border border-stone-100">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-bold text-blue-900 flex items-center gap-2">
              <Trophy className="w-5 h-5 text-amber-500" />
              Upcoming Exams
            </h3>
            <button className="text-blue-600 text-sm font-bold hover:underline">Schedule</button>
          </div>
          <div className="space-y-4">
            {[
              { subject: 'Mathematics', date: 'Mar 20, 2024', time: '09:00 AM', class: 'Grade 10' },
              { subject: 'Physics', date: 'Mar 22, 2024', time: '10:30 AM', class: 'Grade 11' },
              { subject: 'English', date: 'Mar 25, 2024', time: '08:00 AM', class: 'Grade 9' },
            ].map((exam, i) => (
              <div key={i} className="flex items-center justify-between p-4 rounded-2xl bg-stone-50 border border-stone-100">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-white border border-stone-100 flex flex-col items-center justify-center">
                    <span className="text-[10px] font-bold text-red-500 uppercase">{exam.date.split(' ')[0]}</span>
                    <span className="text-lg font-bold text-blue-900 leading-none">{exam.date.split(' ')[1].replace(',', '')}</span>
                  </div>
                  <div>
                    <h4 className="font-bold text-blue-900">{exam.subject}</h4>
                    <p className="text-xs text-stone-500">{exam.class} • {exam.time}</p>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-stone-300" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const AnnouncementsList = ({ limitCount }: { limitCount?: number }) => {
  const [announcements, setAnnouncements] = useState<any[]>([]);

  useEffect(() => {
    const q = query(collection(db, 'announcements'), orderBy('date', 'desc'), limit(limitCount || 50));
    return onSnapshot(q, (s) => {
      setAnnouncements(s.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });
  }, [limitCount]);

  return (
    <div className="space-y-4">
      {announcements.map((ann) => (
        <div key={ann.id} className="p-4 rounded-2xl bg-stone-50 border border-stone-100 hover:border-blue-200 transition-colors">
          <div className="flex justify-between items-start mb-2">
            <h4 className="font-bold text-blue-900">{ann.title}</h4>
            <span className="text-[10px] uppercase tracking-wider font-bold px-2 py-0.5 rounded-full bg-blue-100 text-blue-700">
              {ann.target}
            </span>
          </div>
          <p className="text-stone-600 text-sm line-clamp-2">{ann.content}</p>
          <div className="mt-3 flex items-center gap-2 text-[10px] text-stone-400 font-bold uppercase">
            <Clock className="w-3 h-3" />
            {ann.date?.toDate ? format(ann.date.toDate(), 'MMM dd, yyyy') : 'Just now'}
          </div>
        </div>
      ))}
      {announcements.length === 0 && <p className="text-stone-400 text-center py-8 italic">No announcements yet.</p>}
    </div>
  );
};

const StudentsManagement = ({ role }: { role: UserRole }) => {
  const [students, setStudents] = useState<any[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [editingStudent, setEditingStudent] = useState<any>(null);
  const [search, setSearch] = useState('');
  const [newStudent, setNewStudent] = useState({ 
    name: '', studentId: '', class: '', dob: '', 
    parentName: '', parentPhone: '', address: '', email: '' 
  });

  useEffect(() => {
    return onSnapshot(collection(db, 'students'), (s) => {
      setStudents(s.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });
  }, []);

  const filteredStudents = useMemo(() => {
    return students.filter(s => 
      s.name?.toLowerCase().includes(search.toLowerCase()) || 
      s.studentId?.toLowerCase().includes(search.toLowerCase())
    );
  }, [students, search]);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (role !== 'admin') return;
    try {
      await addDoc(collection(db, 'students'), {
        ...newStudent,
        feeStatus: 'unpaid',
        examResultsLocked: true,
        createdAt: serverTimestamp()
      });
      setNewStudent({ name: '', studentId: '', class: '', dob: '', parentName: '', parentPhone: '', address: '', email: '' });
      setIsAdding(false);
    } catch (err) {
      console.error(err);
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (role !== 'admin' || !editingStudent) return;
    try {
      const { id, ...data } = editingStudent;
      await updateDoc(doc(db, 'students', id), data);
      setEditingStudent(null);
    } catch (err) {
      console.error(err);
    }
  };

  const toggleLock = async (id: string, current: boolean) => {
    if (role !== 'admin') return;
    await updateDoc(doc(db, 'students', id), { examResultsLocked: !current });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-blue-900">Student Management</h2>
          <p className="text-stone-500 text-sm">Manage student records, registration and academic access.</p>
        </div>
        {role === 'admin' && (
          <button 
            onClick={() => setIsAdding(true)}
            className="bg-blue-600 text-white px-6 py-3 rounded-2xl flex items-center gap-2 hover:bg-blue-700 transition-all font-bold shadow-lg shadow-blue-600/20"
          >
            <Plus className="w-5 h-5" /> Add Student
          </button>
        )}
      </div>

      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400 w-5 h-5" />
        <input 
          type="text" 
          placeholder="Search by name or student ID..." 
          className="w-full pl-12 pr-6 py-4 rounded-2xl border border-stone-200 focus:ring-4 focus:ring-blue-600/5 outline-none transition-all"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>

      {(isAdding || editingStudent) && (
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="bg-white p-8 rounded-[32px] border border-blue-100 shadow-xl">
          <h3 className="text-xl font-bold text-blue-900 mb-6">
            {editingStudent ? 'Edit Student Record' : 'New Student Registration'}
          </h3>
          <form onSubmit={editingStudent ? handleUpdate : handleAdd} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-bold text-stone-400 uppercase">Full Name</label>
              <input 
                className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:border-blue-600 outline-none" 
                value={editingStudent ? editingStudent.name : newStudent.name}
                onChange={e => editingStudent 
                  ? setEditingStudent({...editingStudent, name: e.target.value})
                  : setNewStudent({...newStudent, name: e.target.value})
                }
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-stone-400 uppercase">Student ID</label>
              <input 
                className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:border-blue-600 outline-none" 
                value={editingStudent ? editingStudent.studentId : newStudent.studentId}
                onChange={e => editingStudent 
                  ? setEditingStudent({...editingStudent, studentId: e.target.value})
                  : setNewStudent({...newStudent, studentId: e.target.value})
                }
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-stone-400 uppercase">Class</label>
              <input 
                className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:border-blue-600 outline-none" 
                value={editingStudent ? editingStudent.class : newStudent.class}
                onChange={e => editingStudent 
                  ? setEditingStudent({...editingStudent, class: e.target.value})
                  : setNewStudent({...newStudent, class: e.target.value})
                }
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-stone-400 uppercase">Parent Phone</label>
              <input 
                className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:border-blue-600 outline-none" 
                value={editingStudent ? editingStudent.parentPhone : newStudent.parentPhone}
                onChange={e => editingStudent 
                  ? setEditingStudent({...editingStudent, parentPhone: e.target.value})
                  : setNewStudent({...newStudent, parentPhone: e.target.value})
                }
                required
              />
            </div>
            <div className="md:col-span-2 flex gap-4 pt-4">
              <button type="submit" className="flex-1 bg-blue-600 text-white py-4 rounded-2xl font-bold shadow-lg shadow-blue-600/20">
                {editingStudent ? 'Update Record' : 'Complete Registration'}
              </button>
              <button type="button" onClick={() => { setIsAdding(false); setEditingStudent(null); }} className="px-8 py-4 bg-stone-100 text-stone-600 rounded-2xl font-bold">Cancel</button>
            </div>
          </form>
        </motion.div>
      )}

      <div className="bg-white rounded-[32px] shadow-sm border border-stone-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-stone-50 border-b border-stone-100">
              <tr>
                <th className="px-6 py-4 text-xs font-bold text-stone-400 uppercase tracking-wider">Student</th>
                <th className="px-6 py-4 text-xs font-bold text-stone-400 uppercase tracking-wider">Class</th>
                <th className="px-6 py-4 text-xs font-bold text-stone-400 uppercase tracking-wider">Fee Status</th>
                <th className="px-6 py-4 text-xs font-bold text-stone-400 uppercase tracking-wider">Exam Access</th>
                {role === 'admin' && <th className="px-6 py-4 text-xs font-bold text-stone-400 uppercase tracking-wider">Actions</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {filteredStudents.map((student) => (
                <tr key={student.id} className="hover:bg-blue-50/30 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold">
                        {student.name?.charAt(0)}
                      </div>
                      <div>
                        <p className="font-bold text-blue-900">{student.name}</p>
                        <p className="text-xs font-mono text-stone-400">{student.studentId}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm font-medium text-stone-600">{student.class}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={cn(
                      "px-3 py-1 rounded-full text-[10px] font-bold uppercase",
                      student.feeStatus === 'paid' ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-700"
                    )}>
                      {student.feeStatus}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <button 
                      onClick={() => toggleLock(student.id, student.examResultsLocked)}
                      className={cn(
                        "flex items-center gap-2 px-3 py-1 rounded-lg text-xs font-bold transition-all",
                        student.examResultsLocked 
                          ? "bg-red-50 text-red-600 hover:bg-red-100" 
                          : "bg-emerald-50 text-emerald-600 hover:bg-emerald-100"
                      )}
                    >
                      {student.examResultsLocked ? <XCircle className="w-4 h-4" /> : <CheckCircle2 className="w-4 h-4" />}
                      {student.examResultsLocked ? 'Locked' : 'Unlocked'}
                    </button>
                  </td>
                  {role === 'admin' && (
                    <td className="px-6 py-4">
                      <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button 
                          onClick={() => setEditingStudent(student)}
                          className="p-2 text-stone-400 hover:text-blue-600 transition-colors"
                        >
                          <Settings className="w-5 h-5" />
                        </button>
                        <button 
                          onClick={() => deleteDoc(doc(db, 'students', student.id))} 
                          className="p-2 text-stone-400 hover:text-red-600 transition-colors"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filteredStudents.length === 0 && (
          <div className="text-center py-20">
            <Users className="w-12 h-12 text-stone-200 mx-auto mb-4" />
            <p className="text-stone-400 italic">No students found matching your search.</p>
          </div>
        )}
      </div>
    </div>
  );
};

const GalleryManagement = ({ role, userId }: { role: UserRole, userId: string }) => {
  const [images, setImages] = useState<any[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [newImage, setNewImage] = useState({ url: '', caption: '' });

  useEffect(() => {
    const q = query(collection(db, 'gallery'), orderBy('date', 'desc'));
    return onSnapshot(q, (s) => {
      setImages(s.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });
  }, []);

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (role !== 'admin') return;
    try {
      await addDoc(collection(db, 'gallery'), {
        ...newImage,
        uploadedBy: userId,
        date: serverTimestamp()
      });
      setNewImage({ url: '', caption: '' });
      setIsUploading(false);
    } catch (err) { console.error(err); }
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-blue-900">School Gallery</h2>
          <p className="text-stone-500 text-sm">Capturing the best moments at Wadajir Tuition Center.</p>
        </div>
        {role === 'admin' && (
          <button 
            onClick={() => setIsUploading(true)}
            className="bg-red-600 text-white px-6 py-3 rounded-2xl flex items-center gap-2 hover:bg-red-700 transition-all font-bold shadow-lg shadow-red-600/20"
          >
            <Upload className="w-5 h-5" /> Post Photo
          </button>
        )}
      </div>

      {isUploading && (
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-white p-8 rounded-[32px] border border-red-100 shadow-xl max-w-xl mx-auto">
          <h3 className="text-xl font-bold text-blue-900 mb-6">Upload New Photo</h3>
          <form onSubmit={handleUpload} className="space-y-6">
            <div className="space-y-2">
              <label className="text-xs font-bold text-stone-400 uppercase">Image URL</label>
              <input 
                placeholder="https://..." 
                className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:border-red-600 outline-none" 
                value={newImage.url}
                onChange={e => setNewImage({...newImage, url: e.target.value})}
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-stone-400 uppercase">Caption</label>
              <input 
                placeholder="Describe this moment..." 
                className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:border-red-600 outline-none" 
                value={newImage.caption}
                onChange={e => setNewImage({...newImage, caption: e.target.value})}
              />
            </div>
            <div className="flex gap-4">
              <button type="submit" className="flex-1 bg-red-600 text-white py-4 rounded-2xl font-bold shadow-lg shadow-red-600/20">Post to Gallery</button>
              <button type="button" onClick={() => setIsUploading(false)} className="px-8 py-4 bg-stone-100 text-stone-600 rounded-2xl font-bold">Cancel</button>
            </div>
          </form>
        </motion.div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {images.map((img) => (
          <motion.div 
            key={img.id} 
            layout
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="group bg-white rounded-[32px] overflow-hidden shadow-sm border border-stone-100 hover:shadow-xl transition-all"
          >
            <div className="aspect-video relative overflow-hidden">
              <img src={img.url} alt={img.caption} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" referrerPolicy="no-referrer" />
              {role === 'admin' && (
                <button 
                  onClick={() => deleteDoc(doc(db, 'gallery', img.id))}
                  className="absolute top-4 right-4 p-2 bg-white/90 backdrop-blur-sm text-red-500 rounded-xl opacity-0 group-hover:opacity-100 transition-all hover:bg-red-500 hover:text-white"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              )}
            </div>
            <div className="p-6">
              <p className="text-blue-900 font-medium">{img.caption || 'No caption'}</p>
              <p className="text-[10px] text-stone-400 font-bold uppercase mt-2">
                {img.date?.toDate ? format(img.date.toDate(), 'MMMM dd, yyyy') : 'Recently'}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
      {images.length === 0 && (
        <div className="text-center py-24 bg-white rounded-[40px] border border-dashed border-stone-200">
          <ImageIcon className="w-16 h-16 text-stone-200 mx-auto mb-4" />
          <p className="text-stone-400 italic">The gallery is empty. Admins can start posting photos.</p>
        </div>
      )}
    </div>
  );
};

const StudentDashboard = ({ profile, setActiveTab }: { profile: UserProfile, setActiveTab: (tab: string) => void }) => {
  const [studentData, setStudentData] = useState<StudentRecord | null>(null);
  const [attendance, setAttendance] = useState<any[]>([]);
  const [exams, setExams] = useState<any[]>([]);

  useEffect(() => {
    const q = query(collection(db, 'students'), where('userId', '==', profile.uid), limit(1));
    const unsubStudent = onSnapshot(q, (s) => {
      if (!s.empty) setStudentData({ id: s.docs[0].id, ...s.docs[0].data() } as StudentRecord);
    });

    const unsubAtt = onSnapshot(query(collection(db, 'attendance'), where('studentId', '==', profile.uid)), (s) => {
      setAttendance(s.docs.map(d => d.data()));
    });

    const unsubExams = onSnapshot(query(collection(db, 'exams'), where('studentId', '==', profile.uid)), (s) => {
      setExams(s.docs.map(d => d.data()));
    });

    return () => { unsubStudent(); unsubAtt(); unsubExams(); };
  }, [profile.uid]);

  if (!studentData) return <div className="p-12 text-center text-stone-400">Loading student profile...</div>;

  const attendanceRate = attendance.length > 0 
    ? Math.round((attendance.filter(a => a.status === 'present').length / attendance.length) * 100) 
    : 0;

  return (
    <div className="space-y-8 pb-12">
      <header className="flex justify-between items-center">
        <div className="flex items-center gap-4">
          <div className="w-20 h-20 rounded-3xl bg-blue-600 flex items-center justify-center text-white text-3xl font-bold shadow-lg shadow-blue-600/20 overflow-hidden border-4 border-white">
            {profile.photoURL ? (
              <img src={profile.photoURL} alt="Me" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
            ) : (
              profile.displayName.charAt(0)
            )}
          </div>
          <div>
            <h1 className="text-3xl font-bold text-blue-900">{profile.displayName}</h1>
            <p className="text-stone-500 font-medium">Student ID: {studentData.studentId} • {studentData.class}</p>
          </div>
        </div>
        <div className="flex gap-4">
          <div className="bg-emerald-50 px-6 py-3 rounded-2xl border border-emerald-100 text-center">
            <p className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest">Attendance</p>
            <p className="text-2xl font-bold text-emerald-700">{attendanceRate}%</p>
          </div>
          <div className={cn(
            "px-6 py-3 rounded-2xl border text-center",
            studentData.feeStatus === 'paid' ? "bg-blue-50 border-blue-100" : "bg-red-50 border-red-100"
          )}>
            <p className={cn("text-[10px] font-bold uppercase tracking-widest", studentData.feeStatus === 'paid' ? "text-blue-600" : "text-red-600")}>Fee Status</p>
            <p className={cn("text-2xl font-bold", studentData.feeStatus === 'paid' ? "text-blue-700" : "text-red-700")}>{studentData.feeStatus.toUpperCase()}</p>
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white p-8 rounded-[32px] shadow-sm border border-stone-100">
            <h3 className="text-xl font-bold text-blue-900 mb-6 flex items-center gap-2">
              <Trophy className="w-6 h-6 text-amber-500" />
              Academic Performance
            </h3>
            {studentData.examResultsLocked ? (
              <div className="py-12 text-center space-y-4 bg-stone-50 rounded-2xl border border-dashed border-stone-200">
                <AlertCircle className="w-12 h-12 text-red-400 mx-auto" />
                <div>
                  <p className="text-blue-900 font-bold">Results Locked</p>
                  <p className="text-stone-500 text-sm">Please clear your pending fees to view your exam marks.</p>
                </div>
                <button onClick={() => setActiveTab('fees')} className="bg-blue-600 text-white px-6 py-2 rounded-xl text-sm font-bold">Pay Fees Now</button>
              </div>
            ) : (
              <div className="space-y-4">
                {exams.map((exam, i) => (
                  <div key={i} className="flex items-center justify-between p-4 rounded-2xl bg-stone-50 border border-stone-100">
                    <div>
                      <h4 className="font-bold text-blue-900">{exam.subject}</h4>
                      <p className="text-xs text-stone-500">{exam.term}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-blue-600">{exam.marks}/{exam.total}</p>
                      <p className="text-[10px] font-bold text-stone-400 uppercase">{Math.round((exam.marks/exam.total)*100)}%</p>
                    </div>
                  </div>
                ))}
                {exams.length === 0 && <p className="text-stone-400 text-center py-8 italic">No exam results recorded yet.</p>}
              </div>
            )}
          </div>

          <div className="bg-white p-8 rounded-[32px] shadow-sm border border-stone-100">
            <h3 className="text-xl font-bold text-blue-900 mb-6 flex items-center gap-2">
              <ClipboardList className="w-6 h-6 text-blue-600" />
              Recent Attendance
            </h3>
            <div className="grid grid-cols-7 gap-2">
              {attendance.slice(-14).map((a, i) => (
                <div key={i} className="flex flex-col items-center gap-1">
                  <div className={cn(
                    "w-8 h-8 rounded-lg flex items-center justify-center text-white",
                    a.status === 'present' ? "bg-emerald-500" : a.status === 'absent' ? "bg-red-500" : "bg-amber-500"
                  )}>
                    {a.status === 'present' ? <CheckCircle2 className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
                  </div>
                  <span className="text-[8px] font-bold text-stone-400 uppercase">{format(new Date(a.date), 'dd MMM')}</span>
                </div>
              ))}
              {attendance.length === 0 && <p className="col-span-7 text-stone-400 text-center py-8 italic">No attendance records found.</p>}
            </div>
          </div>
        </div>

        <div className="space-y-8">
          <div className="bg-white p-8 rounded-[32px] shadow-sm border border-stone-100">
            <h3 className="text-xl font-bold text-blue-900 mb-6 flex items-center gap-2">
              <Megaphone className="w-6 h-6 text-red-600" />
              Announcements
            </h3>
            <AnnouncementsList limitCount={5} />
          </div>
          
          <div className="bg-blue-900 p-8 rounded-[32px] shadow-xl text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10">
              <School className="w-24 h-24" />
            </div>
            <h3 className="text-lg font-bold mb-2">Need Help?</h3>
            <p className="text-blue-200 text-sm mb-6">Contact the administration office for any queries regarding fees or exams.</p>
            <button onClick={() => setActiveTab('announcements')} className="w-full py-3 bg-red-600 text-white rounded-xl font-bold hover:bg-red-700 transition-all">Contact Admin</button>
          </div>
        </div>
      </div>
    </div>
  );
};

const SubjectsManagement = ({ role }: { role: UserRole }) => {
  const [subjects, setSubjects] = useState<any[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [newSubject, setNewSubject] = useState({ name: '', code: '', description: '' });

  useEffect(() => {
    return onSnapshot(collection(db, 'subjects'), (s) => {
      setSubjects(s.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (role !== 'admin') return;
    try {
      if (editingId) {
        await updateDoc(doc(db, 'subjects', editingId), newSubject);
      } else {
        await addDoc(collection(db, 'subjects'), newSubject);
      }
      setNewSubject({ name: '', code: '', description: '' });
      setIsAdding(false);
      setEditingId(null);
    } catch (err) { console.error(err); }
  };

  const handleEdit = (subject: any) => {
    setNewSubject({ name: subject.name, code: subject.code, description: subject.description || '' });
    setEditingId(subject.id);
    setIsAdding(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-blue-900">Subject Management</h2>
          <p className="text-stone-500 text-sm">Manage academic subjects and curriculum.</p>
        </div>
        {role === 'admin' && (
          <button 
            onClick={() => { setIsAdding(true); setEditingId(null); setNewSubject({ name: '', code: '', description: '' }); }}
            className="bg-blue-600 text-white px-6 py-3 rounded-2xl flex items-center gap-2 hover:bg-blue-700 transition-all font-bold shadow-lg shadow-blue-600/20"
          >
            <Plus className="w-5 h-5" /> Add Subject
          </button>
        )}
      </div>

      {isAdding && (
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="bg-white p-8 rounded-[32px] border border-blue-100 shadow-xl">
          <h3 className="text-xl font-bold text-blue-900 mb-6">{editingId ? 'Edit Subject' : 'Add New Subject'}</h3>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-bold text-stone-400 uppercase">Subject Name</label>
              <input 
                className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:border-blue-600 outline-none" 
                value={newSubject.name}
                onChange={e => setNewSubject({...newSubject, name: e.target.value})}
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-stone-400 uppercase">Subject Code</label>
              <input 
                className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:border-blue-600 outline-none" 
                value={newSubject.code}
                onChange={e => setNewSubject({...newSubject, code: e.target.value})}
                required
              />
            </div>
            <div className="md:col-span-2 space-y-2">
              <label className="text-xs font-bold text-stone-400 uppercase">Description</label>
              <textarea 
                className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:border-blue-600 outline-none h-24" 
                value={newSubject.description}
                onChange={e => setNewSubject({...newSubject, description: e.target.value})}
              />
            </div>
            <div className="md:col-span-2 flex gap-4 pt-4">
              <button type="submit" className="flex-1 bg-blue-600 text-white py-4 rounded-2xl font-bold shadow-lg shadow-blue-600/20">
                {editingId ? 'Update Subject' : 'Create Subject'}
              </button>
              <button type="button" onClick={() => setIsAdding(false)} className="px-8 py-4 bg-stone-100 text-stone-600 rounded-2xl font-bold">Cancel</button>
            </div>
          </form>
        </motion.div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {subjects.map((subject) => (
          <div key={subject.id} className="bg-white p-6 rounded-3xl shadow-sm border border-stone-100 hover:shadow-md transition-shadow group">
            <div className="flex justify-between items-start mb-4">
              <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-600">
                <BookOpen className="w-6 h-6" />
              </div>
              {role === 'admin' && (
                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => handleEdit(subject)} className="p-2 text-stone-400 hover:text-blue-600 transition-colors"><Settings className="w-4 h-4" /></button>
                  <button onClick={() => deleteDoc(doc(db, 'subjects', subject.id))} className="p-2 text-stone-400 hover:text-red-600 transition-colors"><Trash2 className="w-4 h-4" /></button>
                </div>
              )}
            </div>
            <h3 className="text-lg font-bold text-blue-900">{subject.name}</h3>
            <p className="text-xs font-bold text-red-500 uppercase tracking-wider mb-2">{subject.code}</p>
            <p className="text-stone-500 text-sm line-clamp-2">{subject.description || 'No description provided.'}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

const ClassesManagement = ({ role }: { role: UserRole }) => {
  const [classes, setClasses] = useState<any[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [newClass, setNewClass] = useState({ name: '', teacherId: '', studentCount: 0 });

  useEffect(() => {
    return onSnapshot(collection(db, 'classes'), (s) => {
      setClasses(s.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (role !== 'admin') return;
    try {
      await addDoc(collection(db, 'classes'), newClass);
      setNewClass({ name: '', teacherId: '', studentCount: 0 });
      setIsAdding(false);
    } catch (err) { console.error(err); }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-blue-900">Class Management</h2>
          <p className="text-stone-500 text-sm">Manage school classes and classroom assignments.</p>
        </div>
        {role === 'admin' && (
          <button 
            onClick={() => setIsAdding(true)}
            className="bg-blue-600 text-white px-6 py-3 rounded-2xl flex items-center gap-2 hover:bg-blue-700 transition-all font-bold shadow-lg shadow-blue-600/20"
          >
            <Plus className="w-5 h-5" /> Add Class
          </button>
        )}
      </div>

      {isAdding && (
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="bg-white p-8 rounded-[32px] border border-blue-100 shadow-xl">
          <h3 className="text-xl font-bold text-blue-900 mb-6">Add New Class</h3>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-bold text-stone-400 uppercase">Class Name</label>
              <input 
                className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:border-blue-600 outline-none" 
                value={newClass.name}
                onChange={e => setNewClass({...newClass, name: e.target.value})}
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-stone-400 uppercase">Teacher ID (Optional)</label>
              <input 
                className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:border-blue-600 outline-none" 
                value={newClass.teacherId}
                onChange={e => setNewClass({...newClass, teacherId: e.target.value})}
              />
            </div>
            <div className="md:col-span-2 flex gap-4 pt-4">
              <button type="submit" className="flex-1 bg-blue-600 text-white py-4 rounded-2xl font-bold shadow-lg shadow-blue-600/20">Create Class</button>
              <button type="button" onClick={() => setIsAdding(false)} className="px-8 py-4 bg-stone-100 text-stone-600 rounded-2xl font-bold">Cancel</button>
            </div>
          </form>
        </motion.div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {classes.map((c) => (
          <div key={c.id} className="bg-white p-6 rounded-3xl shadow-sm border border-stone-100 hover:shadow-md transition-shadow group">
            <div className="flex justify-between items-start mb-4">
              <div className="w-12 h-12 rounded-2xl bg-red-50 flex items-center justify-center text-red-600">
                <School className="w-6 h-6" />
              </div>
              {role === 'admin' && (
                <button onClick={() => deleteDoc(doc(db, 'classes', c.id))} className="p-2 text-stone-400 hover:text-red-600 transition-colors opacity-0 group-hover:opacity-100"><Trash2 className="w-4 h-4" /></button>
              )}
            </div>
            <h3 className="text-lg font-bold text-blue-900">{c.name}</h3>
            <div className="mt-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-stone-400">Students</span>
                <span className="font-bold text-blue-900">{c.studentCount || 0}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-stone-400">Teacher</span>
                <span className="font-bold text-blue-900">{c.teacherId || 'Unassigned'}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const TeachersManagement = ({ role }: { role: UserRole }) => {
  const [teachers, setTeachers] = useState<any[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [editingTeacher, setEditingTeacher] = useState<any>(null);
  const [newTeacher, setNewTeacher] = useState({ name: '', email: '', phone: '', qualification: '' });

  useEffect(() => {
    return onSnapshot(collection(db, 'teachers'), (s) => {
      setTeachers(s.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (role !== 'admin') return;
    try {
      await addDoc(collection(db, 'teachers'), { ...newTeacher, createdAt: serverTimestamp() });
      setNewTeacher({ name: '', email: '', phone: '', qualification: '' });
      setIsAdding(false);
    } catch (err) { console.error(err); }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (role !== 'admin' || !editingTeacher) return;
    try {
      const { id, ...data } = editingTeacher;
      await updateDoc(doc(db, 'teachers', id), data);
      setEditingTeacher(null);
    } catch (err) { console.error(err); }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-blue-900">Teacher Management</h2>
          <p className="text-stone-500 text-sm">Manage school faculty and staff records.</p>
        </div>
        {role === 'admin' && (
          <button 
            onClick={() => setIsAdding(true)}
            className="bg-blue-600 text-white px-6 py-3 rounded-2xl flex items-center gap-2 hover:bg-blue-700 transition-all font-bold shadow-lg shadow-blue-600/20"
          >
            <Plus className="w-5 h-5" /> Add Teacher
          </button>
        )}
      </div>

      {(isAdding || editingTeacher) && (
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="bg-white p-8 rounded-[32px] border border-blue-100 shadow-xl">
          <h3 className="text-xl font-bold text-blue-900 mb-6">
            {editingTeacher ? 'Edit Teacher Record' : 'Register New Teacher'}
          </h3>
          <form onSubmit={editingTeacher ? handleUpdate : handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-bold text-stone-400 uppercase">Full Name</label>
              <input 
                className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:border-blue-600 outline-none" 
                value={editingTeacher ? editingTeacher.name : newTeacher.name}
                onChange={e => editingTeacher 
                  ? setEditingTeacher({...editingTeacher, name: e.target.value})
                  : setNewTeacher({...newTeacher, name: e.target.value})
                }
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-stone-400 uppercase">Email</label>
              <input 
                type="email"
                className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:border-blue-600 outline-none" 
                value={editingTeacher ? editingTeacher.email : newTeacher.email}
                onChange={e => editingTeacher 
                  ? setEditingTeacher({...editingTeacher, email: e.target.value})
                  : setNewTeacher({...newTeacher, email: e.target.value})
                }
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-stone-400 uppercase">Phone</label>
              <input 
                className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:border-blue-600 outline-none" 
                value={editingTeacher ? editingTeacher.phone : newTeacher.phone}
                onChange={e => editingTeacher 
                  ? setEditingTeacher({...editingTeacher, phone: e.target.value})
                  : setNewTeacher({...newTeacher, phone: e.target.value})
                }
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-stone-400 uppercase">Qualification</label>
              <input 
                className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:border-blue-600 outline-none" 
                value={editingTeacher ? editingTeacher.qualification : newTeacher.qualification}
                onChange={e => editingTeacher 
                  ? setEditingTeacher({...editingTeacher, qualification: e.target.value})
                  : setNewTeacher({...newTeacher, qualification: e.target.value})
                }
              />
            </div>
            <div className="md:col-span-2 flex gap-4 pt-4">
              <button type="submit" className="flex-1 bg-blue-600 text-white py-4 rounded-2xl font-bold shadow-lg shadow-blue-600/20">
                {editingTeacher ? 'Update Record' : 'Register Teacher'}
              </button>
              <button type="button" onClick={() => { setIsAdding(false); setEditingTeacher(null); }} className="px-8 py-4 bg-stone-100 text-stone-600 rounded-2xl font-bold">Cancel</button>
            </div>
          </form>
        </motion.div>
      )}

      <div className="bg-white rounded-[32px] shadow-sm border border-stone-100 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-stone-50 border-b border-stone-100">
            <tr>
              <th className="px-6 py-4 text-xs font-bold text-stone-400 uppercase tracking-wider">Teacher</th>
              <th className="px-6 py-4 text-xs font-bold text-stone-400 uppercase tracking-wider">Qualification</th>
              <th className="px-6 py-4 text-xs font-bold text-stone-400 uppercase tracking-wider">Contact</th>
              {role === 'admin' && <th className="px-6 py-4 text-xs font-bold text-stone-400 uppercase tracking-wider text-right">Actions</th>}
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-100">
            {teachers.map((teacher) => (
              <tr key={teacher.id} className="hover:bg-blue-50/30 transition-colors group">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center text-red-600 font-bold">
                      {teacher.name?.charAt(0)}
                    </div>
                    <div>
                      <p className="font-bold text-blue-900">{teacher.name}</p>
                      <p className="text-xs text-stone-400">{teacher.email}</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className="text-sm font-medium text-stone-600">{teacher.qualification || 'N/A'}</span>
                </td>
                <td className="px-6 py-4">
                  <span className="text-sm font-medium text-stone-600">{teacher.phone || 'N/A'}</span>
                </td>
                {role === 'admin' && (
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button 
                        onClick={() => setEditingTeacher(teacher)}
                        className="p-2 text-stone-400 hover:text-blue-600 transition-colors"
                      >
                        <Settings className="w-5 h-5" />
                      </button>
                      <button 
                        onClick={() => deleteDoc(doc(db, 'teachers', teacher.id))} 
                        className="p-2 text-stone-400 hover:text-red-600 transition-colors"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// --- Main App ---

export default function App() {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (u) => {
      setUser(u);
      if (u) {
        const userDoc = await getDoc(doc(db, 'users', u.uid));
        if (userDoc.exists()) {
          setProfile(userDoc.data() as UserProfile);
        }
      } else {
        setProfile(null);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-blue-50">
        <div className="text-center space-y-4">
          <Loader2 className="w-12 h-12 text-blue-600 animate-spin mx-auto" />
          <p className="text-blue-900 font-bold animate-pulse">Wadajir Tuition Center</p>
        </div>
      </div>
    );
  }

  if (!user || !profile) {
    return <Login />;
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard': return profile.role === 'student' ? <StudentDashboard profile={profile} setActiveTab={setActiveTab} /> : <DashboardHome profile={profile} setActiveTab={setActiveTab} />;
      case 'students': return <StudentsManagement role={profile.role} />;
      case 'teachers': return <TeachersManagement role={profile.role} />;
      case 'subjects': return <SubjectsManagement role={profile.role} />;
      case 'classes': return <ClassesManagement role={profile.role} />;
      case 'gallery': return <GalleryManagement role={profile.role} userId={user.uid} />;
      case 'announcements': return (
        <div className="space-y-8">
          <header>
            <h1 className="text-3xl font-bold text-blue-900">Announcements</h1>
            <p className="text-stone-500">Stay updated with the latest school news.</p>
          </header>
          <div className="bg-white p-8 rounded-[32px] shadow-sm border border-stone-100">
            <AnnouncementsList />
          </div>
        </div>
      );
      case 'profile': return (
        <div className="max-w-2xl mx-auto space-y-8">
          <header>
            <h1 className="text-3xl font-bold text-blue-900">My Profile</h1>
            <p className="text-stone-500">Manage your personal information and account settings.</p>
          </header>
          <div className="bg-white p-10 rounded-[40px] shadow-sm border border-stone-100 text-center">
            <div className="w-32 h-32 rounded-full bg-blue-600 mx-auto mb-6 border-4 border-blue-50 shadow-xl overflow-hidden relative group">
              {profile.photoURL ? (
                <img src={profile.photoURL} alt="Me" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
              ) : (
                <UserIcon className="w-16 h-16 text-white m-auto" />
              )}
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                <Upload className="text-white w-8 h-8" />
              </div>
            </div>
            <h2 className="text-2xl font-bold text-blue-900">{profile.displayName}</h2>
            <p className="text-stone-500 mb-8">{profile.email}</p>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl bg-stone-50 border border-stone-100">
                <p className="text-[10px] font-bold text-stone-400 uppercase mb-1">Role</p>
                <p className="font-bold text-blue-900 uppercase">{profile.role}</p>
              </div>
              <div className="p-4 rounded-2xl bg-stone-50 border border-stone-100">
                <p className="text-[10px] font-bold text-stone-400 uppercase mb-1">Joined</p>
                <p className="font-bold text-blue-900">{profile.createdAt?.toDate ? format(profile.createdAt.toDate(), 'MMM yyyy') : 'Recently'}</p>
              </div>
            </div>
            <button className="w-full mt-8 py-4 bg-blue-600 text-white rounded-2xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/20">Edit Profile</button>
          </div>
        </div>
      );
      default: return <div className="p-12 text-center text-stone-400 italic">Feature coming soon...</div>;
    }
  };

  return (
    <ErrorBoundary>
      <div className="flex min-h-screen bg-blue-50/30">
        <Sidebar 
          role={profile.role} 
          activeTab={activeTab} 
          setActiveTab={setActiveTab} 
          onLogout={() => signOut(auth)} 
          profile={profile}
          isOpen={isSidebarOpen}
          setIsOpen={setIsSidebarOpen}
        />
        
        <div className="flex-1 flex flex-col min-h-screen overflow-hidden">
          <header className="h-20 bg-white border-b border-stone-100 flex items-center justify-between px-8 sticky top-0 z-10">
            <div className="flex items-center gap-4">
              <button onClick={() => setIsSidebarOpen(true)} className="lg:hidden p-2 text-stone-500 hover:bg-stone-50 rounded-lg transition-colors">
                <Menu className="w-6 h-6" />
              </button>
              {activeTab !== 'dashboard' && (
                <button 
                  onClick={() => setActiveTab('dashboard')}
                  className="flex items-center gap-1 text-stone-400 hover:text-blue-600 transition-colors group"
                >
                  <ChevronLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                  <span className="text-sm font-bold">Back</span>
                </button>
              )}
              <div className="h-6 w-px bg-stone-100 mx-2 hidden md:block" />
              <h2 className="text-lg font-bold text-blue-900 capitalize">{activeTab.replace('-', ' ')}</h2>
            </div>
            <div className="flex items-center gap-6">
              <div className="relative hidden md:block">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400 w-4 h-4" />
                <input 
                  type="text" 
                  placeholder="Search anything..." 
                  className="pl-10 pr-4 py-2 rounded-xl bg-stone-50 border-none text-sm focus:ring-2 focus:ring-blue-600/20 outline-none w-64"
                />
              </div>
              <button className="relative p-2 text-stone-400 hover:text-blue-600 transition-colors">
                <Bell className="w-6 h-6" />
                <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white" />
              </button>
              <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white font-bold shadow-lg shadow-blue-600/20 overflow-hidden">
                {profile.photoURL ? (
                  <img src={profile.photoURL} alt="Avatar" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                ) : (
                  profile.displayName.charAt(0)
                )}
              </div>
            </div>
          </header>

          <main className="flex-1 p-8 overflow-y-auto custom-scrollbar">
            <div className="max-w-7xl mx-auto">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  transition={{ duration: 0.2 }}
                >
                  {renderContent()}
                </motion.div>
              </AnimatePresence>
            </div>
          </main>
        </div>
      </div>
    </ErrorBoundary>
  );
}
