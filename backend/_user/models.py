from django.db import models
from django.contrib.auth.models import AbstractUser
from django.contrib.auth.models import Group, Permission

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

    # These arguments fix the reverse accessor clash on the inherited fields:
    groups = models.ManyToManyField(
        'auth.Group',
        verbose_name=('groups'),
        blank=True,
        help_text=('The groups this user belongs to.'),
        related_name="userprofile_set", # <-- Unique related_name
        related_query_name="userprofile",
    )
    user_permissions = models.ManyToManyField(
        'auth.Permission',
        verbose_name=('user permissions'),
        blank=True,
        help_text=('Specific permissions for this user.'),
        related_name="userprofile_permissions_set", # <-- Unique related_name
        related_query_name="userprofile_permission",
    )

    def __str__(self):
        return f"User: {self.first_name} {self.last_name}"
