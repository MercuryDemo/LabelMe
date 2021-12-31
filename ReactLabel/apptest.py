# app.py
import os
from flask import Flask,render_template,request,jsonify
from flask.wrappers import Request
from flask_cors import CORS
import json
import pymysql
app = Flask(__name__)
app.config["JSON_AS_ASCII"] = False
basedir = os.path.abspath(os.path.dirname(__file__))
db = pymysql.connect(host='127.0.0.1',user='root',database='labelme',passwd='root12345',port=3306)
CORS(app)
@app.route('/', methods=['GET','POST'])
def index():
    return "1"



@app.route('/login', methods=['GET','POST'])
def login():
    if request.method == 'POST':
        data = json.loads(request.get_data(as_text=True))
        cursor = db.cursor()
        
        sql = "select password,userid from accounts where name='%s'"%data["user_name"]
        cursor.execute(sql)
        account = cursor.fetchone()
        if account:
            if account[0] == data['user_pwd']:
                #print("登陆成功")
                msg = {
                    "code": 1,
                    "userid":account[1]
                    
                }
                return jsonify(msg)
            else:
                msg={
                    "code":0,
                    "error":"密码错误"
                }
                return jsonify(msg)
        else:
            msg={
                    "code":0,
                    "error":"用户名不存在"
                }
            return jsonify(msg)
        
@app.route('/register', methods=['GET','POST'])
def register():
    if request.method == 'POST':
        data = json.loads(request.get_data(as_text=True))
        cursor = db.cursor()
        sql = "select * from accounts where name='%s'" % data["user_name"]
        cursor.execute(sql)
        if cursor.fetchall():
            return {'code': 0,'error':"用户名已存在"}
        sql = "select * from accounts where mail='%s'" % data["user_mail"]
        cursor.execute(sql)
        if cursor.fetchall():
            return {'code': 0,'error':"邮箱已存在"}
        sql = "insert into accounts values(null,'{name}','{pw}','{email}')"
        sql = sql.format(name=data["user_name"],pw=data["user_pwd"],email=data['user_mail'])
        cursor.execute(sql)
        db.commit()
        # print("成功")
        msg = {'code': 1}
        return jsonify(msg)

@app.route('/upload', methods=['GET','POST'])
def upload():
    if request.method == 'POST':
        print("comehere")
        print(request)
        print(request.headers['user_id'])
        # data = json.loads(request.get_data(as_text=True))
        # print(data)
        cursor = db.cursor()
        imgDatas = request.files.getlist('files[]')
        print(imgDatas)
        for imgData in imgDatas:
            print(imgData)
            # 设置图片要保存到的路径
            path = basedir + "\\frontend\\public\\upload\\img\\"
            # print(path)
            #  获取图片名称及后缀名
            imgName = imgData.filename
            # print(imgName)
            # # 图片path和名称组成图片的保存路径
            imgName=request.headers['user_id']+'_'+imgName
            file_path = path + imgName
            # print(file_path)
            # # 保存图片
            imgData.save(file_path)
            sql = "insert into imgs values(null,'{imgname}','{userid}','{imgurl}')"
            sql = sql.format(imgname=imgData.filename,userid=request.headers['user_id'],imgurl=imgName)
            print(sql)
            cursor.execute(sql)
            db.commit()
            
        return "1"

@app.route('/myimg', methods=['GET','POST'])
def get_img():
    if request.method == 'POST':
        data = json.loads(request.get_data(as_text=True))
        print(data)
        print(data['user_id'])
        cursor = db.cursor()
        sql = "select * from imgs where userid='%d'" % data["user_id"]
        cursor.execute(sql)
        myimgs = cursor.fetchall()
        print(myimgs)
        res = []
        for i in range(len(myimgs)):
            res.append({'id':myimgs[i][0],'name':myimgs[i][1],'url':myimgs[i][3]})
        msg = {
            'imgList' : res
        }
        return jsonify(msg)
@app.route('/alltask', methods=['GET','POST'])
def get_task():
    if request.method == 'POST':
        
        data = json.loads(request.get_data(as_text=True))
        cursor = db.cursor()
        print("hahhahha")
        print(data['user_id'])
        # return '1'
        # if data['user_id']:    
        #     sql = "select * from tasks where creater='%d'" % data["user_id"]
        # else: 
        sql = "select * from tasks "
        cursor.execute(sql)
        mytasks = cursor.fetchall()
        print(mytasks)
        res = []
        for i in range(len(mytasks)):
            sql="select imgurl from imgs where imgid='%s'" % mytasks[i][7]
            cursor.execute(sql)
            coverurl = cursor.fetchone()
            print(coverurl)
            res.append({'id':mytasks[i][0],'name':mytasks[i][1],'info':mytasks[i][2],'state':mytasks[i][6],'coverimgurl':coverurl[0]})
        msg = {
            'taskList' : res
        }
        return jsonify(msg)

@app.route('/mytask', methods=['GET','POST'])
def get_my_task():
    if request.method == 'POST':
        
        data = json.loads(request.get_data(as_text=True))
        cursor = db.cursor()
        print("hahhahha")
        print(data['user_id'])
        # return '1'
        # if data['user_id']:    
        sql = "select * from tasks where creater='%d'" % data["user_id"]
        # else: 
        #     sql = "select * from tasks "
        cursor.execute(sql)
        mytasks = cursor.fetchall()
        print(mytasks)
        res1 = []
        for i in range(len(mytasks)):
            sql="select imgurl from imgs where imgid='%s'" % mytasks[i][7]
            cursor.execute(sql)
            coverurl = cursor.fetchone()
            print(coverurl)
            res1.append({'id':mytasks[i][0],'name':mytasks[i][1],'info':mytasks[i][2],'state':mytasks[i][6],'coverimgurl':coverurl[0]})
        sql = "select * from tasks where labeler='%d'" % data["user_id"]
        # else: 
        #     sql = "select * from tasks "
        cursor.execute(sql)
        mytasks = cursor.fetchall()
        print(mytasks)
        res2 = []
        for i in range(len(mytasks)):
            sql="select imgurl from imgs where imgid='%s'" % mytasks[i][7]
            cursor.execute(sql)
            coverurl = cursor.fetchone()
            print(coverurl)
            res2.append({'id':mytasks[i][0],'name':mytasks[i][1],'info':mytasks[i][2],'state':mytasks[i][6],'coverimgurl':coverurl[0]})
        
        sql = "select * from tasks where reviewer='%d'" % data["user_id"]
        # else: 
        #     sql = "select * from tasks "
        cursor.execute(sql)
        mytasks = cursor.fetchall()
        print(mytasks)
        res3 = []
        for i in range(len(mytasks)):
            sql="select imgurl from imgs where imgid='%s'" % mytasks[i][7]
            cursor.execute(sql)
            coverurl = cursor.fetchone()
            print(coverurl)
            res3.append({'id':mytasks[i][0],'name':mytasks[i][1],'info':mytasks[i][2],'state':mytasks[i][6],'coverimgurl':coverurl[0]})
        
        
        
        msg = {
            'CreateTask' : res1,
            'LabelTask':res2,
            'ReviewTask':res3
        }
        return jsonify(msg)

@app.route('/create', methods=['GET','POST'])
def create_task():
    if request.method == 'POST':
        data = json.loads(request.get_data(as_text=True))
        print(data)
        cursor = db.cursor()
        sql = "select * from tasks where taskname='%s'" % data["task_name"]
        print(sql)
        cursor.execute(sql)
        if cursor.fetchall():
            return {'code': 0,'error':"任务名已存在"}
        sql = "insert into tasks values(null,'{taskname}','{taskintro}','{userid}',null,null,'0','{coverid}')"
        sql = sql.format(taskname=data["task_name"],taskintro=data["taks_intro"],userid=request.headers['user_id'],coverid=data["imglist"][0])
        cursor.execute(sql)
        db.commit()
        sql = "select taskid from tasks where taskname='%s'" % data["task_name"]
        cursor.execute(sql)
        thistaskid = cursor.fetchone()
        print(thistaskid[0])
        for oneimgid in data["imglist"]:
            print(oneimgid)
            sql = "insert into taskhasimgs values(null,'{taskid}','{imgid}')"
            sql = sql.format(taskid=thistaskid[0],imgid=oneimgid)
            print(sql)
            cursor.execute(sql)
            db.commit()
        return "1"

if __name__ == '__main__':
    app.run('127.0.0.1', port=5000, debug=True)
