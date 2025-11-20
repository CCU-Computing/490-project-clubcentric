from rest_framework import serializers
from .models import Document

class DocumentSerializer(serializers.ModelSerializer):
    file = serializers.SerializerMethodField()

    def get_file(self, obj):
        request = self.context.get("request")  # needed for absolute URL
        return request.build_absolute_uri(obj.file.url)

    class Meta:
        model = Document
        fields = ["id", "title", "file"]