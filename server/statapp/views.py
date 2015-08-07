from django.shortcuts import render
from django.http import HttpResponse, JsonResponse
from django.conf import settings
from pathlib import Path
import mimetypes
import opendata.px_reader as px


def get_px(path, data=False, meta=False, sample=False):
    root = Path(settings.DATA_ROOT)
    doc = Path(path)
    px_doc = px.Px(str(root.joinpath(doc.name)))

    resp = {
        "name": doc.name,
        "title": px_doc.title,
        "url": str(path).replace(settings.DATA_ROOT, '')
    }
    if meta:
        resp.update({
            'stub': px_doc.stub,
            'heading': px_doc.heading,
            'levels': px_doc.values})
    if data:
        resp['matrix'] = px_doc.data
    if sample:
        resp['matrix'] = sample_matrix(px_doc)
    return resp


def sample_matrix(px_doc):
    """
    Yes, at the moment the sample is first 100
    rows of the matrix

    :param px_doc:
    :type px_doc:
    :return:
    :rtype:
    """
    return [row[:20] for row in px_doc.data[:30]]


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
    resp = get_px(path, meta=True, data=True)
    return JsonResponse(resp)


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
    resp = get_px(path, data=True)
    return JsonResponse(resp)


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
    resp = get_px(path, meta=True)
    return JsonResponse(resp)


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
        'pxdocs': [get_px(px_doc, sample=True, meta=True) for px_doc in px_docs]
    })
