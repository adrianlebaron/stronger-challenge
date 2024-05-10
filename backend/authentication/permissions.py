from rest_framework.permissions import BasePermission

class IsAdminOrReadOnly(BasePermission):
    # Custom permission to only allow admins to access the view.

    def has_permission(self, request, view):
        # Check if the user is an admin
        return request.user and request.user.profile.roles == 'ADMIN'
