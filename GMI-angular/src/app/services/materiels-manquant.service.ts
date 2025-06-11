import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "../../environments/environment";


@Injectable({
    providedIn: "root",
  })
  export class MatrielManquantsService {
      private readonly baseUrl = `${environment.apiUrl}/materiel`;
    
constructor(private http : HttpClient){}

allmatrielmanquant(){
    
    //// nesta3mlouha ki yebda service lazmpou connexion
    let headers = new HttpHeaders();
    headers.set("Access-Control-Allow-Origin", "*")
    headers = headers.set('Content-Type', 'application/json; charset=utf-8');
    headers = headers.set("Authorization", 'Bearer ' + localStorage.getItem('token'));
    console.log(localStorage.getItem('token'))
    return this.http.get(this.baseUrl+"/allmatrielmanquant",{headers:headers})
}



ajoutmat(mat:any){
    
    //// nesta3mlouha ki yebda service lazmpou connexion
    const user = JSON.parse(localStorage.getItem('currentUser')|| '{}');
    let headers = new HttpHeaders();
    headers.set("Access-Control-Allow-Origin", "*")
    headers = headers.set('Content-Type', 'application/json; charset=utf-8');
    headers = headers.set("Authorization", 'Bearer ' + localStorage.getItem('token'));
    //////////
    return this.http.post(this.baseUrl+"/ajoutmatmanquant",mat,{headers:headers})
}


updatemat(id:any ,mat:any){
    
    //// nesta3mlouha ki yebda service lazmpou connexion
    const user = JSON.parse(localStorage.getItem('currentUser')|| '{}');
    let headers = new HttpHeaders();
    headers.set("Access-Control-Allow-Origin", "*")
    headers = headers.set('Content-Type', 'application/json; charset=utf-8');
    headers = headers.set("Authorization", 'Bearer ' + localStorage.getItem('token'));
    //////////
  console.log(mat)

    return this.http.put(this.baseUrl+"/updatematrielmanquant?id="+id,mat,{headers:headers})
}
deletemat(id:any){
    
    //// nesta3mlouha ki yebda service lazmpou connexion
    const user = JSON.parse(localStorage.getItem('currentUser')|| '{}');
    let headers = new HttpHeaders();
    headers.set("Access-Control-Allow-Origin", "*")
    headers = headers.set('Content-Type', 'application/json; charset=utf-8');
    headers = headers.set("Authorization", 'Bearer ' + localStorage.getItem('token'));
    //////////
    return this.http.delete(this.baseUrl+"/deletematrielmanquant?id="+id,{headers:headers})
}

modif(objectdomaine:any){
  return this.http.put(this.baseUrl+"domaine/modifier",objectdomaine,{})
}

afficherbyid(id:any){
    
  
  return this.http.get(this.baseUrl+"domaine/afficherbyid?id="+id,{})
}

archiver(id:any){
    
  
  return this.http.post(this.baseUrl+"domaine/archiver?id="+id,{})
}


  }
