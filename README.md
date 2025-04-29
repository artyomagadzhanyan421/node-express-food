# BiteBook

Server side for culinary application using Node.js (Express) and MongoDB for people who want to check out unique and interesting recipes. This application was completed as a freelance project for a small local business in the catering industry.

![node.js](https://img.shields.io/badge/node-v20.16.0-green?style=flat)
![express](https://img.shields.io/badge/express-^5.1.0-orange?style=flat)
![mongoose](https://img.shields.io/badge/mongoose-^8.13.2-green?style=flat)

### How does it work?

* JWT based authentication system with automatic log out
* Role orriented structure (user and admin)
* Full CRUD functionality for an admin (create, trash and edit recipes)
* Ability to rate (like or dislike) and save prefered recipes
* [Cloudinary](https://cloudinary.com/) for cloud storage (image files)

### Installation

> [!IMPORTANT]  
> Make sure you've installed the latest version of [Git](https://git-scm.com/) on your machine already!

Open your terminal and clone this repository:

```bash
git clone https://github.com/artyomagadzhanyan421/node-express-food.git
```

Navigate to the project directory:

```bash
cd node-express-food
```

Install dependencies:

```bash
npm install
```

### MongoDB

We use MongoDB to store data for users, recipes, and tokens

#### 1. Create a MongoDB account

If you don't already have one, create a free account at https://www.mongodb.com/cloud

#### 2. Create a cluster

* After logging in, go to **Database** > **Build a Database**
* Choose the free-tier (Shared Cluster)
* Select your cloud provider and region
* Click **Create Cluster**

#### 3. Create the database and collections

Once your cluster is ready:

* Go to **Collections**
* Click **Create Database**
* Database name: ```database```
* Collections: ```users```, ```recipes```, ```tokens```

#### 4. Get Your MongoDB URI

* Go to **Database Access** and create a user with a username and password
* Then go to **Network Access** and allow access from your IP or anywhere
* Click **Connect** > **Connect Your Application** and copy the connection URI

Example format:

```env
mongodb+srv://<username>:<password>@<cluster_name>.r5pdghm.mongodb.net/<database_name>
```

Create your ```.env``` file, add variable as need:

```env
MONGO_URI=mongodb+srv://<username>:<password>@<cluster_name>.r5pdghm.mongodb.net/<database_name>
```

### Cloudinary

We use Cloudinary to store and serve uploaded images (e.g., recipe pictures)

#### 1. Create a Cloudinary account

Sign up at https://cloudinary.com/

#### 2. Get your Cloudinary credentials

After logging in:

* Go to the **Dashboard**
* Copy the following: ```Cloud name```, ```API Key```, ```API Secret```

#### 3. Add Cloudinary

```env
MONGO_URI=mongodb+srv://<username>:<password>@<cluster_name>.r5pdghm.mongodb.net/<database_name>

CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
```