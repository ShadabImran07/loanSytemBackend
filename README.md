# loanSytemBackend
base url-htpp://localhost:5000
## Endpoints

- `POST /api/register`
  - Registers a new customer.

- `POST /api/check-eligibility`
  - Checks the eligibility of a customer for a loan based on certain criteria.

- `POST /api/create-loan`
  - Creates a new loan for a customer.

- `GET /api/view-loan/:loan_id`
  - Retrieves details of a specific loan by loan ID.

- `POST /api/make-payment/:customer_id/:loan_id`
  - Allows a customer to make a payment towards a specific loan.

- `GET /api/view-statement/:customer_id/:loan_id`
  - Views payment statement for a specific customer and loan.
## Usage

- Install Docker if not already installed.
- Navigate to the project directory in your terminal.
- Run the following command to start the Docker container:
  ```bash
  docker-compose up

  npx prisma migrate dev

  
