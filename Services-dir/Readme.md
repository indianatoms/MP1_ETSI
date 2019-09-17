# EasyNotes Application

Build a Restful CRUD API for a simple Note-Taking application using Node.js, Express and MongoDB.

## Steps to Setup

1. Install dependencies

```bash
npm install
```

2. Run Server

```bash
node server.js

```Create a /etc/yum.repos.d/mongodb-org-4.2.repo file so that you can install MongoDB directly using yum:
sudo vim /etc/yum.repos.d/mongodb-org-4.2.repo
```Insert there 
[mongodb-org-4.2]
name=MongoDB Repository
baseurl=https://repo.mongodb.org/yum/redhat/$releasever/mongodb-org/4.2/x86_64/
gpgcheck=1
enabled=1
gpgkey=https://www.mongodb.org/static/pgp/server-4.2.asc
```bash
sudo yum install -y mongodb-org
sudo yum install -y mongodb-org-4.2.0 mongodb-org-server-4.2.0 mongodb-org-shell-4.2.0 mongodb-org-mongos-4.2.0 mongodb-org-tools-4.2.0
```

You can browse the apis at <http://localhost:3000>

## Tutorial
You can find the tutorial for this application at [The CalliCoder Blog](https://www.callicoder.com) - 

<https://www.callicoder.com/node-js-express-mongodb-restful-crud-api-tutorial/>