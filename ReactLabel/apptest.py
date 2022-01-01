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
     
        msg = {'code': 1}
        return jsonify(msg)

@app.route('/upload', methods=['GET','POST'])
def upload():
    if request.method == 'POST':
        
        
        cursor = db.cursor()
        imgDatas = request.files.getlist('files[]')
       
        for imgData in imgDatas:
            
            # 设置图片要保存到的路径
            path = basedir + "\\frontend\\public\\upload\\img\\"
            
            #  获取图片名称及后缀名
            imgName = imgData.filename
            
            # # 图片path和名称组成图片的保存路径
            imgName=request.headers['user_id']+'_'+imgName
            file_path = path + imgName
            
            # # 保存图片
            imgData.save(file_path)
            sql = "insert into imgs values(null,'{imgname}','{userid}','{imgurl}')"
            sql = sql.format(imgname=imgData.filename,userid=request.headers['user_id'],imgurl=imgName)
           
            cursor.execute(sql)
            db.commit()
            
        return "1"

@app.route('/myimg', methods=['GET','POST'])
def get_img():
    if request.method == 'POST':
        data = json.loads(request.get_data(as_text=True))
        
        cursor = db.cursor()
        sql = "select * from imgs where userid='%d'" % data["user_id"]
        cursor.execute(sql)
        myimgs = cursor.fetchall()
        
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
       
        # return '1'
        # if data['user_id']:    
        #     sql = "select * from tasks where creater='%d'" % data["user_id"]
        # else: 
        sql = "select * from tasks where state<4"#0刚刚发布，可以认领标记，2 刚刚标记结束，可以认领审核
        cursor.execute(sql)
        mytasks = cursor.fetchall()
        
        res = []
        for i in range(len(mytasks)):
            sql="select imgurl from imgs where imgid='%s'" % mytasks[i][7]
            cursor.execute(sql)
            coverurl = cursor.fetchone()
            
            res.append({'id':mytasks[i][0],'name':mytasks[i][1],'info':mytasks[i][2],'state':mytasks[i][6],'coverimgurl':coverurl[0]})
        msg = {
            'taskList' : res
        }
        return jsonify(msg)
@app.route('/taskhasimg', methods=['GET','POST'])
def get_taskhasimg():
    if request.method == 'POST':
        
        data = json.loads(request.get_data(as_text=True))
        cursor = db.cursor()
        
        
        sql = "select imgid from taskhasimgs where taskid='%d'" % data['task_id']
        cursor.execute(sql)
        imgList = cursor.fetchall()
       
        res = []
        for i in range(len(imgList)):
            sql="select *from imgs where imgid='%s'" % imgList[i]
            cursor.execute(sql)
            oneimg = cursor.fetchone()
            
            res.append({'id':oneimg[0],'name':oneimg[1],'url':oneimg[3]})
        msg = {
            'imgList' : res
        }
        return jsonify(msg)


@app.route('/mytask', methods=['GET','POST'])
def get_my_task():
    if request.method == 'POST':
        
        data = json.loads(request.get_data(as_text=True))
        cursor = db.cursor()
        
        # return '1'
        # if data['user_id']:    
        sql = "select * from tasks where creater='%d'" % data["user_id"]
        # else: 
        #     sql = "select * from tasks "
        cursor.execute(sql)
        mytasks = cursor.fetchall()
        
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
        
        res2 = []
        for i in range(len(mytasks)):
            sql="select imgurl from imgs where imgid='%s'" % mytasks[i][7]
            cursor.execute(sql)
            coverurl = cursor.fetchone()
            
            res2.append({'id':mytasks[i][0],'name':mytasks[i][1],'info':mytasks[i][2],'state':mytasks[i][6],'coverimgurl':coverurl[0]})
        
        sql = "select * from tasks where reviewer='%d'" % data["user_id"]
        # else: 
        #     sql = "select * from tasks "
        cursor.execute(sql)
        mytasks = cursor.fetchall()
        
        res3 = []
        for i in range(len(mytasks)):
            sql="select imgurl from imgs where imgid='%s'" % mytasks[i][7]
            cursor.execute(sql)
            coverurl = cursor.fetchone()
            
            res3.append({'id':mytasks[i][0],'name':mytasks[i][1],'info':mytasks[i][2],'state':mytasks[i][6],'coverimgurl':coverurl[0]})
        
        
        
        msg = {
            'CreateTask' : res1,
            'LabelTask':res2,
            'ReviewTask':res3
        }
        return jsonify(msg)

@app.route('/claim', methods=['GET','POST'])
def claim_task():
    if request.method == 'POST':
        
        data = json.loads(request.get_data(as_text=True))
        cursor = db.cursor()
        
           
        if data['type']=="label":
            sql = "UPDATE tasks  SET labeler ='{userid}', state = 1  WHERE taskid='{taskid}'" 
        else:    
            sql = "UPDATE tasks  SET reviewer ='{userid}', state = 3  WHERE taskid='{taskid}'" 
        
        sql = sql.format(taskid=data["task_id"],userid=request.headers['user_id'])
        
        
        cursor.execute(sql)
        db.commit()
        msg = {
            'code' : 1,
            'msg':'认领成功',
        }
        return jsonify(msg)

@app.route('/finishtask', methods=['GET','POST'])
def finish_task():
    if request.method == 'POST':
        
        data = json.loads(request.get_data(as_text=True))
        cursor = db.cursor()
        # sql = "select state from tasks where taskid='%d'" % data["task_id"]
        # cursor.execute(sql)
        # state=cursor.fetchone()

        if data["type"]=="success":
            sql = "UPDATE tasks SET state=state+1 where taskid='%d'" % data["task_id"]
        else:
            sql = "UPDATE tasks SET state=5 where taskid='%d'" % data["task_id"] #不通过，状态
        cursor.execute(sql)
        db.commit()
        msg = {
            'code' : 1,
            'msg':'修改成功',
        }
        return jsonify(msg)
@app.route('/getannotation', methods=['GET','POST'])
def get_anonotation():
    if request.method == 'POST':
        
        data = json.loads(request.get_data(as_text=True))
        cursor = db.cursor()
        print(data)
        
        sql = "SELECT id from taskhasimgs where taskid='{taskid}' and imgid='{imgid}' " 
        sql = sql.format(taskid=data["task_id"],imgid=data["img_id"])
        cursor.execute(sql)
        tmid=cursor.fetchone()
        print(tmid[0])
        
        sql = "SELECT imgurl from  imgs where imgid='{imgid}' " 
        sql = sql.format(imgid=data["img_id"])
        cursor.execute(sql)
        imgurl=cursor.fetchone()

        sql = "SELECT * from annotations where taskimgid='%d'"%tmid[0] 
        
        cursor.execute(sql)
        allanno=cursor.fetchall()
        print(allanno)
        
        data = {
            "imgurl" : imgurl[0],
            "tmid":tmid[0],
            "allanno":allanno
        }
        return jsonify(data)

@app.route('/commitannotation', methods=['GET','POST'])
def commit_anonotation():
    if request.method == 'POST':
        
        data = json.loads(request.get_data(as_text=True))
        print(data)
        cursor = db.cursor()
       
        print(data["tmid"])
        print(data["annos"])
        sql = "delete from annotations where taskimgid='%d'"%data["tmid"]
        cursor.execute(sql)
        db.commit()
        
        for anno in data["annos"]:
            sql = "insert into annotations values(null,'{taskimgid}','{text}','{x}','{y}','{width}','{height}','{type}')"
            sql = sql.format(taskimgid=data["tmid"],text=anno['data']['text'],x=anno['geometry']['x'],y=anno['geometry']['y'],
            width=anno['geometry']['width'],height=anno['geometry']['height'],type=anno['geometry']['type'])
            cursor.execute(sql)
            db.commit()
        data = {
            "code" : 1,
            "msg":'保存成功',
        }
        return jsonify(data)

@app.route('/create', methods=['GET','POST'])
def create_task():
    if request.method == 'POST':
        data = json.loads(request.get_data(as_text=True))
        
        cursor = db.cursor()
        sql = "select * from tasks where taskname='%s'" % data["task_name"]
        
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
        
        for oneimgid in data["imglist"]:
            
            sql = "insert into taskhasimgs values(null,'{taskid}','{imgid}')"
            sql = sql.format(taskid=thistaskid[0],imgid=oneimgid)
            
            cursor.execute(sql)
            db.commit()
        data = {
            "code": 1,
            "msg":'创建成功'     
        }
        return jsonify(data)

if __name__ == '__main__':
    app.run('127.0.0.1', port=5000, debug=True)
