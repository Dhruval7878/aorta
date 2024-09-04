# College Dating App

## Introduction
This project facilitates dating among students within a specific college or school community. It allows students from a college (e.g., College Z) to register using their institutional email addresses (e.g., abc@xyz.edu.in). The platform identifies the college/school based on the domain name (xyz.edu.in) extracted from the email address.

If the domain isn't already in the database, a new node is created for that college/school, connecting all students with the same domain. This setup enables users to interact and view profiles of others within their college/school community.

The platform's matching algorithm considers each user's preferences and the preferences of others to curate personalized feeds. Users can manage their profile details, including gender and preferences, by visiting the /profile page.

## Prerequisites
- Node.js (https://nodejs.org/)
- npm (comes with Node.js) or yarn (https://yarnpkg.com/)

## Setting Up the Project

### Step 1: Clone the Repository
Open the terminal on Windows by pressing `Win + R`, then typing `cmd.exe`, and pressing Enter. In the terminal, run:
```sh
git clone https://github.com/Dhruval7878/college-date.git
cd college-dating
code .
```
### Step 2: Install Dependencies
In the integrated terminal of your code editor:
`npm i`

### Step 3: Set Up Environment Variables
Copy the contents of sample.env to a new file named .env and fill in your credentials for Clerk and Neo4j. Get your credentials from the following links:
- https://clerk.com/
- https://neo4j.com/

### Step 4: Start the Project
Run the following command in the terminal:
`npm run dev`
This should start the project.


## Step-by-Step Setup Using Docker
### Step 1: Clone the Repository
Open the terminal or command prompt on your system:

```sh
git clone https://github.com/Dhruval7878/college-date.git
cd college-date
```

### Step 2: Create .env File
Create a .env file in the root of your project directory and add your credentials for Kinde and Neo4j as described earlier.

### Step 3: Build Docker Image
In the terminal, navigate to your project directory (where your Dockerfile is located) and build the Docker image:

```sh
docker build -t college-dating .
```

### Step 4: Run Docker Container
Once the image is built, you can run a Docker container based on this image:

```sh
docker run -p 3000:3000 -d --env-file .env college-dating-app
```
college-dating is the name of the Docker image you built earlier.

### Step 5: Access Your Application
Open your web browser and navigate to http://localhost:3000 to access your application running inside the Docker container.

## Technologies

Authentication and Database Setup
This project uses clerk for authentication and Neo4j for the database. Make sure you have your credentials set up as described above.

Components and Libraries Used
Next.js (TypeScript + Tailwind CSS): For building the user interface.
clerk: For authentication.
ShadCN: As the component library.
Neo4j: As the database.

Troubleshooting and Issues
If you encounter any issues or need to request changes, feel free to open an issue in the repository.

Happy Coding!