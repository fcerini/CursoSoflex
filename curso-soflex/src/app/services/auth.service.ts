import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { UserLogin } from "../domain/user-login";
import { ConfigService } from "./config.service";
import { Observable} from 'rxjs';


@Injectable({
    providedIn: 'root'
})
export class AuthService {
     
    constructor(private config: ConfigService) {}

    isLogged(){
        return localStorage.getItem('Authorization');
    }

    login(user:string, pass:string){
        return this.config.post('login', new UserLogin(user, pass));
    }

    logout(){
        localStorage.removeItem("Authorization");
    }
}
          
          