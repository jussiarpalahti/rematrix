from django.shortcuts import render
from django.http import HttpResponse, JsonResponse
from django.conf import settings
from pathlib import Path
import mimetypes


def serve_direct(request, path):
    root = Path(settings.DATA_ROOT)
    doc = Path(path)
    resp = root.joinpath(doc.name)
    return HttpResponse(resp.open().read(), content_type=mimetypes.guess_type(doc.name))


def full(request, path):
    """
    Returns full meta + data for path
    :param request:
    :type request:
    :param path:
    :type path:
    :return:
    :rtype:
    """
    return HttpResponse("jei")


def data(request, path):
    """
    Returns path's data picked by query string
    :param request:
    :type request:
    :param path:
    :type path:
    :return:
    :rtype:
    """
    return HttpResponse("jee")


def meta(request, path):
    """
    Returns metadata for path
    :param request:
    :type request:
    :param path:
    :type path:
    :return:
    :rtype:
    """
    return HttpResponse("jes")


def index(request):
    """
    Returns a list of available paths
    :param request:
    :type request:
    :return:
    :rtype:
    """
    p = Path(settings.DATA_ROOT)
    json_docs = p.glob('*.json')
    px_docs = p.glob('*.px')
    return JsonResponse({
        'px': [str(i).replace(settings.BASE_DIR, '') for i in px_docs],
        "json": [str(i).replace(settings.BASE_DIR, '/json') for i in json_docs]
    })
