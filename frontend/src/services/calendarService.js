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
      // Create FormData instead of JSON
      const formData = new FormData();
      formData.append('calendar_name', calendar_name);

      // Making user calendar
      if (club_id == null)
      {
        const response = await api.post(
		`/calendar/create/`,
		formData,
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
        formData.append('club_id', club_id);
        const response = await api.post(
		`/calendar/create/`,
		formData,
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
			const formData = new FormData();
			formData.append('cal_id', calendar_id);
			formData.append('cal_name', calendar_name);

			const response = await api.post(
				`/calendar/update/`,
				formData,
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
			const formData = new FormData();
			formData.append('cal_id', calendar_id);

			const response = await api.post(
				`/calendar/delete/`,
				formData,
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
			const formData = new FormData();
			formData.append('calendar_id', calendar_id);
			formData.append('datetime_str', datetime_str);
			formData.append('description', description);

			const response = await api.post(
				`/calendar/meetings/create/`,
				formData,
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
			const formData = new FormData();
			formData.append('meet_id', meeting_id);
			formData.append('desc', description);

			const response = await api.post(
				`/calendar/meetings/update/`,
				formData,
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
			const formData = new FormData();
			formData.append('meet_id', meeting_id);

			const response = await api.post(
				`/calendar/meetings/delete/`,
				formData,
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
