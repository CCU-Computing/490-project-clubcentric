import api from "./api"
import { getCookie } from "../utils/cookies"

export async function create_calendar(club_id, calendar_name) 
{
  try 
  {
    if (calendar_name == null) 
    {
      console.error("Missing fields.");
      return null;
    }
    else 
    {
      // Making user calendar
      if (club_id == null)
      {
        const response = await api.post(
			`calendar/create/`,
			{
          		calendar_name : calendar_name
        	},
			{
				headers:
				{
					"X-CSRFToken": getCookie("csrftoken")
				}
    		}
		);
        return response.data;
      }
      // Club calendar
      else
      {
        const response = await api.post(
			`calendar/create/`,
			{
			club_id : club_id,
			calendar_name : calendar_name
			},
			{
				headers:
				{
					"X-CSRFToken": getCookie("csrftoken")
				}
    		}
		);
        return response.data;
      }
    }
  }
  catch (error)
  {
    console.error("Create calendar failed:", error);
    return null;
  }
}

export async function get_calendars(club_id) 
{
	try 
	{
		// Get user's calendars
		if (club_id == null) 
		{
			const response = await api.get(
				`/calendar/get/`,
				{
					headers:
					{
						"X-CSRFToken": getCookie("csrftoken")
					}
				}
			);
			return response.data;
		}
		// Club's calendars
		else 
		{
			const response = await api.get(
				`/calendar/get/`,
				{
					params:
					{
						club_id
					},
					headers:
					{
						"X-CSRFToken": getCookie("csrftoken")
					}
				}
			);
			return response.data;
		}
	}
	catch (error)
	{
		console.error("Get calendar failed:", error);
		return null;
	}
}

export async function update_calendar(calendar_id, calendar_name) 
{
	try 
	{
		if (calendar_id == null || calendar_name == null) 
		{
			console.error("Missing fields.");
			return null;
		}
		else 
		{
			const response = await api.post(
				`calendar/update/`,
				{
				cal_id : calendar_id,
				cal_name : calendar_name
				},
				{
					headers:
					{
						"X-CSRFToken": getCookie("csrftoken")
					}
				}
			);
			return response.data;
		}
	}
	catch (error)
	{
		console.error("Update calendar failed:", error);
		return null;
	}
}

export async function delete_calendar(calendar_id) 
{
	try 
	{
		if (calendar_id == null) 
		{
			console.error("Missing fields.");
			return null;
		}
		else 
		{
			const response = await api.post(
				`calendar/delete/`,
				{
				cal_id : calendar_id,
				},
				{
					headers:
					{
						"X-CSRFToken": getCookie("csrftoken")
					}
				}
			);
			return response.data;
		}
	}
	catch (error)
	{
		console.error("Delete calendar failed: ", error);
		return null;
	}
}

export async function create_meeting(calendar_id, datetime_str, description) 
{
	try 
	{
		if (calendar_id == null || datetime_str == null || description == null) 
		{
			console.error("Missing fields.");
			return null;
		}
		else 
		{
			const response = await api.post(
				`/calendar/meetings/create/`,
				{
				calendar_id: calendar_id,
				datetime_str: datetime_str,
				description : description
				},
				{
					headers:
					{
						"X-CSRFToken": getCookie("csrftoken")
					}
				}
			);
			return response.data;
		}
	}
	catch (error)
	{
		console.error("Get clubs failed:", error);
		return null;
	}
}

export async function get_meetings(calendar_id) 
{
	try 
	{
		if (calendar_id == null) 
		{
			console.error("Missing fields.");
			return null;
		}
		else 
		{
			const response = await api.get(
				`/calendar/meetings/list/`,
				{
					params:
					{
						calendar_id
					},
					headers:
					{
						"X-CSRFToken": getCookie("csrftoken")
					}
				}	
			);
			return response.data;
		}
	}
	catch (error)
	{
		console.error("Get meetings failed:", error);
		return null;
	}
}

export async function update_meeting(meeting_id, description) 
{
	try 
	{
		if (meeting_id == null || description == null) 
		{
			console.error("Missing fields.");
			return null;
		}
		else 
		{
			const response = await api.post(
				`/calendar/meetings/update/`,
				{
				meet_id : meeting_id,
				desc : description
				},
				{
					headers:
					{
						"X-CSRFToken": getCookie("csrftoken")
					}
				}
			);
			return response.data;
		}
	}
	catch (error)
	{
		console.error("Update meeting failed:", error);
		return null;
	}
}

export async function delete_meeting(meeting_id) 
{
	try 
	{
		if (meeting_id == null) 
		{
			console.error("Missing fields.");
			return null;
		}
		else 
		{
			const response = await api.post(
				`/calendar/meetings/delete/`,
				{
				meet_id : meeting_id
				},
				{
					headers:
					{
						"X-CSRFToken": getCookie("csrftoken")
					}
				}
			);
			return response.data;
		}
	}
	catch (error)
	{
		console.error("Delete meeting failed:", error);
		return null;
	}
}