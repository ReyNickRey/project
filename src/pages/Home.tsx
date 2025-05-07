import { useState, useEffect } from 'react';
import { useEvents } from '../contexts/EventContext';
import { useAuth } from '../contexts/AuthContext';
import EventCard from '../components/EventCard';
import { Search, Filter, SlidersHorizontal } from 'lucide-react';

const Home = () => {
  const { events } = useEvents();
  const { currentUser } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  const categories = [...new Set(events.map(event => event.category))];

  const filteredEvents = events.filter(event => {
    const matchesSearch = event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.organizer.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = selectedCategory === '' || event.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  return (
    <div>
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">School Events</h1>
        <p className="text-gray-600">
          Discover and join exciting school events and activities
        </p>
      </header>

      <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search events..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#5b9bd5]"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="py-2 px-4 bg-white border border-gray-300 rounded-md flex items-center gap-2 hover:bg-gray-50"
          >
            <Filter className="h-4 w-4" />
            <span>Filters</span>
          </button>
        </div>
      </div>

      {showFilters && (
        <div className="mb-6 p-4 bg-white rounded-md shadow-sm">
          <div className="flex items-center gap-2 mb-2">
            <SlidersHorizontal className="h-4 w-4 text-[#5b9bd5]" />
            <h3 className="font-medium">Filter by Category</h3>
          </div>
          <div className="flex flex-wrap gap-2 mt-2">
            <button
              className={`px-3 py-1 rounded-full text-sm ${
                selectedCategory === '' 
                  ? 'bg-[#5b9bd5] text-white' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
              onClick={() => setSelectedCategory('')}
            >
              All
            </button>
            {categories.map(category => (
              <button
                key={category}
                className={`px-3 py-1 rounded-full text-sm ${
                  selectedCategory === category 
                    ? 'bg-[#5b9bd5] text-white' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
                onClick={() => setSelectedCategory(category)}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      )}

      {filteredEvents.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEvents.map(event => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      ) : (
        <div className="bg-white p-8 rounded-lg shadow-md text-center">
          <p className="text-gray-600 mb-2">No events found matching your criteria.</p>
          <p className="text-gray-500 text-sm">Try adjusting your filters or search term.</p>
        </div>
      )}
    </div>
  );
};

export default Home;