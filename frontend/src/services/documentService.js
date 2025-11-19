import api from "./api";

export async function create_manager(name, club_id) {
    try 
    {
        if (name == null || club_id == null) 
        {
            console.error("Missing fields.");
            return null;
        }
        const response = await api.post(
            "/documents/managers/create/",
            {
                name : name,
                club_id :club_id
            }
        );
        return response.data;
    } 
    catch (error) 
    {
        console.error("Create manager failed:", error);
        return null;
    }
}

export async function get_managers(club_id) 
{
    try 
    {
        if (club_id == null) 
        {
            const response = await api.get("/documents/managers/get/");
            return response.data;
        }
        else
        {
            const response = await api.get("/documents/managers/get/", { params : { club_id }});
            return response.data;
        }
    }
    catch (error)
    {
        console.error("Get manager failed:", error);
        return null;
    }
}

export async function update_manager(manager_id, name) 
{
    try 
    {
        if (name == null || manager_id == null) 
        {
            console.error("Missing fields.");
            return null;
        }
        const response = await api.post(
            "/documents/managers/update/",
            {
                manager_id : manager_id,
                name : name
            }
        );
        return response.data;
    } 
    catch (error) 
    {
        console.error("Manager update failed:", error);
        return null;
    }
}

export async function delete_manager(manager_id) 
{
    try 
    {
        if (manager_id == null) 
        {
            console.error("Missing fields.");
            return null;
        }
        const response = await api.post(
            "/documents/managers/delete/",
            {
                manager_id : manager_id
            }
        );
        return response.data;
    } 
    catch (error) 
    {
        console.error("Manager delete failed:", error);
        return null;
    }
}

export async function upload_document(title, manager_id, uploaded_file) 
{
    if (title == null || manager_id == null || uploaded_file == null) 
    {
        console.error("Missing fields.");
        return null;
    }
    const formData = new FormData();
    formData.append("title", title);
    formData.append("manager_id", manager_id);
    formData.append("file", uploaded_file);

    try 
    {
        const response = await api.post("/documents/upload/", formData);
        return response.data;
    } 
    catch (error) 
    {
        console.error("Document upload failed:", error);
        return null;
    }
}

export async function get_document(document_id, manager_id) 
{
    if (document_id == null && manager_id == null) 
    {
        console.error("Missing fields.");
        return null;
    }
    else if (document_id && manager_id) 
    {
        console.error("Invalid input. One or the other.");
        return null;
    }

    try 
    {
        if (document_id)
        {
            const response = await api.get("/documents/get/", { params : { document_id }});
            return response.data;
        }
        else if (manager_id)
        {
            const response = await api.get("/documents/get/", { params : { manager_id }});
            return response.data;
        }
    } 
    catch (error) 
    {
        console.error("Document upload failed:", error);
        return null;
    }
}

export async function delete_document(document_id) 
{
    if (document_id == null) 
    {
        console.error("Missing fields.");
        return null;
    }
    try 
    {
        const response = await api.post("/documents/upload/",
            { 
                doc_id :  document_id 
            });
        return response.data;
    } 
    catch (error) 
    {
        console.error("Document upload failed:", error);
        return null;
    }
}