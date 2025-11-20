from django.db import models
from _club.models import Club
from django.contrib.auth.models import AbstractUser

'''
MAY NOT BE USED -- DJANGO HAS BUILT IN USER

AbstractUser includes:

username
first_name
last_name
email
password
is_staff
is_active
is_superuser
last_login
date_joined
groups (many-to-many)
user_permissions (many-to-many)

get_full_name()
get_short_name()
set_password()
check_password()
has_perm()
has_module_perms()
'''

class UserProfile(AbstractUser):
    bio = models.CharField(max_length=300)

    def __str__(self):
        return f"User: {self.first_name} {self.last_name}"

