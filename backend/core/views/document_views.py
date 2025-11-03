from django.shortcuts import render, redirect
from .forms import DocumentForm
from rest_framework import viewsets
from _documents.models import Document, DocumentManager
from .serializers import DocumentSerializer
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_POST, require_GET, require_http_methods
from django.http import JsonResponse
from django.core.files.storage import default_storage
from django.core.files.base import ContentFile
from clubs.models import Club, Membership
from datetime import datetime
import uuid


#----- DOCUMENT ------


@csrf_exempt
@require_POST
def upload_document(request):
    title = request.POST.get("title")
    manager_id = request.POST.get("manager_id")
    uploaded_file = request.FILES.get("file")

    if not title or not uploaded_file or not manager_id:
        return JsonResponse({"error" : "Missing required fields"}, status=400)
    
    try:
        document_manager = DocumentManager.objects.get(id=manager_id)
    except DocumentManager.DoesNotExist:
        return JsonResponse({"error" : "Document manager not found"}, status=404)
    
    club_id = document_manager.club.id
    # May be wrong to do uploaded_file.name
    path = f"{club_id}/documents/manager_{manager_id}/{uuid.uuid4().hex}_{uploaded_file.name}"

    save_path = default_storage.save(path, ContentFile(uploaded_file.read()))

    doc = Document.objects.create(
        title=title,
        file=save_path,
        uploaded_at=datetime.now(),
        document_manager=document_manager
    )
    return JsonResponse({"id" : doc.id, "file" : doc.file.url})

@csrf_exempt
@require_http_methods(["PUT"])
def update_document(request, document_id):
    '''Updates a Document's title. File content is typically updated via a new upload/delete cycle.'''
    title = request.PUT.get("title")

    # Validation Check (Need a title to update)
    if not title:
        return JsonResponse({"error": "Missing required field: title"}, status=400)

    # Document Existence Check
    try:
        document = Document.objects.get(id=document_id)
    except Document.DoesNotExist:
        return JsonResponse({"error": "Document not found"}, status=404)
    
    manager = document.document_manager
    
    # Authorization Check (Must be able to modify the parent DocumentManager)
    # Club-based: Must be an organizer or admin of the club
    if manager.club is not None:
        if not Membership.objects.filter(user=request.user, club=manager.club, role__in=['organizer', 'admin']).exists():
            return JsonResponse({"error" : "You are not a leader of this club and cannot update this document."}, status=403)
    # User-based: Must be the calendar owner
    elif manager.user is not None:
        if manager.user != request.user:
            return JsonResponse({"error" : "Cannot update another user's document"}, status=403)
    else:
        return JsonResponse({"error": "Document manager has no valid club or user association."}, status=500)
    
    # Update and Save
    document.title = title
    document.save()
    
    return JsonResponse({
        "id": document.id,
        "title": document.title,
        "status": "updated"
    })


@csrf_exempt
@require_http_methods(["DELETE"])
def delete_document(request, document_id):
    '''Deletes a Document. Requires club leader or user ownership of the parent DocumentManager.'''

    # Document Existence Check
    try:
        document = Document.objects.get(id=document_id)
    except Document.DoesNotExist:
        return JsonResponse({"error": "Document not found"}, status=404)
    
    manager = document.document_manager
    
    # Authorization Check (Must be able to modify the parent DocumentManager)
    # Club-based: Must be an organizer or admin of the club
    if manager.club is not None:
        if not Membership.objects.filter(user=request.user, club=manager.club, role__in=['organizer', 'admin']).exists():
            return JsonResponse({"error" : "You are not a leader of this club and cannot delete this document."}, status=403)
    # User-based: Must be the calendar owner
    elif manager.user is not None:
        if manager.user != request.user:
            return JsonResponse({"error" : "Cannot delete another user's document"}, status=403)
    else:
        return JsonResponse({"error": "Document manager has no valid club or user association."}, status=500)
    
    
    # Delete - This only deletes the database record. The file on disk may need separate handling.
    document.delete() 
    
    return JsonResponse({"status": "deleted"})




#----- DOCUMENT MANAGER ------

@csrf_exempt
@require_POST
def create_document_manager(request):
    name = request.POST.get("name")
    club_id = request.POST.get("club_id")

    if not name or not club_id:
        return JsonResponse({"error" : "Missing required fields"}, status=400)
    
    try:
        club = Club.objects.get(id=club_id)
    except Club.DoesNotExist:
        return JsonResponse({"error" : "Club not found"}, status=404)
    
    document_manager = DocumentManager.objects.create(name=name, club=club)
    return JsonResponse({"id" : document_manager.id, "name" : name})


def getManagers(request):
    club_id = request.GET.get("club_id")
    
    if not club_id:
        return JsonResponse({"error" : "Missing required fields"}, status=400)

    try:
        club = Club.objects.get(id=club_id)
    except Club.DoesNotExist:
        return JsonResponse({"error" : "Club not found"}, status=409)
    managers = []
    for manager in club.document_managers.all():
        managers.append({"id": manager.id, "name" : manager.name})
    return JsonResponse(managers, safe=False)

def getDocumentByID(request):
    doc_id = request.GET.get("doc_id")
    manager_id = request.GET.get("manager_id")
    
    if not manager_id and not doc_id:
        return JsonResponse({"error" : "Missing required fields"}, status=400)
    
    if not manager_id or manager_id and doc_id:
        try:
            document = Document.objects.get(id=doc_id)
        except Document.DoesNotExist:
            return JsonResponse({"error" : "Document not found"}, status=404)
        
        return JsonResponse([{
            "id" : document.id, 
            "file" : request.build_absolute_uri(document.file.url)
            }], safe=False)

    if not doc_id:
        try:
            manager = DocumentManager.objects.get(id=manager_id)
        except DocumentManager.DoesNotExist:
            return JsonResponse({"error" : "Manager not found"}, status=409)
        documents = []
        for doc in manager.documents.all():
            documents.append({
                "id": doc.id, 
                "title": doc.title, 
                "file" : request.build_absolute_uri(doc.file.url)})
        return JsonResponse(documents, safe=False)
    

@csrf_exempt
@require_http_methods(["PUT"])
def update_document_manager(request, manager_id):
    '''Update a DocumentManager's name. Requires club leader or user ownership.'''

    name = request.PUT.get("name")
    
    #Checking if a name was passed in
    if not name:
        return JsonResponse({"error": "Missing required field: name"}, status=400)
    
    #Checking if the manager exists
    try:
        manager = DocumentManager.objects.get(id=manager_id)
    except DocumentManager.DoesNotExist:
        return JsonResponse({"error": "Document manager not found"}, status=404)
    
    
    #Club-based Manager Authorization
    if manager.club is not None:
        if not Membership.objects.filter(user=request.user, club=manager.club, role__in=['organizer', 'admin']).exists():
            return JsonResponse({"error" : "You are not a leader of this club and cannot update the document manager."}, status=403)
            
    #User-based Manager Authorization 
    elif manager.user is not None:
        if manager.user != request.user:
            return JsonResponse({"error" : "Cannot update document manager of another user"}, status=403)
            
    # Fallback for unexpected owner state
    else:
        return JsonResponse({"error": "Document manager has no valid club or user association."}, status=500)
    
    #Update and Save
    manager.name = name
    manager.save()
    
    return JsonResponse({
        "id": manager.id, 
        "name": manager.name, 
        "status": "updated"
    })

@csrf_exempt
@require_http_methods(["DELETE"])
def delete_document_manager(request, manager_id):
    '''Deletes a DocumentManager. Requires club leader or user ownership.'''
    
    # Manager Existence Check
    try:
        manager = DocumentManager.objects.get(id=manager_id)
    except DocumentManager.DoesNotExist:
        return JsonResponse({"error": "Document manager not found"}, status=404)
        
    # Authorization Check 
    
    # Club-based Manager Authorization
    if manager.club is not None:
        if not Membership.objects.filter(user=request.user, club=manager.club, role__in=['organizer', 'admin']).exists():
            return JsonResponse({"error" : "You are not a leader of this club and cannot delete the document manager."}, status=403)
            
    # User-based Manager Authorization
    elif manager.user is not None:
        if manager.user != request.user:
            return JsonResponse({"error" : "Cannot delete document manager of another user"}, status=403)
            
    # Fallback for unexpected owner state
    else:
        return JsonResponse({"error": "Document manager has no valid club or user association."}, status=500)
    
    # Delete (This will delete all associated Documents)
    manager.delete()
    
    return JsonResponse({"status": "deleted"})



class DocumentViewSet(viewsets.ModelViewSet):
    queryset = Document.objects.all()
    serializer_class = DocumentSerializer
