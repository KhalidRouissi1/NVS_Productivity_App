import { ITask } from "./task";

export interface User {

    id:string;
    fullName:string;
    email:string;
    password:string;
    task :ITask[];
}
