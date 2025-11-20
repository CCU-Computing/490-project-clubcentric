import api from "./api"
import { getCookie } from "../utils/cookies";

export async function create_club(name, description) {
  try {
    if (!name || !description) {
      console.error("Missing fields.");
      return null;
    }

    // Form-encoded data instead of JSON
    const formData = new URLSearchParams();
    formData.append("club_name", name);
    formData.append("club_description", description);

    const response = await api.post(
      "/clubs/create/",
      formData,
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          "X-CSRFToken": getCookie("csrftoken"),
        },
        withCredentials: true, // ensures cookies are sent
      }
    );

    return response.data;
  } catch (error) {
    console.error("Create club failed:", error);
    throw error;
  }
}

export async function getClubs() {
    try {
        const response = await api.get(
            `/clubs/get/`,
            {
                headers: {
                    "X-CSRFToken": getCookie("csrftoken")
                }
            }
        );

        const clubs = response.data;

        // Fetch full club details for consistency
        const fullClubs = await Promise.all(
            clubs.map(async (club) => {
                const full = await get_club(club.id);
                return full;
            })
        );

        return fullClubs;
    }
    catch (error) {
        console.error("get clubs failed:", error);
        throw error;
    }
}




export async function get_club(club_id) 
{
	try 
	{
		if (club_id == null) 
		{
			const response = await api.get(
				`/clubs/get/`,
				{
					headers:
					{
						"X-CSRFToken": getCookie("csrftoken")
					}
				}
			);
			return response.data;
		}
		else
		{
			const response = await api.get(
				`/clubs/get/`,
				{
					params:
					{
						club_id : club_id
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
		console.error("get club failed:", error);
		throw error;
	}
}

export async function update_club(club_id, name, description, picture, links, summary, videoEmbed, tags, lastMeetingDate) 
{
    try 
    {
        if (club_id == null)
        {
            console.error("Missing club_id field.");
            return null;
        }
        
        // Use FormData for file uploads and other data
        const display = new FormData();
        
        // Append all fields to FormData
        display.append("club_id", club_id);
        
        if (name) display.append("club_name", name);
        if (description) display.append("club_description", description);
        if (summary) display.append("club_summary", summary);
        if (videoEmbed) display.append("club_videoEmbed", videoEmbed);
        if (picture) display.append("club_picture", picture);
        
        // ArrayField (tags) must be JSON stringified
        display.append("club_tags", JSON.stringify(tags || [])); 

        // JSONField (links) must be JSON stringified
        display.append("club_links", JSON.stringify(links || [])); 

        // Send date
        display.append("club_lastMeetingDate", lastMeetingDate || "");

        const response = await api.post(
            `/clubs/update/`,
            display,
            {
                headers:
                {
                    "X-CSRFToken": getCookie("csrftoken")
                }
            }
        );
        return response.data;
    }
    catch (error)
    {
        console.error("update club failed:", error);
        throw error;
    }
}

export async function delete_club(club_id) 
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
			const response = await api.post(
				`/clubs/delete/`,
				{
					club_id : club_id
				},
				{
					headers:
					{
						"Content-Type": "application/json",
						"X-CSRFToken": getCookie("csrftoken")
					}
				}
			);
			return response.data;
		}
	}
	catch (error)
	{
		console.error("delete club failed:", error);
		throw error;
	}
}

export async function join_club(club_id) 
{
	try 
	{
		if (club_id == null) 
		{
			console.error("Missing fields.");
			return null;
		}
		const response = await api.post(
			`/clubs/members/add/`,
			{
				club_id : club_id,
			},
			{
				headers:
				{
					"Content-Type": "application/json",
					"X-CSRFToken": getCookie("csrftoken")
				}
			}
		);
		return response.data;
	}
	catch (error)
	{
		console.error("join club failed:", error);
		throw error;
	}
}

export async function get_membership(club_id, user_id) 
{
	try 
	{

		const response = await api.get(
			`/clubs/members/get/`,
			{
				params:
				{
					club_id : club_id,
					user_id : user_id
				},
				headers:
				{
					"X-CSRFToken": getCookie("csrftoken")
				}
			}
		);
		return response.data;
	}
	catch (error)
	{
		console.error("get membership failed:", error);
		throw error;
	}
}

export async function update_membership(user_id, club_id, role) 
{
	try 
	{
		if (club_id == null || user_id == null || role == null)
		{
			console.error("Missing fields.");
			return null;
		}
		else
		{
			const response = await api.post(
				`/clubs/members/update/`,
				{
					user_id : user_id,
					club_id : club_id,
					new_role : role
				},
				{
					headers:
					{
						"Content-Type": "application/json",
						"X-CSRFToken": getCookie("csrftoken")
					}
				}
			);
			return response.data;
		}
	}
	catch (error)
	{
		console.error("update membership failed:", error);
		throw error;
	}
}

export async function remove_membership(club_id, user_id) 
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
			const response = await api.post(
				`/clubs/members/remove/`,
				{
					club_id : club_id,
					user_id : user_id
				},
				{
					headers:
					{
						"Content-Type": "application/json",
						"X-CSRFToken": getCookie("csrftoken")
					}
				}
			);
			return response.data;
		}
	}
	catch (error)
	{
		console.error("delete membership failed:", error);
		throw error;
	}
}

export async function create_merge(club_id_1, club_id_2) 
{
	try 
	{
		if (club_id_1 == null || club_id_2 == null) 
		{
			console.error("Missing fields.");
			return null;
		}
		const response = await api.post(
			`/clubs/merge/create/`,
			{
				club_id_1 : club_id_1,
				club_id_2 : club_id_2
			},
			{
				headers:
				{
					"Content-Type": "application/json",
					"X-CSRFToken": getCookie("csrftoken")
				}
			}
		);
		return response.data;
	}
	catch (error)
	{
		console.error("create merge failed:", error);
		throw error;
	}
}

export async function get_merge(club_id) 
{
	try 
	{
		const response = await api.get(
			`/clubs/merge/get/`,
			{
				params:
				{
					club_id : club_id
				},
				headers:
				{
					"X-CSRFToken": getCookie("csrftoken")
				}
			}
		);
		return response.data;
	}
	catch (error)
	{
		console.error("get membership failed:", error);
		throw error;
	}
}

export async function update_merge(club_id) 
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
			const response = await api.post(
				`/clubs/merge/update/`,
				{
					club_id : club_id
				},
				{
					headers:
					{
						"Content-Type": "application/json",
						"X-CSRFToken": getCookie("csrftoken")
					}
				}
			);
			return response.data;
		}
	}
	catch (error)
	{
		console.error("update merge failed:", error);
		throw error;
	}
}

export async function delete_merge(club_id) 
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
			const response = await api.post(
				`/clubs/merge/delete/`,
				{
					club_id : club_id
				},
				{
					headers:
					{
						"Content-Type": "application/json",
						"X-CSRFToken": getCookie("csrftoken")
					}
				}
			);
			return response.data;
		}
	}
	catch (error)
	{
		console.error("delete merge failed:", error);
		throw error;
	}
}