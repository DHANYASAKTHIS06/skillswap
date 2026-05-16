Core Requirement:

All data must appear dynamically from database.
No static values. No pre-filled requestors.
Only real-time created student requests should be visible.

🧑‍🏫 Tutor Dashboard – Requests Page

Create a page titled:

“Incoming Skill Requests”

UI Requirements:

Display request cards ONLY if:

A student has sent a request

The request is assigned to that specific logged-in tutor

If no requests exist:

Show a clean empty state illustration

Message: “No new requests yet”

📩 Request Card Design (Dynamic Layout)

Each request card should contain:

Student Name

Student Year (dynamic input field — no fixed year like 1st/2nd/3rd)

Skill Requested

Message from Student

Accept Button

Decline Button

Design should support:

Dynamic list rendering

Auto-refresh state

Loading spinner while fetching data

🎓 Student Request Form (Dynamic Only)

Create a request form with:

Select Tutor (Dropdown populated dynamically)

Skill

Year (Free input field – no predefined options)

Message

Submit Button:
“Send Request”

🚫 Important Design Rules:

No default tutor cards

No hardcoded year values

No placeholder request data

Everything must visually look API-driven

🎨 Style:

Clean SaaS style

Soft card shadows

Indigo primary theme

Clear status indicators (Pending / Accepted / Declined)