# HABIT TRACKER APPLICATION DOCUMENTATION

## TABLE OF CONTENTS

1. [Introduction](#introduction)
   - [Introduction of Project](#introduction-of-project)
   - [Existing System and Need for System](#existing-system-and-need-for-system)
   - [Scope of Work](#scope-of-work)
   - [Operating Environment - Hardware and Software](#operating-environment---hardware-and-software)
   - [Detail Description of Technology Used](#detail-description-of-technology-used)
2. [Proposed Systems](#proposed-systems)
   - [Objectives of System](#objectives-of-system)
   - [Proposed System](#proposed-system)
   - [User Requirements](#user-requirements)
3. [Analysis and Design](#analysis-and-design)
   - [Data Flow Diagram (DFD)](#data-flow-diagram-dfd)
   - [Object Diagram](#object-diagram)
   - [Class Diagram](#class-diagram)
   - [Use Case Diagrams](#use-case-diagrams)
   - [Activity Diagram](#activity-diagram)
   - [Collaboration Diagram](#collaboration-diagram)
   - [Deployment Diagram](#deployment-diagram)
   - [Component Diagram](#component-diagram)
   - [Table Design](#table-design)
   - [Data Dictionary](#data-dictionary)
4. [Drawbacks and Limitations](#drawbacks-and-limitations)
5. [Proposed Enhancements](#proposed-enhancements)
6. [Conclusion](#conclusion)
7. [Bibliography](#bibliography)

## INTRODUCTION

### Introduction of Project

The Habit Tracker Application is a comprehensive web-based system designed to help users track, manage, and analyze their daily habits. The application enables users to create personalized habit tracking routines, monitor their progress over time, and visualize their achievements through interactive reports and statistics. By providing a structured approach to habit formation and maintenance, the application aims to help users develop positive behaviors and achieve their personal goals.

### Existing System and Need for System

Existing habit tracking solutions often lack comprehensive analytics, user-friendly interfaces, or the ability to categorize and customize habits based on individual needs. Many existing applications also fail to provide motivational elements such as badges, streaks, and visual progress indicators that can significantly enhance user engagement and habit adherence.

The need for this system arises from:

- The growing awareness of habit formation as a key factor in personal development and goal achievement
- The lack of comprehensive, user-friendly habit tracking tools that provide detailed analytics
- The need for a system that incorporates behavioral psychology principles to enhance habit formation
- The demand for a responsive, accessible platform that can be used across different devices

### Scope of Work

The Habit Tracker Application includes the following features:

- User registration and authentication system
- Profile management with customizable user information
- Habit creation, categorization, and management
- Daily habit tracking and completion logging
- Progress visualization through interactive charts and reports
- Achievement system with badges and streaks
- Statistical analysis of habit performance
- Responsive design for desktop and mobile devices

### Operating Environment - Hardware and Software

**Hardware Requirements:**

- Server: Any modern server capable of running Node.js applications
- Client: Any device with a modern web browser
- Storage: Minimum 1GB for application and database
- Network: Internet connection for client-server communication

**Software Requirements:**

- Frontend: React.js, Tailwind CSS, Framer Motion
- Backend: Node.js, Express.js
- Database: MongoDB
- Authentication: JWT (JSON Web Tokens)
- Version Control: Git
- Deployment: Any cloud platform supporting Node.js applications

### Detail Description of Technology Used

**Frontend Technologies:**

- **React.js**: A JavaScript library for building user interfaces, providing component-based architecture and efficient DOM manipulation
- **Tailwind CSS**: A utility-first CSS framework for rapidly building custom designs
- **Framer Motion**: A production-ready motion library for React that makes it easy to create animations
- **React Router**: For handling navigation and routing within the application
- **Axios**: For making HTTP requests to the backend API

**Backend Technologies:**

- **Node.js**: A JavaScript runtime built on Chrome's V8 JavaScript engine
- **Express.js**: A minimal and flexible Node.js web application framework
- **MongoDB**: A NoSQL database for storing user and habit data
- **Mongoose**: An Object Data Modeling (ODM) library for MongoDB and Node.js
- **JWT**: For secure authentication and authorization
- **Bcrypt**: For password hashing and security

## PROPOSED SYSTEMS

### Objectives of System

1. To provide users with a simple and intuitive interface for tracking daily habits
2. To enable categorization and customization of habits based on individual needs
3. To visualize progress and achievements through interactive charts and reports
4. To motivate users through gamification elements such as badges and streaks
5. To provide statistical insights into habit formation and adherence patterns
6. To ensure data security and user privacy through robust authentication
7. To deliver a responsive experience across different devices and screen sizes

### Proposed System

The proposed Habit Tracker Application is a full-stack web application with a React.js frontend and Node.js/Express backend. The system follows a client-server architecture where:

1. **Client-Side (Frontend):**
   - Provides user interface for all interactions
   - Handles form validation and data presentation
   - Manages client-side state and routing
   - Renders visualizations and reports
   - Communicates with the server via RESTful API calls

2. **Server-Side (Backend):**
   - Handles authentication and authorization
   - Processes and validates incoming requests
   - Interacts with the database for CRUD operations
   - Implements business logic for habit tracking and analysis
   - Returns appropriate responses to the client

3. **Database:**
   - Stores user information, habits, and tracking data
   - Maintains relationships between different data entities
   - Ensures data integrity and consistency

### User Requirements

1. **Authentication and User Management:**
   - User registration with email verification
   - Secure login with password protection
   - Password reset functionality
   - Profile management and customization

2. **Habit Management:**
   - Create, read, update, and delete habits
   - Categorize habits (health, productivity, learning, fitness, mindfulness, etc.)
   - Set frequency (daily, weekly) and time of day
   - Add descriptions and notes to habits

3. **Habit Tracking:**
   - Mark habits as complete
   - View current and historical completion status
   - Track streaks and consistency
   - Receive badges for achievements

4. **Reporting and Analytics:**
   - View weekly and monthly completion rates
   - Analyze performance by category
   - Track progress over time
   - Generate visual reports of habit data

5. **User Interface:**
   - Responsive design for all devices
   - Intuitive navigation and interaction
   - Visual feedback for user actions
   - Accessibility compliance

## ANALYSIS AND DESIGN

### Entity Relationship Diagram (ERD)

The ERD for the Habit Tracker Application consists of the following main entities:

1. **User**
2. **Habit**
3. **Completion**
4. **Badge**
5. **Category**

The relationships between these entities are:
- A User can have many Habits (one-to-many)
- A Habit belongs to one User (many-to-one)
- A Habit can have many Completions (one-to-many)
- A Habit can have many Badges (many-to-many)
- A Habit belongs to one Category (many-to-one)

### Data Flow Diagram (DFD)

#### Level 0 DFD (Context Diagram)

```
User <--> Habit Tracker System
```

The user interacts with the Habit Tracker System by:
- Sending: User Registration/Login, Habit Management, Habit Tracking
- Receiving: Authentication Response, Habit Data, Reports & Analytics

#### Level 1 DFD

```
User <--> Authentication System <--> User Database
User <--> Habit Management <--> Habit Database
User <--> Habit Tracking <--> Completion Database
User <--> Reporting System <--> Habit Database, Completion Database
```

### Object Diagram

The Object Diagram illustrates instances of the main entities and their relationships:

- User (id, name, email, profilePicture, isVerified)
- Habit (id, userId, title, description, category, frequency, timeOfDay, currentStreak, longestStreak)
- Completion (id, habitId, userId, date)
- Badge (id, habitId, name, icon, description, dateEarned)

### Class Diagram

The Class Diagram shows the structure of the system's classes and their relationships:

- **User Class**: Manages user authentication and profile information
  - Attributes: id, name, email, password, profilePicture, isVerified, etc.
  - Methods: register(), login(), updateProfile(), resetPassword(), verifyEmail()

- **Habit Class**: Manages habit creation and tracking
  - Attributes: id, userId, title, description, category, frequency, timeOfDay, currentStreak, longestStreak, etc.
  - Methods: create(), update(), delete(), complete(), calculateStreak(), earnBadge()

- **Completion Class**: Records habit completions
  - Attributes: id, habitId, userId, date
  - Methods: create(), delete()

- **Badge Class**: Manages achievement badges
  - Attributes: id, habitId, name, icon, description
  - Methods: create()

- **Category Class**: Defines habit categories
  - Attributes: id, name, icon
  - Methods: getAll()

- **Report Class**: Generates analytics and reports
  - Methods: generateWeeklyReport(), generateMonthlyReport(), generateCategoryReport(), calculateCompletionRate()

### Use Case Diagrams

The Use Case Diagram illustrates the interactions between the user and the system:

**Actor**: User

**Use Cases**:
1. Register
2. Login
3. Manage Profile
4. Create Habit
5. Update Habit
6. Delete Habit
7. Mark Habit Complete
8. View Progress
9. Generate Reports
10. View Badges
11. Filter Habits
12. Sort Habits

**Relationships**:
- Mark Habit Complete includes View Badges
- View Progress extends Filter Habits and Sort Habits
- Generate Reports includes View Progress

### Activity Diagram

The Activity Diagram illustrates the flow of activities in the system:

1. User opens application
2. If user is logged in, display Dashboard; otherwise, display Login Screen
3. User navigates application
4. User can:
   - Create New Habit (Fill Habit Details, Save Habit)
   - View Existing Habits (Mark habit as complete, Update Streak, Award Badge if achievement earned)
   - View Reports (Select Report Type: Weekly Report, Monthly Report, Category Report)
5. User logs out

### Collaboration Diagram

The Collaboration Diagram shows the interactions between objects in the system:

1. User -> AuthController: login(email, password)
2. AuthController -> UserModel: findByEmail(email)
3. UserModel -> AuthController: user
4. AuthController -> AuthController: validatePassword(password)
5. AuthController -> User: authToken

6. User -> HabitController: createHabit(habitData)
7. HabitController -> HabitModel: create(habitData)
8. HabitModel -> HabitController: newHabit
9. HabitController -> User: habitDetails

10. User -> HabitController: completeHabit(habitId)
11. HabitController -> CompletionModel: create(habitId, userId, date)
12. CompletionModel -> HabitController: completion
13. HabitController -> HabitModel: updateStreak(habitId)
14. HabitModel -> HabitController: updatedHabit
15. HabitController -> BadgeModel: checkAndCreateBadges(habit)
16. BadgeModel -> HabitController: newBadges
17. HabitController -> User: completionStatus, newBadges

18. User -> ReportController: generateReport(userId, type)
19. ReportController -> HabitModel: findByUserId(userId)
20. HabitModel -> ReportController: habits
21. ReportController -> CompletionModel: findByUserId(userId)
22. CompletionModel -> ReportController: completions
23. ReportController -> ReportController: processData(habits, completions, type)
24. ReportController -> User: reportData

### Deployment Diagram

The Deployment Diagram illustrates the physical deployment of the system:

```
Client Device [Web Browser, React Application]
    |
    | HTTPS
    v
Web Server [Node.js, Express.js, API Endpoints]
    |
    | Mongoose ODM
    v
Database Server [MongoDB]
    |
    | File I/O
    v
File Storage [User Uploads]
```

### Component Diagram

The Component Diagram shows the components of the system and their dependencies:

**Frontend Components**:
- Authentication Components
- Habit Management Components
- Tracking Components
- Reporting Components
- UI Components
- State Management
- API Service

**Backend Components**:
- Authentication Controllers
- Habit Controllers
- Tracking Controllers
- Reporting Controllers
- Middleware
- Database Models
- Utility Services

**Database Collections**:
- Users Collection
- Habits Collection
- Completions Collection
- Badges Collection

### Table Design

#### User Table

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| _id | ObjectId | Primary Key | Unique identifier for the user |
| name | String | Required | User's full name |
| email | String | Required, Unique | User's email address |
| password | String | Required | Hashed password |
| profilePicture | String | Optional | Path to profile picture |
| phoneNumber | String | Optional | User's phone number |
| bio | String | Optional | User's biography |
| address | String | Optional | User's address |
| isVerified | Boolean | Default: false | Email verification status |
| verificationOTP | String | Optional | OTP for email verification |
| verificationOTPExpiry | Date | Optional | Expiry time for verification OTP |
| resetOTP | String | Optional | OTP for password reset |
| resetOTPExpiry | Date | Optional | Expiry time for reset OTP |
| createdAt | Date | Auto | Record creation timestamp |
| updatedAt | Date | Auto | Record update timestamp |

#### Habit Table

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| _id | ObjectId | Primary Key | Unique identifier for the habit |
| user | ObjectId | Foreign Key, Required | Reference to User |
| title | String | Required | Habit title |
| description | String | Optional | Habit description |
| category | String | Required | Habit category |
| frequency | String | Required | Daily, Weekly, etc. |
| timeOfDay | String | Optional | Morning, Afternoon, Evening, etc. |
| currentStreak | Number | Default: 0 | Current consecutive completions |
| longestStreak | Number | Default: 0 | Longest streak achieved |
| totalCompletions | Number | Default: 0 | Total number of completions |
| completionHistory | Array | - | Array of completion records |
| badges | Array | - | Array of earned badges |
| lastCompleted | Date | Optional | Date of last completion |
| startDate | Date | Default: Now | Date when habit was started |
| active | Boolean | Default: true | Whether the habit is active |
| createdAt | Date | Auto | Record creation timestamp |
| updatedAt | Date | Auto | Record update timestamp |

#### Completion Schema (Embedded in Habit)

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| date | Date | Required | Date of completion |
| completed | Boolean | Default: true | Completion status |

#### Badge Schema (Embedded in Habit)

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| name | String | Required | Badge name |
| description | String | Required | Badge description |
| icon | String | Required | Badge icon (emoji or path) |
| dateEarned | Date | Required | Date when badge was earned |

### Data Dictionary

#### User Entity

- **_id**: Unique identifier for the user (MongoDB ObjectId)
- **name**: User's full name (String, Required)
- **email**: User's email address, used for login (String, Required, Unique)
- **password**: Hashed password for security (String, Required)
- **profilePicture**: Path to the user's profile picture (String, Optional)
- **phoneNumber**: User's phone number (String, Optional)
- **bio**: User's biography or about information (String, Optional)
- **address**: User's physical address (String, Optional)
- **isVerified**: Indicates if the user's email is verified (Boolean, Default: false)
- **verificationOTP**: One-time password for email verification (String, Optional)
- **verificationOTPExpiry**: Expiration time for verification OTP (Date, Optional)
- **resetOTP**: One-time password for password reset (String, Optional)
- **resetOTPExpiry**: Expiration time for reset OTP (Date, Optional)
- **createdAt**: Timestamp when the user account was created (Date, Auto-generated)
- **updatedAt**: Timestamp when the user account was last updated (Date, Auto-generated)

#### Habit Entity

- **_id**: Unique identifier for the habit (MongoDB ObjectId)
- **user**: Reference to the user who owns the habit (ObjectId, Required)
- **title**: Name of the habit (String, Required)
- **description**: Detailed description of the habit (String, Optional)
- **category**: Category the habit belongs to (String, Required)
- **frequency**: How often the habit should be performed (String, Required)
- **timeOfDay**: When during the day the habit should be performed (String, Optional)
- **currentStreak**: Number of consecutive days/weeks the habit has been completed (Number, Default: 0)
- **longestStreak**: Longest streak achieved for this habit (Number, Default: 0)
- **totalCompletions**: Total number of times the habit has been completed (Number, Default: 0)
- **completionHistory**: Array of completion records with dates (Array of Completion Schema)
- **badges**: Array of badges earned for this habit (Array of Badge Schema)
- **lastCompleted**: Date when the habit was last marked as complete (Date, Optional)
- **startDate**: Date when the habit was created (Date, Default: current date)
- **active**: Whether the habit is currently active (Boolean, Default: true)
- **createdAt**: Timestamp when the habit was created (Date, Auto-generated)
- **updatedAt**: Timestamp when the habit was last updated (Date, Auto-generated)

#### Completion Entity (Embedded in Habit)

- **date**: Date when the habit was completed (Date, Required)
- **completed**: Whether the habit was completed (Boolean, Default: true)

#### Badge Entity (Embedded in Habit)

- **name**: Name of the badge (String, Required)
- **description**: Explanation of how the badge was earned (String, Required)
- **icon**: Visual representation of the badge (String, Required)
- **dateEarned**: Date when the badge was awarded (Date, Required)

## DRAWBACKS AND LIMITATIONS

1. **Offline Functionality**: The current system requires an internet connection to function. There is no offline mode for tracking habits when connectivity is unavailable.

2. **Mobile App Absence**: While the web application is responsive, there is no dedicated native mobile application, which might limit the user experience on mobile devices.

3. **Limited Social Features**: The application lacks social features such as sharing achievements or competing with friends, which could enhance motivation and engagement.

4. **Notification System**: The current implementation has limited notification capabilities, which could reduce user engagement and habit adherence.

5. **Data Visualization Complexity**: Some of the more advanced data visualization features may be computationally intensive and could affect performance on lower-end devices.

6. **Limited Integration**: The system does not integrate with other health or productivity applications, limiting its utility within a broader ecosystem of tools.

7. **Scalability Concerns**: As the user base grows, the current architecture may face challenges in maintaining performance and responsiveness.

## PROPOSED ENHANCEMENTS

1. **Offline Mode**: Implement local storage and synchronization capabilities to allow users to track habits without an internet connection.

2. **Native Mobile Applications**: Develop dedicated iOS and Android applications to provide a more seamless mobile experience.

3. **Social Features**: Add functionality for users to connect with friends, share achievements, and participate in challenges.

4. **Advanced Notification System**: Implement a comprehensive notification system with customizable reminders and motivational messages.

5. **AI-Powered Insights**: Integrate machine learning algorithms to provide personalized insights and recommendations based on user behavior patterns.

6. **Third-Party Integrations**: Develop APIs and integrations with popular health, fitness, and productivity applications.

7. **Gamification Expansion**: Enhance the gamification elements with more badges, levels, and rewards to increase engagement.

8. **Data Export and Import**: Add functionality for users to export their data or import data from other habit tracking applications.

9. **Advanced Analytics**: Implement more sophisticated analytics tools for deeper insights into habit formation and adherence patterns.

10. **Accessibility Improvements**: Enhance accessibility features to ensure the application is usable by people with various disabilities.

## CONCLUSION

The Habit Tracker Application provides a comprehensive solution for users to track, manage, and analyze their daily habits. By combining an intuitive user interface with powerful tracking and reporting capabilities, the system helps users develop and maintain positive behaviors.

The application's key strengths include its user-friendly design, comprehensive habit categorization, visual progress tracking, and motivational elements such as badges and streaks. These features work together to create an engaging experience that encourages consistent habit formation.

While there are some limitations, such as the lack of offline functionality and native mobile applications, the proposed enhancements outline a clear path for future development. By addressing these limitations and implementing the suggested improvements, the Habit Tracker Application can continue to evolve and better serve its users' needs.

The system's architecture, built on modern web technologies like React.js, Node.js, and MongoDB, provides a solid foundation for scalability and future expansion. The comprehensive documentation, including detailed diagrams and data models, ensures that the system can be maintained and enhanced by development teams.

In conclusion, the Habit Tracker Application represents a valuable tool for individuals seeking to improve their lives through consistent habit formation, offering both immediate utility and significant potential for future growth and enhancement.

## BIBLIOGRAPHY

1. Clear, J. (2018). Atomic Habits: An Easy & Proven Way to Build Good Habits & Break Bad Ones. Avery.

2. Duhigg, C. (2012). The Power of Habit: Why We Do What We Do in Life and Business. Random House.

3. Fogg, B.J. (2020). Tiny Habits: The Small Changes That Change Everything. Houghton Mifflin Harcourt.

4. React Documentation. (2023). Retrieved from https://reactjs.org/docs/getting-started.html

5. Node.js Documentation. (2023). Retrieved from https://nodejs.org/en/docs/

6. MongoDB Documentation. (2023). Retrieved from https://docs.mongodb.com/

7. Express.js Documentation. (2023). Retrieved from https://expressjs.com/

8. Tailwind CSS Documentation. (2023). Retrieved from https://tailwindcss.com/docs

9. JWT.io. (2023). Introduction to JSON Web Tokens. Retrieved from https://jwt.io/introduction/

10. Mongoose Documentation. (2023). Retrieved from https://mongoosejs.com/docs/