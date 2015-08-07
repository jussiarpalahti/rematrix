from django.conf.urls import include, url
from django.contrib import admin

from .views import full, data, meta, index, serve_direct

urlpatterns = [
    url(r'full/(.*)', full),
    url(r'matrix/(.*)', data),
    url(r'meta/(.*)', meta),
    url(r'json/(.*)', serve_direct),
    url(r'', index),
]
