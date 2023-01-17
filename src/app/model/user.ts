export interface User {
    _id?:string;
    login:string;
    password:string;
    listeIds:Array<string>;
}