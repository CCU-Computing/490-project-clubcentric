import api from "./api";
import { getCookie } from "../utils/cookies"

export async function create_manager(name, club_id) {
    try
    {
        if (name == null)
        {
            console.error("Missing fields.");
            return null;
        }

        const formData = new FormData();
        formData.append('name', name);

        // Only append club_id if it's provided (not null)
        if (club_id != null) {
            formData.append('club_id', club_id);
        }

        const response = await api.post(
            "managers/create/",
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
            const response = await api.get(
                "managers/get/",
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
                "managers/get/",
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

        const formData = new FormData();
        formData.append('manager_id', manager_id);
        formData.append('name', name);

        const response = await api.post(
            "managers/update/",
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

        const formData = new FormData();
        formData.append('manager_id', manager_id);

        const response = await api.post(
            "managers/delete/",
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
        const response = await api.post(
            "upload/",
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
            const response = await api.get(
                "get/",
                {
                    params :
                    {
                        document_id
                    },
                    headers:
                    {
                        "X-CSRFToken": getCookie("csrftoken")
                    }
                }
            );
            return response.data;
        }
        else if (manager_id)
        {
            const response = await api.get(
                "get/",
                {
                    params :
                    {
                        manager_id
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

    const formData = new FormData();
    formData.append('doc_id', document_id);

    try
    {
        const response = await api.post(
            "delete/",
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
    catch (error)
    {
        console.error("Document delete failed:", error);
        return null;
    }
}
