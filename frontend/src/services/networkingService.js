// services/networkingService.js
import api from "./api"

export async function getNetworkUsers(search = '', limit = 50, exclude_self = true) 
{
  try 
  {
    const response = await api.get('/networking/users/', {
      params: { search, limit, exclude_self }
    });
    return response.data;
  }
  catch (error)
  {
    console.error("Get network users failed:", error);
    return null;
  }
}

export async function getConnections(status = 'accepted') 
{
  try 
  {
    const response = await api.get('/networking/connections/', {
      params: { status }
    });
    return response.data;
  }
  catch (error)
  {
    console.error("Get connections failed:", error);
    return null;
  }
}

export async function sendConnectionRequest(userId, message = '') 
{
  try 
  {
    const response = await api.post('/networking/connect/', null, {
      params: {
        user_id: userId,
        message: message
      }
    });
    return response.data;
  }
  catch (error)
  {
    console.error("Send connection request failed:", error);
    return null;
  }
}

export async function acceptConnection(connectionId) 
{
  try 
  {
    const response = await api.post('/networking/accept/', null, {
      params: {
        connection_id: connectionId
      }
    });
    return response.data;
  }
  catch (error)
  {
    console.error("Accept connection failed:", error);
    return null;
  }
}

export async function getNetworkSuggestions(limit = 10) 
{
  try 
  {
    const response = await api.get('/networking/suggestions/', {
      params: { limit }
    });
    return response.data;
  }
  catch (error)
  {
    console.error("Get network suggestions failed:", error);
    return null;
  }
}

export async function getNetworkStats() 
{
  try 
  {
    const response = await api.get('/networking/stats/');
    return response.data;
  }
  catch (error)
  {
    console.error("Get network stats failed:", error);
    return null;
  }
}

