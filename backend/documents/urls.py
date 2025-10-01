from django.urls import path, include
import documents.views as doc
urlpatterns = [
    path("new/", doc.create_document_manager, name="create_doc_manager"),
    path("", doc.getManagers, name="get_managers"),
    path("documents/", doc.getDocumentByID, name="get_documents"),
    path("documents/upload/", doc.upload_document, name="upload_document")
]