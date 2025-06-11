export interface loginUser {
  userID: string
  email: string
  username: string
  password: string
  loggedIn: boolean
}

export interface capsulePost {
  id: string
  UsersID: string
  title: string
  description: string
  isAvailable: boolean
  timeLeftInMs: number
  imagePath: string | undefined
  countdownDisplay: string
  display: boolean
}

export interface capsuleDataPull {
  UsersID: string
  CapsuleID: string
  Header: string
  ImageUrl: string
  Comments: Array<Object>
  UnlockDate: string
  Private: boolean
}

export interface UserProfile {
  id: string
  Username: string
  Email: string
  Bio: string
  Followers: string[]
  Following: string[]
}
