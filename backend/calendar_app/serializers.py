from rest_framework import serializers
from .models import Calendar, Meeting
from clubs.models import Club
from users.models import User


class MeetingSerializer(serializers.ModelSerializer):
    # A ModelSerializer automatically maps fields from the Meeting model.
    class Meta:
        model = Meeting
        # Fields to include in the JSON output.
        fields = ['id', 'calendar', 'date', 'description']
        # 'read_only_fields' is often used for fields that should not be set by the client on creation/update.
        read_only_fields = ['id']

class CalendarListSerializer(serializers.ModelSerializer):
    # Note: We include the foreign key IDs directly.
    # The view already ensures only one of club/user is set.
    
    class Meta:
        model = Calendar
        fields = ['id', 'name', 'club', 'user'] 
        read_only_fields = ['id', 'club', 'user']

class CalendarDetailSerializer(serializers.ModelSerializer):
    # This nests the list of meetings associated with the calendar.
    # 'meetings' is the related_name on the Meeting model's ForeignKey.
    meetings = MeetingSerializer(many=True, read_only=True)
    
    # You can also add custom representations for the club/user if needed
    club_name = serializers.CharField(source='club.name', read_only=True, allow_null=True)
    user_full_name = serializers.CharField(source='user.get_full_name', read_only=True, allow_null=True)


    class Meta:
        model = Calendar
        fields = ['id', 'name', 'club', 'club_name', 'user', 'user_full_name', 'meetings']
        read_only_fields = ['id', 'club', 'user']