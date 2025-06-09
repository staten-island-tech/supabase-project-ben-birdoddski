export interface LoginUser {
    userID: string
    email: string
    username: string
    password: string
    loggedIn: boolean
}
export interface CapsulePost {
    id: string;
    title: string;
    description: string;
    isAvailable: boolean;
    timeLeft: number;
    imagePath: string | undefined;
    countdown: string;
}