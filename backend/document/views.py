from django.shortcuts import render, redirect
from forms import DocumentForm
from rest_framework import viewsets
from _documents.models import Document, DocumentManager
from serializers import DocumentSerializer
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_POST, require_GET
from django.http import JsonResponse
from django.core.files.storage import default_storage
from django.core.files.base import ContentFile
from clubs.models import Club
from datetime import datetime
import uuid
from django.contrib.auth.decorators import login_required
from users.views import is_member

@csrf_exempt
@require_POST
@login_required
def create_manager(request):
    name = request.POST.get("name")
    club_id = request.POST.get("club_id")

    if not name:
        return JsonResponse({"error" : "Missing required fields"}, status=400)
    
    # Club document manager
    if club_id:
        try:
            club = Club.objects.get(id=club_id)
        except Club.DoesNotExist:
            return JsonResponse({"error" : "Club not found"}, status=404)
        
        if not is_member(user=request.user, club=club, role="organizer"):
            return JsonResponse({"error": "you are not an organizer of this club"}, status=403)
        
        document_manager = DocumentManager.objects.create(name=name, user=None, club=club)
        return JsonResponse({"status": True, "id" : document_manager.id})
    
    # User doc manager
    else:
        doc_manager = DocumentManager.objects.create(name=name, user=request.user, club=None)
        return JsonResponse({"status": True, "id": doc_manager.id})

@login_required
def get_managers(request):
    club_id = request.GET.get("club_id")
    
    if club_id:
        try:
            club = Club.objects.get(id=club_id)
        except Club.DoesNotExist:
            return JsonResponse({"error" : "Club not found"}, status=409)
        
        if not is_member(user=request.user, club=club):
            return JsonResponse({"error": "you are not a member of the associated club"}, status=403)
        
        managers = []
        for manager in club.document_managers.all():
            managers.append({"id": manager.id, "name" : manager.name})
        return JsonResponse(managers, safe=False)
    else:
        managers = []
        for manager in request.user.document_managers.all():
            managers.append({"id": manager.id, "name" : manager.name})
        return JsonResponse(managers, safe=False)

@csrf_exempt
@login_required
@require_POST
def update_manager(request):
    manager_id = request.POST.get("manager_id")
    name = request.POST.get("name")

    if not manager_id or not name:
        return JsonResponse({"error": "missing required fields"}, status=400)

    try:
        manager = DocumentManager.objects.get(id=manager_id)
    except DocumentManager.DoesNotExist:
        return JsonResponse({"error": "Manager not found"}, status=404)

    if manager.club:
        if not is_member(user=request.user, club=manager.club, role="organizer"):
            return JsonResponse({"error": "you are not an organizer of this club"}, status=403)

        if DocumentManager.objects.filter(club=manager.club, name=name).exists():
            return JsonResponse({"error": "a manager with this name already exists"}, status=409)

    if manager.user:
        if DocumentManager.objects.filter(user=request.user, name=name).exists():
            return JsonResponse({"error": "a manager with this name already exists"}, status=409)
    
    manager.name = name
    manager.save()

    return JsonResponse({"status": True})

@csrf_exempt
@login_required
@require_POST
def delete_manager(request):
    manager_id = request.POST.get("manager_id")

    if not manager_id:
        return JsonResponse({"error": "missing required fields"}, status=400)

    try:
        manager = DocumentManager.objects.get(id=manager_id)
    except DocumentManager.DoesNotExist:
        return JsonResponse({"error": "Manager not found"}, status=404)

    if manager.club:
        if not is_member(user=request.user, club=manager.club, role="organizer"):
            return JsonResponse({"error": "you are not an organizer of this club"}, status=403)

    for document in manager.documents.all():
        document.delete()
    
    manager.delete()
    return JsonResponse({"status": True})

@csrf_exempt
@login_required
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
    
    if document_manager.club:
        if not is_member(user=request.user, club=document_manager.club, role="organizer"):
            return JsonResponse({"error": "you are not an organizer of the associated club"}, status=403)
        
        if Document.objects.filter(title=title, document_manager=document_manager).exists():
            return JsonResponse({"error": "document already exists with the same title"}, status=409)

        # May be wrong to do uploaded_file.name
        path = f"{document_manager.club.id}/documents/manager_{manager_id}/{uuid.uuid4().hex}_{uploaded_file.name}"

        save_path = default_storage.save(path, uploaded_file)

        doc = Document.objects.create(
            title=title,
            file=save_path,
            uploaded_at=datetime.now(),
            document_manager=document_manager
        )
        return JsonResponse({"status": True, "id" : doc.id})
    # User
    else:
        if request.user != document_manager.user:
            return JsonResponse({"error": "cannot upload to a manager that is not yours"}, status=403)
        
        if Document.objects.filter(title=title, document_manager=document_manager).exists():
            return JsonResponse({"error": "document already exists with the same title"}, status=409)

        # May be wrong to do uploaded_file.name
        path = f"{request.user.id}/documents/manager_{manager_id}/{uuid.uuid4().hex}_{uploaded_file.name}"

        save_path = default_storage.save(path, uploaded_file)

        doc = Document.objects.create(
            title=title,
            file=save_path,
            uploaded_at=datetime.now(),
            document_manager=document_manager
        )
        return JsonResponse({"status": True, "id" : doc.id})

@login_required
@csrf_exempt
def get_documents(request):
    doc_id = request.GET.get("doc_id")
    manager_id = request.GET.get("manager_id")

    if not doc_id and not manager_id:
        return JsonResponse({"error": "Missing required fields"}, status=400)

    if doc_id and manager_id:
        return JsonResponse({"error": "cannot request a single doc and all for a manager at the same time"}, status=400)
    
    if doc_id:
        try:
            document = Document.objects.get(id=doc_id)
        except Document.DoesNotExist:
            return JsonResponse({"error" : "document not found"}, status=404)
        
        manager = document.document_manager
        if manager.club:
            if not is_member(user=request.user, club=manager.club):
                return JsonResponse({"error": "you are not a member of the associated club"}, status=403)
            
        if manager.user:
            if manager.user != request.user:
                return JsonResponse({"error" : "you are not the owner of this document"}, status=403)

        return JsonResponse({
            "id": document.id,
            "title": document.title,
            "file": request.build_absolute_url(document.file.url)
        })

    if manager_id:
        try:
            manager = DocumentManager.objects.filter(id=manager_id)
        except DocumentManager.DoesNotExist:
            return JsonResponse({"error": "manager not found"}, status=404)
        
        if manager.club:
            if not is_member(user=request.user, club=manager.club):
                return JsonResponse({"error": "you are not a member of the associated club"}, status=403)
            
        if manager.user:
            if manager.user != request.user:
                return JsonResponse({"error" : "you are not the owner of this document"}, status=403)
        
        documents = []
        for doc in manager.documents.all():
            documents.append({
                "id": doc.id, 
                "title": doc.title, 
                "file" : request.build_absolute_uri(doc.file.url)})
        return JsonResponse(documents, safe=False)

@login_required
@csrf_exempt
@require_POST
def delete_document(request):
    doc_id = request.GET.get("doc_id")
    
    if not doc_id:
        return JsonResponse({"error": "missing required fields"}, status=400)

    try:
        document = Document.objects.get(id=doc_id)
    except Document.DoesNotExist:
        return JsonResponse({"error" : "document not found"}, status=404)
        
    manager = document.document_manager
    if manager.club:
        if not is_member(user=request.user, club=manager.club, role="organizer"):
            return JsonResponse({"error": "you are not an organizer of the associated club"}, status=403)
        
    if manager.user:
        if manager.user != request.user:
            return JsonResponse({"error" : "you are not the owner of this document"}, status=403)

    document.delete()
    return JsonResponse({"status": True})

class DocumentViewSet(viewsets.ModelViewSet):
    queryset = Document.objects.all()
    serializer_class = DocumentSerializer
