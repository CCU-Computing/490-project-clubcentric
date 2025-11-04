from django.apps import AppConfig


class DocsConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'documents'
    def ready(self):
        import _documents.signals
