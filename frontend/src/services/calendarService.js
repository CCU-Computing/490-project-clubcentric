import api from "./api";

const calendarService = {
  addMeeting: async (clubId, date) => {
    const res = await api.post(`/calendars/${clubId}/meetings/`, { date });
    return res;
  }
};

export default calendarService;