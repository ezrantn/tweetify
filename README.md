# Tweetify

Tweetify is a Twitter API clone designed for educational purposes and personal exploration of social media API concepts. It is not affiliated with the official Twitter platform.

## Documentation
Explore the API documentation by visiting `localhost:3000/api/v1/docs`.

To explore my API endpoints and interact with the application, please refer to the [Postman Collection](https://elements.getpostman.com/redirect?entityId=30159941-66bd43d0-3bf5-4c3b-9870-ab2c7147ddda&entityType=collection) provided.

## Tech Stack
- TypeScript
- NodeJS
- ExpressJS
- Prisma
- PostgreSQL
- Docker
- AWS

## Getting Started

Follow these steps to run the project locally:

1. Clone this repository:
   
    ```bash
    git clone https://github.com/ezrantn/tweetify.git
    ```

2. Install dependencies:
   
    ```bash
    npm install
    ```

3. Launch the project in development mode:
   
    ```bash
    npm run dev
    ```

4. Run the migration by:
   
   ```bash
   npx prisma migrate
   ```

5. Access the API documentation at `localhost:3000/api/v1/docs`.

The Docker Way:

1. Run `docker-compose` up to start the Postgres instance:

    ```bash
    docker-compose up
    ```

2. Launch the project in development mode:

   ```bash
   npm run dev
   ```
   
3. Access the API documentation at `localhost:3000/api/v1/docs`.

4. Verify your database connection. The connection string is provided via the `DATABASE_URL` environment variable in the `docker-compose.yml` file.

5. When you are done, you can stop the services by pressing Ctrl+C or:

   ```bash
   docker-compose down
   ```

## Support or Feedback

Your feedback and suggestions are welcome! If you encounter any issues or have ideas for improvements, please open an issue on the [GitHub repository](https://github.com/ezrantn/tweetify).

## License
This project is licensed under the MIT License. See the [LICENSE](https://github.com/ezrantn/tweetify/blob/main/LICENSE) file for details.

*Made with ❤️ by Ezra Natanael*
