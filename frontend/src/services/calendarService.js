// services/clubService.js
import api from "./api"

export async function listCalendars(club_id) 
{
  try 
  {
    if (club_id == null) 
    {
      console.error("Missing fields.");
      return null;
    }
    else 
    {
      const response = await api.get(`/clubs/calendars/`, { params: { club_id } });
      return response.data;
    }
  }
  catch (error)
  {
    console.error("Get clubs failed:", error);
    return null;
  }
}

export async function createCalendar(club_id, calendar_name) 
{
  try 
  {
    if (club_id == null || calendar_name == null) 
    {
      console.error("Missing fields.");
      return null;
    }
    else 
    {
      const response = await api.post(`/clubs/calendars/new/`, {
        club_id : club_id,
        calendar_name : calendar_name
      });
      return response.data;
    }
  }
  catch (error)
  {
    console.error("Create calendar failed:", error);
    return null;
  }
}

export async function createMeeting(calendar_id, datetime_str) 
{
  try 
  {
    if (calendar_id == null || datetime_str == null) 
    {
      console.error("Missing fields.");
      return null;
    }
    else 
    {
      const response = await api.post(`/clubs/calendars/meetings/new`, {
        calendar_id: calendar_id,
        datetime_str: datetime_str
      });
      return response.data;
    }
  }
  catch (error)
  {
    console.error("Get clubs failed:", error);
    return null;
  }
}

export async function listMeetings(calendar_id, meeting_id) 
{
  try 
  {
    if (calendar_id == null && meeting_id == null) 
    {
      console.error("Missing fields.");
      return null;
    }
    else 
    {
      const response = await api.get(`/clubs/calendars/meetings/`, { params: {calendar_id, meeting_id} });
      return response.data;
    }
  }
  catch (error)
  {
    console.error("List meetings failed:", error);
    return null;
  }
}
