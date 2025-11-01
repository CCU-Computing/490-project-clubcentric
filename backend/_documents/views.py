from django.shortcuts import render, redirect
from .forms import DocumentForm
from rest_framework import viewsets
from _documents.models import Document, DocumentManager
from .serializers import DocumentSerializer
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_POST, require_GET
from django.http import JsonResponse
from django.core.files.storage import default_storage
from django.core.files.base import ContentFile
from _club.models import Club
from datetime import datetime
import uuid

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

class DocumentViewSet(viewsets.ModelViewSet):
    queryset = Document.objects.all()
    serializer_class = DocumentSerializer
