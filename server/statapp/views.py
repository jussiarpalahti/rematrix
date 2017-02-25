from django.shortcuts import render
from django.http import HttpResponse, JsonResponse
from django.conf import settings
from pathlib import Path
import mimetypes
import json
import opendata.px_reader as px

def nullify_codes(px_doc, heading):
    try:
        return px_doc.codes[heading]
    except KeyError:
        return [None] * len(px_doc.values[heading])

def get_values(px_doc):
    # TODO: get codes if available
    
    levels = {}
    for heading in px_doc.heading:
        levels[heading] = [
        {
            "name": name,
            "code": code
        }
        for name, code in zip(px_doc.values[heading], nullify_codes(px_doc, heading))]
    for heading in px_doc.stub:
        levels[heading] = [
        {
            "name": name,
            "code": code
        } 
        for name, code in zip(px_doc.values[heading], nullify_codes(px_doc, heading))]
    return levels


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
            'levels': get_values(px_doc)})
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
    rows = json.loads(request.GET.get("rows"))
    cols = json.loads(request.GET.get("cols"))
    matrix = filter_matrix(resp["matrix"], rows, cols)
    print(len(matrix), len(matrix[0]))
    return JsonResponse({"matrix" : matrix})


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

def filter_matrix(matrix, rows, cols):
    return [[matrix[row][col] for col in cols] for row in rows]
