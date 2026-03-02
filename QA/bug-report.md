# Department Calendar - QA Bug Log

-----------------------------------------
Testing ID: T_001
Module: Authentication checking
Date: 2026-03-02

Steps to Reproduce:
1. Enter valid email
2. Enter valid password
3. Click login button

Expected Result:
User should be redirected to dashboard.
-----------------------------------------

-----------------------------------------

Bug ID: BUG_001
Module: Student Dashboard
Type: Frontend 
Date: 2026-03-02
Reported By: Kisothana (QA)

Title:
"New" button visible for Student role

Description:
According to system design, students should not have permission to add new events.
However, when logged in as a Student, the "+ New" button is visible on the dashboard.

Steps to Reproduce:
1. Login as Student user
2. Navigate to Dashboard
3. Observe top right corner

Expected Result:
The "+ New" button should NOT be visible for Student role.

Actual Result:
The "+ New" button is visible.

Severity:
Medium

Status:
Open

Comments:
Need clarification from frontend team whether students are allowed to create events.
-----------------------------------------

-----------------------------------------

Bug ID: BUG_002
Module: HOD Dashboard
Type: Role-Based UI / Functional Issue
Date: 2026-03-02
Reported By: Kisothana (QA)

Title:
HOD dashboard not matching approved design

Description:
According to the approved UI design, the Head of Department (HOD) should have a dedicated Approval Dashboard with:
- Pending Event Approvals
- Approve/Reject buttons
- Approval statistics summary

However, when logged in as HOD, the system displays the standard user dashboard instead of the Approval Dashboard.

Steps to Reproduce:
1. Login as HOD user
2. Navigate to Dashboard

Expected Result:
System should display HOD Approval Dashboard with pending approvals and action buttons.

Actual Result:
System displays regular dashboard layout similar to student view.

Severity:
High

Status:
Open

Comments:
Design reference shared with development team. Needs clarification whether HOD dashboard is implemented.
-----------------------------------------

-----------------------------------------

Bug ID: BUG_003
Module: Role-Based Dashboard (TO)
Type: Role-Based UI / Functional Issue
Date: 2026-03-02
Reported By: Kisothana (QA)

Title:
Technical Officer (TO) dashboard not matching approved design

Description:
According to the approved UI design, the Technical Officer (TO) should have a dedicated Lab Management Dashboard with:
- Lab Sessions Calendar
- Equipment Management
- Student Directory
- Reports
- Alerts & Messages

However, when logged in as TO, the system displays the generic dashboard layout (similar to student view) instead of the designed TO dashboard.

Steps to Reproduce:
1. Login as Technical Officer
2. Navigate to Dashboard

Expected Result:
System should display TO Lab Management Dashboard as per approved design.

Actual Result:
System displays standard dashboard layout.

Severity:
High

Status:
Open

Comments:
Design reference provided to development team. Role-based routing or UI rendering may not be implemented.
-----------------------------------------

-----------------------------------------

Bug ID: BUG_004
Module: Forgot Password – Email Verification
Type: Backend / Email Service Issue
Date: 2026-03-02
Reported By: Kisothana (QA)

Title:
Verification code email not received after clicking "Send Code"

Description:
When entering a registered email address and clicking the "Send Code" button on the Forgot Password page, the system redirects to the verification code page. However, no verification email is received in the inbox.

Steps to Reproduce:
1. Navigate to Login page
2. Click "Forgot Password"
3. Enter registered email (e.g., kisothanabala@gmail.com)
4. Click "Send Code"
5. Check inbox and spam folder

Expected Result:
A 4-digit verification code should be sent to the registered email address.

Actual Result:
No email received in inbox or spam folder.

Severity:
High

Status:
Open

Comments:
Possible issue with SMTP configuration or email service integration. Backend console logs should be checked.
-----------------------------------------

-----------------------------------------

Bug ID: BUG_005
Module: Footer Navigation Links
Type: UI / Routing Issue
Date: 2026-03-02
Reported By: Kisothana (QA)

Title:
Footer links redirect to login page instead of respective pages

Description:
When clicking on the footer links:
- Privacy Policy
- Terms of Service
- Consent Preferences

The system redirects to the Login page instead of opening the corresponding content pages.

Steps to Reproduce:
1. Navigate to Forgot Password page
2. Scroll to footer
3. Click on Privacy Policy (or other footer links)

Expected Result:
Each link should open its respective informational page.

Actual Result:
System redirects to Login page.

Severity:
Medium

Status:
Open

Comments:
Footer routes may be incorrectly configured or protected by authentication middleware.
-----------------------------------------

-----------------------------------------

Bug ID: BUG_006
Module: User Registration
Type: Functional / Role Management Issue
Date: 2026-03-02
Reported By: Kisothana (QA)

Title:
All new registrations are automatically assigned STUDENT role

Description:
When creating a new account using the Sign Up page, the system automatically assigns the STUDENT role. There is no option to select or assign other roles such as HOD, Lecturer, or Technical Officer.

Steps to Reproduce:
1. Navigate to Sign Up page
2. Enter required details
3. Click "Sign Up"
4. Check database role column

Expected Result:
System should allow appropriate role assignment based on requirements (either role selection or admin-controlled role creation).

Actual Result:
All new users are assigned STUDENT role by default.

Severity:
Medium

Status:
Open

Comments:
Clarification needed whether only students are allowed to self-register.
-----------------------------------------