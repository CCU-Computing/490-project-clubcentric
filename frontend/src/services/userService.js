import api from "./api"

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
            const response = await api.post(
                `/user/login/`, 
                {
                    username : username,
                    password: password
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

export async function logout_user() 
{
    try 
    {
        const response = await api.post(`/user/logout/`);
        return response.data;
    }
    catch (error)
    {
        console.error("Logout failed:", error);
        return null;
    }
}


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
            const response = await api.post(
                `/user/create/`, 
                {
                    username : username,
                    password : password
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
