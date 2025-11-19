import api from "./api"

export async function create_club(name, description) 
{
	try 
	{
		if (name == null || description == null) 
		{
			console.error("Missing fields.");
			return null;
		}
		const response = await api.post(
			`/clubs/create/`,
			{
				club_name : name,
				club_description : description
			}
		);
		return response.data;
	}
	catch (error)
	{
		console.error("Create club failed:", error);
		throw error;
	}
}

export async function get_club(club_id) 
{
	try 
	{
		if (club_id == null) 
		{
			const response = await api.post(`/clubs/create/`);
			return response.data;
		}
		else
		{
			const response = await api.post(
				`/clubs/create/`,
				{
					club_id : club_id
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

export async function update_club(club_id, name, description, picture, links) 
{
	try 
	{
		if (club_id == null || (name == null && description && picture && links))
		{
			console.error("Missing fields.");
			return null;
		}
		else
		{
			const display = new FormData();
            display.append("image", picture);
			const response = await api.post(
				`/clubs/update/`,
				{
					club_id : club_id,
					club_name : name,
					club_description : description,
					club_picture : display,
					club_links : links
				}
			);
			return response.data;
		}
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