# Deployment Guide: Node.js Backend with MongoDB on Google Compute Engine (GCE)

This document explains how to set up and deploy a **Node.js backend with MongoDB** on **Google Compute Engine (GCE)** using **GitHub Actions for CI/CD**.

---

## **1. Overview**
You have successfully deployed a **Node.js** backend with **MongoDB** on GCE, with a **CI/CD pipeline** that automates deployment using **GitHub Actions**. 
This guide walks through the steps required to set up a similar environment.

---

## **2. Prerequisites**
Before starting, ensure you have:
- A **Google Cloud Platform (GCP) account**
- A **GitHub repository** containing your Node.js project
- SSH access to a Compute Engine instance
- A registered **domain name** (optional, for HTTPS setup)

---

## **3. Setting Up the Compute Engine VM**

### **Step 1: Create a Compute Engine Instance**
1. Go to **Google Cloud Console** → **Compute Engine** → **VM Instances**.
2. Click **"Create Instance"**.
3. Set up the instance:
   - **Name:** `nodejs-backend`
   - **Region:** Choose a preferred region.
   - **Machine type:** `e2-micro` (for minimal resources) or `e2-small`
   - **Boot disk:** Click "Change" and select **Ubuntu 22.04 LTS** or **Debian**.
   - **Firewall:** Check ✅ "Allow HTTP & HTTPS traffic".
4. Click **Create**.

### **Step 2: SSH Into the Instance and Install Dependencies**
Once the VM is created, click **SSH** to connect.

#### **Install Node.js and MongoDB**
```sh
sudo apt update && sudo apt upgrade -y
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs
sudo apt install -y mongodb
```

#### **Start and Enable MongoDB**
```sh
sudo systemctl start mongodb
sudo systemctl enable mongodb
```

#### **Install PM2 for Process Management**
```sh
npm install -g pm2
```

---

## **4. Deploying the Node.js Backend**
### **Step 1: Clone Your Repository**
```sh
git clone <your-repo-url>
cd <your-project-folder>
```

### **Step 2: Install Dependencies**
```sh
yarn install  # Or npm install
```

### **Step 3: Set Up Environment Variables**
Create a `.env` file:
```sh
touch .env
nano .env
```
Add:
```
PORT=3000
MONGO_URI=mongodb://localhost:27017/mydb
```
Save the file (`CTRL + X`, then `Y`, then `Enter`).

### **Step 4: Start the Application**
```sh
pm start  # Or use PM2 for production mode:
pm2 start server.js --name myapp
pm2 save
pm2 startup
```

---

## **5. Setting Up CI/CD with GitHub Actions**

### **Step 1: Enable Google Cloud APIs**
In **Google Cloud Console** → **APIs & Services** → **Library**, enable:
- **Compute Engine API**
- **Cloud Build API**
- **Secret Manager API**

### **Step 2: Create a Service Account for GitHub Actions**
1. **Go to** `IAM & Admin` → `Service Accounts`.
2. Click **Create Service Account**.
3. Name it `github-deploy`.
4. Assign these roles:
   - **Compute Admin**
   - **Service Account User**
5. Generate a **JSON key**:
   - Go to the "Keys" tab → Click **"Add Key"** → **Create JSON Key**.
   - Save the **key.json** file.

### **Step 3: Store Secrets in GitHub**
In **GitHub Repository** → **Settings** → **Secrets & Variables** → **Actions**, add:
| Secret Name          | Value                                   |
|----------------------|----------------------------------------|
| `GCP_SERVICE_ACCOUNT` | Paste JSON contents of `key.json`     |
| `GCE_IP`            | External IP of Compute Engine VM      |
| `GCE_USER`          | SSH username (default: `ubuntu`)      |
| `GCE_SSH_KEY`       | Private SSH key (`~/.ssh/id_rsa`)      |

### **Step 4: Create GitHub Actions Workflow**
Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to GCE

on:
  push:
    branches:
      - main

jobs:
  deploy:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout code
        uses: actions/checkout@v3

      - name: Authenticate with Google Cloud
        uses: google-github-actions/auth@v1
        with:
          credentials_json: ${{ secrets.GCP_SERVICE_ACCOUNT }}

      - name: Deploy to GCE via SSH
        uses: appleboy/ssh-action@master
        with:
          host: ${{ secrets.GCE_IP }}
          username: ${{ secrets.GCE_USER }}
          key: ${{ secrets.GCE_SSH_KEY }}
          script: |
            cd /home/${{ secrets.GCE_USER }}/motus-users-ms
            git pull origin main

            yarn install
            yarn build
            pm2 restart all
```

### **Step 5: Test CI/CD Pipeline**
Commit and push changes to trigger the pipeline:
```sh
git add .github/workflows/deploy.yml
git commit -m "Setup GitHub Actions CI/CD"
git push origin main
```

Verify the deployment in **GitHub Actions → Actions tab**.

---

## **6. Verify the Deployment**
### **Check if the app is running:**
```sh
ssh -i ~/.ssh/id_rsa <your-user>@<your-gce-ip>
pm2 logs
```
### **Access the API**
Open:
```
http://<YOUR_GCE_IP>:3000
```

---

## **7. (Optional) Set Up a Domain & SSL**
For a domain with **NGINX & Let’s Encrypt**:
```sh
sudo apt install nginx -y
sudo certbot --nginx -d yourdomain.com
```
Your API will be accessible at:
```
https://yourdomain.com
```

---

## **🎉 Your Deployment is Complete!**
Your **CI/CD pipeline** is now fully set up! 🚀 Let me know if you need further refinements. 😊
