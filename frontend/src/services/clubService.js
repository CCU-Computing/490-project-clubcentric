// services/clubService.js
import api from "./api"

export async function getClubs(club_id) 
{
  try 
  {
    const response = club_id
      ? await api.get('/clubs/', { params: { club_id } })
      : await api.get('/clubs/');
    return response.data;
  }
  catch (error)
  {
    console.error("Get clubs failed:", error);
    return null;
  }
}

export async function newClub(name, description, summary, videoEmbed) 
{
  try 
  {
    const response = await api.post(`/clubs/new/`, null, {
      params: {
        club_name: name,
        club_description: description,
        club_summary: summary,
        club_videoEmbed: videoEmbed 
      }
    });
    return response.data;
  }
  catch (error)
  {
    console.error("Create club failed:", error);
    throw error;
  }
}