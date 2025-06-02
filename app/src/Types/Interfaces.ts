export interface LoginUser {
    userID: string
    email: string
    username: string
    password: string
    loggedIn: boolean
}
export interface CapsulePost {
    id: number;
    title: string;
    description: string;
    isAvailable: boolean;
    countdown: string;
}