# PlantUML Code for Project Diagrams

## 1. Data Flow Diagram (DFD)

```plantuml
@startuml Data Flow Diagram
!theme plain
skinparam backgroundColor transparent
skinparam componentStyle rectangle

actor "User" as user
component "Frontend (React)" as frontend
component "Backend (Node.js)" as backend
database "MongoDB" as db
component "Email Service" as email

user <--> frontend : HTTP Requests/Responses
frontend <--> backend : API Calls (axios)
backend <--> db : Mongoose ORM
backend <--> email : Send Emails

note right of user
  - Login/Register
  - Manage Habits
  - Track Progress
end note

note right of frontend
  - User Authentication
  - Habit Management
  - Dashboard Display
  - Progress Visualization
end note

note right of backend
  - User Authentication
  - Habit CRUD Operations
  - Streak Calculation
  - Badge Awards
  - Email Verification
end note

note right of db
  - User Collection
  - Habit Collection
end note

note right of email
  - Verification Emails
  - Password Reset
  - Habit Reminders
end note
@enduml
```

## 2. Object Diagram

```plantuml
@startuml Object Diagram
!theme plain
skinparam backgroundColor transparent

object "user:User" as user {
  id = "60a1e2c3d4e5f6a7b8c9d0e1"
  name = "John Doe"
  email = "john@example.com"
  profilePicture = "/uploads/profiles/1740427392674.jpg"
  isVerified = true
}

object "habit1:Habit" as habit1 {
  id = "61a1e2c3d4e5f6a7b8c9d0e2"
  user = "60a1e2c3d4e5f6a7b8c9d0e1"
  title = "Morning Exercise"
  category = "fitness"
  frequency = "daily"
  currentStreak = 5
  longestStreak = 10
  totalCompletions = 25
}

object "habit2:Habit" as habit2 {
  id = "62a1e2c3d4e5f6a7b8c9d0e3"
  user = "60a1e2c3d4e5f6a7b8c9d0e1"
  title = "Read a Book"
  category = "learning"
  frequency = "daily"
  currentStreak = 3
  longestStreak = 7
  totalCompletions = 15
}

object "completion1:CompletionData" as completion1 {
  date = "2025-04-20"
  completed = true
}

object "completion2:CompletionData" as completion2 {
  date = "2025-04-19"
  completed = true
}

object "badge1:Badge" as badge1 {
  name = "Week Warrior"
  description = "Maintained a 7-day streak!"
  icon = "🔥"
  dateEarned = "2025-04-15"
}

user "1" -- "n" habit1 : has >
user "1" -- "n" habit2 : has >
habit1 "1" -- "n" completion1 : records >
habit1 "1" -- "n" completion2 : records >
habit1 "1" -- "n" badge1 : earned >
@enduml
```

## 3. Class Diagram

```plantuml
@startuml Class Diagram
!theme plain
skinparam backgroundColor transparent

class User {
  -id: ObjectId
  -name: String
  -email: String
  -password: String
  -profilePicture: String
  -phoneNumber: String
  -bio: String
  -address: String
  -isVerified: Boolean
  -verificationOTP: String
  -verificationOTPExpiry: Date
  -resetOTP: String
  -resetOTPExpiry: Date
  +findById()
  +findOne()
  +save()
}

class Habit {
  -id: ObjectId
  -user: ObjectId (ref)
  -title: String
  -description: String
  -category: String
  -frequency: String
  -timeOfDay: String
  -currentStreak: Number
  -longestStreak: Number
  -totalCompletions: Number
  -completionHistory: Array<CompletionSchema>
  -badges: Array<BadgeSchema>
  -lastCompleted: Date
  -startDate: Date
  -active: Boolean
  +isCompletedToday()
  +updateStreak()
  +checkAndAwardBadges()
}

class CompletionSchema {
  -date: Date
  -completed: Boolean
}

class BadgeSchema {
  -name: String
  -description: String
  -icon: String
  -dateEarned: Date
}

class AuthContext {
  -user: User
  -loading: Boolean
  +login()
  +logout()
  +register()
  +checkAuth()
  +refreshUserData()
  +verifyEmail()
  +resendVerificationOTP()
  +updateVerificationEmail()
}

class Dashboard {
  -habits: Array<Habit>
  -loading: Boolean
  -error: String
  -filterCategory: String
  -sortBy: String
  +fetchUserAndHabits()
  +handleAddHabit()
  +handleEditHabit()
  +handleDeleteHabit()
  +handleCompleteHabit()
}

User "1" -- "n" Habit : owns >
Habit "1" -- "n" CompletionSchema : contains >
Habit "1" -- "n" BadgeSchema : earns >
AuthContext "1" -- "1" User : manages >
Dashboard "1" -- "n" Habit : displays >
@enduml
```

## 4. Collaboration Diagram

```plantuml
@startuml Collaboration Diagram
!theme plain
skinparam backgroundColor transparent

actor User as user
participant "Frontend\n(Dashboard)" as dashboard
participant "AuthContext" as auth
participant "Backend\n(API)" as api
database "MongoDB" as db

== User Authentication ==
user -> dashboard : 1. Enter credentials
dashboard -> auth : 2. Call login()
auth -> api : 3. POST /auth/login
api -> db : 4. Find user
db --> api : 5. Return user data
api --> auth : 6. Return token & user data
auth --> dashboard : 7. Update auth state
dashboard --> user : 8. Show dashboard

== Habit Creation ==
user -> dashboard : 1. Enter habit details
dashboard -> api : 2. POST /habits
api -> db : 3. Create habit
db --> api : 4. Return created habit
api --> dashboard : 5. Return habit data
dashboard --> user : 6. Show updated habit list

== Habit Completion ==
user -> dashboard : 1. Click "Complete" button
dashboard -> api : 2. POST /habits/{id}/complete
api -> api : 3. Update streak & check badges
api -> db : 4. Save updated habit
db --> api : 5. Return updated habit
api --> dashboard : 6. Return updated habit with badges
dashboard --> user : 7. Show completion status & badges

== Email Verification ==
user -> dashboard : 1. Enter verification code
dashboard -> auth : 2. Call verifyEmail()
auth -> api : 3. POST /auth/verify-email
api -> db : 4. Update verification status
db --> api : 5. Return updated user
api --> auth : 6. Return verification result
auth --> dashboard : 7. Update auth state
dashboard --> user : 8. Show verification result
@enduml
```

## 5. Deployment Diagram

```plantuml
@startuml Deployment Diagram
!theme plain
skinparam backgroundColor transparent

node "Client Device" {
  artifact "Web Browser" {
    component "React Frontend" {
      component "React Components"
      component "Context API"
      component "Axios HTTP Client"
    }
  }
}

node "Application Server" {
  artifact "Node.js Runtime" {
    component "Express.js Server" {
      component "Authentication Routes"
      component "Habit Routes"
      component "Dashboard Routes"
    }
    component "Middleware" {
      component "Auth Middleware"
    }
  }
}

node "Database Server" {
  database "MongoDB" {
    component "User Collection"
    component "Habit Collection"
  }
}

node "Email Service" {
  component "SMTP Server" {
    component "Email Templates"
  }
}

node "File Storage" {
  folder "Uploads" {
    folder "Profile Pictures"
  }
}

"React Frontend" ..> "Express.js Server" : HTTPS
"Express.js Server" ..> "MongoDB" : Mongoose ORM
"Express.js Server" ..> "SMTP Server" : Send Emails
"Express.js Server" ..> "Uploads" : Store/Retrieve Files
@enduml
```

## 6. Table Design (Database Schema)

```plantuml
@startuml Database Schema
!theme plain
skinparam backgroundColor transparent

entity "User" {
  * _id : ObjectId
  --
  * name : String
  * email : String
  * password : String
  profilePicture : String
  phoneNumber : String
  bio : String
  address : String
  * isVerified : Boolean
  verificationOTP : String
  verificationOTPExpiry : Date
  resetOTP : String
  resetOTPExpiry : Date
  createdAt : Date
  updatedAt : Date
}

entity "Habit" {
  * _id : ObjectId
  --
  * user : ObjectId <<FK>>
  * title : String
  description : String
  * category : String
  * frequency : String
  * timeOfDay : String
  * currentStreak : Number
  * longestStreak : Number
  * totalCompletions : Number
  completionHistory : Array
  badges : Array
  lastCompleted : Date
  * startDate : Date
  * active : Boolean
  createdAt : Date
  updatedAt : Date
}

entity "CompletionHistory" {
  * date : Date
  * completed : Boolean
}

entity "Badge" {
  * name : String
  * description : String
  * icon : String
  * dateEarned : Date
}

User ||--o{ Habit : has
Habit ||--o{ CompletionHistory : contains
Habit ||--o{ Badge : earns

note bottom of User
  Indexes:
  - email (unique)
  - verificationOTPExpiry
  - resetOTPExpiry
end note

note bottom of Habit
  Indexes:
  - user
  - completionHistory.date
end note
@enduml
```

## How to Use These Diagrams

1. Copy the PlantUML code for the diagram you want to generate
2. Paste it into a PlantUML editor or renderer:
   - Online: [PlantUML Web Server](https://www.plantuml.com/plantuml/uml/)
   - VS Code: Install the PlantUML extension
   - JetBrains IDEs: Install the PlantUML integration plugin
3. Generate the diagram

These diagrams provide a comprehensive view of the application's architecture, data flow, and component interactions.