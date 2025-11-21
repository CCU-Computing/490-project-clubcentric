import api from "./api"
import { getCookie } from "../utils/cookies";

export async function create_user(username, password, first_name, last_name, email) 
{
    try 
    {
        // Return if invalid inputs
        if (username == null || password == null || first_name == null || last_name == null || email == null) 
        {
            console.error("Missing fields.");
            return null;
        }
        else 
        {
            const formData = new FormData();
            formData.append("username", username);
            formData.append("password", password);
            formData.append("first_name", first_name);
            formData.append("last_name", last_name);
            formData.append("email", email);
            const response = await api.post(
                `/user/create/`, 
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
        console.error("Login failed:", error);
        return null;
    }
}

export async function get_user(user_id) 
{
    try 
    {
        // Return if invalid inputs
        if (user_id == null) 
        {
            const response = await api.get(
                `/user/get/`,
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
                `/user/get/`,
                {
                    params:
                    {
                        user_id
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
        console.error("Get failed:", error);
        return null;
    }
}

export async function update_user(username, first_name, last_name, email, bio, profile_picture)
{
    try
    {
        // Return if invalid inputs
        if (username == null && first_name == null && last_name == null && email == null && bio == null && profile_picture == null)
        {
            console.error("Missing fields.");
            return null;
        }
        else
        {
            // Use FormData for the entire request if there's a file
            const formData = new FormData();

            if (username) formData.append("username", username);
            if (first_name) formData.append("first_name", first_name);
            if (last_name) formData.append("last_name", last_name);
            if (email) formData.append("email", email);
            if (bio) formData.append("bio", bio);
            if (profile_picture) formData.append("profile_picture", profile_picture);

            const response = await api.post(
                `/user/update/`,
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
        console.error("Update failed:", error);
        return null;
    }
}

export async function delete_user()
{
    try
    {
        const response = await api.post(
            `/user/delete/`,
            {},
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
        console.error("Delete failed:", error);
        return null;
    }
}

export async function login_user(username, password) 
{
    try 
    {
        // Return if invalid inputs
        if (username == null || password == null) 
        {
            console.error("Missing fields.");
            return null;
        }
        else 
        {
            const formData = new FormData();
            formData.append("username", username);
            formData.append("password", password);
            
            const response = await api.post(
                `/user/login/`, 
                formData
            );
            return response.data;
        }
    }
    catch (error)
    {
        console.error("Login failed:", error);
        return null;
    }
}

export async function logout_user()
{
    try
    {
        const response = await api.post(
            `/user/logout/`,
            {},
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
        console.error("Logout failed:", error);
        return null;
    }
}

export async function change_password(password)
{
    try
    {
        // Return if invalid inputs
        if (password == null)
        {
            console.error("Missing fields.");
            return null;
        }
        else
        {
            const response = await api.post(
                `/user/password/`,
                {
                    password: password
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
        console.error("Password change failed:", error);
        return null;
    }
}
