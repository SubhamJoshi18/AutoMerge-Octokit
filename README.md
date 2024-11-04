# Code Reviewer and Auto-Merge System

This project is an automated code review and merging system designed to streamline the code review process. Leveraging multiple microservices, it efficiently analyzes code, provides feedback, and merges approved code into GitHub.


# Features

1) Automated Code Review: Reviews code changes using custom logic and pre-set rules.
2) Automatic Merging: Merges code automatically if it meets specified quality criteria.
3) Queue Management: Uses RabbitMQ to manage requests for code review and merging.
4) Scalability: Built on Docker, enabling easy scaling and deployment.
5) Data Storage: Utilizes MongoDB for storing code review data and Redis for caching.


# Tech Stack

Backend Services:
 
Node.js and Python microservices for handling code review and merging logic using Octokit.


Message Queue: 

RabbitMQ to handle asynchronous tasks and communication between microservices.

Database:
MongoDB for persistent data storage.

Cache:
Redis for efficient data caching and faster processing.

Containerization:
Docker to package services and dependencies for smooth deployment.


# Prerequisites

1) Docker and Docker Compose
2) Node.js and Python for local development
3) RabbitMQ, MongoDB, and Redis

