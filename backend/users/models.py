from django.db import models
from django.contrib.auth.models import AbstractUser

'''

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

class User(AbstractUser):
    bio = models.CharField(max_length=300, blank=True)
    profile_picture = models.ImageField(upload_to="profiles/", blank=True)

    def __str__(self):
        return f"User: {self.first_name} {self.last_name}"

