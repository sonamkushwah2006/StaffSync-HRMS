
import { useEffect, useMemo, useState } from 'react'
import axios from 'axios'

import { motion } from 'framer-motion'
import {
  LayoutDashboard, Users, CalendarCheck, CalendarDays, Wallet,
  ChartNoAxesCombined, GraduationCap, FileBarChart, Settings,
  Search, Bell, ChevronDown, ChevronRight, Plus, ArrowUpRight,
  ArrowDownRight, Clock3, MoreHorizontal, Download, Menu, X,
  BriefcaseBusiness, CircleHelp, CheckCircle2, XCircle, Timer,
  UserRound, SlidersHorizontal, Sparkles
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import {
  Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip,
  XAxis, YAxis, PieChart, Pie, Cell
} from 'recharts'

type Employee = {
  _id: string
  employeeId: string
  firstName: string
  lastName: string
  email: string
  department: string
  position: string
  employmentType: 'Full-time' | 'Part-time' | 'Contract' | 'Intern'
  status: 'Active' | 'On Leave' | 'Inactive'
  joiningDate: string
}

const navigation: { title: string; items: { label: string; icon: LucideIcon }[] }[] = [
  {
    title: 'WORKSPACE',
    items: [
      { label: 'Dashboard', icon: LayoutDashboard },
      { label: 'Employees', icon: Users },
      { label: 'Attendance', icon: CalendarCheck },
      { label: 'Leave Management', icon: CalendarDays },
    ],
  },
  {
    title: 'MANAGEMENT',
    items: [
      { label: 'Payroll', icon: Wallet },
      { label: 'Performance', icon: ChartNoAxesCombined },
      { label: 'Training', icon: GraduationCap },
      { label: 'Reports', icon: FileBarChart },
    ],
  },
]



const attendanceData = [
  { day: 'Mon', present: 218, absent: 18 },
  { day: 'Tue', present: 232, absent: 12 },
  { day: 'Wed', present: 224, absent: 20 },
  { day: 'Thu', present: 241, absent: 9 },
  { day: 'Fri', present: 230, absent: 15 },
  { day: 'Sat', present: 190, absent: 35 },
  { day: 'Sun', present: 205, absent: 24 },
]

const departments = [
  { name: 'Engineering', count: 84, color: '#6258E8' },
  { name: 'Marketing', count: 56, color: '#A99DFB' },
  { name: 'Design', count: 42, color: '#F5B85B' },
  { name: 'HR & Finance', count: 36, color: '#65C7B4' },
  { name: 'Others', count: 28, color: '#E7E9F2' },
]

const leaveRequests = [
  { name: 'Lana Steiner', initials: 'LS', type: 'Annual leave', dates: 'Oct 29 – Oct 31', color: 'bg-rose-100 text-rose-700' },
  { name: 'Phoenix Baker', initials: 'PB', type: 'Sick leave', dates: 'Oct 30', color: 'bg-sky-100 text-sky-700' },
  { name: 'Olivia Rhye', initials: 'OR', type: 'Personal leave', dates: 'Nov 02 – Nov 03', color: 'bg-violet-100 text-violet-700' },
]

function App() {
  const [employees, setEmployees] = useState<Employee[]>([])
const [loadingEmployees, setLoadingEmployees] = useState(true)
const [employeeError, setEmployeeError] = useState('')

  const [activePage, setActivePage] = useState('Dashboard')
  const [search, setSearch] = useState('')
  const [mobileMenu, setMobileMenu] = useState(false)
  const [showAllEmployees, setShowAllEmployees] = useState(false)

  const [showAddEmployee, setShowAddEmployee] = useState(false)

  const [editingEmployeeId, setEditingEmployeeId] = useState<string | null>(null)

  const [notice, setNotice] = useState('')
  const [requests, setRequests] = useState(leaveRequests)
  const [selectedPeriod, setSelectedPeriod] = useState('This week')

  useEffect(() => {
  const fetchEmployees = async () => {
    try {
      setLoadingEmployees(true)
      setEmployeeError('')

      const response = await axios.get(
        'http://localhost:5000/api/employees'
      )

      setEmployees(response.data.data)
    } catch (error) {
      console.error('Failed to fetch employees:', error)
      setEmployeeError('Unable to load employees. Please check the backend.')
    } finally {
      setLoadingEmployees(false)
    }
  }

  fetchEmployees()
}, [])
const [newEmployee, setNewEmployee] = useState({
  employeeId: '',
  firstName: '',
  lastName: '',
  email: '',
  department: '',
  position: '',
  employmentType: 'Full-time',
  status: 'Active',
  joiningDate: '',
})


const handleAddEmployee = async (
  event: React.FormEvent<HTMLFormElement>
) => {
  event.preventDefault()

  try {
    const payload = {
      ...newEmployee,
      joiningDate: newEmployee.joiningDate,
    }

    if (editingEmployeeId) {
      const response = await axios.patch(
        `http://localhost:5000/api/employees/${editingEmployeeId}`,
        payload
      )

      setEmployees((prev) =>
        prev.map((employee) =>
          employee._id === editingEmployeeId
            ? response.data.data
            : employee
        )
      )

      setNotice('Employee updated successfully!')
    } else {
      const response = await axios.post(
        'http://localhost:5000/api/employees',
        payload
      )

      setEmployees((prev) => [response.data.data, ...prev])
      setNotice('Employee added successfully!')
    }

    setShowAddEmployee(false)
    setEditingEmployeeId(null)
    
    setNewEmployee({
      employeeId: '',
      firstName: '',
      lastName: '',
      email: '',
      department: '',
      position: '',
      employmentType: 'Full-time',
      status: 'Active',
      joiningDate: '',
    })
  } catch (error) {
    console.error('Failed to save employee:', error)

    setNotice(
      axios.isAxiosError(error)
        ? JSON.stringify(error.response?.data ?? error.message)
        : String(error)
    )
  }
}

  const filteredEmployees = useMemo(() => {
    const query = search.toLowerCase().trim()
    return employees.filter((employee) =>
      `${employee.firstName} ${employee.lastName} ${employee.position} ${employee.department} ${employee.employeeId}`
        .toLowerCase()
        .includes(query)
    )
  }, [employees, search])

  const visibleEmployees = showAllEmployees ? filteredEmployees : filteredEmployees.slice(0, 5)

  function notify(message: string) {
    setNotice(message)
    window.setTimeout(() => setNotice(''), 2800)
  }

  function exportEmployees() {
    const header = 'Employee ID,Name,Role,Department,Email,Status'
    const rows = filteredEmployees.map((e) =>
      [e.employeeId, `${e.firstName} ${e.lastName}`, e.position, e.department, e.email, e.status]
        .map((value) => `"${value.replaceAll('"', '""')}"`)
        .join(',')
    )
    const csv = [header, ...rows].join('\n')
    const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8;' }))
    const link = document.createElement('a')
    link.href = url
    link.download = 'staffsync-employees.csv'
    link.click()
    URL.revokeObjectURL(url)
    notify('Employee report exported successfully')
  }

  function decideLeave(name: string, decision: 'approved' | 'declined') {
    setRequests((current) => current.filter((request) => request.name !== name))
    notify(`${name}'s request ${decision}`)
  }

  return (
    <div className="min-h-screen bg-[#F7F8FC] text-slate-800">
      {mobileMenu && (
        <button
          aria-label="Close sidebar"
          className="fixed inset-0 z-40 bg-slate-950/40 lg:hidden"
          onClick={() => setMobileMenu(false)}
        />
      )}

      <aside className={`fixed inset-y-0 left-0 z-50 flex w-[252px] flex-col border-r border-slate-200/80 bg-white transition-transform duration-300 ${mobileMenu ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0`}>
        <div className="flex h-[82px] items-center justify-between border-b border-slate-100 px-6">
          <button onClick={() => setActivePage('Dashboard')} className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-[14px] bg-gradient-to-br from-violet-600 to-indigo-500 text-white shadow-lg shadow-violet-200">
              <BriefcaseBusiness size={21} />
            </span>
            <span className="text-left">
              <span className="block text-[20px] font-extrabold tracking-tight text-slate-900">Staff<span className="text-violet-600">Sync</span></span>
              <span className="block text-[10px] font-semibold uppercase tracking-[2px] text-slate-400">People & culture</span>
            </span>
          </button>
          <button onClick={() => setMobileMenu(false)} className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 lg:hidden"><X size={18} /></button>
        </div>

        <div className="px-4 pt-6">
          <button onClick={() => notify('Workspace switcher is ready for backend integration')} className="flex w-full items-center gap-3 rounded-xl border border-slate-200 p-3 text-left hover:bg-slate-50">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-amber-100 text-sm font-bold text-amber-700">A</span>
            <span className="min-w-0 flex-1">
              <span className="block truncate text-sm font-semibold text-slate-800">Acme Corporation</span>
              <span className="block text-xs text-slate-400">Enterprise workspace</span>
            </span>
            <ChevronDown size={16} className="text-slate-400" />
          </button>
        </div>

        <nav className="flex-1 space-y-7 overflow-y-auto px-4 py-7">
          {navigation.map((group) => (
            <div key={group.title}>
              <p className="mb-3 px-3 text-[10px] font-bold tracking-[1.8px] text-slate-400">{group.title}</p>
              <div className="space-y-1">
                {group.items.map(({ label, icon: Icon }) => (
                  <button
                    key={label}
                    onClick={() => { setActivePage(label); setMobileMenu(false) }}
                    className={`group flex w-full items-center gap-3 rounded-xl px-3 py-3 text-[13px] font-medium transition-all ${activePage === label ? 'bg-violet-50 text-violet-700 shadow-sm' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'}`}
                  >
                    <Icon size={18} strokeWidth={activePage === label ? 2.3 : 1.8} />
                    <span className="flex-1 text-left">{label}</span>
                    {label === 'Leave Management' && (
                      <span className="rounded-md bg-rose-100 px-2 py-0.5 text-[10px] font-bold text-rose-600">{requests.length}</span>
                    )}
                    {activePage === label && <span className="h-1.5 w-1.5 rounded-full bg-violet-600" />}
                  </button>
                ))}
              </div>
            </div>
          ))}
          <div>
            <p className="mb-3 px-3 text-[10px] font-bold tracking-[1.8px] text-slate-400">PREFERENCES</p>
            <button
  onClick={() => setActivePage('Settings')}
  className={`flex w-full items-center gap-3 rounded-xl px-3 py-3 text-[13px] font-medium ${
    activePage === 'Settings'
      ? 'bg-violet-50 text-violet-700'
      : 'text-slate-500 hover:bg-slate-50'
  }`}
>
  <Settings size={18} />
  <span>Settings</span>
</button>
            <button onClick={() => notify('Help center will be connected soon')} className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-[13px] font-medium text-slate-500 hover:bg-slate-50">
              <CircleHelp size={18} /><span>Help & support</span>
            </button>
          </div>
        </nav>

        <div className="p-4">
          <div className="rounded-2xl bg-gradient-to-br from-[#211A50] to-[#4938A7] p-4 text-white">
            <span className="mb-3 flex h-9 w-9 items-center justify-center rounded-xl bg-white/15"><Sparkles size={18} /></span>
            <p className="text-sm font-semibold">People first, always.</p>
            <p className="mt-1 text-xs leading-5 text-violet-200">Build a better workplace, one day at a time.</p>
            <button onClick={() => notify('StaffSync workspace tips coming soon')} className="mt-4 flex items-center gap-1 text-xs font-semibold text-white hover:text-violet-200">Explore tips <ArrowUpRight size={14} /></button>
          </div>
          <div className="mt-4 flex items-center gap-3 border-t border-slate-100 pt-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-orange-200 to-rose-300 text-sm font-bold text-rose-800">SK</div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-slate-800">Sonam Kushwah</p>
              <p className="text-xs text-slate-400">HR Administrator</p>
            </div>
            <button onClick={() => setActivePage('Settings')} aria-label="Profile settings"><MoreHorizontal size={20} className="text-slate-400" /></button>
          </div>
        </div>
      </aside>

      <main className="min-h-screen lg:ml-[252px]">
        <header className="sticky top-0 z-30 flex h-[82px] items-center justify-between border-b border-slate-200/70 bg-white/90 px-4 backdrop-blur-xl sm:px-7 xl:px-10">
          <div className="flex items-center gap-3">
            <button onClick={() => setMobileMenu(true)} className="rounded-lg p-2 hover:bg-slate-100 lg:hidden" aria-label="Open menu"><Menu size={21} /></button>
            <div>
              <div className="flex items-center gap-2 text-xs text-slate-400"><span>Workspace</span><ChevronRight size={13} /><span className="text-slate-600">{activePage}</span></div>
              <h1 className="mt-1 text-lg font-bold tracking-tight text-slate-900 sm:text-xl">{activePage}</h1>
            </div>
          </div>
          <div className="flex items-center gap-2 sm:gap-4">
            <label className="hidden h-10 w-52 items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 md:flex xl:w-64">
              <Search size={16} className="text-slate-400" />
              <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search employees..." className="w-full bg-transparent text-xs outline-none placeholder:text-slate-400" />
              <kbd className="rounded border border-slate-200 bg-white px-1.5 py-0.5 text-[10px] text-slate-400">/</kbd>
            </label>
            <button onClick={() => notify('You are all caught up!')} aria-label="Notifications" className="relative flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 text-slate-500 hover:bg-slate-50">
              <Bell size={18} /><span className="absolute right-2 top-2 h-2 w-2 rounded-full border-2 border-white bg-rose-500" />
            </button>
            <div className="hidden h-8 w-px bg-slate-200 sm:block" />
            <button onClick={() => setActivePage('Settings')} className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-orange-200 to-rose-300 text-xs font-bold text-rose-800">SK</div>
              <ChevronDown size={15} className="hidden text-slate-400 sm:block" />
            </button>
          </div>
        </header>

        <div className="mx-auto max-w-[1600px] space-y-6 p-4 sm:p-7 xl:p-10">
          <motion.section initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }} className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
            <div>
              <p className="text-sm text-slate-500">Tuesday, October 27, 2026</p>
              <h2 className="mt-1 text-2xl font-extrabold tracking-tight text-slate-900 sm:text-[28px]">Good morning, Sonam <span className="inline-block origin-bottom-right animate-pulse">👋</span></h2>
              <p className="mt-1 text-sm text-slate-500">Here&apos;s what&apos;s happening with your people today.</p>
            </div>
            <div className="flex flex-wrap gap-2">
              <button onClick={exportEmployees} className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-semibold text-slate-600 shadow-sm transition hover:bg-slate-50"><Download size={15} /> Export report</button>
              <button onClick={() => setActivePage('Employees')} className="flex items-center gap-2 rounded-xl bg-violet-600 px-4 py-2.5 text-xs font-semibold text-white shadow-lg shadow-violet-200 transition hover:bg-violet-700"><Plus size={16} /> Add employee</button>
            </div>
          </motion.section>

          {activePage !== 'Dashboard' && (
            <div className="flex items-start gap-3 rounded-xl border border-violet-100 bg-violet-50 p-4">
              <SlidersHorizontal size={18} className="mt-0.5 text-violet-600" />
              <div>
                <p className="text-sm font-semibold text-violet-900">{activePage} workspace</p>
                <p className="mt-1 text-xs leading-5 text-violet-700">This section is part of the StaffSync dashboard prototype. The full module and persistent data will be connected to the backend in the next development steps.</p>
              </div>
              <button onClick={() => setActivePage('Dashboard')} className="ml-auto text-xs font-semibold text-violet-700">Back</button>
            </div>
          )}

          <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 2xl:grid-cols-4">
            {[
              { title: 'Total employees', value: '246', change: '+12.5%', up: true, note: 'vs. last month', icon: Users, color: 'bg-violet-50 text-violet-600', data: 'M5 23 L15 18 L25 20 L35 10 L45 13 L55 4' },
              { title: 'Present today', value: '218', change: '88.6%', up: true, note: 'attendance rate', icon: CalendarCheck, color: 'bg-emerald-50 text-emerald-600', data: 'M5 22 L15 15 L25 18 L35 9 L45 12 L55 5' },
              { title: 'On leave', value: '18', change: '-4.2%', up: false, note: 'vs. last week', icon: CalendarDays, color: 'bg-amber-50 text-amber-600', data: 'M5 6 L15 12 L25 8 L35 17 L45 14 L55 22' },
              { title: 'Open positions', value: '12', change: '+3 new', up: true, note: 'hiring pipeline', icon: BriefcaseBusiness, color: 'bg-sky-50 text-sky-600', data: 'M5 22 L15 17 L25 20 L35 11 L45 14 L55 5' },
            ].map((stat, index) => {
              const Icon = stat.icon
              return (
                <motion.div key={stat.title} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.07 }} className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm shadow-slate-200/30 transition hover:-translate-y-0.5 hover:shadow-md">
                  <div className="flex items-start justify-between">
                    <span className={`flex h-11 w-11 items-center justify-center rounded-xl ${stat.color}`}><Icon size={21} /></span>
                    <button onClick={() => notify(`${stat.title}: demo statistics`)} aria-label={`More about ${stat.title}`}><MoreHorizontal size={19} className="text-slate-400" /></button>
                  </div>
                  <p className="mt-5 text-[13px] font-medium text-slate-500">{stat.title}</p>
                  <div className="mt-1 flex items-end justify-between gap-2">
                    <p className="text-[30px] font-extrabold tracking-tight text-slate-900">{stat.value}</p>
                    <svg viewBox="0 0 60 28" className="mb-1 h-8 w-16 overflow-visible"><path d={stat.data} fill="none" stroke={index === 2 ? '#D97706' : '#10B981'} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
                  </div>
                  <div className="mt-2 flex items-center gap-1.5 text-[11px]"><span className={`flex items-center gap-0.5 font-bold ${stat.up ? 'text-emerald-600' : 'text-rose-600'}`}>{stat.up ? <ArrowUpRight size={13} /> : <ArrowDownRight size={13} />}{stat.change}</span><span className="text-slate-400">{stat.note}</span></div>
                </motion.div>
              )
            })}
          </section>

          <section className="grid grid-cols-1 gap-5 2xl:grid-cols-3">
            <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm shadow-slate-200/30 sm:p-6 2xl:col-span-2">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div><h3 className="text-[15px] font-bold text-slate-900">Attendance overview</h3><p className="mt-1 text-xs text-slate-400">Daily employee attendance trends</p></div>
                <select value={selectedPeriod} onChange={(e) => setSelectedPeriod(e.target.value)} className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-600 outline-none focus:border-violet-400">
                  <option>This week</option><option>Last week</option><option>This month</option>
                </select>
              </div>
              <div className="mt-6 flex flex-wrap gap-5">
                <div><p className="text-xs text-slate-400">Average attendance</p><p className="mt-1 text-2xl font-extrabold text-slate-900">92.4%</p></div>
                <div className="border-l border-slate-100 pl-5"><p className="text-xs text-slate-400">Average present</p><p className="mt-1 text-2xl font-extrabold text-slate-900">220 <span className="text-xs font-medium text-slate-400">people</span></p></div>
              </div>
              <div className="mt-5 h-[230px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={attendanceData} margin={{ top: 8, right: 5, left: -22, bottom: 0 }}>
                    <defs>
                      <linearGradient id="presentFill" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#7668F6" stopOpacity={0.2} /><stop offset="95%" stopColor="#7668F6" stopOpacity={0} /></linearGradient>
                      <linearGradient id="absentFill" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#F6B95F" stopOpacity={0.16} /><stop offset="95%" stopColor="#F6B95F" stopOpacity={0} /></linearGradient>
                    </defs>
                    <CartesianGrid stroke="#F0F1F6" strokeDasharray="4 5" vertical={false} />
                    <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: '#9CA3AF', fontSize: 11 }} dy={10} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fill: '#9CA3AF', fontSize: 11 }} />
                    <Tooltip contentStyle={{ borderRadius: 12, border: '1px solid #eeeef5', boxShadow: '0 8px 24px #25204d12', fontSize: 12 }} />
                    <Area type="monotone" dataKey="present" name="Present" stroke="#7566F5" strokeWidth={2.5} fill="url(#presentFill)" activeDot={{ r: 5 }} />
                    <Area type="monotone" dataKey="absent" name="Absent" stroke="#F4B65D" strokeWidth={2} fill="url(#absentFill)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-2 flex flex-wrap gap-5 text-xs text-slate-500"><span className="flex items-center gap-2"><span className="h-2.5 w-2.5 rounded-full bg-violet-500" />Present</span><span className="flex items-center gap-2"><span className="h-2.5 w-2.5 rounded-full bg-amber-400" />Absent</span><span className="text-slate-400">Showing: {selectedPeriod.toLowerCase()}</span></div>
            </div>

            <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm shadow-slate-200/30 sm:p-6">
              <div className="flex items-start justify-between"><div><h3 className="text-[15px] font-bold text-slate-900">Departments</h3><p className="mt-1 text-xs text-slate-400">Workforce distribution</p></div><button onClick={() => setActivePage('Reports')} aria-label="Department report"><ArrowUpRight size={18} className="text-slate-400" /></button></div>
              <div className="relative mx-auto mt-2 h-[220px] max-w-[260px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart><Pie data={departments} dataKey="count" nameKey="name" cx="50%" cy="50%" innerRadius={67} outerRadius={91} paddingAngle={4} stroke="none" cornerRadius={5}>{departments.map((item) => <Cell key={item.name} fill={item.color} />)}</Pie><Tooltip contentStyle={{ borderRadius: 12, border: '1px solid #eeeef5', fontSize: 12 }} /></PieChart>
                </ResponsiveContainer>
                <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center"><span className="text-[30px] font-extrabold tracking-tight text-slate-900">246</span><span className="mt-0.5 text-[11px] text-slate-400">Employees</span></div>
              </div>
              <div className="mt-1 space-y-3">
                {departments.map((department) => <div key={department.name} className="flex items-center gap-2.5 text-xs"><span className="h-2.5 w-2.5 rounded-full" style={{ background: department.color }} /><span className="flex-1 text-slate-500">{department.name}</span><span className="font-semibold text-slate-800">{department.count}</span><span className="w-9 text-right text-slate-400">{Math.round(department.count / 246 * 100)}%</span></div>)}
              </div>
            </div>
          </section>

          <section className="grid grid-cols-1 gap-5 2xl:grid-cols-3">
            <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm shadow-slate-200/30 2xl:col-span-2">
              <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-5 sm:px-6">
               <div className="flex items-center justify-between">
  <div>
    <h3 className="text-[15px] font-bold text-slate-900">
      Recent employees
    </h3>
    <p className="mt-1 text-xs text-slate-400">
      Your latest team members and their details
    </p>
  </div>

  <button
    onClick={() => {
  console.log("Add Employee clicked")
  setShowAddEmployee(true)
}}
    className="flex items-center gap-2 rounded-xl bg-violet-600 px-4 py-2.5 text-xs font-semibold text-white transition hover:bg-violet-700"
  >
    <Plus size={16} /> Add employee
  </button>
</div>
                <div className="flex items-center gap-2">
                  <label className="flex items-center gap-2 rounded-lg border border-slate-200 px-2.5 py-2 md:hidden"><Search size={14} className="text-slate-400" /><input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search..." className="w-24 text-xs outline-none" /></label>
                  <button onClick={exportEmployees} className="hidden items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50 sm:flex"><Download size={14} /> Export</button>
                  <button onClick={() => setShowAllEmployees(!showAllEmployees)} className="flex items-center gap-1 rounded-lg bg-violet-50 px-3 py-2 text-xs font-semibold text-violet-700 hover:bg-violet-100">{showAllEmployees ? 'Show less' : 'View all'}<ChevronRight size={14} /></button>
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full min-w-[650px] text-left">
                  <thead><tr className="border-y border-slate-100 bg-slate-50/70 text-[10px] font-bold uppercase tracking-wider text-slate-400"><th className="px-6 py-3.5">Employee</th><th className="px-4 py-3.5">Department</th><th className="px-4 py-3.5">Employee ID</th><th className="px-4 py-3.5">Status</th><th className="px-5 py-3.5">Action</th></tr></thead>
                  <tbody className="divide-y divide-slate-100">
                    {loadingEmployees && (
  <tr>
    <td colSpan={5} className="px-6 py-10 text-center text-sm text-slate-400">
      Loading employees...
    </td>
  </tr>
)}

{!loadingEmployees && employeeError && (
  <tr>
    <td colSpan={5} className="px-6 py-10 text-center text-sm text-rose-500">
      {employeeError}
    </td>
  </tr>
)}
                    {visibleEmployees.map((employee) => (
                      <tr key={employee._id} className="transition hover:bg-slate-50/70">
                        <td className="px-6 py-4"><div className="flex items-center gap-3"><span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-[11px] font-bold ${employee.status === 'Active'
  ? 'bg-violet-100 text-violet-700'
  : employee.status === 'On Leave'
    ? 'bg-amber-100 text-amber-700'
    : 'bg-slate-100 text-slate-600'}`}>{`${employee.firstName.charAt(0)}${employee.lastName.charAt(0)}`}</span><span><span className="block whitespace-nowrap text-xs font-semibold text-slate-800">{employee.firstName} {employee.lastName}</span><span className="mt-1 block whitespace-nowrap text-[10px] text-slate-400">{employee.position}</span></span></div></td>
                        <td className="px-4 py-4 text-xs text-slate-500">{employee.department}</td>
                        <td className="px-4 py-4 font-mono text-[11px] text-slate-500">{employee.employeeId}</td>
                        <td className="px-4 py-4"><span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-semibold ${employee.status === 'Active' ? 'bg-emerald-50 text-emerald-700' : employee.status === 'On Leave' ? 'bg-amber-50 text-amber-700' : 'bg-slate-100 text-slate-500'}`}><span className={`h-1.5 w-1.5 rounded-full ${employee.status === 'Active' ? 'bg-emerald-500' : employee.status === 'On Leave' ? 'bg-amber-500' : 'bg-slate-400'}`} />{employee.status}</span></td>
                        
<td className="px-5 py-4">
  <button
    onClick={() => {
      setNewEmployee({
        employeeId: employee.employeeId,
        firstName: employee.firstName,
        lastName: employee.lastName,
        email: employee.email,
        department: employee.department,
        position: employee.position,
        employmentType: employee.employmentType,
        status: employee.status,
        joiningDate: employee.joiningDate?.slice(0, 10) || '',
      })
      setShowAddEmployee(true)
    }}
    className="rounded-lg px-3 py-2 text-xs font-semibold text-violet-700 hover:bg-violet-50"
  >
    Edit
  </button>
</td>

                      </tr>
                    ))}
                    {!loadingEmployees && !employeeError &&visibleEmployees.length === 0 && <tr><td colSpan={5} className="px-6 py-10 text-center text-sm text-slate-400">No employees match your search.</td></tr>}
                  </tbody>
                </table>
              </div>
              <div className="flex items-center justify-between border-t border-slate-100 px-6 py-4 text-[11px] text-slate-400"><span>Showing {visibleEmployees.length} of {filteredEmployees.length} employees</span><button onClick={() => setActivePage('Employees')} className="font-semibold text-violet-600 hover:text-violet-800">Manage team →</button></div>
            </div>

            <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm shadow-slate-200/30 sm:p-6">
              <div className="flex items-start justify-between"><div><h3 className="text-[15px] font-bold text-slate-900">Leave requests</h3><p className="mt-1 text-xs text-slate-400">Review and manage time off</p></div><span className="rounded-lg bg-amber-50 px-2.5 py-1 text-[10px] font-bold text-amber-700">{requests.length} pending</span></div>
              <div className="mt-5 space-y-4">
                {requests.map((request) => <div key={request.name} className="rounded-xl border border-slate-100 p-3.5 transition hover:border-violet-100 hover:bg-violet-50/20">
                  <div className="flex items-center gap-2.5"><span className={`flex h-9 w-9 items-center justify-center rounded-full text-[11px] font-bold ${request.color}`}>{request.initials}</span><div className="min-w-0 flex-1"><p className="truncate text-xs font-semibold text-slate-800">{request.name}</p><p className="mt-0.5 text-[10px] text-slate-400">{request.type}</p></div><button onClick={() => notify(`${request.name}: ${request.dates}`)} aria-label="Leave details"><MoreHorizontal size={17} className="text-slate-400" /></button></div>
                  <div className="mt-3 flex items-center gap-2 text-[10px] text-slate-500"><Clock3 size={13} />{request.dates}</div>
                  <div className="mt-3 flex gap-2"><button onClick={() => decideLeave(request.name, 'approved')} className="flex flex-1 items-center justify-center gap-1 rounded-lg bg-emerald-50 py-2 text-[10px] font-semibold text-emerald-700 transition hover:bg-emerald-100"><CheckCircle2 size={13} /> Approve</button><button onClick={() => decideLeave(request.name, 'declined')} className="flex flex-1 items-center justify-center gap-1 rounded-lg bg-rose-50 py-2 text-[10px] font-semibold text-rose-600 transition hover:bg-rose-100"><XCircle size={13} /> Decline</button></div>
                </div>)}
                {requests.length === 0 && <div className="py-8 text-center"><CheckCircle2 size={26} className="mx-auto text-emerald-500" /><p className="mt-2 text-sm font-semibold text-slate-700">All caught up!</p><p className="mt-1 text-xs text-slate-400">No pending leave requests.</p></div>}
              </div>
              <button onClick={() => setActivePage('Leave Management')} className="mt-4 flex w-full items-center justify-center gap-1 rounded-xl border border-slate-200 py-3 text-xs font-semibold text-slate-600 transition hover:border-violet-200 hover:bg-violet-50 hover:text-violet-700">View all requests <ChevronRight size={14} /></button>
            </div>
          </section>

          <section className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="flex items-center gap-4 rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm shadow-slate-200/30">
              <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-sky-50 text-sky-600"><Timer size={23} /></span>
              <div className="flex-1"><p className="text-xs text-slate-400">Average working hours</p><p className="mt-1 text-xl font-extrabold text-slate-900">7h 42m</p><p className="mt-1 text-[10px] text-slate-400">Across all departments</p></div>
              <button onClick={() => setActivePage('Attendance')} className="rounded-lg p-2 text-slate-400 hover:bg-slate-50"><ArrowUpRight size={18} /></button>
            </div>
            <div className="flex items-center gap-4 rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm shadow-slate-200/30">
              <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-rose-50 text-rose-600"><UserRound size={23} /></span>
              <div className="flex-1"><p className="text-xs text-slate-400">Employee satisfaction</p><p className="mt-1 text-xl font-extrabold text-slate-900">94.8%</p><p className="mt-1 text-[10px] text-emerald-600">↑ 2.4% from last quarter</p></div>
              <button onClick={() => setActivePage('Performance')} className="rounded-lg p-2 text-slate-400 hover:bg-slate-50"><ArrowUpRight size={18} /></button>
            </div>
          </section>

          <footer className="flex flex-col justify-between gap-2 border-t border-slate-200/70 py-5 text-[11px] text-slate-400 sm:flex-row sm:items-center">
            <span>© 2026 StaffSync HRMS. All rights reserved.</span>
            <span className="flex items-center gap-1.5"><span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />All systems operational <span className="mx-1">·</span> Made for people</span>
          </footer>
        </div>
      </main>


{showAddEmployee && (
  <div
    className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
    onClick={() => setShowAddEmployee(false)}
  >
    <div
      className="w-full max-w-2xl rounded-2xl border border-white/10 bg-slate-900 p-6 shadow-2xl"
      onClick={(event) => event.stopPropagation()}
    >
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-white">Add New Employee</h2>
          <p className="mt-1 text-sm text-slate-400">
            Enter the employee details below.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setShowAddEmployee(false)}
          className="rounded-lg px-3 py-2 text-slate-400 hover:bg-white/10 hover:text-white"
        >
          ✕
        </button>
      </div>

      <form onSubmit={handleAddEmployee}>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <input
            required
            placeholder="Employee ID (e.g. EMP002)"
            value={newEmployee.employeeId}
            onChange={(e) =>
              setNewEmployee({ ...newEmployee, employeeId: e.target.value })
            }
            className="rounded-xl border border-white/10 bg-slate-800 p-3 text-white outline-none focus:border-violet-500"
          />

          <input
            required
            placeholder="First Name"
            value={newEmployee.firstName}
            onChange={(e) =>
              setNewEmployee({ ...newEmployee, firstName: e.target.value })
            }
            className="rounded-xl border border-white/10 bg-slate-800 p-3 text-white outline-none focus:border-violet-500"
          />

          <input
            required
            placeholder="Last Name"
            value={newEmployee.lastName}
            onChange={(e) =>
              setNewEmployee({ ...newEmployee, lastName: e.target.value })
            }
            className="rounded-xl border border-white/10 bg-slate-800 p-3 text-white outline-none focus:border-violet-500"
          />

          <input
            required
            type="email"
            placeholder="Email Address"
            value={newEmployee.email}
            onChange={(e) =>
              setNewEmployee({ ...newEmployee, email: e.target.value })
            }
            className="rounded-xl border border-white/10 bg-slate-800 p-3 text-white outline-none focus:border-violet-500"
          />

          <input
            required
            placeholder="Department"
            value={newEmployee.department}
            onChange={(e) =>
              setNewEmployee({ ...newEmployee, department: e.target.value })
            }
            className="rounded-xl border border-white/10 bg-slate-800 p-3 text-white outline-none focus:border-violet-500"
          />

          <input
            required
            placeholder="Position / Job Title"
            value={newEmployee.position}
            onChange={(e) =>
              setNewEmployee({ ...newEmployee, position: e.target.value })
            }
            className="rounded-xl border border-white/10 bg-slate-800 p-3 text-white outline-none focus:border-violet-500"
          />

          <select
            value={newEmployee.employmentType}
            onChange={(e) =>
              setNewEmployee({
                ...newEmployee,
                employmentType: e.target.value as
                  | 'Full-time'
                  | 'Part-time'
                  | 'Contract'
                  | 'Intern',
              })
            }
            className="rounded-xl border border-white/10 bg-slate-800 p-3 text-white outline-none focus:border-violet-500"
          >
            <option value="Full-time">Full-time</option>
            <option value="Part-time">Part-time</option>
            <option value="Contract">Contract</option>
            <option value="Intern">Intern</option>
          </select>

          <input
            required
            type="date"
            value={newEmployee.joiningDate}
            onChange={(e) =>
              setNewEmployee({ ...newEmployee, joiningDate: e.target.value })
            }
            className="rounded-xl border border-white/10 bg-slate-800 p-3 text-white outline-none focus:border-violet-500"
          />
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <button
            type="button"
            onClick={() => setShowAddEmployee(false)}
            className="rounded-xl border border-white/10 px-4 py-2.5 text-sm text-slate-300 hover:bg-white/5"
          >
            Cancel
          </button>

          <button
            type="submit"
            className="rounded-xl bg-violet-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-violet-700"
          >
            Add Employee
          </button>
        </div>
      </form>
    </div>
  </div>
)}

      {notice && <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="fixed bottom-5 right-5 z-[60] flex max-w-[calc(100%-40px)] items-center gap-3 rounded-xl bg-slate-900 px-4 py-3 text-sm text-white shadow-xl"><CheckCircle2 size={17} className="shrink-0 text-emerald-400" />{notice}</motion.div>}
    </div>
  )
}

export default App
