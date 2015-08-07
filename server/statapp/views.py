from django.shortcuts import render
from django.http import HttpResponse, JsonResponse
from django.conf import settings


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
    from pathlib import Path
    p = Path(settings.DATA_ROOT)
    json_docs = p.glob('*.json')
    px_docs = p.glob('*.px')
    return JsonResponse({
        'px': [str(i).replace(settings.BASE_DIR, '') for i in px_docs],
        "json": [str(i).replace(settings.BASE_DIR, '') for i in json_docs]
    })
