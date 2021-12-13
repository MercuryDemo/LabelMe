
from django.contrib import admin
from django.urls import path
from labelme import views

urlpatterns = [
      path('newhello/', views.newhello),
]
