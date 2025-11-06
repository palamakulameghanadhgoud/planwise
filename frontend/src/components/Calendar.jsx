import React, { useEffect, useState } from 'react';
import { campus as campusApi } from '../api/client';
import { Plus, Calendar as CalendarIcon, MapPin, Clock, X, BookOpen, Coffee, Users } from 'lucide-react';

function Calendar() {
  const [events, setEvents] = useState([]);
  const [todaySchedule, setTodaySchedule] = useState([]);
  const [freeSlots, setFreeSlots] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [eventData, setEventData] = useState({
    title: '',
    event_type: 'class',
    start_time: '',
    end_time: '',
    location: '',
  });

  useEffect(() => {
    loadCalendarData();
  }, [selectedDate]);

  const loadCalendarData = async () => {
    try {
      const [scheduleRes, eventsRes, slotsRes] = await Promise.all([
        campusApi.getTodaySchedule(),
        campusApi.getEvents({ date: selectedDate }),
        campusApi.getFreeSlots({ date: selectedDate }),
      ]);
      setTodaySchedule(scheduleRes.data);
      setEvents(eventsRes.data);
      setFreeSlots(slotsRes.data.free_slots || []);
    } catch (error) {
      console.error('Failed to load calendar:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await campusApi.createEvent({
        ...eventData,
        start_time: new Date(eventData.start_time).toISOString(),
        end_time: new Date(eventData.end_time).toISOString(),
      });
      loadCalendarData();
      setShowModal(false);
      setEventData({
        title: '',
        event_type: 'class',
        start_time: '',
        end_time: '',
        location: '',
      });
    } catch (error) {
      console.error('Failed to create event:', error);
    }
  };

  const handleDeleteEvent = async (eventId) => {
    if (confirm('Delete this event?')) {
      try {
        await campusApi.deleteEvent(eventId);
        loadCalendarData();
      } catch (error) {
        console.error('Failed to delete event:', error);
      }
    }
  };

  const getEventIcon = (type) => {
    const icons = {
      class: <BookOpen size={16} />,
      canteen: <Coffee size={16} />,
      event: <Users size={16} />,
      club: <Users size={16} />,
    };
    return icons[type] || <CalendarIcon size={16} />;
  };

  const getEventColor = (type) => {
    const colors = {
      class: 'bg-blue-500/20 border-blue-500',
      canteen: 'bg-orange-500/20 border-orange-500',
      event: 'bg-purple-500/20 border-purple-500',
      club: 'bg-green-500/20 border-green-500',
      task: 'bg-pink-500/20 border-pink-500',
    };
    return colors[type] || 'bg-gray-500/20 border-gray-500';
  };

  const formatTime = (dateString) => {
    return new Date(dateString).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="container mx-auto max-w-4xl fade-in">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold">Campus Calendar 📅</h1>
          <p className="text-gray-400">Schedule your day efficiently</p>
        </div>
        <button onClick={() => setShowModal(true)} className="btn btn-primary">
          <Plus size={20} />
          Add Event
        </button>
      </div>

      {/* Date Selector */}
      <div className="card mb-6">
        <div className="flex items-center gap-3">
          <CalendarIcon className="text-blue-400" size={20} />
          <input
            type="date"
            className="input flex-1"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
          />
        </div>
      </div>

      {/* Today's Schedule */}
      <div className="card mb-6">
        <h3 className="text-xl font-bold mb-4">
          {selectedDate === new Date().toISOString().split('T')[0]
            ? "Today's Schedule"
            : 'Schedule'}
        </h3>

        {todaySchedule.length === 0 ? (
          <div className="text-center py-8 text-gray-400">
            <CalendarIcon size={48} className="mx-auto mb-2 opacity-50" />
            <p>No events scheduled for this day</p>
          </div>
        ) : (
          <div className="space-y-3">
            {todaySchedule.map((item) => (
              <div
                key={`${item.type}-${item.id}`}
                className={`p-4 rounded-lg border ${getEventColor(item.type || item.event_type)}`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      {getEventIcon(item.type || item.event_type)}
                      <h4 className="font-semibold">{item.title}</h4>
                      <span className="badge badge-secondary text-xs capitalize">
                        {item.type || item.event_type}
                      </span>
                    </div>

                    <div className="space-y-1 text-sm text-gray-300">
                      <div className="flex items-center gap-2">
                        <Clock size={14} />
                        <span>
                          {formatTime(item.start)} - {formatTime(item.end)}
                        </span>
                      </div>

                      {item.location && (
                        <div className="flex items-center gap-2">
                          <MapPin size={14} />
                          <span>{item.location}</span>
                        </div>
                      )}

                      {item.priority && (
                        <span className={`badge badge-${item.priority === 'urgent' ? 'danger' : 'warning'} text-xs`}>
                          {item.priority}
                        </span>
                      )}
                    </div>
                  </div>

                  {item.type === 'event' && (
                    <button
                      onClick={() => handleDeleteEvent(item.id)}
                      className="p-2 hover:bg-red-500/20 rounded-lg transition"
                    >
                      <X size={16} className="text-red-400" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Free Time Slots */}
      {freeSlots.length > 0 && (
        <div className="card mb-6 bg-green-500/10 border-green-500/30">
          <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
            <Clock className="text-green-400" />
            Free Time Slots
          </h3>
          <p className="text-sm text-gray-400 mb-4">
            Perfect windows to schedule tasks and study sessions
          </p>
          <div className="grid md:grid-cols-2 gap-3">
            {freeSlots.map((slot, idx) => (
              <div key={idx} className="p-3 bg-slate-700/50 rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold">
                      {formatTime(slot.start)} - {formatTime(slot.end)}
                    </p>
                    <p className="text-sm text-gray-400">{slot.duration_minutes} minutes</p>
                  </div>
                  <span className="badge badge-success">{Math.floor(slot.duration_minutes / 60)}h {slot.duration_minutes % 60}m</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Campus Events */}
      {events.length > 0 && (
        <div className="card">
          <h3 className="text-xl font-bold mb-4">Campus Events</h3>
          <div className="space-y-2">
            {events.map((event) => (
              <div
                key={event.id}
                className={`p-3 rounded-lg border ${getEventColor(event.event_type)}`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {getEventIcon(event.event_type)}
                    <div>
                      <p className="font-semibold">{event.title}</p>
                      <p className="text-sm text-gray-400">
                        {formatTime(event.start_time)} - {formatTime(event.end_time)}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleDeleteEvent(event.id)}
                    className="p-2 hover:bg-red-500/20 rounded-lg transition"
                  >
                    <X size={16} className="text-red-400" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Add Event Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="card max-w-md w-full">
            <h2 className="text-2xl font-bold mb-4">Add Campus Event</h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Title</label>
                <input
                  type="text"
                  className="input"
                  value={eventData.title}
                  onChange={(e) => setEventData({ ...eventData, title: e.target.value })}
                  placeholder="e.g., Math Lecture"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Type</label>
                <select
                  className="input"
                  value={eventData.event_type}
                  onChange={(e) => setEventData({ ...eventData, event_type: e.target.value })}
                >
                  <option value="class">Class</option>
                  <option value="canteen">Canteen/Break</option>
                  <option value="event">Event</option>
                  <option value="club">Club Activity</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Start Time</label>
                  <input
                    type="datetime-local"
                    className="input"
                    value={eventData.start_time}
                    onChange={(e) => setEventData({ ...eventData, start_time: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">End Time</label>
                  <input
                    type="datetime-local"
                    className="input"
                    value={eventData.end_time}
                    onChange={(e) => setEventData({ ...eventData, end_time: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Location (optional)</label>
                <input
                  type="text"
                  className="input"
                  value={eventData.location}
                  onChange={(e) => setEventData({ ...eventData, location: e.target.value })}
                  placeholder="e.g., Room 301"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button type="submit" className="btn btn-primary flex-1">
                  Add Event
                </button>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="btn btn-secondary flex-1"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Calendar;

