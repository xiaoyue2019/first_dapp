from django.shortcuts import render
from django.shortcuts import HttpResponse
from . import gow_py
import json,time,random

def index(request):
    return render(request, 'index.html')
def register_shitu(request):
    domain=request.GET.get('domain')
    # dic={'domain':domain}
    rep=render(request, 'register.html')
    rep.set_cookie('token',domain)
    return  rep
def makeresponse(_t):
    _t["Access-Control-Allow-Origin"]="*"
    _t["Access-Control-Allow-Methods"]="POST, PUT, GET, OPTIONS, DELETE"
    _t["Access-Control-Allow-Credentials"]="true"
    _t["Access-Control-Max-Age"]="3600"
    _t["Access-Control-Allow-Headers"]="x-auth-token, x-requested-with,Authorization,Origin, Accept, Content-Type,x-xsrf-token"
    return _t

def token_register(request):
    if request.method=='POST':
        _token=request.COOKIES.get('token')
        _hash=request.POST.get('address')
    elif request.method=='GET':
        _token=request.COOKIES.get('token')
        _hash=request.GET.get('address')

    res=random.randint(0,1)
    if res:
        _t=HttpResponse(json.dumps({"status":0,"msg": "True!"}, ensure_ascii=False), content_type="application/json,charset=utf-8")
        return makeresponse(_t)
    else:
        _t=HttpResponse(json.dumps({"status": -1, "msg": "False!"}, ensure_ascii=False), content_type="application/json,charset=utf-8")
        return makeresponse(_t)

def register(request):
    if request.method=='POST':
        _hash=request.POST.get('hash')
    elif request.method=='GET':
        _hash=request.GET.get('hash')
        
    res=gow_py.control(_hash)
    if res:
        _t=HttpResponse(json.dumps({"status":0,"msg": "True!"}, ensure_ascii=False), content_type="application/json,charset=utf-8")
        return makeresponse(_t)
    else:
        _t=HttpResponse(json.dumps({"status": -1, "msg": "False!"}, ensure_ascii=False), content_type="application/json,charset=utf-8")
        return makeresponse(_t)

# 路由: /api/v1/check  方法: post  参数: domain  类型：str
# 返回值: {"status":0}或{"status": -1, "msg": "...."}

def api_check(request):
    if request.method=='POST':
        _domain=request.POST.get('domain')
    elif request.method=='GET':
        _domain=request.GET.get('domain')
        
    res=gow_py.available(_domain)
    if res:
        _t=HttpResponse(json.dumps({"status":0,"msg": "True!"}, ensure_ascii=False), content_type="application/json,charset=utf-8")
        return makeresponse(_t)
    else:
        _t=HttpResponse(json.dumps({"status": -1, "msg": "False!"}, ensure_ascii=False), content_type="application/json,charset=utf-8")
        return makeresponse(_t)