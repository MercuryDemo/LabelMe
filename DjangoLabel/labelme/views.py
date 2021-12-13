from django.shortcuts import render

# Create your views here.
from django.http import HttpResponse
def hello(request):
    return HttpResponse('hello world!')

def newhello(request):
    return render(request,'hello.html')
    # return HttpResponse('hello world!')
