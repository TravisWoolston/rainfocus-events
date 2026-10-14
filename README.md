# RainFocus React Events Application

A React events management application built with Vite, Axios, and React Router to interact with the RainFocus API endpoints.

## Acceptance Criteria & Feature Checklist

- [x] **Event Listing**: Displays event `name`, `description`, and `company`, with theme color badge and action buttons.
- [x] **Add Event Form**: Add new events saving at a minimum `name`, `description`, `company`, `color` (web-safe named colors like red, blue, green, etc.), automatically updating the list upon creation.
- [x] **Delete Event**: Removes an event via `DELETE /events/{id}`, prompts for confirmation, and updates the list after deletion.
- [x] **Error Handling Methodologies**:
  - Global try/catch error normalization covering HTTP status codes (404, 500), network timeouts, and request errors.
  - Interactive red error alert banner with **"Retry Request"** and dismiss controls.
  - **"Simulate API Error"** toggle in the top navbar to easily demonstrate error handling and recovery even when the server is healthy.
- [x] **Sorted by Company Name**: Events are automatically sorted alphabetically by company name (`a.company.localeCompare(b.company)`) immediately after loading from the API, with an option to toggle ascending/descending order.
- [x] **Update Event**: Update an event's `name`, `description`, `company`, `color`, and optional details via `PUT /events/{id}`, updating the local state and preserving sort order.
- [x] **Individual Event View**:
  - **Modal View**: Quick modal view displaying the event's name, description, company, and metadata.
  - **Dedicated Route**: Built with `react-router` at `/events/:id`, fetching the single event independently via `GET /events/{id}`.
- [x] **Input Validation**:
  - Validates required fields: `name` (min 2 chars), `company` (min 2 chars), `description` (min 5 chars), and `color` (web-safe named color).
  - Validates optional email format with regex.
  - Displays inline field errors on blur and on submit.

## API Endpoints Supported

- Default: `https://rf-json-server.herokuapp.com/events/`
- Alternate endpoints selectable in header dropdown: `/events-2/`, `/events-3/`, `/events-4/`, `/events-5/`

## Available Scripts

- `npm install` - Install dependencies
- `npm run dev` - Launch local Vite development server
- `npm run build` - Build production bundle
- `npm run preview` - Preview production build
