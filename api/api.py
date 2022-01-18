from flask import Flask, jsonify
from flask_restful import Api, Resource, reqparse, abort, fields, marshal_with
from flask_sqlalchemy import SQLAlchemy
from flask_marshmallow import Marshmallow
from flask_cors import CORS, cross_origin

app = Flask(__name__)
CORS(app)
api = Api(app)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///database.db'
db = SQLAlchemy(app)
ma = Marshmallow(app)

def my_bool(s):
    return str(s) != 'False'

class TaskModel(db.Model):
    id = db.Column(db.Integer, primary_key = True)
    text = db.Column(db.String(100), nullable = False)
    day = db.Column(db.String(100), nullable = False)
    reminder = db.Column(db.Boolean, nullable = False)

    def __repr__(self):
        return f"Task(text = {self.text}, day = {self.day}, reminder = {self.reminder}"

task_put_args = reqparse.RequestParser()
task_put_args.add_argument("text", type=str, help="Text required", required=True)
task_put_args.add_argument("day", type=str, help="Day required", required=True)
task_put_args.add_argument("reminder", action='store_false', type=my_bool, help="Reminder required", required=True)

task_update_args = reqparse.RequestParser()
task_update_args.add_argument("text", type=str, help="Text required")
task_update_args.add_argument("day", type=str, help="Day required")
task_update_args.add_argument("reminder", action='store_false', type=my_bool, help="Reminder required")

resource_fields = {
    'id': fields.String,
    'text': fields.String,
    'day': fields.String,
    'reminder': fields.Boolean
}

class Task(Resource):
    @marshal_with(resource_fields)    
    def get(self, task_id):
        result = TaskModel.query.filter_by(id=task_id).first()
        result = TaskModel.query.filter_by(id=task_id).first()
        if not result:
            abort(404, message="Task doesn't exist")
        return result

    @marshal_with(resource_fields)
    def put(self, task_id):
        args = task_put_args.parse_args()
        result = TaskModel.query.filter_by(id=task_id).first()
        if result:
            db.session.delete(result)
            db.session.commit()
        task = TaskModel(id=task_id, text=args['text'], day=args['day'], reminder=my_bool(args['reminder']))
        db.session.add(task)
        db.session.commit()
        return task, 201

    # @marshal_with(resource_fields)
    # def patch(self, task_id):
    #     args = task_update_args.parse_args()
    #     print(args['reminder'])
    #     result = TaskModel.query.filter_by(id=task_id).first()
    #     if not result:
    #         abort(404, message="Task doesn't exist")
    #     if args['text']:
    #         result.text = args['text']
    #     if args['day']:
    #         result.day = args['day']
    #     if args['reminder']:
    #         result.reminder = False
    #     print(result.reminder)
    #     db.session.merge(result)
    #     db.session.commit()
    #     return result

    @marshal_with(resource_fields)
    def delete(self, task_id):
        result = TaskModel.query.filter_by(id=task_id).first()
        db.session.delete(result)
        db.session.commit()
        return '', 204

class TaskSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = TaskModel

class Tasks(Resource):
    def get(self):
        tasks = TaskModel.query.all()
        task_schema = TaskSchema(many=True)
        output = task_schema.dump(tasks)
        return jsonify({'task': output})

class Add(Resource):
    @marshal_with(resource_fields)
    def put(self):
        args = task_put_args.parse_args()
        task = TaskModel(text=args['text'], day=args['day'], reminder=my_bool(args['reminder']))
        db.session.add(task)
        db.session.commit()
        return task, 201

api.add_resource(Task, "/api/tasks/<int:task_id>")
api.add_resource(Tasks, "/api/tasks")
api.add_resource(Add, "/api/tasks/add")

if __name__ == '__main__':
    app.run()