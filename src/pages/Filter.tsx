import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ChevronDown, Check } from 'lucide-react';

export default function Filter() {
  const navigate = useNavigate();
  
  // State for the requested fields
  const [golfers, setGolfers] = useState('2');
  const [timePreference, setTimePreference] = useState('Anytime');
  const [selectedDays, setSelectedDays] = useState<string[]>(['Sat', 'Sun']);

  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const times = ['Morning', 'Afternoon', 'Twilight', 'Anytime'];

  const toggleDay = (day: string) => {
    setSelectedDays(prev => 
      prev.includes(day) ? prev.filter(d => d !== day) : [...prev, day]
    );
  };

  return (
    <div className="min-h-screen bg-golf-cream font-sans text-golf-dark">
      {/* Header */}
      <div className="bg-golf-dark text-golf-cream px-6 py-8 shadow-lg">
        <button onClick={() => navigate(-1)} className="mb-4 flex items-center text-golf-accent hover:opacity-80">
          <ArrowLeft size={20} className="mr-2" />
          <span className="text-sm font-medium uppercase tracking-widest">Back</span>
        </button>
        <h1 className="text-3xl font-serif italic">Search Preferences</h1>
        <p className="text-golf-light/70 text-sm mt-1">Refine your perfect round</p>
      </div>

      <div className="max-w-md mx-auto p-6 space-y-8">
        
        {/* Number of Golfers - Dropdown */}
        <section>
          <label className="block text-xs font-bold uppercase tracking-widest text-golf-primary mb-3">
            Number of Golfers
          </label>
          <div className="relative">
            <select 
              value={golfers}
              onChange={(e) => setGolfers(e.target.value)}
              className="w-full appearance-none bg-white border-2 border-golf-primary/20 rounded-none px-4 py-4 focus:border-golf-accent outline-none transition-all font-medium"
            >
              <option value="1">1 Player (Single)</option>
              <option value="2">2 Players (Twosome)</option>
              <option value="3">3 Players (Threesome)</option>
              <option value="4">4 Players (Foursome)</option>
            </select>
            <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-golf-primary pointer-events-none" size={20} />
          </div>
        </section>

        {/* Preferred Time - Dropdown */}
        <section>
          <label className="block text-xs font-bold uppercase tracking-widest text-golf-primary mb-3">
            Preferred Time
          </label>
          <div className="relative">
            <select 
              value={timePreference}
              onChange={(e) => setTimePreference(e.target.value)}
              className="w-full appearance-none bg-white border-2 border-golf-primary/20 rounded-none px-4 py-4 focus:border-golf-accent outline-none transition-all font-medium"
            >
              {times.map(t => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
            <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-golf-primary pointer-events-none" size={20} />
          </div>
        </section>

        {/* Days of the Week - Multi-Select Grid */}
        <section>
          <label className="block text-xs font-bold uppercase tracking-widest text-golf-primary mb-3">
            Select Days
          </label>
          <div className="grid grid-cols-4 gap-2">
            {days.map(day => {
              const isSelected = selectedDays.includes(day);
              return (
                <button
                  key={day}
                  onClick={() => toggleDay(day)}
                  className={`py-3 border-2 transition-all text-sm font-bold ${
                    isSelected 
                    ? 'bg-golf-primary border-golf-primary text-white shadow-md' 
                    : 'bg-white border-golf-primary/10 text-golf-primary/40 hover:border-golf-primary/30'
                  }`}
                >
                  {day}
                </button>
              );
            })}
          </div>
        </section>

        {/* Action Button */}
        <button 
          onClick={() => navigate('/results')}
          className="w-full bg-golf-dark text-golf-accent py-5 mt-8 font-serif text-xl italic hover:bg-black transition-colors shadow-xl flex items-center justify-center group"
        >
          Find Tee Times
          <Check className="ml-2 opacity-0 group-hover:opacity-100 transition-opacity" size={20} />
        </button>

      </div>
    </div>
  );
}
