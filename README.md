# Product Admin Dashboard



A small admin dashboard to manage products, built with Next.js, React, Tailwind CSS, and Axios, using the DummyJSON API.



## Setup



1. Clone this repo

2. Install dependencies: npm install

3. Run the development server: npm run dev

4. Open http://localhost:3000 in your browser

5. Login with username: emilys, password: emilyspass



## What's completed



- Login page with error handling and protection against duplicate submits

- Route protection (middleware) - only logged-in users can access /products

- Logout button

- Product list with responsive table (desktop) / cards (mobile)

- Pagination with page numbers, Previous/Next, page size selector (10/20/50), and Showing X-Y of Z text

- Debounced search (waits until typing stops before calling the API)

- Category filter and sort by price/rating/title

- Product details page with images, description, and reviews

- Not found page for invalid product IDs

- Add and edit product forms with validation

- Delete with a confirmation popup

- Loading, empty, and error (with Retry) states

- All page/search/filter/sort state kept in the URL

- A single shared Axios instance with request/response interceptors

- Race-condition-safe search (using AbortController)

- Protection against multiple rapid submits on Login and Save buttons



## Notes



See NOTES.md for design decisions, a problem I faced, and where AI helped.

