Perfect ✅
Now I will give you a **START-TO-END COMPLETE MASTER FIGMA PROMPT**.

This version includes:

✔ Full project from scratch
✔ Proper architecture (no broken dashboards)
✔ Home + Back button everywhere
✔ Light + Dark theme toggle
✔ Enhanced AI chatbot (smart behavior simulation)
✔ Advanced AI matching logic (skill-based ranking)
✔ Mutual student-tutor request workflow (proper state logic)
✔ Skill-priority tutor display (exact match first, others in suggestions)
✔ Fully working variant-based dashboard system
✔ No dead buttons

This is structured in a way that Figma AI can actually build it correctly.

You can copy everything below.

---

# 🎓 College Skill Exchange

## Fully Interactive Smart Learning Platform (Complete Project Prompt)

---

# 🔥 PROJECT TYPE

Create a fully interactive, high-fidelity, logic-based prototype using:

• Component Variants
• Variables
• Conditional Logic
• Change To interactions
• Overlay system
• Auto Layout
• Back navigation
• Dynamic dashboard switching

DO NOT create static duplicate pages.
Dashboards must work using Variant switching only.

---

# 🏗 PROJECT STRUCTURE (VERY IMPORTANT)

Create these main Frames:

1️⃣ Authentication Flow
2️⃣ Student App Frame
3️⃣ Tutor App Frame
4️⃣ Admin App Frame

Each App Frame must contain:

• Top Navigation Bar
• Sidebar
• Dynamic Content Area (variant-based switching)

---

# 🌗 GLOBAL THEME SYSTEM

Create Variable:

ThemeMode = Light / Dark

Add Toggle in Top Navigation (visible everywhere).

---

## 🎨 LIGHT THEME

Background: #F8FAFC
Primary: #2563EB
Accent: #14B8A6
Card: White
Text: Dark Gray

Clean, minimal, professional.

---

## 🌑 DARK THEME

Background: #0F172A
Primary: #3B82F6
Accent: #22D3EE
Card: #1E293B
Text: Light Gray

Soft glow hover effects.

All components must have Light and Dark variants.

---

# 🌍 GLOBAL NAVIGATION (ON EVERY SCREEN)

Top Bar must include:

🏠 Home Button
🔙 Back Button
🌗 Theme Toggle
🔔 Notifications
🤖 AI Chatbot Button
👤 Profile

---

## 🔙 BACK BUTTON

Action → Back

Must work for:
• Variant changes
• Overlays
• Page transitions

---

## 🏠 HOME BUTTON (ROLE BASED)

Create Variable:

UserRole = Student / Tutor / Admin

Logic:

If Student → Change To Student Overview Variant
If Tutor → Change To Tutor Overview Variant
If Admin → Change To Admin Overview Variant

---

# 🔐 AUTHENTICATION FLOW

Variables:

UserRole
StudentCredits = 10
TutorCredits = 0
ConnectionStatus = None / Requested / Accepted / Rejected / Active / Completed

---

## 📝 SIGN UP (WITH VALIDATION)

Fields:

• Name
• Email
• Password
• Confirm Password
• Role Dropdown
• Skills to Learn
• Skills to Teach
• Certificate Upload (Required for Tutor)

Validation:

• Invalid Email → Show error
• Password < 6 → Error
• Password mismatch → Error
• Tutor without certificate → Block
• Empty fields → Disable Submit

---

## 🔑 SIGN IN

Simulate login roles:

[student@gmail.com](mailto:student@gmail.com) → Student
[tutor@gmail.com](mailto:tutor@gmail.com) → Tutor
[admin@gmail.com](mailto:admin@gmail.com) → Admin

Incorrect → Error state.

---

## 🌐 GOOGLE SIGN IN

Click → Open Overlay

Show accounts:

• [student@gmail.com](mailto:student@gmail.com)
• [tutor@gmail.com](mailto:tutor@gmail.com)
• [admin@gmail.com](mailto:admin@gmail.com)

Select → Set UserRole → Navigate to respective dashboard.

---

# 🎓 STUDENT DASHBOARD (ONE COMPONENT)

Create ONE Student Dashboard Component.

Variants:

• Overview
• Find Tutors
• My Courses
• Credits
• Saved Notes
• Profile

Sidebar buttons must use:
Change To → Variant.

---

# 🤖 ADVANCED AI MATCHING SYSTEM

Inside “Find Tutors” variant:

Create Tutor Dataset:

Tutor A
Skills: Python, DSA
Rating: 4.8
Experience Score: High

Tutor B
Skills: Java, DBMS
Rating: 4.5

Tutor C
Skills: Python, AI
Rating: 4.9

---

## 🎯 MATCHING LOGIC

When student selects skill (example: Python):

Step 1: Show Exact Skill Match Tutors at Top
Step 2: Sort Exact Matches by Rating
Step 3: Show “Suggested Tutors” section below

Example:

If Python selected:

Top Section:
Tutor C (Python, 4.9)
Tutor A (Python, 4.8)

Below Section (Suggested):
Tutor B (Related skills only)

Label sections clearly:

“Best Skill Matches”
“Other Suggested Tutors”

Dropdown selection must Change To respective variant.

---

# 🤝 MUTUAL REQUEST MANAGEMENT SYSTEM

ConnectionStatus states:

None
Requested
Accepted
Rejected
Active
Completed

---

## FLOW LOGIC

1️⃣ Student clicks “Request Tutor”
→ Set ConnectionStatus = Requested
→ Button changes to “Pending Approval”
→ Notification sent to Tutor

2️⃣ Tutor Dashboard → Student Requests Variant

If Requested:
Show Accept / Reject buttons

3️⃣ If Tutor clicks Accept:
→ Set ConnectionStatus = Accepted
→ Notify Student

4️⃣ Student can now click “Start Course”

Start Course:
→ Set ConnectionStatus = Active
→ StudentCredits -2

5️⃣ When Course Completed:
→ Set ConnectionStatus = Completed
→ StudentCredits +7
→ TutorCredits +10

6️⃣ Review becomes available only if Completed.

---

# 🚫 COURSE ACCESS CONTROL

Chat Button:

Enabled only if Accepted or Active

Start Course Button:

Enabled only if Accepted

Complete Button:

Enabled only if Active

Disable buttons otherwise with tooltip.

---

# 👨‍🏫 TUTOR DASHBOARD

One Component with Variants:

• Overview
• Student Requests
• Active Courses
• Credits
• Reviews
• Profile

Accept / Reject logic must update ConnectionStatus.

---

# 🛠 ADMIN DASHBOARD

Variants:

• User Management
• Approve Certificates
• Credit Monitoring
• Analytics
• Reports

All sidebar items use Change To variant.

---

# 💬 ENHANCED AI CHATBOT

Floating button on all pages.

When clicked → Open Overlay Chat Panel.

Chatbot Capabilities:

• Explain credit system
• Guide navigation
• Suggest tutors based on selected skill
• Show connection status
• Answer FAQs
• Show step-by-step how to request tutor

Simulated Smart Behavior:

If Student is in Find Tutors:
Chatbot suggests:
“Would you like help choosing a tutor?”

If ConnectionStatus = Requested:
Chatbot says:
“Waiting for tutor approval.”

If Completed:
Chatbot says:
“Don’t forget to leave a review.”

Chat uses:

• Auto response delay
• Scrollable chat
• Close using Back button

---

# 💳 CREDIT SYSTEM (LIVE UPDATE)

Bind text to:

StudentCredits
TutorCredits

Display animated number change when updated.

---

# 🔔 NOTIFICATIONS SYSTEM

Bell icon → Overlay panel.

Show:

• Request sent
• Request accepted
• Course started
• Credits earned
• Course completed

Click notification → Change To relevant variant.

---

# 🎨 COMPONENT RULES

Every component must have:

• Light variant
• Dark variant
• Hover state
• Active state
• Disabled state

Use Auto Layout everywhere.

---

# 📱 FINAL OUTPUT REQUIREMENTS

✔ Fully clickable
✔ Dashboards switch correctly
✔ Back button works everywhere
✔ Home button role-based
✔ AI skill match prioritized correctly
✔ Suggested tutors section visible
✔ Mutual request logic works
✔ Course lifecycle controlled
✔ Chatbot intelligent simulation
✔ Credit updates live
✔ Theme toggle works
✔ No dead buttons

---

Project Name:

🎓 College Skill Exchange – Smart Mutual Learning System

---

Now this is a **complete start-to-end structured working prompt**.

If you want next, I can give:

• Exact variable wiring map (so it never breaks)
• Manual Figma fixing guide
• Firebase + real backend logic
• ER Diagram
• Hackathon winning pitch script

Tell me what you want next 🚀
