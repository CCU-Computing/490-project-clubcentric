from django.shortcuts import render, redirect
from .forms import DocumentForm
from rest_framework import viewsets
from .models import Document
from .serializers import DocumentSerializer

def upload_document(request):
    if request.method == 'POST':
        form = DocumentForm(request.POST, request.FILES)
        if form.is_valid():
            form.save()
            return redirect('document_list')
    
    else:
        form = DocumentForm()
    
    return render(request, 'documents/upload.html', {'form': form})

class DocumentViewSet(viewsets.ModelViewSet):
    queryset = Document.objects.all()
    serializer_class = DocumentSerializer
