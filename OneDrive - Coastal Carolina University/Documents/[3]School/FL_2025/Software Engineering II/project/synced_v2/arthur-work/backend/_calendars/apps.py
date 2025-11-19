from django.apps import AppConfig

class CalendarsConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = '_calendars'

    def ready(self):
        import _calendars.signals